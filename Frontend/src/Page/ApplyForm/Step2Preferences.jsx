function Step2Preferences({ formData, handleChange, nextStep, prevStep }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Step 2: Roommate Preferences</h2>

      {/* Quiet or Not */}
      <div className="flex flex-col gap-1">
        <label htmlFor="isQuiet" className="text-sm font-medium text-gray-600">
          Do you prefer a quiet roommate?
        </label>
        <select
          id="isQuiet"
          name="isQuiet"
          value={formData.isQuiet}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
        >
          <option value="yes">Yes (Quiet)</option>
          <option value="no">No (Doesn’t matter)</option>
        </select>
      </div>

      {/* Sleep Time (Manual Input) */}
      <div className="flex flex-col gap-1">
        <label htmlFor="sleepTime" className="text-sm font-medium text-gray-600">
          What time do you usually sleep?
        </label>
        <input
          type="time"
          id="sleepTime"
          name="sleepTime"
          value={formData.sleepTime}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />
      </div>

      {/* Study Time (Manual Input) */}
      <div className="flex flex-col gap-1">
        <label htmlFor="studyTime" className="text-sm font-medium text-gray-600">
          When do you prefer to study?
        </label>
        <input
          type="time"
          id="studyTime"
          name="studyTime"
          value={formData.studyTime}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />
      </div>

      {/* Smoker or not */}
      <div className="flex flex-col gap-1">
        <label htmlFor="isSmoker" className="text-sm font-medium text-gray-600">
          Do you smoke?
        </label>
        <select
          id="isSmoker"
          name="isSmoker"
          value={formData.isSmoker}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
        >
          <option value="no">No</option>
          <option value="yes">Yes</option>
        </select>
      </div>

      {/* Cleanliness */}
      <div className="flex flex-col gap-1">
        <label htmlFor="cleanliness" className="text-sm font-medium text-gray-600">
          Cleanliness (1 = Low, 5 = Very Clean)
        </label>
        <input
          id="cleanliness"
          type="number"
          name="cleanliness"
          min="1"
          max="5"
          value={formData.cleanliness}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />
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
          onClick={nextStep}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Step2Preferences;
