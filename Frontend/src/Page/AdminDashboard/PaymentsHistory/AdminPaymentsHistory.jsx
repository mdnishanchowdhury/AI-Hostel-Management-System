import { useEffect, useState, useMemo } from "react";
import useAxiosSecure from "../../../Hook/useAxiosSecure";
import { FaCoins, FaMoneyCheckAlt, FaUsers, FaExclamationTriangle } from "react-icons/fa";
import SummaryCard from "../../../Components/SummaryCard/SummaryCard";

function AdminPaymentsHistory() {
  const axiosSecure = useAxiosSecure();

  const [payments, setPayments] = useState([]);
  const [unpaidUsers, setUnpaidUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.toISOString().slice(0, 7);

  const [year, setYear] = useState(currentYear);
  const [month, setMonth] = useState(currentMonth);

  const fetchPayments = async () => {
    try {
      const res = await axiosSecure.get(`/payments?month=${month}`);
      setPayments(res.data || []);
    } catch (error) {
      console.error("Fetch payments failed:", error);
    }
  };

  const fetchUnpaidUsers = async () => {
    try {
      const res = await axiosSecure.get(`/payments/unpaid?month=${month}`);
      setUnpaidUsers(res.data?.unpaidUsers || []);
    } catch (error) {
      console.error("Fetch unpaid users failed:", error);
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchPayments(), fetchUnpaidUsers()]).finally(() =>
      setLoading(false)
    );
  }, [month]);

  const summary = useMemo(() => {
    const totalPaidAmount = payments.reduce(
      (sum, p) => sum + Number(p.amount || 0),
      0
    );

    return {
      totalUsers: payments.length + unpaidUsers.length,
      paidCount: payments.length,
      unpaidCount: unpaidUsers.length,
      totalPaidAmount,
    };
  }, [payments, unpaidUsers]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  // Year dropdown 
  const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - i);

  // Month dropdown 
  const monthOptions = Array.from({ length: 12 }, (_, i) => {
    const m = (i + 1).toString().padStart(2, "0");
    return `${year}-${m}`;
  });

  return (
    <div className="p-4 md:p-6 bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 min-h-screen">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-3xl font-bold text-gray-800">Admin Payment History</h2>

        <div className="flex gap-2 items-center bg-white rounded-lg shadow px-3 py-2">
          <span className="text-gray-600 font-semibold">Year:</span>
          <select
            value={year}
            onChange={(e) => {
              const selectedYear = Number(e.target.value);
              setYear(selectedYear);
              setMonth(`${selectedYear}-01`);
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
            {monthOptions.map((m) => (
              <option key={m} value={m}>
                {new Date(m + "-01").toLocaleString("default", { month: "long" })}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* summary table */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <SummaryCard
          icon={<FaMoneyCheckAlt />}
          label="Total Paid (৳)"
          value={summary.totalPaidAmount}
          color="blue"
        />
        <SummaryCard
          icon={<FaUsers />}
          label="Total Users"
          value={summary.totalUsers}
          color="indigo"
        />
        <SummaryCard
          icon={<FaCoins />}
          label="Paid Users"
          value={summary.paidCount}
          color="green"
        />
        <SummaryCard
          icon={<FaExclamationTriangle />}
          label="Unpaid Users"
          value={summary.unpaidCount}
          color="orange"
        />
      </div>

      {/* paid users */}
      <TableWrapper title="Paid Users">
        <table className="w-full text-left">
          <thead className="bg-blue-100">
            <tr>
              <Th>Name</Th>
              <Th>Student ID</Th>
              <Th>Email</Th>
              <Th>Month</Th>
              <Th>Amount</Th>
              <Th>Method</Th>
              <Th>Status</Th>
            </tr>
          </thead>
          <tbody>
            {payments.length > 0 ? (
              payments.map((p) => (
                <tr key={p._id} className="hover:bg-blue-50 transition">
                  <Td>{p.userName}</Td>
                  <Td>{p.studentId}</Td>
                  <Td>{p.email}</Td>
                  <Td>{new Date(p.month + "-01").toLocaleString("default", { month: "long", year: "numeric" })}</Td>
                  <Td className="font-semibold text-green-600">৳{p.amount}</Td>
                  <Td>{p.method}</Td>
                  <Td>
                    <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">Paid</span>
                  </Td>
                </tr>
              ))
            ) : (
              <EmptyRow colSpan={7} text="No paid users found" />
            )}
          </tbody>
        </table>
      </TableWrapper>

      {/* unpaid users */}
      <TableWrapper title="Unpaid Users">
        <table className="w-full text-left">
          <thead className="bg-red-100">
            <tr>
              <Th>Name</Th>
              <Th>Student ID</Th>
              <Th>Email</Th>
            </tr>
          </thead>
          <tbody>
            {unpaidUsers.length > 0 ? (
              unpaidUsers.map((u) => (
                <tr key={u._id} className="hover:bg-red-50 transition">
                  <Td>{u.name}</Td>
                  <Td>{u.studentId}</Td>
                  <Td>{u.email}</Td>
                </tr>
              ))
            ) : (
              <EmptyRow colSpan={3} text="All users have paid" />
            )}
          </tbody>
        </table>
      </TableWrapper>
    </div>
  );
}

const TableWrapper = ({ title, children }) => (
  <div className="bg-white rounded-xl shadow p-4 mb-8 overflow-x-auto">
    <h3 className="text-xl font-semibold mb-3">{title}</h3>
    {children}
  </div>
);

const Th = ({ children }) => (
  <th className="p-3 text-left font-semibold text-gray-700">{children}</th>
);

const Td = ({ children, className = "" }) => (
  <td className={`p-3 text-gray-800 ${className}`}>{children}</td>
);

const EmptyRow = ({ colSpan, text }) => (
  <tr>
    <td colSpan={colSpan} className="p-4 text-center text-gray-500">
      {text}
    </td>
  </tr>
);

export default AdminPaymentsHistory;
