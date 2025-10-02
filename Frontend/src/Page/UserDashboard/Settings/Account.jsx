import { useState } from "react";
import { FaTrash } from "react-icons/fa";
import { deleteUser, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import useAuth from "../../../Hook/useAuth";
import Swal from "sweetalert2";

export default function Account() {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [password, setPassword] = useState("");
    const { user } = useAuth();
    const [accountInfo, setAccountInfo] = useState({
        fullName: "John Doe",
        email: "john@example.com",
    });

    // Input change
    const handleChange = (e) =>
        setAccountInfo({ ...accountInfo, [e.target.name]: e.target.value });

    const handleSave = () => {
        alert("Account info saved!");
    };

    // Firebase delete
    const handleDelete = async () => {
        if (!password) {
            alert("Please enter your password to confirm.");
            return;
        }

        try {
            const credential = EmailAuthProvider.credential(user.email, password);
            await reauthenticateWithCredential(user, credential);
            await deleteUser(user);
            Swal.fire({
                title: "Account deleted successfully",
                icon: "success",
                draggable: true
            });
        } catch (error) {
            console.error(error);
            Swal.fire({
                title: "Error",
                text: error.message,
                icon: "error",
                draggable: true
            });
        }
    };

    return (
        <div className="space-y-6 max-w-2xl mx-auto p-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                Account Information
            </h2>

            <div className="space-y-4">
                <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                    <input
                        type="text"
                        name="fullName"
                        value={accountInfo.fullName}
                        onChange={handleChange}
                        className="w-full border rounded-md px-4 py-2 dark:bg-gray-800 dark:text-white dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-1">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={accountInfo.email}
                        onChange={handleChange}
                        className="w-full border rounded-md px-4 py-2 dark:bg-gray-800 dark:text-white dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <button
                    onClick={handleSave}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                    Save Changes
                </button>
            </div>

            {/* Danger Zone */}
            <div className="mt-10 border-t pt-6">
                <h3 className="text-red-600 font-semibold mb-2">Danger Zone</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-3">
                    Deleting your account is irreversible.
                </p>
                <button
                    onClick={() => setShowDeleteModal(true)}
                    className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition flex items-center gap-2"
                >
                    <FaTrash /> Delete Account
                </button>
            </div>

            {/* Delete Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white dark:bg-gray-900 rounded-xl p-8 max-w-md w-full shadow-lg">
                        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">Confirm Delete</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            Please enter your password to confirm account deletion.
                        </p>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            className="w-full border rounded-md px-4 py-2 mb-6 dark:bg-gray-800 dark:text-white dark:border-gray-700 focus:ring-2 focus:ring-red-500"
                        />
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4 py-2 rounded-md border border-gray-400 hover:bg-gray-100 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
