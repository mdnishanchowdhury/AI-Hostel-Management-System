import useAxiosSecure from "../../../Hook/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import MenuLoading from "../../../Components/Loading/MenuLoading";
import { motion } from "framer-motion";

function AdminApplications() {
  const axiosSecure = useAxiosSecure();
  const [loadingActionId, setLoadingActionId] = useState(null);

  // Fetch applications
  const { data: applications = [], refetch, isLoading } = useQuery({
    queryKey: ['applications'],
    queryFn: async () => {
      const res = await axiosSecure.get('/applications');
      return res.data;
    }
  });

  // Handle Accept / Reject
  const handleAction = async (id, action) => {
    try {
      setLoadingActionId(id);
      await axiosSecure.patch(`/applications/${id}`, { action });
      await refetch();
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingActionId(null);
    }
  };

  if (isLoading) return <MenuLoading />;

  return (
    <div className="w-full mx-auto p-6 mt-10 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen rounded-xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-indigo-700 tracking-wide">Hostel Applications</h1>
        <p className="text-gray-600 font-medium">
          Total Applications:{" "}
          <span className="text-indigo-600 font-semibold">{applications.length}</span>
        </p>
      </div>

      {applications.length === 0 ? (
        <div className="flex items-center justify-center h-[200px]">
          <p className="text-gray-500 text-lg">No applications found.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {applications.map((app) => (
            <motion.div
              key={app._id}
              whileHover={{ scale: 1.03 }}
              className="bg-white rounded-2xl shadow-lg p-5 border border-gray-200 hover:shadow-xl transition-all duration-300"
            >
              <div className="mb-3">
                <h2 className="text-lg font-semibold text-gray-800">{app.name}</h2>
                <p className="text-gray-600 text-sm">{app.email}</p>
              </div>

              <div className="flex items-center justify-between mt-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    app.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : app.status === "accepted"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {app.status.toUpperCase()}
                </span>

                {app.status === "pending" ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAction(app._id, "accepted")}
                      className={`px-4 py-1.5 rounded-lg text-white bg-green-600 hover:bg-green-700 transition disabled:opacity-50`}
                      disabled={loadingActionId === app._id}
                    >
                      {loadingActionId === app._id ? "..." : "Accept"}
                    </button>
                    <button
                      onClick={() => handleAction(app._id, "rejected")}
                      className={`px-4 py-1.5 rounded-lg text-white bg-red-600 hover:bg-red-700 transition disabled:opacity-50`}
                      disabled={loadingActionId === app._id}
                    >
                      {loadingActionId === app._id ? "..." : "Reject"}
                    </button>
                  </div>
                ) : (
                  <span className="text-sm text-gray-500 font-medium">
                    ✅ Already {app.status}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminApplications;
