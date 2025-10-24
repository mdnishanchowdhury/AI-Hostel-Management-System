import useAxiosPublic from "../../Hook/useAxiosPublic";

function Step2Preferences({ formData, handleChange, nextStep, prevStep }) {
  const axiosPublic = useAxiosPublic();

  const handleSubmit = async () => {
    try {
      const res = await axiosPublic.post('/applications', formData);
      console.log('Next form data submitted:', res.data);
      nextStep(); 
    } catch (err) {
      console.error('Error submitting preferences:', err);
      alert('Failed to submit preferences. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center font-poppins text-gray-700 mb-6">
        Step 2: Roommate Preferences
      </h2>

      {/* Preferred Study Time */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-poppins font-medium text-gray-600">
          Preferred Study Time
        </label>
        <select
          name="rateStudyTime"
          value={formData.rateStudyTime}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-red-400 focus:outline-none"
        >
          <option value="">Select Time</option>
          <option value="morning">Morning</option>
          <option value="afternoon">Afternoon</option>
          <option value="evening">Evening</option>
          <option value="night">Night</option>
        </select>
      </div>

      {/* Morning Study Time */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-poppins font-medium text-gray-600">
          Morning Study Time
        </label>
        <div className="flex gap-2">
          <input
            type="time"
            name="morningStudyStart"
            value={formData.morningStudyStart}
            onChange={handleChange}
            className="w-1/2 border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-red-400 focus:outline-none"
          />
          <input
            type="time"
            name="morningStudyEnd"
            value={formData.morningStudyEnd}
            onChange={handleChange}
            className="w-1/2 border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-red-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Night Study Time */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-poppins font-medium text-gray-600">
          Night Study Time
        </label>
        <div className="flex gap-2">
          <input
            type="time"
            name="nightStudyStart"
            value={formData.nightStudyStart}
            onChange={handleChange}
            className="w-1/2 border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-red-400 focus:outline-none"
          />
          <input
            type="time"
            name="nightStudyEnd"
            value={formData.nightStudyEnd}
            onChange={handleChange}
            className="w-1/2 border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-red-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Night Sleep Time */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-poppins font-medium text-gray-600">
          Night Sleep Time
        </label>
        <div className="flex gap-2">
          <input
            type="time"
            name="nightSleepStart"
            value={formData.nightSleepStart}
            onChange={handleChange}
            className="w-1/2 border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-red-400 focus:outline-none"
          />
          <input
            type="time"
            name="nightSleepEnd"
            value={formData.nightSleepEnd}
            onChange={handleChange}
            className="w-1/2 border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-red-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Cleaning Preference */}
      <div className="flex flex-col gap-1">
        <label htmlFor="cleaningPreference" className="text-sm font-poppins font-medium text-gray-600">
          Cleaning Preference
        </label>
        <select
          id="cleaningPreference"
          name="cleaningPreference"
          value={formData.cleaningPreference}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-red-400 focus:outline-none"
        >
          <option value="">Select</option>
          <option value="always">Always clean after use</option>
          <option value="weekly">Clean weekly</option>
          <option value="none">No specific preference</option>
        </select>
      </div>

      {/* Noise Sensitivity */}
      <div className="flex flex-col gap-1">
        <label htmlFor="noiseSensitivity" className="text-sm font-poppins font-medium text-gray-600">
          Noise Sensitivity
        </label>
        <select
          id="noiseSensitivity"
          name="noiseSensitivity"
          value={formData.noiseSensitivity}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-red-400 focus:outline-none"
        >
          <option value="">Select</option>
          <option value="low">Low (can tolerate noise)</option>
          <option value="medium">Medium</option>
          <option value="high">High (very sensitive to noise)</option>
        </select>
      </div>

      {/* Smoking Habit */}
      <div className="flex flex-col gap-1">
        <label htmlFor="isSmoker" className="text-sm font-poppins font-medium text-gray-600">
          Smoking Habit
        </label>
        <select
          id="isSmoker"
          name="isSmoker"
          value={formData.isSmoker}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-red-400 focus:outline-none"
        >
          <option value="">Select</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
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
          className="bg-[#FA8370] font-poppins text-white px-6 py-2 rounded-md hover:bg-red-600"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Step2Preferences;
