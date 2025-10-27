import MenuLoading from "../../Loading/MenuLoading";
import IconButton from "./IconButton";
import { MdDelete, MdVisibility } from "react-icons/md";

const RoomsTable = ({ rooms, onView, onDelete, loading }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <MenuLoading></MenuLoading>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white/80 border border-gray-200 rounded-xl shadow-sm mt-6">
      <table className="w-full text-sm text-left border-collapse">
        <thead className="bg-blue-100 text-gray-700">
          <tr>
            <th className="p-3 font-semibold">Room Number</th>
            <th className="p-3 font-semibold">Hostel</th>
            <th className="p-3 font-semibold">Capacity</th>
            <th className="p-3 pl-8 text-center flex gap-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {rooms.length > 0 ? (
            rooms.map((room) => (
              <tr key={room._id} className="border-b hover:bg-blue-50 transition">
                <td className="p-3 font-medium text-gray-800">{room.roomNumber}</td>
                <td className="p-3 text-gray-700">{room.hostel}</td>
                <td className="p-3 text-gray-700">{room.capacity.join(", ")}</td>
                <td className="p-3 text-center flex gap-2">
                  <IconButton icon={MdVisibility} onClick={() => onView(room.roomNumber)} title="View Occupants" />
                  <IconButton
                    icon={MdDelete}
                    onClick={() => onDelete(room._id)}
                    bg="bg-red-100"
                    hover="hover:bg-red-200"
                    color="text-red-600"
                    title="Delete Room"
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="p-6 text-center text-gray-500 italic">
                No rooms available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RoomsTable;
