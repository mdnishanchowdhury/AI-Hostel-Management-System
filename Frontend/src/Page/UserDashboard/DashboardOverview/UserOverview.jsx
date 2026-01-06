import { useEffect, useState } from "react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, BarChart, Bar, ResponsiveContainer, } from "recharts";
import { FaChartLine, FaPizzaSlice, FaBed, FaBuilding, FaCoins, FaUsers, FaMoneyCheckAlt, FaUtensils, } from "react-icons/fa";
import useAxiosSecure from "../../../Hook/useAxiosSecure";
import useAuth from "../../../Hook/useAuth";
import MenuLoading from "../../../Components/Loading/MenuLoading";
import { motion } from "framer-motion";
import SummaryCard from "../../../Components/SummaryCard/SummaryCard";

export default function UserOverview() {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({});
  const [roomInfo, setRoomInfo] = useState(null);
  const [payments, setPayments] = useState([]);
  const [meals, setMeals] = useState({
    daily: {},
    totalMeals: 0,
    totalPrice: 0,
  });

  useEffect(() => {
    document.title = "Smart Hostel | Dashboard";

    const fetchData = async () => {
      if (!user?.email) return setLoading(false);
      setLoading(true);

      try {
        const profileRes = await axiosSecure.get(
          `/users/room?email=${user.email}`
        );
        const userProfile = profileRes.data || {};
        setProfile(userProfile);

        const roomsRes = await axiosSecure.get("/rooms");
        const rooms = roomsRes.data || [];

        if (userProfile?.selectedSeat && rooms.length) {
          const [roomNumber, bedNo] =
            userProfile.selectedSeat.split("-Bed-");

          const matchedRoom = rooms.find(
            (r) => r.roomNumber === roomNumber
          );

          if (matchedRoom) {
            setRoomInfo({
              building: matchedRoom.hostel,
              roomNumber: matchedRoom.roomNumber,
              bedNumber: `Bed-${bedNo}`,
              bedCount: matchedRoom.capacity.length,
            });
          }
        }

        const paymentsRes = await axiosSecure.get(
          `/payments/user?email=${user.email}`
        );
        setPayments(paymentsRes.data || []);

        const month = new Date().toISOString().slice(0, 7);
        const mealsRes = await axiosSecure.get(
          `/bookings/user-history?email=${user.email}&month=${month}`
        );
        setMeals(
          mealsRes.data || { daily: {}, totalMeals: 0, totalPrice: 0 }
        );
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.email, axiosSecure]);

  if (loading) return <MenuLoading />;

  const safeRoomInfo = roomInfo || {
    building: "-",
    roomNumber: "-",
    bedNumber: "-",
    bedCount: 0,
  };

  const totalRoomRent = payments.reduce(
    (sum, p) => sum + (Number(p.roomRent) || 0),
    0
  );

  const totalMealCost = payments.reduce(
    (sum, p) => sum + (Number(p.mealCost) || 0),
    0
  );

  const totalPaid = payments.reduce(
    (sum, p) => sum + (Number(p.amount) || 0),
    0
  );

  const currentMonth = new Date().toISOString().slice(0, 7);
  const currentPayment =
    payments.find((p) => p.month === currentMonth) || {
      roomRent: 0,
      mealCost: 0,
      amount: 0,
      status: "Pending",
    };

  const paymentData = payments.map((p) => ({
    month: new Date(p.month + "-01").toLocaleString("default", {
      month: "short",
    }),
    paid: p.amount,
  }));

  const mealData = Object.keys(meals.daily).map((day) => ({
    day,
    meals:
      (meals.daily[day]?.Breakfast || 0) +
      (meals.daily[day]?.Lunch || 0) +
      (meals.daily[day]?.Dinner || 0),
  }));

  return (
    <div className="md:p-8 space-y-6 w-full">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        My Overview
      </h1>

      {/* Room Info */}
      <motion.div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <SummaryCard
          icon={<FaBuilding className="text-indigo-500 text-2xl" />}
          label="Building"
          value={safeRoomInfo.building}
          color="indigo"
        />
        <SummaryCard
          icon={<FaBed className="text-green-500 text-2xl" />}
          label="Room Number"
          value={safeRoomInfo.roomNumber}
          color="green"
        />
        <SummaryCard
          icon={<FaBed className="text-blue-500 text-2xl" />}
          label="My Bed"
          value={safeRoomInfo.bedNumber}
          color="blue"
        />
        <SummaryCard
          icon={<FaUsers className="text-purple-500 text-2xl" />}
          label="Total Beds"
          value={safeRoomInfo.bedCount}
          color="purple"
        />
      </motion.div>

      {/* TOTAL PAYMENT SUMMARY */}
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

      {/*Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
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

        <div className="bg-white rounded-2xl shadow-md p-5">
          <h2 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <FaPizzaSlice className="text-emerald-500" /> Daily Meals
          </h2>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mealData}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="meals" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Month Payment Table */}
      <motion.div className="overflow-x-auto rounded-2xl shadow-md bg-white p-5 mt-6">
        <h2 className="font-semibold text-gray-700 mb-3">Current Month Payment</h2>
        <table className="w-full text-left border-collapse">
          <thead className="bg-blue-100 text-gray-700 uppercase text-sm tracking-wider">
            <tr>
              <th className="py-3 px-4">Room Rent</th>
              <th className="py-3 px-4">Meal Cost</th>
              <th className="py-3 px-4">Total Paid</th>
              <th className="py-3 px-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr className="hover:bg-blue-50 transition">
              <td className="py-3 px-4">{currentPayment.roomRent || 0} TK</td>
              <td className="py-3 px-4">{currentPayment.mealCost || 0} TK</td>
              <td className="py-3 px-4 font-semibold">{currentPayment.amount || 0} TK</td>
              <td className="py-3 px-4">
                <span
                  className={`px-3 py-1 rounded-full text-white text-xs font-semibold ${currentPayment.status === "Paid"
                    ? "bg-green-600"
                    : currentPayment.status === "Failed"
                      ? "bg-red-600"
                      : "bg-yellow-500"
                    }`}
                >
                  {currentPayment.status || "Pending"}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}
