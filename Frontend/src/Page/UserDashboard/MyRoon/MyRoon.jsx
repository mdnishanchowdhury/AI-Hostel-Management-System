import { useState, useEffect } from "react";
import { FaBed, FaBuilding, FaMapMarkerAlt, FaUserFriends, FaWifi, FaBath, FaFan, FaChair } from "react-icons/fa";
import { motion } from "framer-motion";
import useAxiosSecure from "../../../Hook/useAxiosSecure";
import useAuth from "../../../Hook/useAuth";

function MyRoom() {
  const secureAxios = useAxiosSecure();
  const { user } = useAuth();

  const [userInfo, setUserInfo] = useState(null); 
  const [rooms, setRooms] = useState([]);         
  const [roomInfo, setRoomInfo] = useState(null); 

  
  useEffect(() => {
    if (!user?.email) return;

    // axios user info
    secureAxios.get(`/users/room?email=${user.email}`)
      .then(res => setUserInfo(res.data))
      .catch(err => console.error("Failed to fetch user info:", err));

    // axios all rooms
    secureAxios.get("/rooms")
      .then(res => setRooms(res.data))
      .catch(err => console.error("Failed to fetch rooms:", err));
  }, [user, secureAxios]);

  // Match user's selected seat with the rooms
  useEffect(() => {
    if (!userInfo || !rooms.length) return;

    const seat = userInfo.selectedSeat; 
    if (!seat) return;

    const [roomNumber] = seat.split("-Bed-");
    const room = rooms.find(r => r.roomNumber === roomNumber);

    if (room) {
      // Placeholder roommates 
      const roommates = room.booked.map((b, idx) => `User ${idx + 1}`);

      setRoomInfo({
        building: room.hostel,
        location: userInfo.address,
        roomNumber: room.roomNumber,
        bedCount: room.capacity.length,
        roommates,
        amenities: ["WiFi", "Fan", "Chair/Table"],
      });
    }
  }, [userInfo, rooms]);

  // Loading state
  if (!roomInfo) {
    return (
      <div className="w-11/12 mx-auto p-6 max-w-4xl">
        <p className="text-center text-lg text-gray-500">Loading room info...</p>
      </div>
    );
  }

  return (
    <div className="w-11/12 mx-auto p-6 max-w-4xl">
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl font-extrabold text-gray-900 mb-8 flex items-center gap-3"
      >
        My Room Information
      </motion.h1>

      {/* Room Info Card */}
      <motion.div className="bg-white rounded-2xl shadow-xl p-8 space-y-8">
        {/* Room Details */}
        <div className="grid md:grid-cols-2 gap-10">
          <div className="space-y-5">
            {[
              { icon: <FaBuilding className="text-indigo-600" />, label: "Building", value: roomInfo.building },
              { icon: <FaMapMarkerAlt className="text-red-500" />, label: "Location", value: roomInfo.location },
              { icon: <FaBed className="text-green-600" />, label: "Room Number", value: roomInfo.roomNumber },
              { icon: <FaUserFriends className="text-yellow-500" />, label: "Total Beds", value: roomInfo.bedCount },
            ].map(({ icon, label, value }, i) => (
              <div key={i} className="flex items-center gap-4 text-gray-700 font-medium text-lg">
                <span className="text-2xl">{icon}</span>
                <span><strong>{label}:</strong> {value}</span>
              </div>
            ))}
          </div>

          {/* Roommates */}
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center gap-3">
              <FaUserFriends className="text-pink-600 text-3xl" /> Roommates
            </h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2 text-lg">
              {roomInfo.roommates.map((mate, idx) => (
                <li key={idx} className="hover:text-pink-600">{mate}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Amenities */}
        <div>
          <h2 className="text-2xl font-semibold mb-5 text-gray-800 flex items-center gap-3">Amenities</h2>
          <div className="flex flex-wrap gap-5">
            {roomInfo.amenities.includes("WiFi") && <Amenity icon={<FaWifi />} text="WiFi" color="indigo" />}
            {roomInfo.amenities.includes("Attached Bathroom") && <Amenity icon={<FaBath />} text="Attached Bath" color="red" />}
            {roomInfo.amenities.includes("Fan") && <Amenity icon={<FaFan />} text="Fan" color="green" />}
            {roomInfo.amenities.includes("Chair/Table") && <Amenity icon={<FaChair />} text="Study Set" color="yellow" />}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function Amenity({ icon, text, color }) {
  const borderColor = `border-${color}-600`;
  const textColor = `text-${color}-600`;
  const hoverColor = `hover:bg-${color}-600 hover:text-white`;
  return (
    <span className={`badge badge-outline flex items-center gap-2 px-4 py-2 ${borderColor} ${textColor} rounded-full text-lg font-semibold cursor-default select-none ${hoverColor}`}>
      {icon} {text}
    </span>
  );
}
export default  MyRoom;