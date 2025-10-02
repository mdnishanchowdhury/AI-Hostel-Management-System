import { useState, useEffect } from "react";
import useAuth from "../../../Hook/useAuth";
import useAxiosSecure from "../../../Hook/useAxiosSecure";
import Swal from "sweetalert2";

const mealTypes = [
    { type: "Breakfast", price: 50 },
    { type: "Lunch", price: 100 },
    { type: "Dinner", price: 120 },
];

export default function MealsBooking({ email, token }) {
    const today = new Date();
    const [bookings, setBookings] = useState([]);
    const [bookedData, setBookedData] = useState(null);
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();

    // Fetch booking
    const fetchBookings = async () => {
        try {
            const res = await axiosSecure.get(`bookings?email=${user.email}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBookings(res.data);
        } catch (err) {
            console.error(err);
        }
    };


    useEffect(() => { fetchBookings(); }, []);

    // Toggle meals only for next day
    const toggleMeal = (dayIdx, mealIdx) => {
        const nextDay = new Date(today);
        nextDay.setDate(today.getDate() + 1);
        const day = bookings[dayIdx];
        const dayDate = new Date(day.date);

        if (dayDate.toDateString() === nextDay.toDateString()) {
            const newBookings = bookings.map((d, idx) =>
                idx === dayIdx
                    ? { ...d, meals: d.meals.map((m, mIdx) => mIdx === mealIdx ? { ...m, booked: !m.booked } : m) }
                    : d
            );
            setBookings(newBookings);
        } else Swal.fire({
            position: "top-end",
            icon: "success",
            title: "You can only modify meals for the next day.",
            showConfirmButton: false,
            timer: 1500
        });
    };

    // Confirm bookings (update backend)
    const confirmBookings = async (dayIdx) => {
        try {
            const day = bookings[dayIdx];
            const res = await axiosSecure.patch(`/bookings/${day._id}`, { meals: day.meals }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // check backend response
            console.log("Update Response:", res.data);

            if (res.data && res.data.date) {
                setBookedData({
                    date: new Date(res.data.date).toDateString(),
                    bookedMeals: res.data.meals.filter(m => m.booked).map(m => m.type),
                    cancelledMeals: res.data.meals.filter(m => !m.booked).map(m => m.type)
                });
            }

            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Your meals have been updated",
                showConfirmButton: false,
                timer: 1500
            });
        } catch (err) {
            console.error("Meal update error:", err.response?.data || err.message);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Failed to update meals!"
            });
        }
    };


    return (
        <div className="p-6 space-y-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl shadow-md">
            <h1 className="text-2xl font-bold text-gray-800">Daily Auto Booked Meals</h1>

            {/* Top section */}
            <div className="mb-4 p-4 bg-green-100 rounded-md">
                {
                    bookedData ? (
                        <>
                            <strong>Booked Meals for {bookedData.date}:</strong>
                            <ul>{bookedData.bookedMeals.map((m, i) => <li key={i}>{m}</li>)}</ul>
                            {bookedData.cancelledMeals.length > 0 && <>
                                <strong>Cancelled Meals:</strong>
                                <ul>{bookedData.cancelledMeals.map((m, i) => <li key={i}>{m}</li>)}</ul>
                            </>}
                        </>
                    ) : <p>All meals auto-booked. Untick next day meals if skipping.</p>
                }
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-xl border border-gray-200 max-h-[400px] overflow-y-auto">
                <table className="table w-full text-center">
                    <thead className="bg-blue-100 text-gray-700">
                        <tr>
                            <th>Date</th>
                            {mealTypes.map((meal, i) => <th key={i}>{meal.type} ({meal.price}৳)</th>)}
                            <th>Confirm</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                        {
                            bookings.map((day, dayIdx) => {
                                const nextDay = new Date(today); nextDay.setDate(today.getDate() + 1);
                                const isUnlocked = new Date(day.date).toDateString() === nextDay.toDateString();
                                return (
                                    <tr key={dayIdx}>
                                        <td className="font-semibold py-3 text-left px-4">{new Date(day.date).toDateString()}</td>
                                        {day.meals.map((meal, mealIdx) =>
                                            <td key={mealIdx}>
                                                <input type="checkbox" checked={meal.booked} disabled={!isUnlocked} onChange={() => toggleMeal(dayIdx, mealIdx)} />
                                            </td>
                                        )}
                                        <td>
                                            <button disabled={!isUnlocked} className={`px-4 py-1 rounded-md text-white ${isUnlocked ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-300 cursor-not-allowed"}`} onClick={() => confirmBookings(dayIdx)}>Confirm</button>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
}
