import { motion } from "framer-motion";
import { useEffect } from "react";
import { Link } from "react-router-dom";
export default function About() {
    useEffect(() => {
          document.title = "Smart Hostel | About";
      }, []);
  return (
    <section className="bg-white max-w-[1322px] mx-auto px-6 md:px-0 pt-32 py-12 ">
      <motion.div
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Text */}
        <div className="space-y-6">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900">
            Welcome to <span className="text-[#FA8370]">GUB Hostel</span>
          </h2>
          <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
            GUB Hostel is more than just a place to stay — it’s a vibrant, secure, and welcoming community for students. We provide modern facilities, nutritious meals, and opportunities to engage in extracurricular activities, helping students grow academically and socially.
          </p>
          <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
            Our hostel ensures a safe environment with 24/7 security, comfortable rooms, high-speed internet, and a variety of recreational activities. Every student here is part of a supportive and inclusive community.
          </p>
          <Link to='/facilities'>
            <button className="mt-4 px-8 py-3 rounded-full bg-[#FA8370] text-white text-lg font-semibold hover:bg-red-500 transition-colors duration-300">
              Explore Our Facilities
            </button>
          </Link>
        </div>

        {/* Image */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <img
            src='https://i.ibb.co.com/MyjQG2hv/hostel-management-software-guide.jpg'
            alt="GUB Hostel"
            className="w-full h-auto rounded-2xl shadow-lg object-cover"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
