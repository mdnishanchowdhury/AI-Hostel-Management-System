import { useEffect, useState } from "react";
import useAxiosSecure from "../../../Hook/useAxiosSecure";
import Swal from "sweetalert2";
import MenuLoading from "../../../Components/Loading/MenuLoading";

function DailyBookedMeals() {
  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [summary, setSummary] = useState({ userList: [], totalSummary: {} });
  const [loading, setLoading] = useState(false);
  const axiosSecure = useAxiosSecure();

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
        text: "Failed to fetch meals summary!",
        confirmButtonColor: "#3b82f6",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary(selectedDate);
  }, [selectedDate]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-2xl p-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-800">
            Daily Meals Summary
          </h1>

          <div className="flex items-center gap-3 bg-gray-100 px-3 py-2 rounded-lg">
            <label htmlFor="date" className="font-semibold text-gray-700">
              Select Date:
            </label>
            <input
              type="date"
              id="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1.5 bg-white text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-16">
            <MenuLoading></MenuLoading>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-blue-500 text-white p-5 rounded-xl shadow hover:shadow-md transition">
                <h2 className="text-sm opacity-90 font-medium">Breakfast</h2>
                <p className="text-3xl font-bold mt-1">
                  {summary.totalSummary?.Breakfast || 0}
                </p>
              </div>
              <div className="bg-green-500 text-white p-5 rounded-xl shadow hover:shadow-md transition">
                <h2 className="text-sm opacity-90 font-medium">Lunch</h2>
                <p className="text-3xl font-bold mt-1">
                  {summary.totalSummary?.Lunch || 0}
                </p>
              </div>
              <div className="bg-orange-500 text-white p-5 rounded-xl shadow hover:shadow-md transition">
                <h2 className="text-sm opacity-90 font-medium">Dinner</h2>
                <p className="text-3xl font-bold mt-1">
                  {summary.totalSummary?.Dinner || 0}
                </p>
              </div>
            </div>

            <div className="overflow-x-auto bg-gray-50 border rounded-xl shadow-sm mt-6">
              <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-gray-200 text-gray-800">
                  <tr>
                    <th className="p-3 font-semibold">Email</th>
                    <th className="p-3 font-semibold">Booked Meals</th>
                    <th className="p-3 font-semibold">Canceled Meals</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.userList?.length > 0 ? (
                    summary.userList.map((user, idx) => (
                      <tr
                        key={idx}
                        className="border-t hover:bg-gray-100 transition"
                      >
                        <td className="p-3 font-medium text-gray-700">
                          {user.email}
                        </td>
                        <td className="p-3 text-gray-700">
                          {user.bookedMeals.join(", ") || "-"}
                        </td>
                        <td className="p-3 text-gray-700">
                          {user.canceledMeals.join(", ") || "-"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={3}
                        className="p-6 text-center text-gray-500 italic"
                      >
                        No bookings for this date.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
export default DailyBookedMeals;