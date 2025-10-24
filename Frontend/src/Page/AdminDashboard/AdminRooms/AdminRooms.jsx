import { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import useAxiosSecure from "../../../Hook/useAxiosSecure";
import Swal from "sweetalert2";

function AdminRooms() {
    const axiosSecure = useAxiosSecure();
    const [rooms, setRooms] = useState([]);

    // Fetch all rooms
    const fetchRooms = async () => {
        try {
            const res = await axiosSecure.get("/rooms");
            setRooms(res.data);
        } catch (err) {
            console.error(err);
            Swal.fire({
                icon: "error",
                title: "Failed!",
                text: "Failed to load rooms!",
            });
        }
    };

    useEffect(() => {
        fetchRooms();
    }, []);

    // Delete a room
    const handleDelete = (roomId) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            cancelButtonColor: "#3b82f6",
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axiosSecure.delete(`/rooms/${roomId}`);
                    setRooms(rooms.filter((room) => room._id !== roomId));
                    Swal.fire("Deleted!", "Room has been deleted.", "success");
                } catch (err) {
                    console.error(err);
                    Swal.fire("Failed!", "Failed to delete room.", "error");
                }
            }
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-gray-50 to-gray-100 p-6">


            <div className="max-w-6xl mx-auto bg-white/70 backdrop-blur-md p-6 rounded-3xl shadow-xl space-y-6">

                <h2 className="text-2xl md:text-4xl font-bold mb-10 text-center text-gray-800">
                    Hostel Room Management
                </h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border rounded-2xl shadow-lg overflow-hidden">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="text-left py-3 px-6 font-medium text-gray-700">Room Number</th>
                                <th className="text-left py-3 px-6 font-medium text-gray-700">Hostel</th>
                                <th className="text-left py-3 px-6 font-medium text-gray-700">Capacity</th>
                                <th className="text-center py-3 px-6 font-medium text-gray-700">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rooms.map((room) => (
                                <tr key={room._id} className="border-b hover:bg-gray-50 transition duration-200">
                                    <td className="py-3 px-6 text-gray-800">{room.roomNumber}</td>
                                    <td className="py-3 px-6 text-gray-800">{room.hostel}</td>
                                    <td className="py-3 px-6 text-gray-800">{room.capacity.join(", ")}</td>
                                    <td className="py-3 px-6 text-center">
                                        <button
                                            onClick={() => handleDelete(room._id)}
                                            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-400 transition-transform transform hover:scale-110"
                                            title="Delete Room"
                                        >
                                            <MdDelete className="text-red-600 w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {rooms.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="text-center py-8 text-gray-400 text-lg">
                                        No rooms available.
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

export default AdminRooms;
