import { motion, useScroll, useTransform } from "framer-motion";
import banner1 from "../../assets/Banner/banner.png";
import mobile2 from "../../assets/Banner/mobile.png";
import Ellipse_1 from "../../assets/Banner/Ellipse_1.png";
import Ellipse_2 from "../../assets/Banner/Ellipse 2.png";

function Banner() {
  const { scrollY } = useScroll();

  const ellipse1Opacity = useTransform(scrollY, [0, 400], [1, 0]);
  const ellipse1Y = useTransform(scrollY, [0, 400], [0, 150]);

  const ellipse2Opacity = useTransform(scrollY, [100, 500], [0, 1]);
  const ellipse2Y = useTransform(scrollY, [100, 500], [-150, 0]);

  return (
    <section
      className="relative h-auto md:h-[935px] flex items-center bg-cover bg-center px-3 md:px-6"
      style={{ backgroundImage: `url(${banner1})` }}
    >
      {/*Ellipse_1 */}
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        style={{ opacity: ellipse1Opacity, y: ellipse1Y }}
        className="absolute -top-10 -left-[60px] sm:-top-14 sm:-left-[80px] md:-top-16 md:-left-[120px]"
      >
        <img
          src={Ellipse_1}
          alt="Ellipse 1"
          className="w-[300px] sm:w-[500px] md:w-[733px] h-auto"
        />
      </motion.div>

      {/* Ellipse 2 */}
      <motion.div
        style={{ opacity: ellipse2Opacity, y: ellipse2Y }}
        className="absolute top-[406px] left-[60px] -z-10"
      >
        <img
          src={Ellipse_2}
          alt="Ellipse 2"
          className="w-[320px] sm:w-[500px] md:w-[733px] h-auto opacity-70"
        />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 flex flex-col-reverse md:flex-row items-center md:items-start justify-between w-full max-w-[1322px] mx-auto lg:px-0">

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="flex justify-center md:justify-start w-full md:w-1/2 mb-6"
        >
          <div className="text-black md:text-white text-center md:text-left pt-8 md:pt-[87px] space-y-4 md:space-y-[29px]">
            <h2 className="font-poppins text-3xl sm:text-4xl md:text-5xl  font-bold">
              Welcome to Smarter Hostel Living
            </h2>
            <h1 className="font-poppins text-xl sm:text-2xl md:text-3xl font-normal ">
              We build impactful digital systems for hostels.
            </h1>
            <p className="font-poppins text-[15px] sm:text-base md:text-[18px] font-normal ">
              Needs Better Solutions
            </p>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="font-poppins border-black md:border-[#FFF] border-1 hover:bg-blue-100 transition-colors px-8 py-2 rounded-full text-[15px] font-normal hover:text-black"
            >
              Apply
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-20 md:mt-0 md:mr-11 flex justify-center md:justify-end w-full md:w-1/2"
        >
          <img
            src={mobile2}
            alt="Preview of our mobile app"
            className="w-56 sm:w-72 md:w-96 h-auto"
            loading="lazy"
          />
        </motion.div>
      </div>
    </section>
  );
}

export default Banner;
