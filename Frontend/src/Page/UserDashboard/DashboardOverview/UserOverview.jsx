import { useEffect } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  ResponsiveContainer,
} from "recharts";
import {
  FaChartLine,
  FaPizzaSlice,
  FaUserCheck,
  FaWallet,
  FaBed,
} from "react-icons/fa";

const paymentData = [
  { month: "Jan", paid: 5000 },
  { month: "Feb", paid: 7500 },
  { month: "Mar", paid: 5000 },
  { month: "Apr", paid: 7500 },
];

const mealData = [
  { day: "Mon", meals: 3 },
  { day: "Tue", meals: 2 },
  { day: "Wed", meals: 3 },
  { day: "Thu", meals: 2 },
  { day: "Fri", meals: 3 },
];

const attendanceData = [
  { name: "Present", value: 26 },
  { name: "Absent", value: 4 },
];

const COLORS = ["#34D399", "#F87171"];

const summary = {
  room: "Room 302, Seat 2",
  dailyMeal: 3,
  totalMeal: 95,
  totalPayment: 20000,
  monthlyDue: 2500,
  presentDays: 26,
  totalDays: 30,
};

export default function UserOverview() {
  useEffect(() => {
    document.title = "Smart Hostel | Dashboard";
  }, []);

  return (
    <div className="md:p-8 space-y-6 w-full">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">My Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
        <div className="bg-white shadow-md rounded-2xl p-4 flex items-center gap-3">
          <FaBed className="text-indigo-500 text-2xl" />
          <div>
            <h4 className="text-sm text-gray-400">My Room</h4>
            <p className="text-xl font-bold text-gray-800">{summary.room}</p>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-2xl p-4 flex items-center gap-3">
          <FaWallet className="text-green-500 text-2xl" />
          <div>
            <h4 className="text-sm text-gray-400">Total Payment</h4>
            <p className="text-xl font-bold text-gray-800">৳ {summary.totalPayment}</p>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-2xl p-4 flex items-center gap-3">
          <FaWallet className="text-red-500 text-2xl" />
          <div>
            <h4 className="text-sm text-gray-400">Due This Month</h4>
            <p className="text-xl font-bold text-gray-800">৳ {summary.monthlyDue}</p>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-2xl p-4 flex items-center gap-3">
          <FaPizzaSlice className="text-orange-500 text-2xl" />
          <div>
            <h4 className="text-sm text-gray-400">Daily Meal</h4>
            <p className="text-xl font-bold text-gray-800">{summary.dailyMeal}</p>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-2xl p-4 flex items-center gap-3">
          <FaUserCheck className="text-indigo-500 text-2xl" />
          <div>
            <h4 className="text-sm text-gray-400">Attendance</h4>
            <p className="text-xl font-bold text-gray-800">
              {summary.presentDays}/{summary.totalDays}
            </p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Payment Trend */}
        <div className="bg-white rounded-2xl shadow-md p-5">
          <h2 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <FaChartLine className="text-indigo-500" /> Payment Trend
          </h2>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={paymentData}>
                <Line type="monotone" dataKey="paid" stroke="#6366f1" strokeWidth={2} />
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weekly Meals */}
        <div className="bg-white rounded-2xl shadow-md p-5">
          <h2 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <FaPizzaSlice className="text-emerald-500" /> Weekly Meals
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

        {/* Attendance Pie */}
        <div className="bg-white rounded-2xl shadow-md p-5">
          <h2 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <FaUserCheck className="text-pink-500" /> Attendance Stats
          </h2>
          <div className="h-56 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={attendanceData}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  label
                >
                  {attendanceData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
