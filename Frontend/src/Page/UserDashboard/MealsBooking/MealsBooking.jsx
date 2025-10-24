import { useState, useEffect } from "react";
import useAuth from "../../../Hook/useAuth";
import useAxiosSecure from "../../../Hook/useAxiosSecure";
import Swal from "sweetalert2";
import MenuLoading from "../../../Components/Loading/MenuLoading";

const mealTypes = [
    { type: "Breakfast", price: 50, color: "bg-blue-500" },
    { type: "Lunch", price: 100, color: "bg-green-500" },
    { type: "Dinner", price: 120, color: "bg-orange-500" },
];

function MealsBooking({ token }) {
    const today = new Date();
    const [bookings, setBookings] = useState([]);
    const [bookedData, setBookedData] = useState(null);
    const [loading, setLoading] = useState(false);
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();

    // Fetch booking
    const fetchBookings = async () => {
        if (!user || !user.email) return;
        setLoading(true);
        try {
            const res = await axiosSecure.get(`bookings?email=${user.email}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBookings(res.data);
        } catch (err) {
            console.error(err);
            Swal.fire("Oops...", "Failed to fetch bookings!", "error");
        }
        setLoading(false);
    };

    useEffect(() => { fetchBookings(); }, [user]);

    const toggleMeal = (dayIdx, mealIdx) => {
        const nextDay = new Date(today);
        nextDay.setDate(today.getDate() + 1);
        const day = bookings[dayIdx];
        const dayDate = new Date(day.date);

        if (dayDate.toDateString() === nextDay.toDateString()) {
            const newBookings = bookings.map((d, idx) =>
                idx === dayIdx
                    ? { ...d, meals: d.meals.map((m, mIdx) => mIdx === mealIdx ? { ...m, booked: !m.booked } : m) }
                    : d
            );
            setBookings(newBookings);
        } else Swal.fire({
            position: "top-end",
            icon: "success",
            title: "You can only modify meals for the next day.",
            showConfirmButton: false,
            timer: 1500
        });
    };

    const confirmBookings = async (dayIdx) => {
        try {
            const day = bookings[dayIdx];
            const res = await axiosSecure.patch(`/bookings/${day._id}`, { meals: day.meals }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data && res.data.date) {
                setBookedData({
                    date: new Date(res.data.date).toDateString(),
                    bookedMeals: res.data.meals.filter(m => m.booked).map(m => m.type),
                    cancelledMeals: res.data.meals.filter(m => !m.booked).map(m => m.type)
                });
            }

            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Your meals have been updated",
                showConfirmButton: false,
                timer: 1500
            });
        } catch (err) {
            console.error(err);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Failed to update meals!"
            });
        }
    };

    // Summary data for cards
    const totalMeals = bookings.reduce(
        (sum, d) => sum + d.meals.filter(m => m.booked).length,
        0
    );

    const summary = {
        Breakfast: bookings.reduce((sum, d) => sum + d.meals.filter(m => m.type === "Breakfast" && m.booked).length, 0),
        Lunch: bookings.reduce((sum, d) => sum + d.meals.filter(m => m.type === "Lunch" && m.booked).length, 0),
        Dinner: bookings.reduce((sum, d) => sum + d.meals.filter(m => m.type === "Dinner" && m.booked).length, 0),
        TotalMeals: totalMeals
    };

    return (
        <div className="bg-gradient-to-br from-blue-50 via-gray-50 to-gray-100 min-h-screen">
            <div className="max-w-6xl mx-auto space-y-6">

                <h1 className="text-3xl font-bold text-gray-800">Daily Booked Meals</h1>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {mealTypes.map((meal, i) => (
                        <div key={i} className={`${meal.color} text-white p-5 rounded-xl shadow-md hover:shadow-lg transition`}>
                            <h4 className="text-sm font-medium opacity-90">{meal.type}</h4>
                            <p className="text-2xl font-bold mt-1">{summary[meal.type]}</p>
                        </div>
                    ))}
                    <div className="bg-indigo-500 text-white p-5 rounded-xl shadow-md hover:shadow-lg transition">
                        <h4 className="text-sm font-medium opacity-90">Total Meals</h4>
                        <p className="text-2xl font-bold mt-1">{summary.TotalMeals}</p>
                    </div>
                </div>

                {/* Bookings Table */}
                <div className="overflow-x-auto rounded-xl border border-gray-200 max-h-[400px] overflow-y-auto">
                    <table className="table w-full text-center">
                        <thead className="bg-blue-100 text-gray-700">
                            <tr>
                                <th>Date</th>
                                {mealTypes.map((meal, i) => <th key={i}>{meal.type} ({meal.price}৳)</th>)}
                                <th>Confirm</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            {loading ? (
                                <tr>
                                    <td colSpan={mealTypes.length + 2} className="p-6 text-center text-gray-500 italic">
                                        <MenuLoading />
                                    </td>
                                </tr>
                            ) : bookings.length > 0 ? (
                                bookings.map((day, dayIdx) => {
                                    const nextDay = new Date(today); nextDay.setDate(today.getDate() + 1);
                                    const isUnlocked = new Date(day.date).toDateString() === nextDay.toDateString();
                                    return (
                                        <tr key={dayIdx}>
                                            <td className="font-semibold py-3 text-left px-4">{new Date(day.date).toDateString()}</td>
                                            {day.meals.map((meal, mealIdx) =>
                                                <td key={mealIdx}>
                                                    <input type="checkbox" checked={meal.booked} disabled={!isUnlocked} onChange={() => toggleMeal(dayIdx, mealIdx)} />
                                                </td>
                                            )}
                                            <td>
                                                <button disabled={!isUnlocked} className={`px-4 py-1 rounded-md text-white ${isUnlocked ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-300 cursor-not-allowed"}`} onClick={() => confirmBookings(dayIdx)}>Confirm</button>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={mealTypes.length + 2} className="p-6 text-center text-gray-500 italic">
                                        No bookings available.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
}
export default MealsBooking;
