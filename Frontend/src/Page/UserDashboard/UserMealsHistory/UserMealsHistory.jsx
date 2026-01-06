import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../Hook/useAxiosSecure";
import useAuth from "../../../Hook/useAuth";
import MenuLoading from "../../../Components/Loading/MenuLoading";
import { FaUtensils, FaMoneyCheckAlt, FaCalendarAlt } from "react-icons/fa";
import SummaryCard from "../../../Components/SummaryCard/SummaryCard";

function UserMealsHistory() {
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [history, setHistory] = useState({ daily: {}, totalMeals: 0, totalPrice: 0 });
  const [loading, setLoading] = useState(false);
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const fetchHistory = async () => {
    if (!month) return;
    if (!user?.email) return Swal.fire("Oops...", "User not logged in!", "error");

    setLoading(true);
    try {
      const res = await axiosSecure.get(
        `/bookings/user-history?month=${month}&email=${user.email}`
      );
      setHistory(res.data);
    } catch (err) {
      console.error(err);
      Swal.fire("Oops...", "Failed to fetch monthly history!", "error");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchHistory();
  }, [month, user]);

  const monthOptions = Array.from({ length: 12 }).map((_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    return d.toISOString().slice(0, 7);
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 py-10 px-4">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Top Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800">Monthly Meals History</h1>

          <div className="flex items-center gap-3 bg-white rounded-lg shadow px-3 py-2">
            <FaCalendarAlt className="text-gray-600 text-lg" />
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="border-none focus:ring-0 text-gray-700 bg-transparent"
            >
              {monthOptions.map((m) => (
                <option key={m} value={m}>
                  {new Date(m + "-01").toLocaleString("default", {
                    month: "long",
                    year: "numeric",
                  })}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          <SummaryCard
            icon={<FaUtensils />}
            label="Total Meals"
            value={history.totalMeals}
            color="blue"
          />
          <SummaryCard
            icon={<FaMoneyCheckAlt />}
            label="Total Price (৳)"
            value={history.totalPrice}
            color="green"
          />
        </div>

        {/* Daily Meals Table */}
        <div className="overflow-x-auto rounded-3xl shadow-lg bg-white/90 backdrop-blur-md">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gradient-to-r from-blue-200 to-blue-100 text-gray-700 uppercase text-sm tracking-wider">
              <tr>
                <th className="py-3 px-6 rounded-tl-3xl">Date</th>
                <th className="py-3 px-6">Breakfast</th>
                <th className="py-3 px-6">Lunch</th>
                <th className="py-3 px-6">Dinner</th>
                <th className="py-3 px-6 rounded-tr-3xl">Total Price (৳)</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-6 text-center">
                    <MenuLoading />
                  </td>
                </tr>
              ) : Object.keys(history.daily).length > 0 ? (
                Object.keys(history.daily).map((day, idx) => (
                  <tr key={idx} className="hover:bg-blue-50 transition duration-200">
                    <td className="py-3 px-6 font-medium text-gray-800">{day}</td>
                    <td className="py-3 px-6">{history.daily[day].Breakfast || 0}</td>
                    <td className="py-3 px-6">{history.daily[day].Lunch || 0}</td>
                    <td className="py-3 px-6">{history.daily[day].Dinner || 0}</td>
                    <td className="py-3 px-6 font-semibold text-green-600">{history.daily[day].total || 0}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-6 text-center text-gray-400 italic">
                    No meal data available for this month.
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

export default UserMealsHistory;