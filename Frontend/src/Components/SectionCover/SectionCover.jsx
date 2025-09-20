import { motion } from "framer-motion";

function SectionCover({ subHeading, heading1, heading2 }) {
  return (
    <div className="w-full">
      <div className="flex justify-center">
        <motion.div
          className="px-4 sm:px-8 md:px-16 lg:px-36 xl:px-72 text-center"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-roboto text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-medium">
            <span className="text-[#FA8370]">{heading1}</span> {heading2}
          </h1>
          <motion.p
            className="text-sm sm:text-base md:text-lg lg:text-[18px] font-roboto font-normal mt-2"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {subHeading}
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}

export default SectionCover;
