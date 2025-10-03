import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../Hook/useAxiosSecure";
import useAuth from "../../../Hook/useAuth";

export default function UserMealsHistory() {
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
    <div className="p-6 bg-gray-50 rounded-lg shadow-md space-y-6">
      <h1 className="text-2xl font-bold">My Monthly Meals History</h1>

      {/* Month Picker */}
      <div className="flex items-center gap-4">
        <label className="font-semibold">Select Month:</label>
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="px-2 py-1 border rounded"
        />
        <button
          onClick={fetchHistory}
          disabled={loading}
          className={`px-4 py-1 rounded text-white ${
            loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Loading..." : "Search"}
        </button>
      </div>

      {/* Summary */}
      <div className="p-4 bg-blue-100 rounded shadow">
        <p className="font-semibold">Total Meals: {history.totalMeals}</p>
        <p className="font-semibold">Total Price: {history.totalPrice}৳</p>
      </div>

      {/* Daily Table */}
      <div className="overflow-x-auto">
        <table className="table w-full text-center border">
          <thead className="bg-blue-100">
            <tr>
              <th>Date</th>
              <th>Breakfast</th>
              <th>Lunch</th>
              <th>Dinner</th>
              <th>Total Price (৳)</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {Object.keys(history.daily).length > 0 ? (
              Object.keys(history.daily).map((day, idx) => (
                <tr key={idx} className="border-b">
                  <td>{day}</td>
                  <td>{history.daily[day].Breakfast}</td>
                  <td>{history.daily[day].Lunch}</td>
                  <td>{history.daily[day].Dinner}</td>
                  <td>{history.daily[day].total}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-gray-500 py-2">
                  No meals booked this month.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
