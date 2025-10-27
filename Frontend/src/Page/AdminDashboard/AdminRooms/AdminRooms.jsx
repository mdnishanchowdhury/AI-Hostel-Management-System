import { useEffect, useState, useMemo } from "react";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../Hook/useAxiosSecure";
import StatsCards from "../../../Components/AdminDashboard/AdminRooms/StatsCards";
import RoomOccupantsModal from "../../../Components/AdminDashboard/AdminRooms/RoomOccupantsModal";
import StatsModal from "../../../Components/AdminDashboard/AdminRooms/StatsModal";
import RoomsTable from "../../../Components/AdminDashboard/AdminRooms/RoomsTable";

function AdminRooms() {
    const axiosSecure = useAxiosSecure();
    const [rooms, setRooms] = useState([]);
    const [allOccupants, setAllOccupants] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [modalType, setModalType] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [roomsRes, occupantsRes] = await Promise.all([axiosSecure.get("/rooms"), axiosSecure.get("/applications")]);
                setRooms(roomsRes.data);
                setAllOccupants(occupantsRes.data);
            } catch {
                Swal.fire({ icon: "error", title: "Failed!", text: "Failed to load data!" });
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

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
                    setRooms((prev) => prev.filter((room) => room._id !== roomId));
                    Swal.fire("Deleted!", "Room has been deleted.", "success");
                } catch {
                    Swal.fire("Failed!", "Failed to delete room.", "error");
                }
            }
        });
    };

    const bookedRooms = useMemo(() => rooms.filter((room) => allOccupants.some((u) => u.roomNumber === room.roomNumber)), [rooms, allOccupants]);
    const vacantRooms = useMemo(() => rooms.filter((room) => !allOccupants.some((u) => u.roomNumber === room.roomNumber)), [rooms, allOccupants]);
    const totalRooms = rooms.length;
    const bookedRoomsCount = bookedRooms.length;
    const vacantRoomsCount = vacantRooms.length;
    const totalSeats = useMemo(() => rooms.reduce((acc, room) => acc + room.capacity.length, 0), [rooms]);
    const bookedSeats = allOccupants.length;

    const vacantSeatsMap = useMemo(() => {
        return rooms.reduce((acc, room) => {
            acc[room.roomNumber] = room.capacity.filter(
                (seat) => !allOccupants.find((u) => u.roomNumber === room.roomNumber && u.seatNumber === seat)
            );
            return acc;
        }, {});
    }, [rooms, allOccupants]);

    const closeModal = () => {
        setSelectedRoom(null);
        setModalType("");
    };

    const stats = [
        { label: "Total Rooms", value: totalRooms, type: "totalRooms", bg: "bg-gray-300", text: "text-gray-800" },
        { label: "Booked Rooms", value: bookedRoomsCount, type: "bookedRooms", bg: "bg-green-500", text: "text-white" },
        { label: "Vacant Rooms", value: vacantRoomsCount, type: "vacantRooms", bg: "bg-blue-500", text: "text-white" },
        { label: "Total Seats", value: totalSeats, type: "totalSeats", bg: "bg-gray-300", text: "text-gray-800" },
        { label: "Booked Seats", value: bookedSeats, type: "bookedSeats", bg: "bg-green-500", text: "text-white" },
        { label: "Vacant Seats", value: totalSeats - bookedSeats, type: "vacantSeats", bg: "bg-blue-500", text: "text-white" },
    ];

    return (
        <div className="md:p-6 bg-gradient-to-br from-blue-50 via-gray-50 to-gray-100 min-h-screen rounded-2xl">

            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 bg-white/80 shadow-md rounded-2xl p-6">
                <h1 className="text-3xl font-bold text-gray-800 text-center">Room Management</h1>
            </div>

            {/* stats cards */}
            <StatsCards stats={stats} onClick={setModalType} ></StatsCards>

            {/* Rooms table */}
            <RoomsTable rooms={rooms} onView={setSelectedRoom} onDelete={handleDelete} loading={loading} ></RoomsTable>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {selectedRoom && (

                    // room model
                    <RoomOccupantsModal
                        roomNumber={selectedRoom}
                        occupants={allOccupants.filter((u) => u.roomNumber === selectedRoom)}
                        onClose={closeModal}
                    ></RoomOccupantsModal>
                )}

                {modalType && ["bookedRooms", "vacantRooms", "bookedSeats", "vacantSeats"].includes(modalType) && (

                    // stats Model
                    <StatsModal
                        type={modalType}
                        bookedRooms={bookedRooms}
                        vacantRooms={vacantRooms}
                        allOccupants={allOccupants}
                        vacantSeatsMap={vacantSeatsMap}
                        rooms={rooms}
                        onClose={closeModal}
                    ></StatsModal>
                )}
            </div>
        </div>
    );
}

export default AdminRooms;
