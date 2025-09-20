import { motion } from "framer-motion";

const members = [
  {
    name: "Ms. Ayesha Rahman",
    role: "Hostel Warden",
    feedback: "“A terrific piece of praise”",
    img: "https://randomuser.me/api/portraits/women/1.jpg",
  },
  {
    name: "Mr. Arif Hossain",
    role: "Student Representative",
    feedback: "“A fantastic bit of feedback”",
    img: "https://randomuser.me/api/portraits/men/2.jpg",
  },
  {
    name: "Mr. Shahin Ahmed",
    role: "Maintenance Head",
    feedback: "“A genuinely glowing review”",
    img: "https://randomuser.me/api/portraits/men/3.jpg",
  },
];

export default function HostelFacality() {
  return (
    <section className="py-16 max-w-[1322px] mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-4xl md:text-5xl font-semibold text-gray-900 font-poppins">
          Hostel <span className="text-[#FA8370]">Committee</span>
        </h1>
        <p className="text-gray-600 mt-3 max-w-2xl mx-auto text-base sm:text-lg font-poppins leading-relaxed">
          Meet the dedicated members responsible for maintaining a secure and well-organized hostel environment.
        </p>
      </div>

      <div className="grid gap-10 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {members.map(({ name, role, feedback, img }, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: i * 0.15, duration: 0.6 }}
            className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-xl transition-shadow duration-300"
          >
            <p className="text-lg sm:text-xl italic font-poppins text-gray-700 mb-6 leading-relaxed">
              {feedback}
            </p>
            <div className="flex items-center gap-5">
              <img
                src={img}
                alt={name}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-blue-500"
              />
              <div>
                <p className="font-semibold text-gray-900 text-lg sm:text-xl font-poppins">{name}</p>
                <p className="text-gray-500 text-sm sm:text-base font-poppins">{role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
