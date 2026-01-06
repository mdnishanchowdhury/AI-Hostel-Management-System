import { useState, useEffect } from "react";
import useAxiosSecure from "../../../Hook/useAxiosSecure";
import Swal from "sweetalert2";
import { FaCheckCircle } from "react-icons/fa";

function AutoBookedMeals() {
  const axiosSecure = useAxiosSecure();

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = (today.getMonth() + 1).toString().padStart(2, "0");

  const [year, setYear] = useState(currentYear);
  const [month, setMonth] = useState(currentMonth);
  const [alreadySeeded, setAlreadySeeded] = useState(false);
  const [loading, setLoading] = useState(false);

  const checkMonthSeeded = async (year, month) => {
    try {
      const res = await axiosSecure.get(
        `/bookings/check-month?month=${month}&year=${year}`
      );
      setAlreadySeeded(res.data.seeded);
    } catch (err) {
      console.error(err);
      setAlreadySeeded(false);
    }
  };

  useEffect(() => {
    checkMonthSeeded(year, month);
  }, [year, month]);

  const handleSeedMeals = async () => {
    if (alreadySeeded) {
      return Swal.fire({
        icon: "info",
        title: "Meals already seeded for this month",
      });
    }

    const confirmResult = await Swal.fire({
      title: "Confirm Action",
      text: `This will seed meals for all users (except admins) for ${year}-${month}.`,
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
        year: parseInt(year),
        month: parseInt(month),
      });

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: res.data.message,
      });

      setAlreadySeeded(true);
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

  const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - i);

  const monthOptions = Array.from({ length: 12 }, (_, i) => {
    const m = (i + 1).toString().padStart(2, "0");
    return { value: m, label: new Date(`${currentYear}-${m}-01`).toLocaleString("default", { month: "long" }) };
  });

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

        <div className="flex gap-4 mb-6 flex-wrap">
          {/* Year */}
          <div className="flex-1">
            <label className="block text-gray-700 font-medium mb-2">Select Year</label>
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            >
              {yearOptions.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          {/* Month */}
          <div className="flex-1">
            <label className="block text-gray-700 font-medium mb-2">Select Month</label>
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            >
              {monthOptions.map((m) => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleSeedMeals}
          disabled={loading || alreadySeeded}
          className={`w-full py-3 rounded-xl font-semibold text-white text-lg flex items-center justify-center gap-2 ${loading
              ? "bg-gray-400 cursor-not-allowed"
              : alreadySeeded
                ? "bg-green-500 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 hover:scale-[1.02] shadow-md hover:shadow-lg"
            }`}
        >
          {loading
            ? "Seeding..."
            : alreadySeeded
              ? <><FaCheckCircle /> Meals Already Seeded for {year}-{month}</>
              : `Seed Meals for ${year}-${month}`}
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
