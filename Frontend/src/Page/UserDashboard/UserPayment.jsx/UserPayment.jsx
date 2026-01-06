import { useEffect, useState } from "react";
import useAxiosSecure from "../../../Hook/useAxiosSecure";
import useAuth from "../../../Hook/useAuth";
import MenuLoading from "../../../Components/Loading/MenuLoading";
import Swal from "sweetalert2";
import { FaCoins, FaUtensils, FaMoneyCheckAlt, FaCalendarAlt } from "react-icons/fa";

export default function UserPayment() {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.toISOString().slice(0, 7); // YYYY-MM

  const [year, setYear] = useState(currentYear);
  const [month, setMonth] = useState(currentMonth); 
  const [mealCost, setMealCost] = useState(0);
  const [roomRent] = useState(4500);
  const [total, setTotal] = useState(4500);
  const [alreadyPaid, setAlreadyPaid] = useState(false);

  const [payments, setPayments] = useState([]);

  // Fetch user profile
  useEffect(() => {
    if (!user?.email) return;
    setLoading(true);
    axiosSecure
      .get(`/users/room?email=${user?.email}`)
      .then((res) => setProfile(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [user?.email, axiosSecure]);

  // Fetch payments & meal cost
  useEffect(() => {
    if (!user?.email || !month) return;

    const fetchData = async () => {
      try {
        // Fetch all payments
        const payRes = await axiosSecure.get(`/payments/user?email=${user.email}`);
        setPayments(payRes.data || []);

        // Fetch meal cost for selected month
        const mealRes = await axiosSecure.get(`/bookings/user-history?email=${user.email}&month=${month}`);
        const mealTotal = mealRes.data?.totalPrice || 0;
        setMealCost(mealTotal);
        setTotal(roomRent + mealTotal);

        const paidThisMonth = (payRes.data || []).some(
          (p) => p.month === month && p.status === "Paid"
        );
        setAlreadyPaid(paidThisMonth);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchData();
  }, [user?.email, month, roomRent, axiosSecure]);

  // Payment success alert
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    if (query.get("payment") === "success") {
      Swal.fire("Success!", "Payment completed successfully.", "success");
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, []);

  const handlePayment = async () => {
    if (alreadyPaid) {
      Swal.fire("Oops!", "You have already paid for this month!", "info");
      return;
    }
    if (!profile?.name || !profile?.studentId) {
      Swal.fire("Error", "User profile incomplete!", "error");
      return;
    }

    try {
      const res = await axiosSecure.post("/payments/init", {
        userName: profile.name,
        studentId: profile.studentId,
        email: user.email,
        month,
        total,
        roomRent,
        mealCost,
      });

      if (res.data?.url) {
        window.location.href = res.data.url;
      } else {
        Swal.fire("Error", "Payment initialization failed!", "error");
      }
    } catch (err) {
      console.error("Payment error:", err.response?.data || err.message);
      Swal.fire("Error", "Payment failed! Check console for details.", "error");
    }
  };

  if (loading) return <MenuLoading />;

  // Year dropdown (last 5 years)
  const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - i);

  // Month dropdown (all 12 months)
  const monthOptions = Array.from({ length: 12 }, (_, i) => {
    const m = (i + 1).toString().padStart(2, "0");
    return `${year}-${m}`;
  });

  // Filter payments by selected year + month
  const filteredPayments = payments.filter((p) => {
    const pYear = new Date(p.month + "-01").getFullYear();
    return pYear === Number(year) && (!month || p.month === month);
  });

  const InfoBox = ({ icon, label, value, color }) => {
    const colors = {
      blue: "border-blue-500 text-blue-500",
      green: "border-green-500 text-green-500",
      indigo: "border-indigo-500 text-indigo-500",
      yellow: "border-yellow-500",
    };
    return (
      <div className={`bg-white shadow-md rounded-xl p-5 flex items-center gap-4 border-l-4 ${colors[color]} hover:scale-105 transform transition`}>
        <div className={`text-3xl ${colors[color]}`}>{icon}</div>
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-xl font-bold">{value}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 py-10 px-4">
      {/* Header with Year + Month */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Hostel Payment</h1>
        <div className="flex items-center gap-3 bg-white rounded-lg shadow px-3 py-2">
          <FaCalendarAlt className="text-gray-600 text-lg" />
          
          {/* Year Dropdown */}
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="border-none focus:ring-0 text-gray-700 bg-transparent"
          >
            {yearOptions.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>

          {/* Month Dropdown */}
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

      {/* Info Boxes */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <InfoBox icon={<FaMoneyCheckAlt />} label="Room Rent" value={`${roomRent} TK`} color="blue" />
        <InfoBox icon={<FaUtensils />} label="Meal Cost" value={`${mealCost} TK`} color="green" />
        <InfoBox icon={<FaCoins />} label="Total" value={`${total} TK`} color="indigo" />
        <div className="bg-white shadow-md rounded-xl p-5 flex items-center justify-center border-l-4 border-yellow-500 hover:scale-105 transform transition">
          <button
            onClick={handlePayment}
            disabled={alreadyPaid}
            className={`px-5 py-3 rounded-lg text-white font-semibold w-full ${alreadyPaid ? "bg-gray-400 cursor-not-allowed" : "bg-yellow-500 hover:bg-yellow-600"}`}
          >
            {alreadyPaid ? "Already Paid" : "Pay Now"}
          </button>
        </div>
      </div>

      {/* Payment History */}
      <div className="max-w-7xl mx-auto bg-white shadow-md rounded-xl p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Payment History</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-blue-100 text-gray-700 uppercase text-sm tracking-wider">
              <tr>
                <th className="py-3 px-4 rounded-tl-lg">Month</th>
                <th className="py-3 px-4">Room Rent</th>
                <th className="py-3 px-4">Meal Cost</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 rounded-tr-lg">Paid At</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPayments.length > 0 ? (
                filteredPayments.map((p, idx) => (
                  <tr key={idx} className="hover:bg-gray-100 transition duration-200">
                    <td className="py-3 px-4 font-medium text-gray-800">
                      {new Date(p.month + "-01").toLocaleString("default", { month: "long", year: "numeric" })}
                    </td>
                    <td className="py-3 px-4">{p.roomRent} TK</td>
                    <td className="py-3 px-4">{p.mealCost} TK</td>
                    <td className="py-3 px-4 font-semibold">{p.amount || total} TK</td>
                    <td className="py-3 px-4">{p.method || "-"}</td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-white font-semibold text-xs ${p.status === "Paid" ? "bg-green-600" : p.status === "Failed" ? "bg-red-600" : "bg-yellow-500"}`}>
                        {p.status || "Pending"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-500">{p.paidAt ? new Date(p.paidAt).toLocaleString() : "-"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-6 text-center text-gray-400">No payments found for this month.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
