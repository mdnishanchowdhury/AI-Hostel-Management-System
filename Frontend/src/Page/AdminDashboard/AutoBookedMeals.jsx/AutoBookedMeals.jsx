import { useState } from "react";
import useAxiosSecure from "../../../Hook/useAxiosSecure";
import Swal from "sweetalert2";

export default function AutoBookedMeals() {
  const [loading, setLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("");
  const axiosSecure = useAxiosSecure();

  const handleSeedMeals = async () => {
    if (!selectedMonth) {
      return Swal.fire({
        icon: "warning",
        title: "Oops...",
        text: "Please select a month first!",
      });
    }

    const confirmResult = await Swal.fire({
      title: "Are you sure?",
      text: `This will seed meals for all users (except admins) for ${selectedMonth}.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, seed it!",
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
    <div className="p-6 space-y-6 bg-gray-50 rounded shadow-md">
      <h1 className="text-2xl font-bold">Admin: Seed Meals for All Users</h1>

      <div className="flex items-center gap-4">
        <label htmlFor="month" className="font-semibold">
          Select Month:
        </label>
        <input
          type="month"
          id="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="px-2 py-1 border rounded"
        />
      </div>

      <button
        onClick={handleSeedMeals}
        disabled={loading || !selectedMonth}
        className={`px-4 py-2 rounded text-white ${
          loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Seeding..." : "Seed Meals for Selected Month"}
      </button>
    </div>
  );
}
