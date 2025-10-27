import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hook/useAxiosSecure";
import Swal from "sweetalert2";
import MenuLoading from "../../../Components/Loading/MenuLoading";

function AdminMealsHistory() {
  const axiosSecure = useAxiosSecure();
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [searchEmail, setSearchEmail] = useState("");

  const [year, monthNumber] = month.split("-");

  const {
    data: history = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["monthlyHistory", month],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/bookings/monthly-history?month=${monthNumber}&year=${year}`
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
    <div className="md:p-6 bg-gradient-to-br from-blue-50 via-gray-50 to-gray-100 min-h-screen rounded-2xl">
      {/* Header */}
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
            className="border border-gray-300 px-3 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />

          <input
            type="text"
            placeholder="Search by email..."
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
            className="border border-gray-300 px-3 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none w-52"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-500 text-white p-5 rounded-xl shadow-md hover:shadow-lg transition duration-300">
          <h4 className="text-sm font-medium opacity-90">Total Meals</h4>
          <p className="text-2xl font-bold mt-1">{totalSummary.totalMeals}</p>
        </div>

        <div className="bg-green-500 text-white p-5 rounded-xl shadow-md hover:shadow-lg transition duration-300">
          <h4 className="text-sm font-medium opacity-90">Total Price (All Users)</h4>
          <p className="text-2xl font-bold mt-1">{totalSummary.totalPrice} TK</p>
        </div>

        <div className="bg-indigo-500 text-white p-5 rounded-xl shadow-md hover:shadow-lg transition duration-300">
          <h4 className="text-sm font-medium opacity-90">Total Users</h4>
          <p className="text-2xl font-bold mt-1">{history.length}</p>
        </div>
      </div>

      {/* Table Section */}
      {isLoading ? (
        <MenuLoading></MenuLoading>
      ) : isError ? (
        <p className="text-red-600 text-center mt-8">Failed to load history.</p>
      ) : filteredHistory.length > 0 ? (
        filteredHistory.map((user, idx) => (
          <div
            key={idx}
            className="mb-8 p-6 bg-white/80 backdrop-blur-md border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg transition duration-300"
          >
            <div className="flex flex-wrap items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-gray-800">{user.email}</h2>
              <p className="text-sm text-gray-600">
                Meals: <b>{user.totalMeals}</b> | Total:{" "}
                <b className="text-blue-600">{user.totalPrice} TK</b>
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
                      <td className="text-blue-600 font-semibold">
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