import React, { useEffect, useState } from "react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, BarChart, Bar, ResponsiveContainer, } from "recharts";
import { FaChartLine, FaPizzaSlice, FaMoneyCheckAlt, FaCoins, FaUtensils, FaUsers, } from "react-icons/fa";
import useAxiosSecure from "../../../Hook/useAxiosSecure";
import MenuLoading from "../../../Components/Loading/MenuLoading";
import { motion } from "framer-motion";
import SummaryCard from "../../../Components/SummaryCard/SummaryCard";

export default function AdminOverview() {
    const axiosSecure = useAxiosSecure();

    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [payments, setPayments] = useState([]);
    const [meals, setMeals] = useState({});
    const [applications, setApplications] = useState([]);
    const [loadingActionId, setLoadingActionId] = useState(null);

    // Fetch all data
    useEffect(() => {
        document.title = "Smart Hostel | Admin Dashboard";

        const fetchData = async () => {
            setLoading(true);
            try {
                // Users
                const usersRes = await axiosSecure.get("/users");
                setUsers(usersRes.data || []);

                // Payments
                const paymentsRes = await axiosSecure.get("/payments");
                setPayments(paymentsRes.data || []);

                // Daily Meals (current month)
                const today = new Date();
                const year = today.getFullYear();
                const monthIndex = today.getMonth();
                const month = (monthIndex + 1).toString().padStart(2, "0");
                const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

                const allDays = Array.from({ length: daysInMonth }, (_, i) => {
                    const date = new Date(year, monthIndex, i + 1);
                    const yyyy = date.getFullYear();
                    const mm = (date.getMonth() + 1).toString().padStart(2, "0");
                    const dd = date.getDate().toString().padStart(2, "0");
                    return `${yyyy}-${mm}-${dd}`;
                });

                const dailyMealsPromises = allDays.map((day) =>
                    axiosSecure
                        .get(`/bookings/summary?date=${day}`)
                        .then((res) => ({
                            date: day,
                            summary: res.data.totalSummary || { Breakfast: 0, Lunch: 0, Dinner: 0 },
                        }))
                        .catch(() => ({ date, summary: { Breakfast: 0, Lunch: 0, Dinner: 0 } }))
                );

                const dailyMealsArray = await Promise.all(dailyMealsPromises);
                const mealsObj = {};
                dailyMealsArray.forEach((m) => {
                    mealsObj[m.date] = m.summary;
                });
                setMeals(mealsObj);

                // Applications (all pending)
                const appsRes = await axiosSecure.get("/applications");
                const pendingApps = appsRes.data.filter((app) => app.status === "pending");
                setApplications(pendingApps);
            } catch (err) {
                console.error("Admin Overview fetch error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [axiosSecure]);

    // Accept or Reject application remove from dashboard
    const handleAction = async (id, action) => {
        try {
            setLoadingActionId(id);
            await axiosSecure.patch(`/applications/${id}`, { action });
            setApplications((prev) => prev.filter((app) => app._id !== id));
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingActionId(null);
        }
    };

    if (loading) return <MenuLoading />;

    // Total Payments
    const totalRoomRent = payments.reduce((sum, p) => sum + (Number(p.roomRent) || 0), 0);
    const totalMealCost = payments.reduce((sum, p) => sum + (Number(p.mealCost) || 0), 0);
    const totalPaid = payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

    // Payment Trend
    const paymentData = payments.map((p) => ({
        month: new Date(p.month + "-01").toLocaleString("default", { month: "short" }),
        paid: p.amount,
    }));

    // Daily Meals
    const today = new Date();
    const year = today.getFullYear();
    const monthIndex = today.getMonth();
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

    const allDays = Array.from({ length: daysInMonth }, (_, i) => {
        const date = new Date(year, monthIndex, i + 1);
        const yyyy = date.getFullYear();
        const mm = (date.getMonth() + 1).toString().padStart(2, "0");
        const dd = date.getDate().toString().padStart(2, "0");
        return `${yyyy}-${mm}-${dd}`;
    });

    const mealData = allDays.map((day) => {
        const dayMeals = meals[day] || { Breakfast: 0, Lunch: 0, Dinner: 0 };
        return {
            day: day.split("-")[2],
            Breakfast: dayMeals.Breakfast,
            Lunch: dayMeals.Lunch,
            Dinner: dayMeals.Dinner,
            meals: dayMeals.Breakfast + dayMeals.Lunch + dayMeals.Dinner,
        };
    });

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-white p-2 rounded-lg shadow-md border border-gray-200 text-sm">
                    <p className="font-semibold">Day: {label}</p>
                    <p>Breakfast: {data.Breakfast}</p>
                    <p>Lunch: {data.Lunch}</p>
                    <p>Dinner: {data.Dinner}</p>
                    <p className="font-semibold">Total: {data.meals}</p>
                </div>
            );
        }
        return null;
    };

    // Users & Admins
    const totalUsers = users.length;
    const totalAdmins = users.filter((u) => u.role === "admin").length;

    return (
        <div className="md:p-8 space-y-6 w-full">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Admin Overview</h1>

            {/* Users & Admins */}
            <motion.div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <SummaryCard
                    icon={<FaUsers className="text-indigo-500 text-2xl" />}
                    label="Total Users"
                    value={totalUsers}
                    color="indigo"
                />
                <SummaryCard
                    icon={<FaUsers className="text-green-500 text-2xl" />}
                    label="Total Admins"
                    value={totalAdmins}
                    color="green"
                />
            </motion.div>

            {/* Payments */}
            <motion.div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6">
                <SummaryCard
                    icon={<FaMoneyCheckAlt className="text-blue-500 text-2xl" />}
                    label="Total Room Rent"
                    value={`${totalRoomRent} TK`}
                    color="blue"
                />
                <SummaryCard
                    icon={<FaUtensils className="text-green-500 text-2xl" />}
                    label="Total Meal Cost"
                    value={`${totalMealCost} TK`}
                    color="green"
                />
                <SummaryCard
                    icon={<FaCoins className="text-indigo-500 text-2xl" />}
                    label="Total Paid"
                    value={`${totalPaid} TK`}
                    color="indigo"
                />
            </motion.div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {/* Payment Trend */}
                <div className="bg-white rounded-2xl shadow-md p-5">
                    <h2 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <FaChartLine className="text-indigo-500" /> Payment Trend
                    </h2>
                    <div className="h-56">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={paymentData}>
                                <Line dataKey="paid" stroke="#6366f1" strokeWidth={2} />
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Daily Meals */}
                <div className="bg-white rounded-2xl shadow-md p-5">
                    <h2 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <FaPizzaSlice className="text-emerald-500" /> Daily Meals (Current Month)
                    </h2>
                    <div className="h-56">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={mealData}>
                                <XAxis dataKey="day" />
                                <YAxis />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="meals" fill="#10b981" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Pending Applications */}
            {applications.length > 0 && (
                <div className="mt-10 w-full">
                    <h2 className="text-2xl font-bold mb-4">Pending Hostel Applications</h2>
                    <div className="flex flex-wrap gap-6 w-full">
                        {applications.map((app) => (
                            <motion.div
                                key={app._id}
                                whileHover={{ scale: 1.03 }}
                                className="flex-1 min-w-[300px] bg-white rounded-2xl shadow-md p-5 border border-gray-200 hover:shadow-lg transition-all duration-300"
                            >
                                <div className="mb-3">
                                    <h3 className="text-lg font-semibold">{app.name}</h3>
                                    <p className="text-gray-600 text-sm">{app.email}</p>
                                </div>
                                <div className="flex items-center justify-between mt-3 gap-2">
                                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
                                        PENDING
                                    </span>
                                    <div className="flex gap-2">
                                        <button
                                            disabled={loadingActionId === app._id}
                                            onClick={() => handleAction(app._id, "accepted")}
                                            className="px-4 py-1.5 rounded-lg bg-green-500 text-white hover:bg-green-700 disabled:opacity-50"
                                        >
                                            {loadingActionId === app._id ? "..." : "Accept"}
                                        </button>
                                        <button
                                            disabled={loadingActionId === app._id}
                                            onClick={() => handleAction(app._id, "rejected")}
                                            className="px-4 py-1.5 rounded-lg bg-pink-500 text-white hover:bg-pink-700 disabled:opacity-50"
                                        >
                                            {loadingActionId === app._id ? "..." : "Reject"}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

        </div>
    );
}
