import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { CalendarDays, Trophy, Music, Users } from "lucide-react";
import Ellipse_2 from "../../assets/Banner/Ellipse_4.png";
const activities = [
  {
    icon: <CalendarDays className="w-8 h-8 text-blue-600" />,
    title: "Monthly Events",
    description:
      "Regular hostel gatherings, orientation programs, and cultural nights to build community.",
  },
  {
    icon: <Trophy className="w-8 h-8 text-yellow-600" />,
    title: "Sports & Competitions",
    description:
      "Annual sports events, indoor games, and inter-hostel competitions to keep students active.",
  },
  {
    icon: <Music className="w-8 h-8 text-pink-600" />,
    title: "Cultural Activities",
    description:
      "Music nights, drama shows, debate clubs, and talent hunts for creative expression.",
  },
  {
    icon: <Users className="w-8 h-8 text-green-600" />,
    title: "Student Community",
    description:
      "Group study sessions, leadership workshops, and team-building activities.",
  },
];

function ActivitySection() {
  const { scrollY } = useScroll();
  const ellipseOpacity = useTransform(scrollY, [0, 600], [0, 1]);
  const ellipseYRaw = useTransform(scrollY, [0, 600], [-500, 0]);
  const ellipseY = useSpring(ellipseYRaw, { stiffness: 60, damping: 20 });
  return (
    <div className="relative max-w-[1322px] mx-auto  py-12">
      {/* Ellipse 2 */}
      <motion.div
        initial={{ opacity: 0, y: -200 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        viewport={{ once: false }}
        className="absolute top-[809px]  md:top-[279px] right-[4px] md:-right-[150px] -z-10"
      >
        <img
          src={Ellipse_2}
          alt="image"
          className="w-[320px] sm:w-[500px] md:w-[400px] h-[324px] opacity-70"
        />
      </motion.div>

      <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium text-center pb-10">
        Hostel <span className="text-[#FA8370]">Activities</span>
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {activities.map((activity, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            whileHover={{ scale: 1.05 }}
            className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 mb-4">
              {activity.icon}
            </div>

            <h3 className="font-semibold text-lg text-gray-800 mb-2">
              {activity.title}
            </h3>

            <p className="text-sm text-gray-600 leading-relaxed">
              {activity.description}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default ActivitySection;
