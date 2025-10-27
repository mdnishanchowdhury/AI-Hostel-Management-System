const RoomOccupantsModal = ({ roomNumber, occupants, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

    <div className="relative w-full max-w-lg max-h-[80vh] overflow-y-auto bg-white/90 rounded-3xl shadow-2xl p-6">
      <h3 className="text-2xl font-semibold text-center mb-4">Occupants of {roomNumber}</h3>
      {
        occupants.length > 0 ? (
          <div className="space-y-3">
            {
              occupants.map((user, idx) => (
                <div key={idx} className="bg-gray-50 p-3 rounded-xl border hover:bg-gray-100 transition">
                  <p><b>Name:</b> {user.name}</p>
                  <p><b>Student ID:</b> {user.studentId}</p>
                  <p><b>Email:</b> {user.email}</p>
                  <p><b>Seat Number:</b> {user.seatNumber}</p>
                </div>
              ))
            }
          </div>
        ) : (
          <p className="text-center text-gray-500">No one has booked this room yet.</p>
        )
      }

      <button
        onClick={onClose}
        className="mt-6 w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition"
      >
        Close
      </button>
    </div>
  </div>
);

export default RoomOccupantsModal;
