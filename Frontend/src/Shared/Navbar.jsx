import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { IoMenu, IoClose } from 'react-icons/io5';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const getLinkClass = ({ isActive }) =>
    "relative font-poppins text-white  xl:text-black pb-2 font-medium " +
    (isActive
      ? "after:absolute after:left-0 after:bottom-0 after:h-0.5 after:bg-black after:w-full after:transition-all after:duration-500"
      : "after:absolute after:left-0 after:bottom-0 after:h-0.5 after:bg-white after:w-0 hover:after:w-full after:transition-all after:duration-500");

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
    <div className="fixed top-0 w-full z-20 bg-transparent px-3 md:px-6 pt-6 md:pt-10">
      <div className="max-w-[1322px] mx-auto flex justify-between items-center">

        {/* <img src={logo} alt="Logo" className="w-[153px] h-[27px] object-cover" /> */}
        <h2 className='text-2xl font-bold font-poppins uppercase '>Smart Hostel</h2>

        <ul className="hidden lg:flex flex-row gap-10 xl:gap-14 text-[15px] font-medium text-white">
          {links}
        </ul>

        <div className="lg:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-md hover:bg-[#FA8370] transition"
          >
            {isOpen ? <IoClose className="w-8 h-8 text-black" /> : <IoMenu className="w-8 h-8 text-black" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <ul className="flex flex-col gap-4 bg-amber-950 text-white p-5 mt-3 text-[15px] font-medium rounded-lg shadow-lg lg:hidden">
          {links}
        </ul>
      )}
    </div>
  );
}

export default Navbar;
