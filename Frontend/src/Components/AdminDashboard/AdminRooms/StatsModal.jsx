const StatsModal = ({ type, bookedRooms, vacantRooms, allOccupants, vacantSeatsMap, rooms, onClose }) => (
  
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
    
    <div className="relative w-full max-w-lg max-h-[80vh] overflow-y-auto bg-white/90 rounded-3xl shadow-2xl p-6">
      <h3 className="text-2xl font-semibold text-center mb-4">List of {type}</h3>
     
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {type === "bookedRooms" &&
          bookedRooms.map((room) => (
            <div key={room._id} className="p-2 border rounded-md bg-green-50">
              {room.roomNumber} - {room.hostel}
            </div>
          ))}
        {type === "vacantRooms" &&
          vacantRooms.map((room) => (
            <div key={room._id} className="p-2 border rounded-md bg-blue-50">
              {room.roomNumber} - {room.hostel}
            </div>
          ))}
        {type === "bookedSeats" &&
          allOccupants.map((user) => (
            <div key={user._id} className="p-2 border rounded-md bg-green-50">
              {user.name} - Room {user.roomNumber} - Seat {user.seatNumber}
            </div>
          ))}
        {type === "vacantSeats" &&
          Object.entries(vacantSeatsMap).flatMap(([roomNumber, seats]) =>
            seats.map((seat, idx) => (
              <div key={`${roomNumber}-${idx}`} className="p-2 border rounded-md bg-blue-50">
                Room {roomNumber} - Seat {seat}
              </div>
            ))
          )}
      </div>
      <button
        onClick={onClose}
        className="mt-6 w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition"
      >
        Close
      </button>
    </div>
  </div>
);

export default StatsModal;
