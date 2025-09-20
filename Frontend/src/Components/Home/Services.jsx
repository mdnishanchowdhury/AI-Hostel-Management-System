import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Wifi, BedDouble, Shield, Utensils, Wind, Droplet } from "lucide-react";
import Ellipse_2 from "../../assets/Banner/Ellipse_4.png";
import Card from "./Card";
function Services() {
  const { scrollY } = useScroll();
  const ellipseOpacity = useTransform(scrollY, [0, 600], [0, 1]);
  const ellipseYRaw = useTransform(scrollY, [0, 600], [-500, 0]);
  const ellipseY = useSpring(ellipseYRaw, { stiffness: 60, damping: 20 });

  const items = [
    {
      icon: <BedDouble className="w-8 h-8 text-blue-600" />,
      title: "Comfortable Beds",
      description:
        "Every room is equipped with individual beds, high-quality mattresses, and pillows for comfortable sleep.",
    },
    {
      icon: <Wifi className="w-8 h-8 text-blue-600" />,
      title: "24/7 High-Speed Wi-Fi",
      description:
        "Unlimited internet access throughout the hostel premises with fast and secure connectivity.",
    },
    {
      icon: <Shield className="w-8 h-8 text-blue-600" />,
      title: "Security & CCTV",
      description:
        "24/7 security guards and CCTV monitoring ensure a safe and peaceful environment.",
    },
    {
      icon: <Utensils className="w-8 h-8 text-blue-600" />,
      title: "Healthy Meal Service",
      description:
        "Nutritious and hygienic food served three times a day, with weekly menu variations.",
    },
    {
      icon: <Wind className="w-8 h-8 text-blue-600" />,
      title: "Ceiling Fans & Air Flow",
      description:
        "All rooms come with ceiling fans and proper ventilation for comfort in summer.",
    },
    {
      icon: <Droplet className="w-8 h-8 text-blue-600" />,
      title: "Purified Drinking Water",
      description:
        "RO water filtration systems installed to provide clean and safe drinking water.",
    },
  ];


  return (
    <div className="relative max-w-[1322px] mx-auto ">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium text-center pb-5 md:pb-7">
        Hostel <span className="text-[#FA8370]">Services & Facilities</span>
      </h2>

      {/* Ellipse 2 */}
      <motion.div
        initial={{ opacity: 0, y: -200 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        viewport={{ once: false }}
        className="absolute top-[279px] -left-[150px] -z-10"
      >
        <img
          src={Ellipse_2}
          alt="image"
          className="w-[320px] sm:w-[500px] md:w-[400px] h-[324px] opacity-70"
        />
      </motion.div>

      <div className="flex justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 px-4 sm:px-6 lg:px-0">
          {
            items.map((item, index) => (
              <Card key={index} index={index} item={item}></Card>
            ))
          }

        </div>
      </div>
      <div className="  flex justify-center py-7 md:py-20 lg:py-7">
        <motion.button
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          whileHover={{ scale: 1.05 }}
          className="font-poppins bg-[#FA8370] text-white hover:bg-blue-100 transition-colors px-8 py-2 rounded-full text-[15px] font-normal hover:text-black"
        >
          More
        </motion.button>
      </div>
    </div>
  );
}

export default Services;
