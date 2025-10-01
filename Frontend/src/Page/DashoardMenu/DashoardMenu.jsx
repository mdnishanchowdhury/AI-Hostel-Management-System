import { Link, useLocation } from "react-router-dom";
import { FaHome, FaBed, FaUtensils, FaMoneyBill, FaClipboardCheck, FaUser, FaCog, FaSignOutAlt, FaHistory, } from "react-icons/fa";
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
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        <h2 className="text-teal-400 font-bold">Student Dashboard</h2>
      </div>

      {/* Menu Items */}
      <ul className="flex-1 px-2 py-4 space-y-2">
        {menuItems.map(({ path, label, icon }) => {
          const isActive =
            path === `${base}` ? location.pathname === path : location.pathname.startsWith(path);

          return (
            <li key={path}>
              <Link
                to={path}
                onClick={onLinkClick}
                className={`flex items-center gap-4 px-3 py-2 rounded-md text-sm font-semibold transition-colors duration-300
                  ${isActive
                    ? "bg-teal-600 bg-opacity-30 text-teal-400"
                    : "hover:bg-slate-700 hover:text-teal-400 text-slate-300"
                  }`}
              >
                <span className="text-lg">{icon}</span>
                <span className="whitespace-nowrap overflow-hidden">{label}</span>
              </Link>
            </li>
          );
        })}

        {/* Logout */}
        <li>
          <Link
            to="/login"
            onClick={onLinkClick}
            className="flex items-center gap-4 px-3 py-2 rounded-md text-sm font-semibold text-red-500 hover:text-red-400 hover:bg-slate-700 transition-colors duration-300"
          >
            <FaSignOutAlt className="text-lg" />
            <span className="whitespace-nowrap overflow-hidden">Logout</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default DashoardMenu;
