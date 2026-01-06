import { useState, useEffect } from "react";
import useAxiosSecure from "../../../Hook/useAxiosSecure";
import Swal from "sweetalert2";
import { FaCheckCircle } from "react-icons/fa";

function AutoBookedMeals() {
  const [loading, setLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7) // YYYY-MM default
  );
  const [alreadySeeded, setAlreadySeeded] = useState(false);
  const axiosSecure = useAxiosSecure();

  // Check if the selected month is already seeded
  const checkMonthSeeded = async (month) => {
    try {
      const [year, monthNumber] = month.split("-");
      const res = await axiosSecure.get(
        `/bookings/check-month?month=${monthNumber}&year=${year}`
      );
      setAlreadySeeded(res.data.seeded); // true/false
    } catch (err) {
      console.error(err);
      setAlreadySeeded(false);
    }
  };

  // Run check whenever the month changes
  useEffect(() => {
    if (selectedMonth) checkMonthSeeded(selectedMonth);
  }, [selectedMonth]);

  const handleSeedMeals = async () => {
    if (!selectedMonth) {
      return Swal.fire({
        icon: "warning",
        title: "Please select a month first!",
      });
    }

    if (alreadySeeded) {
      return Swal.fire({
        icon: "info",
        title: "Meals already seeded for this month",
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
      const [year, month] = selectedMonth.split("-");
      const res = await axiosSecure.post("/bookings/seed", {
        month: parseInt(month), // e.g., 1 for January
        year: parseInt(year),
      });

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: res.data.message,
      });

      setAlreadySeeded(true); // mark as seeded
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-indigo-100 px-2 rounded-md md:px-4">
      <div className="w-full max-w-xl backdrop-blur-lg bg-white/60 rounded-3xl shadow-xl border border-blue-100 p-10 transition hover:shadow-2xl duration-500">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-blue-700 tracking-tight">
            Auto Seed Monthly Meals
          </h1>
          <p className="text-gray-600 mt-2 text-sm">
            Automatically create meal bookings for all non-admin users for the selected month.
          </p>
        </div>

        {/* Month Selector */}
        <div className="mb-6">
          <label htmlFor="month" className="block text-gray-700 font-medium mb-2">
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
          disabled={loading || alreadySeeded}
          className={`w-full py-3 rounded-xl font-semibold text-white text-lg flex items-center justify-center gap-2 ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : alreadySeeded
              ? "bg-green-500 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 hover:scale-[1.02] shadow-md hover:shadow-lg"
          }`}
        >
          {loading
            ? "Seeding..."
            : alreadySeeded
            ? <>
                <FaCheckCircle /> Meals Already Seeded for {selectedMonth}
              </>
            : `Seed Meals for ${selectedMonth}`}
        </button>

        {/* Info */}
        <div className="mt-8 bg-blue-50 p-4 rounded-xl border border-blue-100 text-sm text-blue-800">
          <p className="font-semibold mb-1">Note:</p>
          <ul className="list-disc ml-5 space-y-1">
            <li>Admins are excluded from meal seeding.</li>
            <li>Only the selected month will be seeded, no other months.</li>
            <li>This action cannot be undone once completed.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AutoBookedMeals;
