import { useEffect, useState } from "react";
import useAxiosSecure from "../../../Hook/useAxiosSecure";
import useAuth from "../../../Hook/useAuth";
import MenuLoading from "../../../Components/Loading/MenuLoading";
import { FaCoins, FaUtensils, FaMoneyCheckAlt, FaCalendarAlt } from "react-icons/fa";
import SummaryCard from "../../../Components/SummaryCard/SummaryCard";

function UserPaymentHistory() {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(""); // initially no month selected
  const [error, setError] = useState("");

  // Fetch payments
  useEffect(() => {
    if (!user?.email) return;

    const fetchPayments = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axiosSecure.get(`/payments/user?email=${user.email}`);
        const data = res.data || [];
        setPayments(data);
        if (data.length === 0) setError("No payments found.");
      } catch (err) {
        console.error(err);
        setError("Failed to fetch payment history.");
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [user?.email, axiosSecure]);

  if (loading) return <MenuLoading />;
  if (error && payments.length === 0)
    return <p className="text-center mt-6 text-gray-500">{error}</p>;

  // Filter payments by selected year
  const paymentsByYear = payments.filter((p) => {
    const paymentYear = new Date(p.month + "-01").getFullYear();
    return paymentYear === Number(year);
  });

  // Filter payments by selected month
  const filteredPayments = month
    ? paymentsByYear.filter((p) => p.month === month)
    : paymentsByYear;

  // Totals
  const totalRoomRent = filteredPayments.reduce((sum, p) => sum + (p.roomRent || 0), 0);
  const totalMealCost = filteredPayments.reduce((sum, p) => sum + (p.mealCost || 0), 0);
  const totalPaid = filteredPayments.reduce((sum, p) => sum + (p.amount || 0), 0);

  // Year options (last 5 years)
  const yearOptions = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  // Month options (all months)
  const monthOptions = Array.from({ length: 12 }, (_, i) => {
    const m = i + 1;
    return `${year}-${m.toString().padStart(2, "0")}`;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 py-10 px-4">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Filters */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Payment History</h1>
          <div className="flex items-center gap-3 bg-white rounded-lg shadow px-3 py-2">
            <FaCalendarAlt className="text-gray-600 text-lg" />
            <select
              value={year}
              onChange={(e) => {
                setYear(e.target.value);
                setMonth(""); // reset month when year changes
              }}
              className="border-none focus:ring-0 text-gray-700 bg-transparent"
            >
              {yearOptions.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>

            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="border-none focus:ring-0 text-gray-700 bg-transparent"
            >
              <option value="">All Months</option>
              {monthOptions.map((m) => (
                <option key={m} value={m}>
                  {new Date(m + "-01").toLocaleString("default", { month: "long" })}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
          <SummaryCard icon={<FaMoneyCheckAlt />} label="Total Room Rent" value={`${totalRoomRent} TK`} color="blue" />
          <SummaryCard icon={<FaUtensils />} label="Total Meal Cost" value={`${totalMealCost} TK`} color="green" />
          <SummaryCard icon={<FaCoins />} label="Total Paid" value={`${totalPaid} TK`} color="indigo" />
        </div>

        {/* Payment Table */}
        <div className="overflow-x-auto rounded-3xl shadow-lg bg-white/90 backdrop-blur-md">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gradient-to-r from-blue-200 to-blue-100 text-gray-700 uppercase text-sm tracking-wider">
              <tr>
                <th className="py-3 px-6 rounded-tl-3xl">Month</th>
                <th className="py-3 px-6">Room Rent</th>
                <th className="py-3 px-6">Meal Cost</th>
                <th className="py-3 px-6">Total</th>
                <th className="py-3 px-6">Payment Method</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6 rounded-tr-3xl">Paid At</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPayments.length ? (
                filteredPayments.map((p, idx) => (
                  <tr key={idx} className="hover:bg-blue-50 transition duration-200">
                    <td className="py-3 px-6 font-medium text-gray-800">
                      {new Date(p.month + "-01").toLocaleString("default", { month: "long", year: "numeric" })}
                    </td>
                    <td className="py-3 px-6">{p.roomRent || 0} TK</td>
                    <td className="py-3 px-6">{p.mealCost || 0} TK</td>
                    <td className="py-3 px-6 font-semibold">{p.amount || 0} TK</td>
                    <td className="py-3 px-6">{p.method || "-"}</td>
                    <td className="py-3 px-6">
                      <span className={`px-3 py-1 rounded-full text-white font-semibold text-xs ${
                        p.status === "Paid" ? "bg-green-600" : p.status === "Failed" ? "bg-red-600" : "bg-yellow-500"
                      }`}>{p.status || "Pending"}</span>
                    </td>
                    <td className="py-3 px-6 text-gray-500">{p.createdAt ? new Date(p.createdAt).toLocaleString() : "-"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-6 text-center text-gray-400">
                    No payments found for this selection.
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

export default UserPaymentHistory;
