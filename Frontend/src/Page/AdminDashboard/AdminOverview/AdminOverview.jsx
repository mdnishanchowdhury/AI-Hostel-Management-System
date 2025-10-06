import { 
    LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, 
    PieChart, Pie, Cell, BarChart, Bar, Legend, ResponsiveContainer 
} from "recharts";
import { 
    FaChartLine, FaPizzaSlice, FaUserCheck, FaCalendarCheck, 
    FaMoneyCheckAlt, FaCoins 
} from "react-icons/fa";
import { useEffect } from "react";

// Sample Data
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

// Summary Stats
const summary = {
    dailyMeal: 3,
    totalMeal: 95,
    totalPayment: 20000,
    monthlyDue: 2500,
    presentDays: 26,
    totalDays: 30,
};

function AdminOverview() {
    useEffect(() => {
        document.title = "Smart Hostel | Dashboard";
    }, []);

    return (
        <div className="md:p-6 space-y-6 w-full min-h-screen bg-gradient-to-br from-blue-50 via-gray-50 to-gray-100 rounded-2xl">
            <h1 className="text-3xl font-bold mb-4 text-gray-800">Student Dashboard</h1>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {[
                    { icon: <FaCoins className="text-2xl text-blue-500" />, label: "Total Payment", value: `৳ ${summary.totalPayment}` },
                    { icon: <FaMoneyCheckAlt className="text-2xl text-green-500" />, label: "Due This Month", value: `৳ ${summary.monthlyDue}` },
                    { icon: <FaPizzaSlice className="text-2xl text-indigo-500" />, label: "Daily Meal", value: summary.dailyMeal },
                    { icon: <FaCalendarCheck className="text-2xl text-blue-500" />, label: "Total Meals", value: summary.totalMeal },
                    { icon: <FaUserCheck className="text-2xl text-green-500" />, label: "Attendance", value: `${summary.presentDays}/${summary.totalDays}` },
                ].map((card, idx) => (
                    <div key={idx} className="bg-white p-5 rounded-2xl flex items-center gap-4 shadow-md hover:shadow-lg transition duration-300">
                        {card.icon}
                        <div>
                            <h4 className="text-sm text-gray-600">{card.label}</h4>
                            <p className="text-xl font-bold text-gray-800">{card.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {/* Payment Line Chart */}
                <div className="bg-white rounded-2xl shadow-md p-5 hover:shadow-lg transition duration-300">
                    <h2 className="flex items-center gap-2 font-semibold mb-3 text-gray-800">
                        <FaChartLine className="text-blue-500" /> Payment Trend
                    </h2>
                    <div className="h-56">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={paymentData}>
                                <Line type="monotone" dataKey="paid" stroke="#3B82F6" strokeWidth={3}/>
                                <CartesianGrid strokeDasharray="3 3"/>
                                <XAxis dataKey="month"/>
                                <YAxis/>
                                <Tooltip />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Meal Bar Chart */}
                <div className="bg-white rounded-2xl shadow-md p-5 hover:shadow-lg transition duration-300">
                    <h2 className="flex items-center gap-2 font-semibold mb-3 text-gray-800">
                        <FaPizzaSlice className="text-indigo-500" /> Weekly Meals
                    </h2>
                    <div className="h-56">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={mealData}>
                                <XAxis dataKey="day" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="meals" fill="#6366F1" radius={[6,6,0,0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Attendance Pie Chart */}
                <div className="bg-white rounded-2xl shadow-md p-5 hover:shadow-lg transition duration-300">
                    <h2 className="flex items-center gap-2 font-semibold mb-3 text-gray-800">
                        <FaUserCheck className="text-green-500" /> Attendance Stats
                    </h2>
                    <div className="h-56 flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={attendanceData} dataKey="value" cx="50%" cy="50%" outerRadius={70} label>
                                    {attendanceData.map((entry, index) => (
                                        <Cell key={index} fill={index === 0 ? "#10B981" : "#22C55E"} />
                                    ))}
                                </Pie>
                                <Tooltip/>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminOverview;
