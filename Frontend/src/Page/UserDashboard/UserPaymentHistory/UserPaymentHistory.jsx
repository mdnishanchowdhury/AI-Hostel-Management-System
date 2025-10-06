import { useEffect, useState, useMemo } from "react";
import useAxiosSecure from "../../../Hook/useAxiosSecure";
import useAuth from "../../../Hook/useAuth";

export default function UserPaymentHistory() {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [month, setMonth] = useState("");
    const [error, setError] = useState("");

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

    const filteredPayments = useMemo(() => {
        if (!month) return payments;
        return payments.filter((p) => p.month === month);
    }, [month, payments]);

    if (loading) return <p className="text-center mt-6 text-gray-500">Loading...</p>;
    if (error && payments.length === 0) return <p className="text-center mt-6 text-gray-500">{error}</p>;

    return (
        <div className="bg-gradient-to-br from-blue-50 via-gray-50 to-gray-100 min-h-screen">
            <div className="max-w-6xl mx-auto space-y-6">

                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 bg-white/80 shadow-md rounded-2xl p-6 gap-4">
                    <h1 className="text-3xl font-bold text-gray-800">Payment History</h1>
                    <div className="flex flex-wrap items-center gap-3 mt-4 md:mt-0 bg-gray-100 px-3 p-2 rounded-lg">
                    <label htmlFor="date" className="font-semibold text-gray-700">
                        Select Month:
                    </label>
                    <input
                        type="month"
                        value={month}
                        onChange={(e) => setMonth(e.target.value)}
                        className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto rounded-2xl shadow-lg bg-white/90 backdrop-blur-md">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-blue-100 text-gray-700 uppercase text-sm tracking-wider">
                            <tr>
                                <th className="py-3 px-6 rounded-tl-2xl">Month</th>
                                <th className="py-3 px-6">Room Rent</th>
                                <th className="py-3 px-6">Meal Cost</th>
                                <th className="py-3 px-6">Total</th>
                                <th className="py-3 px-6">Payment Method</th>
                                <th className="py-3 px-6">Status</th>
                                <th className="py-3 px-6 rounded-tr-2xl">Paid At</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredPayments.length > 0 ? (
                                filteredPayments.map((p, idx) => (
                                    <tr key={idx} className="hover:bg-gray-100 transition duration-200">
                                        <td className="py-3 px-6 font-medium text-gray-800">{p.month}</td>
                                        <td className="py-3 px-6">{p.roomRent} TK</td>
                                        <td className="py-3 px-6">{p.mealCost} TK</td>
                                        <td className="py-3 px-6 font-semibold">{p.total} TK</td>
                                        <td className="py-3 px-6">{p.paymentMethod}</td>
                                        <td className="py-3 px-6">
                                            <span
                                                className={`px-3 py-1 rounded-full text-white font-semibold text-xs ${p.status === "Paid" ? "bg-green-600" : "bg-red-600"
                                                    }`}
                                            >
                                                {p.status}
                                            </span>
                                        </td>
                                        <td className="py-3 px-6 text-gray-500">{new Date(p.createdAt).toLocaleString()}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="py-6 text-center text-gray-400">
                                        No payments found for this month.
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
