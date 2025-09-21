import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { IoMenu, IoClose } from 'react-icons/io5';
import Swal from 'sweetalert2';
import useAuth from '../Hook/useAuth';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, userLogOut, setLoading } = useAuth();
  const navigate =useNavigate();

  // auth
  const handleLogOut = () => {
    userLogOut()
      .then(() => {
        setLoading(false);
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

  // btn css
  const getLinkClass = ({ isActive }) =>
    "relative font-poppins pb-2 font-medium transition-colors " +
    (isActive
      ? "text-black after:absolute after:left-0 after:bottom-0 after:h-0.5 after:bg-black after:w-full"
      : "text-gray-700 hover:text-black after:absolute after:left-0 after:bottom-0 after:h-0.5 after:bg-black after:w-0 hover:after:w-full after:transition-all after:duration-500");

  // btn
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
  // auth btn
  const authButtons = user?.email ? (
    <button
      onClick={handleLogOut}
      className="px-5 py-2 rounded-md border border-black text-black font-poppins hover:bg-red-500 hover:text-white transition"
    >
      LogOut
    </button>
  )
    :
    (
      <>
        <Link to="/login">
          <button className="px-5 py-2 rounded-md border border-black text-black font-poppins hover:bg-red-500 hover:text-white transition w-full">
            Login
          </button>
        </Link>
        <Link to="/apply">
          <button className="px-5 py-2 rounded-md border border-black text-black font-poppins hover:bg-red-500 hover:text-white transition w-full">
            Apply
          </button>
        </Link>
      </>
    );


  return (
    <div className="fixed top-0 w-full z-20 bg-white/5 backdrop-blur-md px-4 md:px-6 py-3 shadow-sm">
      <div className="max-w-[1322px] mx-auto flex justify-between items-center">

        <h2 className="text-2xl font-bold font-poppins uppercase text-black">
          Smart Hostel
        </h2>

        <div className="flex items-center gap-8">
          <ul className="hidden lg:flex flex-row gap-8 xl:gap-14 text-[15px]">
            {links}
          </ul>

          <div className="hidden lg:flex space-x-3">
            {authButtons}
          </div>

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

      {isOpen && (
        <div className="lg:hidden mt-3 rounded-lg shadow-lg p-5">
          <ul className="flex flex-col gap-4 text-gray-800">{links}</ul>
          <div className="flex flex-col gap-3 mt-5">
            {authButtons}
          </div>
        </div>
      )}
    </div>
  );
}

export default Navbar;
