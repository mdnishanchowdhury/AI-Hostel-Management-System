import { useEffect, useState } from "react";
import useAxiosSecure from "../../../Hook/useAxiosSecure";
import useAuth from "../../../Hook/useAuth";

export default function UserPaymentHistory() {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const [payment, setPayment] = useState(null);
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (!user?.email) return;

        const fetchPayment = async () => {
            try {
                const res = await axiosSecure.get(`/payments/current-month?email=${user.email}`);
                const data = res.data;

                if (data.payment) {
                    setPayment(data.payment);
                } else {
                    setMessage("No payment found for this month.");
                }
            } catch (err) {
                console.error(err);
                setMessage("Failed to fetch payment history.");
            }
        };

        fetchPayment();
    }, [user?.email, axiosSecure]);

    if (message) return <p className="text-center text-gray-500 mt-4">{message}</p>;

    if (!payment) return <p className="text-center mt-4">Loading...</p>;

    return (
        <div className="p-6 bg-white rounded shadow-md max-w-md mx-auto mt-6">
            <h2 className="text-2xl font-bold mb-4">This Month Payment</h2>
            <p><strong>Month:</strong> {payment.month}</p>
            <p><strong>Room Rent:</strong> {payment.roomRent} TK</p>
            <p><strong>Meal Cost:</strong> {payment.mealCost} TK</p>
            <p><strong>Total:</strong> {payment.total} TK</p>
            <p><strong>Payment Method:</strong> {payment.paymentMethod}</p>
            <p><strong>Status:</strong> {payment.status}</p>
            <p><strong>Paid At:</strong> {new Date(payment.createdAt).toLocaleString()}</p>
        </div>
    );
}
