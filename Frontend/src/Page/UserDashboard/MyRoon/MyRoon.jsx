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
        <p className="text-center text-lg text-gray-500 animate-pulse">
          Loading room info...
        </p>
      </div>
    );
  }

  return (
    <motion.div
      className="max-w-4xl mx-auto bg-gradient-to-r from-purple-50 to-blue-50 shadow-xl rounded-2xl p-8 mt-10"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl font-extrabold text-gray-900 mb-8 flex items-center gap-3"
      >
        My Room Information
      </motion.h1>

      <motion.div
        className="space-y-10"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 },
          },
        }}
      >
        {/* Room Details */}
        <motion.div
          className="grid md:grid-cols-2 gap-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="space-y-5">
            {[
              {
                icon: <FaBuilding className="text-indigo-600 text-2xl" />,
                label: "Building",
                value: roomInfo.building,
              },
              {
                icon: <FaMapMarkerAlt className="text-red-500 text-2xl" />,
                label: "Location",
                value: roomInfo.location,
              },
              {
                icon: <FaBed className="text-green-600 text-2xl" />,
                label: "Room Number",
                value: roomInfo.roomNumber,
              },
              {
                icon: <FaBed className="text-blue-600 text-2xl" />,
                label: "Your Bed",
                value: roomInfo.bedNumber,
              },
              {
                icon: <FaUserFriends className="text-yellow-500 text-2xl" />,
                label: "Total Beds",
                value: roomInfo.bedCount,
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-4 text-gray-700 font-medium text-lg bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: i * 0.15 }}
              >
                {item.icon}
                <span>
                  <strong>{item.label}:</strong> {item.value}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Roommates */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center gap-3">
              <FaUserFriends className="text-pink-600 text-3xl" /> Roommates
            </h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2 text-lg">
              {
                roomInfo.roommates.map((mate, idx) => (
                  <li
                    key={idx}
                    className="hover:text-pink-600 transition duration-200"
                  >
                    {mate}
                  </li>
                ))
              }
            </ul>
          </motion.div>
        </motion.div>

        {/* Amenities */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-2xl font-semibold mb-5 text-gray-800 flex items-center gap-3">
            Amenities
          </h2>
          <div className="flex flex-wrap gap-5">
            {
              roomInfo.amenities.includes("WiFi") && (
                <span className="flex items-center gap-2 px-4 py-2 border border-indigo-600 text-indigo-600 rounded-full text-lg font-semibold cursor-default hover:bg-indigo-600 hover:text-white transition">
                  <FaWifi /> WiFi
                </span>
              )
            }
            {
              roomInfo.amenities.includes("Attached Bathroom") && (
                <span className="flex items-center gap-2 px-4 py-2 border border-red-600 text-red-600 rounded-full text-lg font-semibold cursor-default hover:bg-red-600 hover:text-white transition">
                  <FaBath /> Attached Bath
                </span>
              )
            }
            {
              roomInfo.amenities.includes("Fan") && (
                <span className="flex items-center gap-2 px-4 py-2 border border-green-600 text-green-600 rounded-full text-lg font-semibold cursor-default hover:bg-green-600 hover:text-white transition">
                  <FaFan /> Fan
                </span>
              )
            }
            {
              roomInfo.amenities.includes("Chair/Table") && (
                <span className="flex items-center gap-2 px-4 py-2 border border-yellow-600 text-yellow-600 rounded-full text-lg font-semibold cursor-default hover:bg-yellow-600 hover:text-white transition">
                  <FaChair /> Study Set
                </span>
              )
            }
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default MyRoom;
