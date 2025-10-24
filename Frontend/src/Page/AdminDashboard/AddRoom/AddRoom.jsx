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

    // Handle input change
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle capacity input changes
    const handleCapacityChange = (index, value) => {
        const updated = [...formData.capacity];
        updated[index] = value;
        setFormData({ ...formData, capacity: updated });
    };

    // Add more
    const handleAddCapacityField = () => {
        setFormData({ ...formData, capacity: [...formData.capacity, ""] });
    };

    // Submit form
    const handleSubmit = async (e) => {
        e.preventDefault();

        const hostelName = formData.hostel === "Other" ? formData.newHostel : formData.hostel;

        if (!hostelName.trim()) {
            Swal.fire({
                icon: "error",
                title: "Oops!",
                text: "Please enter a valid hostel name",
            });
            return;
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
                timer: 1500
            });

            setFormData({ roomNumber: "", hostel: "", newHostel: "", capacity: [""] });
        } catch (err) {
            console.error(err);
            Swal.fire({
                position: "top-end",
                icon: "error",
                title: "Failed to add room!",
                showConfirmButton: false,
                timer: 1500
            });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-gray-50 to-gray-100 p-6">

            <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-lg rounded-2xl ">
                <h2 className="text-2xl font-semibold text-center mb-4">Add New Room</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Room Number */}
                    <input
                        type="text"
                        name="roomNumber"
                        placeholder="Room Number (e.g., Room-105)"
                        value={formData.roomNumber}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                        required
                    />

                    {/* Hostel Selection */}
                    <select
                        name="hostel"
                        value={formData.hostel}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                        required
                    >
                        <option value="">Select Hostel</option>
                        <option value="Hostel-A">Hostel-A</option>
                        <option value="Hostel-B">Hostel-B</option>
                        <option value="Hostel-C">Hostel-C</option>
                        <option value="Other">Other</option>
                    </select>

                    {/* New Hostel Input (shown only if Other is selected) */}
                    {formData.hostel === "Other" && (
                        <input
                            type="text"
                            name="newHostel"
                            placeholder="Enter new hostel name"
                            value={formData.newHostel}
                            onChange={handleChange}
                            className="w-full border p-2 rounded mt-2"
                            required
                        />
                    )}

                    {/* Capacity Beds */}
                    <div>
                        <label className="font-medium">Capacity Beds:</label>
                        {formData.capacity.map((bed, index) => (
                            <div key={index} className="flex gap-2 mt-2">
                                <input
                                    type="text"
                                    placeholder={`e.g., Bed-${index + 1}`}
                                    value={bed}
                                    onChange={(e) => handleCapacityChange(index, e.target.value)}
                                    className="flex-1 border p-2 rounded"
                                />
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={handleAddCapacityField}
                            className="mt-3 bg-blue-500 text-white px-3 py-1 rounded"
                        >
                            + Add More Bed
                        </button>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700"
                    >
                        Add Room
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AddRoom;
