import { useState } from "react";
import useAxiosSecure from "../../../Hook/useAxiosSecure";
import Swal from "sweetalert2";

function AutoBookedMeals() {
  const [loading, setLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );
  const axiosSecure = useAxiosSecure();

  const handleSeedMeals = async () => {
    if (!selectedMonth) {
      return Swal.fire({
        icon: "warning",
        title: "Please select a month first!",
      });
    }

    const confirmResult = await Swal.fire({
      title: "Confirm Action",
      text: `This will seed meals for all users (except admins) for ${selectedMonth}.`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, seed now!",
    });

    if (!confirmResult.isConfirmed) return;

    setLoading(true);
    try {
      const res = await axiosSecure.post("/bookings/seed", {
        month: selectedMonth,
      });

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: res.data.message,
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Failed!",
        text: "Failed to seed meals for all users.",
      });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-indigo-100 px-4">
      <div className="w-full max-w-xl backdrop-blur-lg bg-white/60 rounded-3xl shadow-xl border border-blue-100 p-10 transition hover:shadow-2xl duration-500">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-blue-700 tracking-tight">
            Auto Seed Monthly Meals
          </h1>
          <p className="text-gray-600 mt-2 text-sm">
            Automatically create meal bookings for all non-admin users.
          </p>
        </div>

        {/* Month Selector */}
        <div className="mb-6">
          <label
            htmlFor="month"
            className="block text-gray-700 font-medium mb-2"
          >
            Select Month
          </label>
          <input
            type="month"
            id="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>

        {/* Action Button */}
        <button
          onClick={handleSeedMeals}
          disabled={loading}
          className={`w-full py-3 rounded-xl font-semibold text-white text-lg transition-all duration-300 ${loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 hover:scale-[1.02] shadow-md hover:shadow-lg"
            }`}
        >
          {loading ? "Seeding..." : `Seed Meals for ${selectedMonth}`}
        </button>

        {/* Info Section */}
        <div className="mt-8 bg-blue-50 p-4 rounded-xl border border-blue-100 text-sm text-blue-800">
          <p className="font-semibold mb-1"> Note:</p>
          <ul className="list-disc ml-5 space-y-1">
            <li>Admins are excluded from meal seeding.</li>
            <li>Ensure the selected month is correct before seeding.</li>
            <li>This action cannot be undone once completed.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
export default AutoBookedMeals;