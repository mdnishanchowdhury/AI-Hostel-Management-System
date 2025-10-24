import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../Hook/useAuth";
import useAxiosSecure from "../../../Hook/useAxiosSecure";
import MenuLoading from "../../../Components/Loading/MenuLoading";

export default function UserPayment() {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [mealCost, setMealCost] = useState(0);
  const [roomRent] = useState(4500);
  const [total, setTotal] = useState(4500);
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [alreadyPaid, setAlreadyPaid] = useState(false);

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ["profile", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/room?email=${user?.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  useEffect(() => {
    if (!user?.email || !month) return;

    const fetchData = async () => {
      try {
        const mealRes = await axiosSecure.get(
          `/bookings/user-history?email=${user.email}&month=${month}`
        );
        const mealTotal = mealRes.data?.totalPrice || 0;
        setMealCost(mealTotal);
        setTotal(roomRent + mealTotal);

        const payRes = await axiosSecure.get(`/payments/user?email=${user.email}`);
        const paidThisMonth = payRes.data.some(
          (p) => p.month === month && p.status === "Paid"
        );
        setAlreadyPaid(paidThisMonth);
      } catch (err) {
        console.error(err);
        Swal.fire("Oops...", "Failed to fetch data.", "error");
      }
    };

    fetchData();
  }, [user?.email, month, roomRent, axiosSecure]);

  const handlePayment = async () => {
    if (!month) return Swal.fire("Warning", "Please select the month.", "warning");
    if (alreadyPaid) return Swal.fire("Info", "You have already paid for this month!", "info");
    if (!profile?.name || !profile?.studentId)
      return Swal.fire("Error", "User profile incomplete.", "error");

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

      if (res.data.url) {
        window.location.href = res.data.url; // Redirect to SSLCommerz
      } else {
        Swal.fire("Error", "Payment initialization failed!", "error");
      }
    } catch (err) {
      console.error("Payment Error:", err);
      Swal.fire("Error", "Payment failed!", "error");
    }
  };

  if (isLoading) return <MenuLoading></MenuLoading>;
  if (error) return <p>Failed to load profile.</p>;

  return (
    <div className="bg-gradient-to-br from-blue-50 via-gray-50 to-gray-100 min-h-screen">
      <div className="flex justify-center">
        <div className="w-full max-w-md space-y-6 bg-white/90 backdrop-blur-md shadow-lg rounded-2xl p-4">
          <h2 className="text-3xl font-bold text-gray-800">Hostel Payment</h2>

          <div className="flex items-center gap-3">
            <label className="font-semibold text-gray-700">Month:</label>
            <input
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-blue-500 text-white p-4 rounded-xl shadow-md">
              <p className="text-sm opacity-90 font-medium">Room Rent</p>
              <p className="text-xl font-bold mt-1">{roomRent} TK</p>
            </div>
            <div className="bg-green-500 text-white p-4 rounded-xl shadow-md">
              <p className="text-sm opacity-90 font-medium">Meal Cost</p>
              <p className="text-xl font-bold mt-1">{mealCost} TK</p>
            </div>
            <div className="bg-indigo-500 text-white p-4 rounded-xl shadow-md">
              <p className="text-sm opacity-90 font-medium">Total</p>
              <p className="text-xl font-bold mt-1">{total} TK</p>
            </div>
          </div>

          <button
            onClick={handlePayment}
            disabled={alreadyPaid}
            className={`w-full py-2 rounded-lg text-white font-semibold shadow-md ${
              alreadyPaid ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {alreadyPaid ? "Already Paid" : "Pay Now"}
          </button>
        </div>
      </div>
    </div>
  );
}
