import { motion } from "framer-motion";

function Card({ item, index }) {
  return (
    <motion.div
      key={index}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      whileHover={{ scale: 1.05 }}
      className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center text-center cursor-pointer hover:shadow-lg transition-shadow"
    >
      {/* Icon */}
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
        {item.icon}
      </div>

      {/* Title */}
      <h3 className="font-semibold text-lg text-gray-800 mb-2">
        {item.title}
      </h3>

      {/* Description */}
      <p className="text-sm text-gray-600 leading-relaxed">
        {item.description}
      </p>
    </motion.div>
  );
}

export default Card;
