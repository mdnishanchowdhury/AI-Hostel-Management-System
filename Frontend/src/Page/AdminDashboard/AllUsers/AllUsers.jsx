import { useQuery } from '@tanstack/react-query';
import { MdDelete } from 'react-icons/md';
import { FaUsers } from 'react-icons/fa';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../Hook/useAxiosSecure';
import MenuLoading from '../../../Components/Loading/MenuLoading';

function AllUsers() {
  const axiosSecure = useAxiosSecure();

  // fetch users
  const { data: users = [], refetch, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await axiosSecure.get('/users');
      return res.data;
    }
  });

  // Loading state
  if (isLoading) {
    return <MenuLoading></MenuLoading>
  }

  // make admin handler
  const handleMakeAdmin = async (user) => {
    try {
      const res = await axiosSecure.patch(`/users/admin/${user._id}`);
      if (res.data.modifiedCount > 0) {
        refetch();
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: `${user.name} is an admin now!`,
          showConfirmButton: false,
          timer: 1500
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!"
      });
    }
  };

  // delete handler
  const handleDeleted = (user) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axiosSecure.delete(`/users/${user._id}`);
          if (res.data.deletedUser?.deletedCount > 0) {
            refetch();
            Swal.fire("Deleted!", "User has been deleted.", "success");
          } else {
            Swal.fire("Error!", "Delete failed.", "error");
          }
        } catch (err) {
          console.error(err);
          Swal.fire("Error!", "Delete failed.", "error");
        }
      }
    });
  };

  return (
    <div className="mt-3 w-full">
      <h2 className="text-[16px] md:text-3xl font-bold uppercase">
        Total Users: {users.length}
      </h2>

      <div className="overflow-x-auto mt-4">
        <table className="table">
          <thead className="bg-green-600/30 text-black">
            <tr>
              <th>#</th>
              <th>USER NAME</th>
              <th>USER EMAIL</th>
              <th>ROLE</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, inx) => (
              <tr key={user._id}>
                <th>{inx + 1}</th>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <th>
                  {user.role === 'admin' ? (
                    'Admin'
                  ) : (
                    <button
                      onClick={() => handleMakeAdmin(user)}
                      className="btn btn-ghost btn-xs uppercase"
                    >
                      <FaUsers className="w-6 h-6" />
                    </button>
                  )}
                </th>
                <th>
                  <button
                    onClick={() => handleDeleted(user)}
                    className="btn btn-ghost btn-xs uppercase"
                  >
                    <MdDelete className="w-6 h-6" />
                  </button>
                </th>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AllUsers;
