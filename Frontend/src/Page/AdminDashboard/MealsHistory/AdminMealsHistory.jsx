import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hook/useAxiosSecure";
import Swal from "sweetalert2";
import MenuLoading from "../../../Components/Loading/MenuLoading";
import SummaryCard from "../../../Components/SummaryCard/SummaryCard";
import { FaUtensils, FaCoins, FaUsers } from "react-icons/fa";

function AdminMealsHistory() {
  const axiosSecure = useAxiosSecure();

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.toISOString().slice(0, 7);

  const [year, setYear] = useState(currentYear);
  const [month, setMonth] = useState(currentMonth);
  const [searchEmail, setSearchEmail] = useState("");

  // Year & Month dropdown options
  const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - i);
  const monthOptions = Array.from({ length: 12 }, (_, i) => {
    const m = (i + 1).toString().padStart(2, "0");
    return `${year}-${m}`;
  });

  const [selectedYear, selectedMonthNumber] = month.split("-");

  const {
    data: history = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["monthlyHistory", month],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/bookings/monthly-history?month=${selectedMonthNumber}&year=${selectedYear}`
      );
      return res.data;
    },
    onError: () => {
      Swal.fire("Oops...", "Failed to fetch monthly history!", "error");
    },
  });

  const filteredHistory = history.filter((user) =>
    user.email.toLowerCase().includes(searchEmail.toLowerCase())
  );

  const totalSummary = history.reduce(
    (acc, user) => {
      acc.totalMeals += user.totalMeals;
      acc.totalPrice += user.totalPrice;
      return acc;
    },
    { totalMeals: 0, totalPrice: 0 }
  );

  return (
    <div className="md:p-6 bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8  gap-4">
        <h1 className="text-3xl font-bold text-gray-800">
          Monthly Meals History
        </h1>

        {/* Year & Month Controls */}
        <div className="flex flex-wrap items-center gap-3 bg-white shadow px-3 py-2 rounded-lg">
          <span className="text-gray-600 font-semibold">Year:</span>
          <select
            value={year}
            onChange={(e) => {
              const selectedYear = Number(e.target.value);
              setYear(selectedYear);
              setMonth(`${selectedYear}-01`);
            }}
            className="border-none focus:ring-2 focus:ring-blue-400 focus:outline-none rounded-lg px-3 py-2"
          >
            {yearOptions.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>

          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="border-none focus:ring-2 focus:ring-blue-400 focus:outline-none rounded-lg px-3 py-2"
          >
            {monthOptions.map((m) => (
              <option key={m} value={m}>
                {new Date(m + "-01").toLocaleString("default", {
                  month: "long",
                })}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Search by email..."
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
            className="border-none focus:ring-2 focus:ring-blue-400 focus:outline-none rounded-lg px-3 py-2 w-52"
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <SummaryCard
          icon={<FaUtensils />}
          label="Total Meals"
          value={totalSummary.totalMeals}
          color="blue"
        />
        <SummaryCard
          icon={<FaCoins />}
          label="Total Price (All Users)"
          value={`${totalSummary.totalPrice} TK`}
          color="green"
        />
        <SummaryCard
          icon={<FaUsers />}
          label="Total Users"
          value={history.length}
          color="indigo"
        />
      </div>

      {/* Table Section */}
      {isLoading ? (
        <MenuLoading />
      ) : isError ? (
        <p className="text-red-600 text-center mt-8">
          Failed to load history.
        </p>
      ) : filteredHistory.length > 0 ? (
        filteredHistory.map((user, idx) => (
          <div
            key={idx}
            className="mb-8 p-6 bg-white shadow-md rounded-2xl hover:shadow-lg transition duration-300"
          >
            <div className="flex flex-wrap items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-gray-800">{user.email}</h2>
              <p className="text-sm text-gray-600">
                Meals: <b>{user.totalMeals}</b> | Total:{" "}
                <b className="text-green-600">{user.totalPrice} TK</b>
              </p>
            </div>

            <div className="overflow-x-auto rounded-lg border border-gray-100">
              <table className="w-full text-sm text-center">
                <thead className="bg-blue-100 text-gray-700">
                  <tr>
                    <th className="py-2 px-3 font-medium">Date</th>
                    <th className="py-2 px-3 font-medium">Breakfast</th>
                    <th className="py-2 px-3 font-medium">Lunch</th>
                    <th className="py-2 px-3 font-medium">Dinner</th>
                    <th className="py-2 px-3 font-medium">Total Price</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(user.daily).map((day, i) => (
                    <tr
                      key={i}
                      className="border-b hover:bg-blue-50 transition duration-200"
                    >
                      <td className="py-2 px-3 text-gray-700">{day}</td>
                      <td>{user.daily[day].Breakfast}</td>
                      <td>{user.daily[day].Lunch}</td>
                      <td>{user.daily[day].Dinner}</td>
                      <td className="text-green-600 font-semibold">
                        {user.daily[day].total}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-center mt-6">
          No meals booked for this month.
        </p>
      )}
    </div>
  );
}

export default AdminMealsHistory;
