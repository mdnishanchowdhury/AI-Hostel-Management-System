import { motion } from "framer-motion";

function LifeHostel() {
    return (
        <section className="w-full  py-6 md:py-20">
            <div className="max-w-[1322px] mx-auto px-6 lg:px-0 flex flex-col lg:flex-row items-start lg:items-center gap-10">

                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    viewport={{ once: true }}
                    className="flex-1 items-center"
                >
                    <h2 className="font-poppins text-2xl md:text-3xl font-semibold mb-4">
                        Life at Hostel
                    </h2>
                    <p className="font-poppins text-[16px] font-normal leading-relaxed">
                        More than a place to stay — our hostel is a vibrant, inclusive, and safe community for students to live, learn, and grow together.
                    </p>
                </motion.div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                        viewport={{ once: true }}
                        className="w-full md:w-[220px] p-6 bg-white shadow-md rounded-md border border-gray-100 flex flex-col justify-center items-center space-y-1"
                    >
                        <img src='https://i.ibb.co.com/HLgZ6Z0N/services.png' alt="" className="w-16 h-16 object-cover" />
                        <h3 className="font-poppins text-xl font-medium">24/7 Security</h3>
                        <p className="font-poppins text-sm md:text-base text-[#A0A0A0] font-normal ">
                            Round-the-clock safety measures so you can live without worry.
                        </p>
                    </motion.div>
                    {/*  Modern Facilities */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
                        viewport={{ once: true }}
                        className="w-full md:w-[220px] p-6 bg-white shadow-md rounded-md border border-gray-100 flex flex-col justify-center items-center space-y-1"
                    >
                        <img src='https://i.ibb.co.com/8ntzs4zR/Screenshot-2025-09-20-150258-removebg-preview.png' alt="" className="w-16 h-16 object-cover" />
                        <h3 className="font-poppins text-xl font-medium">Modern Facilities</h3>
                        <p className="font-poppins text-sm md:text-base text-[#A0A0A0] font-normal r">
                            Enjoy clean, comfortable rooms with all the essentials for a great student life.
                        </p>
                    </motion.div>

                    {/*  Healthy Dining*/}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut", delay: 0.6 }}
                        viewport={{ once: true }}
                        className="col-span-2 md:col-span-1 w-full md:w-[220px] p-6 bg-white shadow-md rounded-md border border-gray-100 flex flex-col justify-center items-center space-y-1"
                    >
                        <img src='https://i.ibb.co.com/xqdpgGCP/Screenshot-2025-09-20-150619-removebg-preview.png' alt="" className="w-16 h-16 object-cover" />
                        <h3 className="font-poppins text-xl font-medium">Healthy Dining</h3>
                        <p className="font-poppins text-sm md:text-base text-[#A0A0A0] font-normal ">
                            Nutritious meals served daily to keep you energized and focused.
                        </p>
                    </motion.div>

                    {/*  24/7 Security */}


                </div>
            </div>
        </section>
    );
}
export default LifeHostel;