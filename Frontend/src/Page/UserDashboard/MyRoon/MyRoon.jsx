import { useState, useEffect } from "react";
import { FaBed, FaBuilding, FaMapMarkerAlt, FaUserFriends, FaWifi, FaBath, FaFan, FaChair, } from "react-icons/fa";
import { motion } from "framer-motion";
import useAxiosSecure from "../../../Hook/useAxiosSecure";
import useAuth from "../../../Hook/useAuth";

function MyRoom() {
  const secureAxios = useAxiosSecure();
  const { user } = useAuth();

  const [userInfo, setUserInfo] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [roomInfo, setRoomInfo] = useState(null);

  // Fetch user info & rooms
  useEffect(() => {
    if (!user?.email) return;

    secureAxios
      .get(`/users/room?email=${user.email}`)
      .then((res) => setUserInfo(res.data))
      .catch((err) => console.error("Failed to fetch user info:", err));

    secureAxios
      .get("/rooms")
      .then((res) => setRooms(res.data))
      .catch((err) => console.error("Failed to fetch rooms:", err));
  }, [user, secureAxios]);

  // Match room info
  useEffect(() => {
    if (!userInfo || !rooms.length) return;

    const seat = userInfo.selectedSeat;
    if (!seat) return;

    const [roomNumber, bedNumber] = seat.split("-Bed-");
    const room = rooms.find((r) => r.roomNumber === roomNumber);

    if (room) {
      const roommates = room.booked.map((b, idx) => `User ${idx + 1}`);

      setRoomInfo({
        building: room.hostel,
        location: userInfo.address,
        roomNumber: room.roomNumber,
        bedCount: room.capacity.length,
        bedNumber: `Bed-${bedNumber}`,
        roommates,
        amenities: ["WiFi", "Fan", "Chair/Table"],
      });
    }
  }, [userInfo, rooms]);

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

      <motion.div className="bg-white rounded-2xl shadow-xl p-8 space-y-8">
        {/* Room Details */}
        <div className="grid md:grid-cols-2 gap-10">
          <div className="space-y-5">
            <div className="flex items-center gap-4 text-gray-700 font-medium text-lg">
              <FaBuilding className="text-indigo-600 text-2xl" />
              <span>
                <strong>Building:</strong> {roomInfo.building}
              </span>
            </div>
            <div className="flex items-center gap-4 text-gray-700 font-medium text-lg">
              <FaMapMarkerAlt className="text-red-500 text-2xl" />
              <span>
                <strong>Location:</strong> {roomInfo.location}
              </span>
            </div>
            <div className="flex items-center gap-4 text-gray-700 font-medium text-lg">
              <FaBed className="text-green-600 text-2xl" />
              <span>
                <strong>Room Number:</strong> {roomInfo.roomNumber}
              </span>
            </div>
            <div className="flex items-center gap-4 text-gray-700 font-medium text-lg">
              <FaBed className="text-blue-600 text-2xl" />
              <span>
                <strong>Your Bed:</strong> {roomInfo.bedNumber}
              </span>
            </div>
            <div className="flex items-center gap-4 text-gray-700 font-medium text-lg">
              <FaUserFriends className="text-yellow-500 text-2xl" />
              <span>
                <strong>Total Beds:</strong> {roomInfo.bedCount}
              </span>
            </div>
          </div>

          {/* Roommates */}
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center gap-3">
              <FaUserFriends className="text-pink-600 text-3xl" /> Roommates
            </h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2 text-lg">
              {
                roomInfo.roommates.map((mate, idx) => (
                  <li key={idx} className="hover:text-pink-600">
                    {mate}
                  </li>
                ))
              }
            </ul>
          </div>
        </div>

        {/* Amenities */}
        <div>
          <h2 className="text-2xl font-semibold mb-5 text-gray-800 flex items-center gap-3">
            Amenities
          </h2>
          <div className="flex flex-wrap gap-5">
            {
              roomInfo.amenities.includes("WiFi") && (
                <span className="flex items-center gap-2 px-4 py-2 border border-indigo-600 text-indigo-600 rounded-full text-lg font-semibold cursor-default hover:bg-indigo-600 hover:text-white">
                  <FaWifi /> WiFi
                </span>
              )
            }
            {
              roomInfo.amenities.includes("Attached Bathroom") && (
                <span className="flex items-center gap-2 px-4 py-2 border border-red-600 text-red-600 rounded-full text-lg font-semibold cursor-default hover:bg-red-600 hover:text-white">
                  <FaBath /> Attached Bath
                </span>
              )
            }
            {
              roomInfo.amenities.includes("Fan") && (
                <span className="flex items-center gap-2 px-4 py-2 border border-green-600 text-green-600 rounded-full text-lg font-semibold cursor-default hover:bg-green-600 hover:text-white">
                  <FaFan /> Fan
                </span>
              )
            }
            {
              roomInfo.amenities.includes("Chair/Table") && (
                <span className="flex items-center gap-2 px-4 py-2 border border-yellow-600 text-yellow-600 rounded-full text-lg font-semibold cursor-default hover:bg-yellow-600 hover:text-white">
                  <FaChair /> Study Set
                </span>
              )
            }
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default MyRoom;
