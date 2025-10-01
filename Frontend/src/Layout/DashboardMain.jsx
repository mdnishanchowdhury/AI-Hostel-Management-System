import { useState } from "react";
import { Outlet } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import DashoardMenu from "../Page/DashoardMenu/DashoardMenu";

function DashboardMain() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Mobile Top Navbar */}
      <div className="md:hidden fixed top-0 left-0 w-full z-50 bg-white/5 backdrop-blur-md p-4 shadow-sm flex items-center justify-between">
        <h2 className="text-2xl font-bold font-poppins uppercase text-black">
          Smart Hostel
        </h2>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? (
            <FaTimes className="w-6 h-6" />
          ) : (
            <FaBars className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Sidebar / Mobile Menu */}
      <div
        className={`fixed md:relative z-40 top-0 left-0 h-full md:h-auto w-64 bg-gradient-to-b from-slate-900 to-slate-800 transform transition-transform duration-300
          ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <DashoardMenu onLinkClick={() => setMobileMenuOpen(false)} />
      </div>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-30 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 p-6 bg-gray-50 rounded-lg shadow-inner mt-16 md:mt-0">
        <Outlet />
      </div>
    </div>
  );
}

export default DashboardMain;
