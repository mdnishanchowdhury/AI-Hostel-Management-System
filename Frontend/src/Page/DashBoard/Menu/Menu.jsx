import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaBars,
  FaChevronRight,
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
import useAdmin from "../../../Hook/useAdmin";



const Menu = () => {
  const location = useLocation();
  const [isAdmin, isAdminLoading] = useAdmin();

  const [open, setOpen] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => setOpen(window.innerWidth >= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  // btn
  const base = "/dashboard";

  const menuItems = isAdmin
    ? [
      { path: `${base}`, label: "Dashboard", icon: <FaHome /> },
      { path: `${base}/application`, label: "Application", icon: <FaHome /> },
      { path: `${base}/allUsers`, label: "All User", icon: <FaCog /> },

    ]
    : [
      { path: `${base}`, label: "Dashboard", icon: <FaHome /> },
      { path: `${base}/room`, label: "My Room", icon: <FaBed /> },
      { path: `${base}/mealbooking`, label: "Meals", icon: <FaUtensils /> },
      { path: `${base}/payments`, label: "Make Payment", icon: <FaMoneyBill /> },
      { path: `${base}/payments/history`, label: "Payment History", icon: <FaHistory /> },
      { path: `${base}/attendance`, label: "Attendance", icon: <FaClipboardCheck /> },
      { path: `${base}/profile`, label: "Profile", icon: <FaUser /> },
      { path: `${base}/settings`, label: "Settings", icon: <FaCog /> },
    ];

  return (
    <aside
      className={`bg-gradient-to-b from-slate-900 to-slate-800 mb-5 text-slate-100 h-screen flex flex-col shadow-xl
        transition-width duration-500 ease-in-out overflow-hidden
        ${open ? "w-64" : "w-16"}`}
      aria-label="Sidebar navigation"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        {/* Toggle button */}
        <button
          onClick={() => setOpen(!open)}
          aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
          className="text-2xl focus:outline-none focus:ring-2 focus:ring-teal-400 rounded-md"
        >
          {open ? (
            <FaChevronRight className="text-teal-400 hover:text-teal-300 transition" />
          ) : (
            <FaBars className="text-teal-400 hover:text-teal-300 transition" />
          )}
        </button>

        {/* Title */}
        <h2
          className={`text-teal-400 font-bold whitespace-nowrap
            transition-opacity duration-300
            ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          aria-hidden={!open}
        >
          Student Dashboard
        </h2>
      </div>

      {/* Menu Items */}
      <ul className="flex-1 overflow-y-auto px-2 py-4 space-y-2">
        {menuItems.map(({ path, label, icon }) => {
          const isActive = location.pathname.startsWith(path);
          return (
            <li key={path}>
              <Link
                to={path}
                className={`flex items-center gap-4 px-3 py-2 rounded-md text-sm font-semibold
                  transition-colors duration-300
                  ${isActive
                    ? "bg-teal-600 bg-opacity-30 text-teal-400"
                    : "hover:bg-slate-700 hover:text-teal-400 text-slate-300"
                  }`}
                aria-current={isActive ? "page" : undefined}
              >
                <span className="text-lg">{icon}</span>
                <span
                  className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${open ? "max-w-full opacity-100" : "max-w-0 opacity-0"
                    }`}
                >
                  {label}
                </span>
              </Link>
            </li>
          );
        })}

        {/* Logout */}
        <li>
          <Link
            to="/login"
            className="flex items-center gap-4 px-3 py-2 rounded-md text-sm font-semibold text-red-500 hover:text-red-400 hover:bg-slate-700 transition-colors duration-300"
          >
            <FaSignOutAlt className="text-lg" />
            <span
              className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${open ? "max-w-full opacity-100" : "max-w-0 opacity-0"
                }`}
            >
              Logout
            </span>
          </Link>
        </li>
      </ul>
    </aside>
  );
};

export default Menu;
