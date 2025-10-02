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
} from "react-icons/fa";
import useAdmin from "../../Hook/useAdmin";

const DashoardMenu = ({ onLinkClick }) => {
  const location = useLocation();
  const [isAdmin] = useAdmin();

  const base = "/dashboard";

  const menuItems = isAdmin
    ? [
        { path: `${base}`, label: "Dashboard", icon: <FaHome /> },
        { path: `${base}/application`, label: "Application", icon: <FaHome /> },
        { path: `${base}/allUsers`, label: "All Users", icon: <FaCog /> },
        { path: `${base}/autobooking`, label: "Auto booking", icon: <FaCog /> },
        { path: `${base}/mealsBookList`, label: "Daily Booked Meals", icon: <FaCog /> },
      ]
    : [
        { path: `${base}`, label: "Dashboard", icon: <FaHome /> },
        { path: `${base}/myRoom`, label: "My Room", icon: <FaBed /> },
        { path: `${base}/mealbooking`, label: "Meals", icon: <FaUtensils /> },
        { path: `${base}/payments`, label: "Make Payment", icon: <FaMoneyBill /> },
        { path: `${base}/payments/history`, label: "Payment History", icon: <FaHistory /> },
        { path: `${base}/attendance`, label: "Attendance", icon: <FaClipboardCheck /> },
        { path: `${base}/profile`, label: "Profile", icon: <FaUser /> },
        { path: `${base}/settings`, label: "Settings", icon: <FaCog /> },
      ];

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <h2 className="text-green-400 font-bold text-lg tracking-wide">Smart Hostel</h2>
      </div>

      {/* Menu Items */}
      <ul className="flex-1 px-3 py-4 space-y-2">
        {menuItems.map(({ path, label, icon }) => {
          const isActive =
            path === `${base}` ? location.pathname === path : location.pathname.startsWith(path);

          return (
            <li key={path}>
              <Link
                to={path}
                onClick={onLinkClick}
                className={`flex items-center gap-4 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300
                  ${
                    isActive
                      ? "bg-green-600/30 text-green-400 font-semibold shadow-sm"
                      : "text-gray-300 hover:bg-green-600/20 hover:text-green-400"
                  }`}
              >
                <span className="text-lg">{icon}</span>
                <span className="whitespace-nowrap">{label}</span>
              </Link>
            </li>
          );
        })}

        {/* Logout */}
        <li>
          <Link
            to="/login"
            onClick={onLinkClick}
            className="flex items-center gap-4 px-3 py-2 rounded-lg text-sm font-medium text-red-500 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300"
          >
            <FaSignOutAlt className="text-lg" />
            <span className="whitespace-nowrap">Logout</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default DashoardMenu;
