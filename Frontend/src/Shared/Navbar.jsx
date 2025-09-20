import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { IoMenu, IoClose } from 'react-icons/io5';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const getLinkClass = ({ isActive }) =>
    "relative font-poppins pb-2 font-medium transition-colors " +
    (isActive
      ? "text-black after:absolute after:left-0 after:bottom-0 after:h-0.5 after:bg-black after:w-full"
      : "text-gray-700 hover:text-black after:absolute after:left-0 after:bottom-0 after:h-0.5 after:bg-black after:w-0 hover:after:w-full after:transition-all after:duration-500");

  const links = (
    <>
      <li><NavLink to="/" className={getLinkClass} onClick={() => setIsOpen(false)}>Home</NavLink></li>
      <li><NavLink to="/fees" className={getLinkClass} onClick={() => setIsOpen(false)}>Fees</NavLink></li>
      <li><NavLink to="/services" className={getLinkClass} onClick={() => setIsOpen(false)}>Services</NavLink></li>
      <li><NavLink to="/contact" className={getLinkClass} onClick={() => setIsOpen(false)}>Contact</NavLink></li>
      <li><NavLink to="/about" className={getLinkClass} onClick={() => setIsOpen(false)}>About</NavLink></li>
      <li><NavLink to="/dashboard" className={getLinkClass} onClick={() => setIsOpen(false)}>Dashboard</NavLink></li>
    </>
  );

  return (
    <div className="fixed top-0 w-full z-20 bg-white/5 backdrop-blur-md px-4 md:px-6 py-3 shadow-sm">
      <div className="max-w-[1322px] mx-auto flex justify-between items-center">
        
        {/* Left Logo/Name */}
        <h2 className="text-2xl font-bold font-poppins uppercase text-black">
          Smart Hostel
        </h2>

        {/* Right Side: Links + Buttons */}
        <div className="flex items-center gap-8">
          {/* Desktop Nav */}
          <ul className="hidden lg:flex flex-row gap-8 xl:gap-14 text-[15px]">
            {links}
          </ul>

          {/* Buttons (Desktop) */}
          <div className="hidden lg:flex space-x-3">
            <button className="px-5 py-2 rounded-md border border-black text-black font-poppins hover:bg-red-500 hover:text-white transition">
              Login
            </button>
            <button className="px-5 py-2 rounded-md border border-black text-black font-poppins hover:bg-red-500 hover:text-white transition">
              Apply
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md hover:bg-gray-200 transition"
            >
              {isOpen ? (
                <IoClose className="w-7 h-7 text-gray-800" />
              ) : (
                <IoMenu className="w-7 h-7 text-gray-800" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="lg:hidden mt-3 bg-white rounded-lg shadow-lg p-5">
          <ul className="flex flex-col gap-4 text-gray-800">{links}</ul>
          <div className="flex flex-col gap-3 mt-5">
            <button className="w-full px-5 py-2 rounded-md border border-black text-black font-poppins hover:bg-[#FA7470] hover:text-white transition">
              Login
            </button>
            <button className="w-full px-5 py-2 rounded-md border border-black text-black font-poppins hover:bg-red-500 hover:text-white transition">
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Navbar;
