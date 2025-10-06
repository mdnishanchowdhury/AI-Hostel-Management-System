import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaBed,
  FaUtensils,
  FaMoneyBill,
  FaClipboardCheck,
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaHistory,
  FaBookOpen,
  FaUsers,
  FaCalendarAlt,
  FaTachometerAlt,
} from "react-icons/fa";
import useAdmin from "../../Hook/useAdmin";

const DashoardMenu = ({ onLinkClick }) => {
  const location = useLocation();
  const [isAdmin] = useAdmin();

  const base = "/dashboard";

  const menuItems = isAdmin
    ? [
      { path: '/', label: "Home", icon: <FaHome /> },
      { path: `${base}`, label: "Dashboard", icon: <FaTachometerAlt /> },
      { path: `${base}/application`, label: "Application", icon: <FaBookOpen /> },
      { path: `${base}/allUsers`, label: "All Users", icon: <FaUsers /> },
      { path: `${base}/autobooking`, label: "Auto Booking", icon: <FaCalendarAlt /> },
      { path: `${base}/dailyBookedMeals`, label: "Daily Meals", icon: <FaUtensils /> },
      { path: `${base}/mealsHistory`, label: "Meals History", icon: <FaHistory /> },
      { path: `${base}/admin/payments/History`, label: "Payment History", icon: <FaMoneyBill /> },
    ]
    : [
      { path: `${base}`, label: "Dashboard", icon: <FaHome /> },
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
        <h2 className="text-green-400 font-bold text-lg tracking-wide">Smart Hostel</h2>
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
            onClick={onLinkClick}
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
