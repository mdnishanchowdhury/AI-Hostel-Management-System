import useAxiosSecure from "../../Hook/useAxiosSecure";
import Swal from 'sweetalert2'
function Step3RoomSelect({ formData, handleChange, prevStep }) {
  const axiosSecure = useAxiosSecure();

  const handleSubmit = async () => {
    try {
      // const res = await axiosSecure.post('/application', formData);
      const res = await axiosSecure.post('/applications', formData);

      if (res.data && res.data.insertedId) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Your application has been submitted!",
          showConfirmButton: false,
          timer: 1500
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Something went wrong!",
        text: error.response?.data?.message || error.message,
        showConfirmButton: true
      });
    }
  };


  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Step 3: Room Selection</h2>

      {/* Simulated AI suggestion */}
      <div className="bg-green-50 border border-green-400 text-green-700 px-4 py-3 rounded">
        <p><strong>Suggested Room:</strong> Room-204, Hostel-A (Based on your preferences)</p>
      </div>

      {/* Room Dropdown */}
      <div className="flex flex-col gap-1">
        <label htmlFor="selectedRoom" className="text-sm font-medium text-gray-600">Choose a Room</label>
        <select
          id="selectedRoom"
          name="selectedRoom"
          value={formData.selectedRoom}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          required
        >
          <option value="">Select a Room</option>
          <option value="Room-204">Room-204 (Suggested)</option>
          <option value="Room-301">Room-301</option>
          <option value="Room-101">Room-101</option>
        </select>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-4">
        <button
          onClick={prevStep}
          className="bg-gray-300 text-black px-5 py-2 rounded-md hover:bg-gray-400"
        >
          Back
        </button>
        <button
          onClick={handleSubmit}
          className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
        >
          Submit
        </button>
      </div>
    </div>
  );
}

export default Step3RoomSelect;
