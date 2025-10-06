import { useEffect, useState, useMemo } from "react";
import useAxiosSecure from "../../../Hook/useAxiosSecure";

function AdminPaymentsHistory() {
  const [payments, setPayments] = useState([]);
  const [unpaidUsers, setUnpaidUsers] = useState([]);

  const currentMonth = new Date().toISOString().slice(0, 7);
  const [month, setMonth] = useState(currentMonth);

  const axiosSecure = useAxiosSecure();

  // payments
  const fetchPayments = async () => {
    try {
      let url = "/payments";
      if (month) url += `?month=${month}`;
      const res = await axiosSecure.get(url);
      setPayments(res.data);
    } catch (err) {
      console.error("Failed to fetch payments:", err);
    }
  };

  // unpaid users
  const fetchUnpaidUsers = async () => {
    try {
      const res = await axiosSecure.get("/payments/unpaid");
      setUnpaidUsers(res.data.unpaidUsers);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPayments();
    fetchUnpaidUsers();
  }, [month]);

  // summary
  const summary = useMemo(() => {
    const totalUsers = payments.length + unpaidUsers.length;
    const totalPaidAmount = payments.reduce((sum, p) => sum + (p.total || 0), 0);
    const unpaidCount = unpaidUsers.length;
    const paidCount = payments.filter((p) => p.status === "Paid").length;
    return { totalUsers, totalPaidAmount, unpaidCount, paidCount };
  }, [payments, unpaidUsers]);

  return (
    <div className="md:p-6 bg-gradient-to-br from-blue-50 via-gray-50 to-gray-100 min-h-screen">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-white/80 shadow-md rounded-2xl p-6 mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Payment History</h2>
        <div className="flex items-center gap-3 mt-3 md:mt-0 bg-gray-100 px-3 p-2 rounded-lg">
          <label htmlFor="date" className="font-semibold text-gray-700">
            Select Date:
          </label>
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
          {/* <button
            onClick={() => {
              fetchPayments();
              fetchUnpaidUsers();
            }}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
          >
            Search
          </button> */}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-red-500 text-white p-5 rounded-xl shadow-md hover:shadow-lg transition">
          <h4 className="text-sm font-medium opacity-90">Total Paid (TK)</h4>
          <p className="text-2xl font-bold mt-1">{summary.totalPaidAmount} TK</p>
        </div>

        <div className="bg-indigo-500 text-white p-5 rounded-xl shadow-md hover:shadow-lg transition">
          <h4 className="text-sm font-medium opacity-90">Total Users</h4>
          <p className="text-2xl font-bold mt-1">{summary.totalUsers}</p>
        </div>

        <div className="bg-green-500 text-white p-5 rounded-xl shadow-md hover:shadow-lg transition">
          <h4 className="text-sm font-medium opacity-90">Paid Users</h4>
          <p className="text-2xl font-bold mt-1">{summary.paidCount}</p>
        </div>

        <div className="bg-blue-500 text-white p-5 rounded-xl shadow-md hover:shadow-lg transition">
          <h4 className="text-sm font-medium opacity-90">Unpaid Users</h4>
          <p className="text-2xl font-bold mt-1">{summary.unpaidCount}</p>
        </div>
      </div>

      {/* Paid Users Table */}
      <div className="bg-white/80 rounded-xl shadow-md p-4 mb-8 backdrop-blur-md">
        <h3 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">
          Paid Users
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-blue-100 text-gray-700">
              <tr>
                <th className="p-3 font-medium">Name</th>
                <th className="p-3 font-medium">Student ID</th>
                <th className="p-3 font-medium">Email</th>
                <th className="p-3 font-medium">Month</th>
                <th className="p-3 font-medium">Amount</th>
                <th className="p-3 font-medium">Payment Method</th>
                <th className="p-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.length > 0 ? (
                payments.map((p) => (
                  <tr
                    key={p._id}
                    className="hover:bg-blue-50 border-b last:border-none transition"
                  >
                    <td className="p-3 text-gray-800">{p.userName}</td>
                    <td className="p-3 text-gray-800">{p.studentId}</td>
                    <td className="p-3 text-gray-800">{p.email}</td>
                    <td className="p-3 text-gray-800">{p.month}</td>
                    <td className="p-3 text-green-600 font-semibold">{p.total}</td>
                    <td className="p-3 text-gray-800">{p.paymentMethod}</td>
                    <td className="p-3">
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-600">
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="p-4 text-center text-gray-500">
                    No paid users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Unpaid Users Table */}
      <div className="bg-white/80 rounded-xl shadow-md p-4 backdrop-blur-md">
        <h3 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">
          Unpaid Users
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-blue-100 text-gray-700">
              <tr>
                <th className="p-3 font-medium">Name</th>
                <th className="p-3 font-medium">Student ID</th>
                <th className="p-3 font-medium">Email</th>
              </tr>
            </thead>
            <tbody>
              {unpaidUsers.length > 0 ? (
                unpaidUsers.map((u) => (
                  <tr
                    key={u._id}
                    className="hover:bg-blue-50 border-b last:border-none transition"
                  >
                    <td className="p-3 text-gray-800">{u.name}</td>
                    <td className="p-3 text-gray-800">{u.studentId}</td>
                    <td className="p-3 text-gray-800">{u.email}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="p-4 text-center text-gray-500">
                    All users have paid.
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

export default AdminPaymentsHistory;
