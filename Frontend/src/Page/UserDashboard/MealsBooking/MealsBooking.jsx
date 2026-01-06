import { useState, useEffect } from "react";
import useAuth from "../../../Hook/useAuth";
import useAxiosSecure from "../../../Hook/useAxiosSecure";
import Swal from "sweetalert2";
import MenuLoading from "../../../Components/Loading/MenuLoading";
import { FaUtensils, FaMoneyCheckAlt } from "react-icons/fa";
import SummaryCard from "../../../Components/SummaryCard/SummaryCard";

const mealTypes = [
  { type: "Breakfast", price: 50, color: "blue" },
  { type: "Lunch", price: 100, color: "green" },
  { type: "Dinner", price: 120, color: "orange" },
];

function MealsBooking({ token }) {
  const today = new Date();
  const [bookings, setBookings] = useState([]);
  const [bookedData, setBookedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  // Helper: safely parse date
  const parseDate = (dateStr) => {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    if (isNaN(d)) {
      // try DD/MM/YYYY format
      const parts = dateStr.split("/");
      if (parts.length === 3) {
        return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
      }
      return null;
    }
    return d;
  };

  // Fetch booking
  const fetchBookings = async () => {
    if (!user?.email) return;
    setLoading(true);
    try {
      const res = await axiosSecure.get(`bookings?email=${user.email}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Fetched bookings:", res.data);
      setBookings(res.data);
    } catch (err) {
      console.error(err);
      Swal.fire("Oops...", "Failed to fetch bookings!", "error");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBookings();
  }, [user]);

  const toggleMeal = (dayIdx, mealIdx) => {
    const nextDay = new Date(today);
    nextDay.setDate(today.getDate() + 1);
    const day = bookings[dayIdx];
    const dayDate = parseDate(day.date);

    if (!dayDate) return;

    if (dayDate.toDateString() === nextDay.toDateString()) {
      const newBookings = bookings.map((d, idx) =>
        idx === dayIdx
          ? {
              ...d,
              meals: d.meals.map((m, mIdx) =>
                mIdx === mealIdx ? { ...m, booked: !m.booked } : m
              ),
            }
          : d
      );
      setBookings(newBookings);
    } else
      Swal.fire({
        position: "top-end",
        icon: "info",
        title: "You can only modify meals for the next day.",
        showConfirmButton: false,
        timer: 1500,
      });
  };

  const confirmBookings = async (dayIdx) => {
    try {
      const day = bookings[dayIdx];
      const res = await axiosSecure.patch(
        `/bookings/${day._id}`,
        { meals: day.meals },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data && res.data.date) {
        const bookedDate = parseDate(res.data.date);
        setBookedData({
          date: bookedDate ? bookedDate.toDateString() : "Unknown date",
          bookedMeals: res.data.meals
            .filter((m) => m.booked)
            .map((m) => m.type),
          cancelledMeals: res.data.meals
            .filter((m) => !m.booked)
            .map((m) => m.type),
        });
      }

      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Your meals have been updated",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to update meals!",
      });
    }
  };

  // Summary
  const totalMeals = bookings.reduce(
    (sum, d) => sum + d.meals.filter((m) => m.booked).length,
    0
  );
  const summary = {
    Breakfast: bookings.reduce(
      (sum, d) =>
        sum + d.meals.filter((m) => m.type === "Breakfast" && m.booked).length,
      0
    ),
    Lunch: bookings.reduce(
      (sum, d) =>
        sum + d.meals.filter((m) => m.type === "Lunch" && m.booked).length,
      0
    ),
    Dinner: bookings.reduce(
      (sum, d) =>
        sum + d.meals.filter((m) => m.type === "Dinner" && m.booked).length,
      0
    ),
    TotalMeals: totalMeals,
  };

  const colors = {
    blue: "border-blue-500 text-blue-500",
    green: "border-green-500 text-green-500",
    orange: "border-orange-500 text-orange-500",
    indigo: "border-indigo-500 text-indigo-500",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-gray-50 to-gray-100 py-10 px-4">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Title */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Daily Booked Meals</h1>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {mealTypes.map((meal, i) => (
            <SummaryCard
              key={i}
              icon={<FaUtensils />}
              label={meal.type}
              value={summary[meal.type]}
              color={meal.color}
            />
          ))}
          <SummaryCard
            icon={<FaMoneyCheckAlt />}
            label="Total Meals"
            value={summary.TotalMeals}
            color="indigo"
          />
        </div>

        {/* Bookings Table */}
        <div className="overflow-x-auto rounded-3xl shadow-lg bg-white/90 backdrop-blur-md max-h-[500px] overflow-y-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gradient-to-r from-blue-200 to-blue-100 text-gray-700 uppercase text-sm tracking-wider">
              <tr>
                <th className="py-3 px-6 rounded-tl-3xl">Date</th>
                {mealTypes.map((meal, i) => (
                  <th key={i} className="py-3 px-6">{meal.type} ({meal.price}৳)</th>
                ))}
                <th className="py-3 px-6 rounded-tr-3xl">Confirm</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={mealTypes.length + 2} className="py-6 text-center">
                    <MenuLoading />
                  </td>
                </tr>
              ) : bookings.length > 0 ? (
                bookings.map((day, dayIdx) => {
                  const dayDate = parseDate(day.date);
                  const nextDay = new Date(today);
                  nextDay.setDate(today.getDate() + 1);
                  const isUnlocked = dayDate && dayDate.toDateString() === nextDay.toDateString();

                  return (
                    <tr key={dayIdx} className="hover:bg-blue-50 transition duration-200">
                      <td className="py-3 px-6 font-medium">
                        {dayDate ? dayDate.toDateString() : "No date"}
                      </td>
                      {day.meals.map((meal, mealIdx) => (
                        <td key={mealIdx} className="py-3 px-6">
                          <input
                            type="checkbox"
                            checked={meal.booked}
                            disabled={!isUnlocked}
                            onChange={() => toggleMeal(dayIdx, mealIdx)}
                          />
                        </td>
                      ))}
                      <td className="py-3 px-6">
                        <button
                          disabled={!isUnlocked}
                          className={`px-4 py-1 rounded-md text-white ${
                            isUnlocked
                              ? "bg-blue-600 hover:bg-blue-700"
                              : "bg-gray-300 cursor-not-allowed"
                          }`}
                          onClick={() => confirmBookings(dayIdx)}
                        >
                          Confirm
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={mealTypes.length + 2} className="py-6 text-center text-gray-400 italic">
                    No bookings available.
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

export default MealsBooking;
