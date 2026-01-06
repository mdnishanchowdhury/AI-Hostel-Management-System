import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../Hook/useAxiosSecure";
import MenuLoading from "../../../Components/Loading/MenuLoading";
import { MdDelete } from "react-icons/md";
import { FaUserPlus } from "react-icons/fa";

function AllUsers() {
  const axiosSecure = useAxiosSecure();
  const [filter, setFilter] = useState("user");

  const { data: users = [], refetch, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axiosSecure.get("/users");
      return res.data;
    },
  });

  // Filtered users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => u.role === filter);
  }, [filter, users]);

  const handleDelete = (user) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#dc2626",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axiosSecure.delete(`/users/${user._id}`);
          if (res.data.deletedUser?.deletedCount > 0) {
            refetch();
            Swal.fire("Deleted!", "User removed successfully.", "success");
          }
        } catch {
          Swal.fire("Error!", "Delete failed.", "error");
        }
      }
    });
  };

  if (isLoading) return <MenuLoading />;

  return (
    <div className="md:mt-8 md:px-4 w-full bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 min-h-screen rounded-2xl md:p-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between py-6">
        <h2 className="text-3xl font-bold text-gray-800">
          {filter === "user" ? "Users" : "Admins"} ({filteredUsers.length})
        </h2>
        <Link to="/signUp">
          <button className="flex items-center gap-2 bg-gray-100 text-blue-600 font-medium px-4 py-2 rounded-lg hover:bg-blue-100 transition-all duration-300 shadow-md">
            <FaUserPlus className="text-lg text-blue-600" />
            Create Admin
          </button>
        </Link>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setFilter("user")}
          className={`px-4 py-2 rounded-lg font-medium transition ${filter === "user"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-white/80 text-gray-700 hover:bg-blue-100"
            }`}
        >
          Users
        </button>
        <button
          onClick={() => setFilter("admin")}
          className={`px-4 py-2 rounded-lg font-medium transition ${filter === "admin"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-white/80 text-gray-700 hover:bg-blue-100"
            }`}
        >
          Admins
        </button>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto rounded-xl shadow-lg backdrop-blur-md bg-white/80 border border-gray-200">
        <table className="w-full text-sm text-left">
          <thead className="bg-blue-100 text-gray-700 uppercase text-[13px]">
            <tr>
              <th className="px-6 py-3">#</th>
              <th className="px-6 py-3">User Name</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Role</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, idx) => (
              <tr
                key={user._id}
                className="hover:bg-blue-50 transition-all border-b border-gray-200"
              >
                <td className="px-6 py-4 text-gray-800">{idx + 1}</td>
                <td className="px-6 py-4 font-medium text-gray-800">{user.name}</td>
                <td className="px-6 py-4 text-gray-600">{user.email}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${user.role === "admin"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-green-100 text-green-600"
                      }`}
                  >
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => handleDelete(user)}
                    className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 hover:bg-red-200 transition"
                    title="Delete User"
                  >
                    <MdDelete className="text-red-600" />
                  </button>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-6 text-gray-500 italic">
                  No {filter === "user" ? "users" : "admins"} found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default AllUsers;