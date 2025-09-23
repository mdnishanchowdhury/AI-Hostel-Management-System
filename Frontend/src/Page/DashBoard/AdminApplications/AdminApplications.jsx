import useAxiosSecure from "../../../Hook/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

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
            // await axiosSecure.patch(`/application/${id}`, { action });
            await axiosSecure.patch(`/applications/${id}`, { action });
            await refetch();
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingActionId(null);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-20 w-full">
                <span className="loading loading-spinner loading-xl"></span>
            </div>
        );
    }

    return (
        <div className="w-full mx-auto p-6 bg-white rounded-lg shadow-lg mt-10">
            <h1 className="text-2xl font-bold mb-6">Admin - Hostel Applications</h1>

            {applications.length === 0 ? (
                <p className="text-gray-500">No applications found.</p>
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
                                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded disabled:opacity-50"
                                            disabled={loadingActionId === app._id}
                                        >
                                            Accept
                                        </button>
                                        <button
                                            onClick={() => handleAction(app._id, "rejected")}
                                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded disabled:opacity-50"
                                            disabled={loadingActionId === app._id}
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
