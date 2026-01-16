import { useEffect, useState } from "react";
import useAxiosSecure from "../../../Hook/useAxiosSecure";
import Swal from "sweetalert2";
import MenuLoading from "../../../Components/Loading/MenuLoading";
import SummaryCard from "../../../Components/SummaryCard/SummaryCard";

function DailyBookedMeals() {
  const axiosSecure = useAxiosSecure();

  const today = new Date();
  const todayDate = today.toISOString().split("T")[0];

  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState((today.getMonth() + 1).toString().padStart(2, "0"));
  const [selectedDate, setSelectedDate] = useState(todayDate);
  const [summary, setSummary] = useState({ userList: [], totalSummary: {} });
  const [loading, setLoading] = useState(false);

  // Fetch summary 
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

  const yearOptions = Array.from({ length: 5 }, (_, i) => today.getFullYear() - i);

  const monthOptions = Array.from({ length: 12 }, (_, i) =>
    (i + 1).toString().padStart(2, "0")
  );

  const datesInMonth = () => {
    const numDays = new Date(year, Number(month), 0).getDate();
    return Array.from({ length: numDays }, (_, i) => {
      const d = (i + 1).toString().padStart(2, "0");
      return `${year}-${month}-${d}`;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 md:p-6">
      <div className="space-y-6 backdrop-blur-md">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4p-6">
          <h1 className="text-3xl font-bold text-gray-800">Daily Meals Summary</h1>

          <div className="flex items-center gap-3 flex-wrap bg-white px-3 py-2 rounded-lg">
            {/* Year */}
            <label className="font-semibold text-gray-700">Year:</label>
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="border-none bg-transparent text-gray-700 focus:ring-0"
            >
              {yearOptions.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>

            {/* Month */}
            <label className="font-semibold text-gray-700">Month:</label>
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="border-none bg-transparent text-gray-700 focus:ring-0"
            >
              {monthOptions.map((m) => (
                <option key={m} value={m}>
                  {new Date(`${year}-${m}-01`).toLocaleString("default", { month: "long" })}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Dates Row */}
        <div className="flex flex-wrap gap-2 bg-white/80 p-4 rounded-2xl shadow-md">
          {datesInMonth().map((date) => (
            <button
              key={date}
              onClick={() => setSelectedDate(date)}
              className={`px-3 py-1 rounded-lg border ${date === selectedDate
                ? "bg-blue-500 text-white border-blue-500"
                : date === todayDate
                  ? "bg-blue-100 text-blue-700 border-blue-200"
                  : "bg-gray-100 text-gray-700 border-gray-200"
                } hover:scale-105 transition`}
            >
              {new Date(date).getDate()}
            </button>
          ))}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <SummaryCard
            // icon=""
            label="Breakfast"
            value={summary.totalSummary?.Breakfast || 0}
            color="blue"
          />
          <SummaryCard
            // icon=""
            label="Lunch"
            value={summary.totalSummary?.Lunch || 0}
            color="green"
          />
          <SummaryCard
            // icon=""
            label="Dinner"
            value={summary.totalSummary?.Dinner || 0}
            color="indigo"
          />
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <MenuLoading />
          </div>
        ) : (
          <div className="overflow-x-auto bg-white/80 border border-gray-200 rounded-xl shadow-sm mt-6">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-blue-100 text-gray-700">
                <tr>
                  <th className="p-3 font-semibold">Name</th>
                  <th className="p-3 font-semibold">Student Id</th>
                  {/* <th className="p-3 font-semibold">Email</th> */}
                  <th className="p-3 font-semibold">Booked Meals</th>
                  <th className="p-3 font-semibold">Canceled Meals</th>
                </tr>
              </thead>
              <tbody>
                {summary.userList?.length > 0 ? (
                  summary.userList.map((user, idx) => (
                    <tr key={idx} className="border-b hover:bg-blue-50 transition">
                      <td className="p-3 font-medium text-gray-800">{user.name}</td>
                      <td className="p-3 font-medium text-gray-800">{user.studentId}</td>
                      {/* <td className="p-3 font-medium text-gray-800">{user.email}</td> */}
                      <td className="p-3 text-gray-700">{user.bookedMeals.join(", ") || "-"}</td>
                      <td className="p-3 text-gray-700">{user.canceledMeals.join(", ") || "-"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="p-6 text-center text-gray-500 italic">
                      No bookings for this date.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default DailyBookedMeals;
