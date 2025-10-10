import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import useAxiosSecure from "../../../Hook/useAxiosSecure";
import useAuth from "../../../Hook/useAuth";
import MenuLoading from "../../../Components/Loading/MenuLoading";

function Profile() {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    // Fetch user profile info
    const { data: profile, isLoading, error } = useQuery({
        queryKey: ["profile", user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/users/room?email=${user?.email}`);
            return res.data;
        },
        enabled: !!user?.email,
    });

    if (isLoading)
        return <MenuLoading></MenuLoading>
    if (error)
        return (
            <div className="text-center py-10 text-red-500">
                Error loading profile
            </div>
        );

    return (
        <motion.div
            className="max-w-4xl mx-auto bg-gradient-to-br from-blue-50 via-gray-50 to-gray-100 shadow-lg rounded-2xl p-4 mt-10"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
        >
            {/* Header */}
            <motion.h2
                className="text-3xl font-bold text-gray-800 mb-6 text-center"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                My Profile
            </motion.h2>

            {/* Profile Image */}
            <motion.div
                className="flex flex-col items-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
            >
                <img
                    src={profile?.image || "https://i.ibb.co/3fJ7k4M/avatar.png"}
                    alt="profile"
                    className="w-28 h-28 rounded-full border-4 object-cover border-indigo-200 shadow-md"
                />
                <h3 className="text-xl font-semibold mt-4">{profile?.name || "No name"}</h3>
                <p className="text-gray-600">{profile?.email}</p>
            </motion.div>

            {/* Info Section */}
            <motion.div
                className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4"
                initial="hidden"
                animate="visible"
                variants={{
                    hidden: { opacity: 0 },
                    visible: {
                        opacity: 1,
                        transition: { staggerChildren: 0.2 },
                    },
                }}
            >
                {
                    [
                        { label: "Student ID", value: profile?.studentId },
                        { label: "Department", value: profile?.department },
                        { label: "Phone", value: profile?.phone },
                        { label: "Father's Name", value: profile?.fatherName },
                        { label: "Father's Phone", value: profile?.fatherPhone },
                        { label: "Address", value: profile?.address },
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            className="bg-white shadow-md rounded-lg p-4 border-l-4 border-indigo-400"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.2 + i * 0.15 }}
                        >
                            <p className="text-sm text-gray-500">{item.label}</p>
                            <p className="font-semibold text-gray-800">{item.value || "N/A"}</p>
                        </motion.div>
                    ))
                }
            </motion.div>
        </motion.div>
    );
}

export default Profile;
