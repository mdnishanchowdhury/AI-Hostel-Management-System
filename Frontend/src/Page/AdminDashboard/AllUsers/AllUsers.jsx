import { useQuery } from '@tanstack/react-query';
import { MdDelete } from 'react-icons/md';
import { FaUsers, FaUserPlus } from 'react-icons/fa';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../Hook/useAxiosSecure';
import MenuLoading from '../../../Components/Loading/MenuLoading';
import { Link } from 'react-router-dom';

function AllUsers() {
  const axiosSecure = useAxiosSecure();

  const { data: users = [], refetch, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await axiosSecure.get('/users');
      return res.data;
    }
  });

  if (isLoading) return <MenuLoading />;

  const handleMakeAdmin = async (user) => {
    try {
      const res = await axiosSecure.patch(`/users/admin/${user._id}`);
      if (res.data.modifiedCount > 0) {
        refetch();
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: `${user.name} is now an admin!`,
          showConfirmButton: false,
          timer: 1500
        });
      }
    } catch {
      Swal.fire("Error!", "Something went wrong!", "error");
    }
  };

  const handleDeleted = (user) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
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

  return (
    <div className="mt-8 px-4 w-full">
      {/* Header Section */}
      <div className="flex items-center justify-between flex-wrap mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-2xl shadow-md">
        <h2 className="text-xl md:text-3xl font-semibold tracking-wide uppercase">
          All Users ({users.length})
        </h2>
        <Link to="/signUp">
          <button className="flex items-center gap-2 bg-white text-blue-600 font-medium px-4 py-2 rounded-lg hover:bg-blue-100 transition-all duration-300 shadow">
            <FaUserPlus className="text-lg" />
            Create Admin
          </button>
        </Link>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto rounded-xl shadow-lg backdrop-blur-md bg-white/60 border border-gray-200">
        <table className="w-full text-sm text-left">
          <thead className="bg-gradient-to-r from-green-500/70 to-green-600/70 text-white uppercase text-[13px]">
            <tr>
              <th className="px-6 py-3">#</th>
              <th className="px-6 py-3">User Name</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Role</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, inx) => (
              <tr
                key={user._id}
                className="hover:bg-blue-50 transition-all border-b border-gray-200"
              >
                <td className="px-6 py-4">{inx + 1}</td>
                <td className="px-6 py-4 font-medium text-gray-800">
                  {user.name}
                </td>
                <td className="px-6 py-4 text-gray-600">{user.email}</td>
                <td className="px-6 py-4">
                  {user.role === 'admin' ? (
                    <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-semibold">
                      Admin
                    </span>
                  ) : (
                    <button
                      onClick={() => handleMakeAdmin(user)}
                      className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 hover:bg-green-200 transition"
                    >
                      <FaUsers className="text-green-600" />
                    </button>
                  )}
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => handleDeleted(user)}
                    className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 hover:bg-red-200 transition"
                  >
                    <MdDelete className="text-red-600" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AllUsers;
