import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../Hook/useAxiosSecure";

export default function AdminMealsHistory() {
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchEmail, setSearchEmail] = useState("");
  const axiosSecure = useAxiosSecure();

  const fetchHistory = async () => {
    if (!month) return;
    setLoading(true);
    const [year, monthNumber] = month.split("-");
    try {
      const res = await axiosSecure.get(
        `/bookings/monthly-history?month=${monthNumber}&year=${year}`
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
  }, [month]);

  // Filter by email
  const filteredHistory = history.filter((user) =>
    user.email.toLowerCase().includes(searchEmail.toLowerCase())
  );

  // Compute total meals & total price across all users
  const totalSummary = history.reduce(
    (acc, user) => {
      acc.totalMeals += user.totalMeals;
      acc.totalPrice += user.totalPrice;
      return acc;
    },
    { totalMeals: 0, totalPrice: 0 }
  );

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-md space-y-6">
      <h1 className="text-2xl font-bold">Admin: Monthly Meals History</h1>

      {/* Month Picker & Search */}
      <div className="flex flex-wrap items-center gap-4">
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

        {/* Email Search */}
        <input
          type="text"
          placeholder="Search by email"
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
          className="px-2 py-1 border rounded ml-auto"
        />
      </div>

      {/* Total Summary */}
      <div className="p-4 bg-blue-100 rounded shadow">
        <p className="font-semibold">
          Total Meals (All Users): {totalSummary.totalMeals}
        </p>
        <p className="font-semibold">
          Total Price (All Users): {totalSummary.totalPrice}৳
        </p>
      </div>

      {/* Users Table */}
      {filteredHistory.length > 0 ? (
        filteredHistory.map((user, idx) => (
          <div key={idx} className="mb-6 p-4 border rounded bg-white">
            <h2 className="text-lg font-bold mb-2">{user.email}</h2>
            <p className="mb-2">
              Total Meals: {user.totalMeals}, Total Price: {user.totalPrice}৳
            </p>
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
                  {Object.keys(user.daily).map((day, idx2) => (
                    <tr key={idx2} className="border-b">
                      <td>{day}</td>
                      <td>{user.daily[day].Breakfast}</td>
                      <td>{user.daily[day].Lunch}</td>
                      <td>{user.daily[day].Dinner}</td>
                      <td>{user.daily[day].total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500">No meals booked for this month.</p>
      )}
    </div>
  );
}
