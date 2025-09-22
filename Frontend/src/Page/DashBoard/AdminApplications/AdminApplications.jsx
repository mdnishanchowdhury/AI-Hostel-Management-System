import { useEffect, useState } from "react";
import useAxiosSecure from "../../../Hook/useAxiosSecure";

function AdminApplications() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const axiosSecure = useAxiosSecure();

    // Fetch all applications (Admin)
    const fetchApplications = async () => {
        try {
            setError("");
            const res = await axiosSecure.get("/applications");
            setApplications(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Something went wrong");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    // Handle Accept / Reject
    const handleAction = async (id, action) => {
        try {
            await axiosSecure.patch(`/application/${id}`, { action });
            // Refresh applications list after action
            fetchApplications();
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Action failed");
        }
    };

    if (loading) return <p>Loading applications...</p>;

    return (
        <div className="w-full mx-auto p-6 bg-white rounded-lg shadow-lg mt-10">
            <h1 className="text-2xl font-bold mb-6">Admin - Hostel Applications</h1>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            {applications.length === 0 ? (
                <p>No applications found.</p>
            ) : (
                <div className="space-y-4">
                    {applications.map((app) => (
                        <div
                            key={app._id}
                            className="p-4 border rounded-lg flex justify-between items-center"
                        >
                            <div>
                                <p><strong>Name:</strong> {app.name}</p>
                                <p><strong>Email:</strong> {app.email}</p>
                                <p><strong>Status:</strong> {app.status}</p>
                            </div>
                            <div className="flex gap-2">
                                {app.status === "pending" ? (
                                    <>
                                        <button
                                            onClick={() => handleAction(app._id, "accepted")}
                                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                                        >
                                            Accept
                                        </button>
                                        <button
                                            onClick={() => handleAction(app._id, "rejected")}
                                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                                        >
                                            Reject
                                        </button>
                                    </>
                                ) : (
                                    <span className="text-gray-500 font-medium">
                                        Already {app.status}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default AdminApplications;
