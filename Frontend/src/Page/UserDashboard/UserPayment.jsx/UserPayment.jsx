import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../Hook/useAuth";
import useAxiosSecure from "../../../Hook/useAxiosSecure";

export default function UserPayment() {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const [mealCost, setMealCost] = useState(0);
    const [roomRent] = useState(4500);
    const [total, setTotal] = useState(4500);
    const [month, setMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
    const [paymentMethod, setPaymentMethod] = useState("Cash");
    const [alreadyPaid, setAlreadyPaid] = useState(false);

    // ✅ Fetch user profile info
    const { data: profile, isLoading: profileLoading, error: profileError } = useQuery({
        queryKey: ["profile", user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/users/room?email=${user?.email}`);
            return res.data;
        },
        enabled: !!user?.email,
    });

    // ✅ Fetch meal cost and check previous payment
    useEffect(() => {
        if (!user?.email || !month) return;

        const fetchData = async () => {
            try {
                // ১. Meal cost
                const mealRes = await axiosSecure.get(
                    `/bookings/user-history?email=${user.email}&month=${month}`
                );
                const mealData = mealRes.data || {};
                const mealTotal = mealData.totalPrice || 0;
                setMealCost(mealTotal);
                setTotal(roomRent + mealTotal);

                // ২. Check if already paid
                const payRes = await axiosSecure.get(`/payments/user?email=${user.email}`);
                const userPayments = payRes.data || [];
                const paidThisMonth = userPayments.some(p => p.month === month);
                setAlreadyPaid(paidThisMonth);
            } catch (err) {
                console.error(err);
                Swal.fire("Oops...", "Failed to fetch data.", "error");
            }
        };

        fetchData();
    }, [user?.email, month, roomRent, axiosSecure]);

    const handlePayment = async () => {
        if (!month) {
            Swal.fire("Warning", "Please select the month.", "warning");
            return;
        }

        if (alreadyPaid) {
            Swal.fire("Info", "You have already paid for this month!", "info");
            return;
        }

        if (!profile?.name || !profile?.studentId) {
            Swal.fire("Error", "User profile incomplete. Cannot proceed.", "error");
            return;
        }

        try {
            const res = await axiosSecure.post("/payments", {
                userName: profile.name,
                studentId: profile.studentId,
                email: user.email,
                month,
                roomRent,
                mealCost,
                total,
                paymentMethod,
                status: "Paid",
            });

            Swal.fire(
                "Success!",
                `Payment successful! Total: ${res.data.payment.total} TK`,
                "success"
            );
            setAlreadyPaid(true);
        } catch (err) {
            console.error(err);
            Swal.fire("Error", "Payment failed!", "error");
        }
    };

    if (profileLoading) return <p>Loading profile...</p>;
    if (profileError) return <p>Failed to load profile.</p>;

    return (
        <div className="payment-box p-6 bg-white rounded shadow-md max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4">Hostel Payment</h2>

            <label className="block mb-2 font-semibold">
                Month:
                <input
                    type="month"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    className="w-full p-2 border rounded mt-1"
                />
            </label>

            <p>Room Rent: {roomRent} TK</p>
            <p>Meal Cost: {mealCost} TK</p>
            <h3 className="font-bold">Total: {total} TK</h3>

            <label className="block mt-4 font-semibold">
                Payment Method:
                <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full p-2 border rounded mt-1"
                >
                    <option value="Cash">Cash</option>
                    <option value="Bkash">Bkash</option>
                    <option value="Nagad">Nagad</option>
                </select>
            </label>

            <button
                onClick={handlePayment}
                className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                disabled={alreadyPaid}
            >
                {alreadyPaid ? "Already Paid" : "Pay Now"}
            </button>
        </div>
    );
}
