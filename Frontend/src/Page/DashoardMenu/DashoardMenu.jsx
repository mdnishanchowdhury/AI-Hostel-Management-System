import { Link, useLocation, useNavigate } from "react-router-dom";
import {FaHome,FaBed,FaUtensils,FaMoneyBill,FaUser,FaCog,FaSignOutAlt,FaHistory,FaBookOpen,FaUsers,FaCalendarAlt,
  FaTachometerAlt} from "react-icons/fa";
import useAdmin from "../../Hook/useAdmin";
import useAuth from "../../Hook/useAuth";
import Swal from "sweetalert2";
import { IoAddCircle } from "react-icons/io5";
import { MdMeetingRoom } from "react-icons/md";

const DashoardMenu = ({ onLinkClick }) => {
  const location = useLocation();
  const [isAdmin] = useAdmin();
   const navigate = useNavigate();
  const base = "/dashboard";
  const {userLogOut} = useAuth();

   const handleLogOut = () => {
    userLogOut()
      .then(() => {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Logged out successfully!",
          showConfirmButton: false,
          timer: 1500
        });
        navigate('/login')
      })
  }

  const menuItems = isAdmin
    ? [
      { path: '/', label: "Home", icon: <FaHome /> },
      { path: `${base}`, label: "Dashboard", icon: <FaTachometerAlt /> },
      { path: `${base}/application`, label: "Application", icon: <FaBookOpen /> },
      { path: `${base}/allUsers`, label: "All Users", icon: <FaUsers /> },
      { path: `${base}/addRoom`, label: "Add Room", icon: <IoAddCircle /> },
      { path: `${base}/adminRooms`, label: "Rooms", icon: <MdMeetingRoom /> },
      { path: `${base}/autobooking`, label: "Auto Booking", icon: <FaCalendarAlt /> },
      { path: `${base}/dailyBookedMeals`, label: "Daily Meals", icon: <FaUtensils /> },
      { path: `${base}/mealsHistory`, label: "Meals History", icon: <FaHistory /> },
      { path: `${base}/admin/payments/History`, label: "Payment History", icon: <FaMoneyBill /> },
    ]
    : [
      { path: '/', label: "Home", icon: <FaHome /> },
      { path: `${base}`, label: "Dashboard", icon: <FaTachometerAlt /> },
      { path: `${base}/myRoom`, label: "My Room", icon: <FaBed /> },
      { path: `${base}/mealbooking`, label: "Meals", icon: <FaUtensils /> },
      { path: `${base}/history`, label: "Meals History", icon: <FaHistory /> },
      { path: `${base}/payments`, label: "Make Payment", icon: <FaMoneyBill /> },
      { path: `${base}/payments/history`, label: "Payment History", icon: <FaHistory /> },
      // { path: `${base}/attendance`, label: "Attendance", icon: <FaClipboardCheck /> },
      { path: `${base}/profile`, label: "Profile", icon: <FaUser /> },
      { path: `${base}/settings`, label: "Settings", icon: <FaCog /> },
    ];

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-gray-800 text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <img className='w-40 h-13 object-cover' src="https://i.ibb.co.com/2rVZSDt/Screenshot-2026-01-16-040835-removebg-preview.png" alt="Smart Hostel" />
      </div>

      {/* Menu Items */}
      <ul className="flex-1 px-3 py-4 space-y-2">
        {menuItems.map(({ path, label, icon }) => {
          const isActive = location.pathname === path;

          return (
            <li key={path}>
              <Link
                to={path}
                onClick={onLinkClick}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300
                  ${isActive ? "bg-gray-700 text-white font-semibold" : "text-gray-300 hover:bg-gray-700 hover:text-white"}`}
              >
                <span className="text-lg">{icon}</span>
                <span>{label}</span>
              </Link>
            </li>
          );
        })}

        {/* Logout */}
        <li>
          <Link
            to="/login"
            onClick={handleLogOut}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-500 hover:text-white hover:bg-red-600 transition-all duration-300"
          >
            <FaSignOutAlt className="text-lg" />
            <span>Logout</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default DashoardMenu;
