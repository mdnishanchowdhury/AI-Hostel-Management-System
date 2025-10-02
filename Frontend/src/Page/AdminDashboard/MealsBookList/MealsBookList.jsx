import { useEffect, useState } from "react";
import useAxiosSecure from "../../../Hook/useAxiosSecure";
import Swal from "sweetalert2";

export default function MealsBookList() {
  const [selectedDate, setSelectedDate] = useState(""); 
  const [summary, setSummary] = useState({ userList: [], totalSummary: {} });
  const axiosSecure = useAxiosSecure();
  const [loading, setLoading] = useState(false);

  const fetchSummary = async (date) => {
    if (!date) return;
    setLoading(true);
    try {
      const res = await axiosSecure.get(`/bookings/summary?date=${date}`);
      setSummary(res.data);
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to fetch meals summary!"
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    if (selectedDate) fetchSummary(selectedDate);
  }, [selectedDate]);

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-md space-y-4">
      <h1 className="text-2xl font-bold">Meals Summary by Date</h1>

      {/* Date Picker */}
      <div className="flex items-center gap-2">
        <label htmlFor="date" className="font-semibold">Select Date:</label>
        <input
          type="date"
          id="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border px-2 py-1 rounded"
        />
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {/* Total */}
          <div className="bg-blue-50 p-4 rounded">
            <h2 className="font-semibold text-lg">Total Booked Meals:</h2>
            <p>Breakfast: {summary.totalSummary?.Breakfast || 0}</p>
            <p>Lunch: {summary.totalSummary?.Lunch || 0}</p>
            <p>Dinner: {summary.totalSummary?.Dinner || 0}</p>
          </div>

          <div className="overflow-x-auto">
            <table className="table w-full text-center border">
              <thead className="bg-blue-100">
                <tr>
                  <th>Email</th>
                  <th>Booked Meals</th>
                  <th>Canceled Meals</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {summary.userList?.length > 0 ? (
                  summary.userList.map((user, idx) => (
                    <tr key={idx} className="border-b">
                      <td className="font-medium">{user.email}</td>
                      <td>{user.bookedMeals.join(", ") || "-"}</td>
                      <td>{user.canceledMeals.join(", ") || "-"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="py-4">No bookings for this date</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
