import { useState } from "react";
import useAxiosSecure from "../../../Hook/useAxiosSecure";
import Swal from "sweetalert2";

function AddRoom() {
    const axiosSecure = useAxiosSecure();

    const [formData, setFormData] = useState({
        roomNumber: "",
        hostel: "",
        newHostel: "",
        capacity: [""],
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCapacityChange = (index, value) => {
        const updated = [...formData.capacity];
        updated[index] = value;
        setFormData({ ...formData, capacity: updated });
    };

    const handleAddCapacityField = () => {
        setFormData({ ...formData, capacity: [...formData.capacity, ""] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const hostelName = formData.hostel === "Other" ? formData.newHostel : formData.hostel;

        if (!hostelName.trim()) {
            return Swal.fire({
                icon: "error",
                title: "Oops!",
                text: "Please enter a valid hostel name",
            });
        }

        try {
            const res = await axiosSecure.post("/rooms", {
                roomNumber: formData.roomNumber,
                hostel: hostelName,
                capacity: formData.capacity,
            });
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Room added successfully!",
                showConfirmButton: false,
                timer: 1500,
            });
            setFormData({ roomNumber: "", hostel: "", newHostel: "", capacity: [""] });
        } catch (err) {
            console.error(err);
            Swal.fire({
                position: "top-end",
                icon: "error",
                title: "Failed to add room!",
                showConfirmButton: false,
                timer: 1500,
            });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-gray-50 to-indigo-50 p-6 flex items-center justify-center">
            <div className="w-full max-w-lg bg-white/80 backdrop-blur-md shadow-xl rounded-3xl p-8 transition hover:shadow-2xl">
                
                <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
                    Add New Room
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Room Number */}
                    <div className="flex flex-col">
                        <label className="text-gray-700 font-medium mb-1">Room Number</label>
                        <input
                            type="text"
                            name="roomNumber"
                            placeholder="Room-105"
                            value={formData.roomNumber}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm transition"
                            required
                        />
                    </div>

                    {/* Hostel Selection */}
                    <div className="flex flex-col">
                        <label className="text-gray-700 font-medium mb-1">Select Hostel</label>
                        <select
                            name="hostel"
                            value={formData.hostel}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm transition"
                            required
                        >
                            <option value="">Select Hostel</option>
                            <option value="Hostel-A">Hostel-A</option>
                            <option value="Hostel-B">Hostel-B</option>
                            <option value="Hostel-C">Hostel-C</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    {/* New Hostel Input */}
                    {formData.hostel === "Other" && (
                        <div className="flex flex-col">
                            <label className="text-gray-700 font-medium mb-1">New Hostel Name</label>
                            <input
                                type="text"
                                name="newHostel"
                                placeholder="Enter new hostel name"
                                value={formData.newHostel}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm transition"
                                required
                            />
                        </div>
                    )}

                    {/* Capacity */}
                    <div className="flex flex-col">
                        <label className="text-gray-700 font-medium mb-1">Capacity Beds</label>
                        {formData.capacity.map((bed, index) => (
                            <input
                                key={index}
                                type="text"
                                placeholder={`Bed-${index + 1}`}
                                value={bed}
                                onChange={(e) => handleCapacityChange(index, e.target.value)}
                                className="w-full px-4 py-2 mb-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm transition"
                            />
                        ))}
                        <button
                            type="button"
                            onClick={handleAddCapacityField}
                            className="w-max bg-blue-500 text-white px-4 py-1 rounded-xl shadow hover:bg-blue-600 transition"
                        >
                            + Add More Bed
                        </button>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-2xl shadow-md hover:bg-indigo-700 hover:scale-[1.02] transition flex items-center justify-center gap-2"
                    >
                        Add Room
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AddRoom;
