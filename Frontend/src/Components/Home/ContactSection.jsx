import { FaPhoneAlt } from "react-icons/fa";
import { MdEmail, MdLocationOn } from "react-icons/md";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.2 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

function ContactSection() {
  const contacts = [
    { icon: <FaPhoneAlt className="w-6 h-6" />, text: "+8801712345678" },
    { icon: <MdEmail className="w-6 h-6" />, text: "info@gubhostel.edu.bd" },
    {
      icon: <MdLocationOn className="w-6 h-6" />,
      text: "Green University Hostel, Mirpur Road, Dhaka - 1216, Bangladesh",
    },
  ];

  return (
    <section className="bg-gradient-to-r from-[#f87171] to-[#fb923c] py-16 px-4 sm:px-6 md:px-10 lg:px-20">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        className="max-w-6xl mx-auto text-white space-y-10"
      >
        {/* Heading */}
        <motion.h2
          variants={itemVariants}
          className="text-2xl sm:text-3xl md:text-4xl font-bold font-poppins text-center"
        >
          Contact GUB Hostel
        </motion.h2>

        {/* Contact Items */}
        <div className="flex flex-col md:flex-row md:flex-wrap justify-center items-stretch gap-6 text-center">
          {contacts.map((contact, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              className="flex flex-col sm:flex-row items-center sm:items-center justify-center sm:justify-start gap-2 w-full md:w-1/3 p-4 bg-white/10 rounded-xl backdrop-blur-sm hover:shadow-lg transition-shadow duration-300"
            >
              {contact.icon}
              <span className="text-sm sm:text-[16px] font-normal font-poppins break-words">
                {contact.text}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Button */}
        <motion.div variants={itemVariants} className="flex justify-center">
          <button className="text-base sm:text-[16px] font-normal font-poppins text-[#FA7470] bg-white px-10 sm:px-12 md:px-16 py-3 rounded-full hover:bg-red-500 hover:text-white transition-colors duration-300">
            Contact Us
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
}

export default ContactSection;
