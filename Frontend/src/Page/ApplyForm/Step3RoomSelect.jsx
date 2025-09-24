import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import useAxiosPublic from "../../Hook/useAxiosPublic";
import { MdOutlineStar } from "react-icons/md";

function Step3RoomSelect({ formData, handleChange, prevStep }) {
  const axiosPublic = useAxiosPublic();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [suggestedSeat, setSuggestedSeat] = useState("");
  const [matchPercent, setMatchPercent] = useState(null);
  const [matchWith, setMatchWith] = useState(null);
  const MATCH_THRESHOLD = 50; // % threshold

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        // Fetch rooms
        const res = await axiosPublic.get("/rooms");
        const roomData = res.data.map((room) => ({
          ...room,
          booked: room.booked || [],
          seats: room.capacity.map((seat) => ({
            seatNumber: seat,
            available: !(room.booked || []).includes(seat),
          })),
        }));
        setRooms(roomData);

        // AI suggestion
        const suggestionRes = await axiosPublic.post("/applications/suggest", formData);
        console.log("AI Suggestion Response:", suggestionRes.data);

        if (suggestionRes.data) {
          setSuggestedSeat(suggestionRes.data.suggestedSeat || "");
          setMatchPercent(suggestionRes.data.matchPercent ?? 0);
          setMatchWith(suggestionRes.data.matchWith || "");
        } else {
          setSuggestedSeat("");
          setMatchPercent(null);
          setMatchWith("");
        }
      } catch (error) {
        console.error("Error fetching rooms or AI suggestion:", error);
        setSuggestedSeat("");
        setMatchPercent(null);
        setMatchWith("");
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, [axiosPublic, formData]);

  const handleSubmit = async () => {
    if (!formData.selectedSeat && (matchPercent < MATCH_THRESHOLD || !suggestedSeat)) {
      Swal.fire({
        icon: "warning",
        title: "Please select a seat",
      });
      return;
    }

    const finalSeat =
      formData.selectedSeat || (matchPercent >= MATCH_THRESHOLD ? suggestedSeat : null);

    if (!finalSeat) {
      Swal.fire({
        icon: "warning",
        title: "No valid seat selected",
      });
      return;
    }

    const [roomNumber, seatNumber] = finalSeat.split(/-(?=Bed)/);

    try {
      const res = await axiosPublic.patch("/applications", {
        ...formData,
        selectedSeat: finalSeat,
        selectedRoom: roomNumber,
        roomNumber,
        seatNumber,
        status: "pending",
      });

      if (res.data?.result?.modifiedCount > 0 || res.data?.result?.upsertedId) {
        await axiosPublic.patch(`/rooms/book/${roomNumber}`, { seatNumber });

        setRooms((prevRooms) =>
          prevRooms.map((room) =>
            room.roomNumber === roomNumber
              ? {
                ...room,
                seats: room.seats.map((seat) =>
                  seat.seatNumber === seatNumber
                    ? { ...seat, available: false }
                    : seat
                ),
              }
              : room
          )
        );

        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Your application has been submitted!",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Something went wrong!",
        text: error.response?.data?.message || error.message,
        showConfirmButton: true,
      });
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-poppins font-bold text-center text-gray-700 mb-6">
        Step 3: Room Selection
      </h2>

      {/* AI Suggested Block */}
      {
        matchPercent !== null && (
          <div className="p-4 rounded-lg shadow-sm"
            style={{
              backgroundColor: matchPercent >= MATCH_THRESHOLD ? "#FEF3C7" : "#FEE2E2",
              borderColor: matchPercent >= MATCH_THRESHOLD ? "#FACC15" : "#F87171",
              borderWidth: "1px",
              borderStyle: "solid",
            }}>
            {
              matchPercent >= MATCH_THRESHOLD ? (
                <>
                  <p className="flex flex-row gap-2 items-center text-lg font-poppins font-semibold text-gray-800">
                    <MdOutlineStar className="text-red-600 w-5 h-5 object-cover" />  AI Suggested Seat: {suggestedSeat}
                  </p>
                  <p className="text-sm font-poppins text-gray-700 mt-1">
                    Best match with <span className="font-medium">{matchWith}</span> —
                    Similarity: <span className="font-bold">{matchPercent}%</span>
                  </p>
                  <button
                    onClick={() =>
                      handleChange({
                        target: { name: "selectedSeat", value: suggestedSeat },
                      })
                    }
                    className="mt-3 bg-[#FA8370] font-poppins text-white px-4 py-2 rounded-md hover:bg-red-600"
                  >
                    Accept Suggested Seat
                  </button>
                </>
              ) : (
                <p className="flex flex-row gap-2 items-center text-sm font-poppins text-gray-700">
                  <MdOutlineStar className="text-red-600 w-5 h-5 object-cover" />  No suitable match found (Similarity below {MATCH_THRESHOLD}%)
                </p>
              )
            }
          </div>
        )}

      {/* Manual Room & Seat Dropdown */}
      <div className="flex flex-col gap-1">
        <label htmlFor="selectedSeat" className="text-sm font-poppins font-medium text-gray-600">
          Or choose manually
        </label>
        {
          loading ? (
            <p className="text-gray-500 font-poppins">Loading rooms...</p>
          ) : (
            <select
              id="selectedSeat"
              name="selectedSeat"
              value={formData.selectedSeat}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-red-400 focus:outline-none"
            >
              <option value="">Select a seat</option>
              {
                rooms.map((room) => (
                  <optgroup
                    key={room.roomNumber}
                    label={`${room.roomNumber} (${room.hostel})`}
                  >
                    {
                      room.seats.map((seat) => (
                        <option
                          key={seat.seatNumber}
                          value={`${room.roomNumber}-${seat.seatNumber}`}
                          disabled={!seat.available}
                        >
                          {seat.seatNumber} {seat.available ? "" : "(Booked)"}
                        </option>
                      ))
                    }
                  </optgroup>
                ))
              }
            </select>
          )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <button
          onClick={prevStep}
          className="bg-gray-300 text-black px-5 py-2 rounded-md hover:bg-gray-400"
        >
          Back
        </button>
        <button
          onClick={handleSubmit}
          className="bg-[#FA8370] font-poppins text-white px-6 py-2 rounded-md hover:bg-red-600"
        >
          Submit
        </button>
      </div>
    </div>
  );
}
export default Step3RoomSelect;
