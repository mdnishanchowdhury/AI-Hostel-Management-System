import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../Hook/useAxiosSecure";
import useAuth from "../../../Hook/useAuth";
import MenuLoading from "../../../Components/Loading/MenuLoading";

function UserMealsHistory() {
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [history, setHistory] = useState({ daily: {}, totalMeals: 0, totalPrice: 0 });
  const [loading, setLoading] = useState(false);
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const fetchHistory = async () => {
    if (!month) return;
    if (!user || !user.email) return Swal.fire("Oops...", "User not logged in!", "error");

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

  return (
    <div className=" bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-6">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 bg-white/80 shadow-md rounded-2xl p-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Monthly Meals History
          </h1>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-3 mt-4 md:mt-0 bg-gray-100 px-3 p-2 rounded-lg">
            <label htmlFor="date" className="font-semibold text-gray-700">
              Select Date:
            </label>
            <input
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>


        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
          <div className="bg-indigo-500 text-white p-5 rounded-xl shadow-md hover:shadow-lg transition">
            <h4 className="text-sm font-medium opacity-90">Total Meals</h4>
            <p className="text-2xl font-bold mt-1">{history.totalMeals}</p>
          </div>
          <div className="bg-green-500 text-white p-5 rounded-xl shadow-md hover:shadow-lg transition">
            <h4 className="text-sm font-medium opacity-90">Total Price (৳)</h4>
            <p className="text-2xl font-bold mt-1">{history.totalPrice}</p>
          </div>
        </div>

        {/* Daily Table */}
        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-md">
          <table className="table w-full text-center border-collapse">
            <thead className="bg-blue-100 text-gray-700">
              <tr>
                <th className="p-3 font-medium">Date</th>
                <th className="p-3 font-medium">Breakfast</th>
                <th className="p-3 font-medium">Lunch</th>
                <th className="p-3 font-medium">Dinner</th>
                <th className="p-3 font-medium">Total Price (৳)</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {Object.keys(history.daily).length > 0 ? (
                Object.keys(history.daily).map((day, idx) => (
                  <tr key={idx} className="border-b hover:bg-blue-50 transition">
                    <td className="p-3 font-medium">{day}</td>
                    <td className="p-3">{history.daily[day].Breakfast}</td>
                    <td className="p-3">{history.daily[day].Lunch}</td>
                    <td className="p-3">{history.daily[day].Dinner}</td>
                    <td className="p-3 text-green-600 font-semibold">{history.daily[day].total}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-6 text-center text-gray-500 italic">
                    <MenuLoading></MenuLoading>
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