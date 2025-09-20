import { motion } from "framer-motion";

export default function FeesDetails() {
  const hostelCharges = [
    { label: "Room Rent (Per Month)", amount: "৳ 4,500" },
    { label: "Meal / Food Cost", amount: "৳ 3,500" },
  ];

  const otherFees = [
    { label: "Booking Advance (Non-refundable)", amount: "৳ 5,000" },
  ];

  return (
    <motion.div
      className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#089cc2] mb-12 text-center">
        Hostel Fees Breakdown
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 text-gray-700">
        {/* Hostel Charges */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-6">
            Hostel Charges
          </h3>
          <ul className="space-y-4">
            {hostelCharges.map(({ label, amount }) => (
              <motion.li
                key={label}
                className="flex justify-between border-b border-gray-300 pb-2 hover:bg-white/10 rounded transition-colors duration-300 px-2 py-1"
              >
                <span>{label}</span>
                <span>{amount}</span>
              </motion.li>
            ))}
            <li className="flex justify-between border-b border-gray-400 pb-2 font-semibold text-lg">
              <span>Total Monthly Hostel Fee</span>
              <span>৳ 7,500</span>
            </li>
          </ul>
        </motion.div>

        {/* Other Fees */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-6">
            Other Fees
          </h3>
          <ul className="space-y-4">
            {otherFees.map(({ label, amount }) => (
              <motion.li
                key={label}
                className="flex justify-between border-b border-gray-300 pb-2 hover:bg-white/10 rounded transition-colors duration-300 px-2 py-1"
              >
                <span>{label}</span>
                <span>{amount}</span>
              </motion.li>
            ))}
            <li className="flex justify-between border-b border-gray-400 pb-2 font-bold text-green-700 text-lg">
              <span>Total Initial Payable</span>
              <span>৳ 12,500</span>
            </li>
          </ul>
        </motion.div>
      </div>

      <motion.div
        className="mt-12 text-sm sm:text-base text-gray-600 leading-relaxed max-w-3xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        <p className="mb-2">
          <strong>Note:</strong> Monthly fees must be paid by the 5th of each month.
        </p>
        <p>
          Booking fee is a one-time payment during admission. Meal service includes 3 daily meals.
        </p>
      </motion.div>
    </motion.div>
  );
}
