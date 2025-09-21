function Step1BasicInfo({ formData, handleChange, nextStep }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">
        Step 1: Basic Information
      </h2>

      {/* Student Name */}
      <div className="flex flex-col gap-1">
        <label htmlFor="studentId" className="text-sm font-medium text-gray-600">
          Student Name
        </label>
        <input
          id="name"
          name="name"
          placeholder="Enter your name"
          value={formData.studentId}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          required
        />
      </div>
      {/* Student ID */}
      <div className="flex flex-col gap-1">
        <label htmlFor="studentId" className="text-sm font-medium text-gray-600">
          Student ID
        </label>
        <input
          id="studentId"
          name="studentId"
          placeholder="Enter your student ID"
          value={formData.studentId}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          required
        />
      </div>

      {/* Email */}
      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-sm font-medium text-gray-600">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          required
        />
      </div>

      {/* Department */}
      <div className="flex flex-col gap-1">
        <label htmlFor="department" className="text-sm font-medium text-gray-600">
          Department
        </label>
        <select
          id="department"
          name="department"
          value={formData.department}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          required
        >
          <option value="">Select Department</option>
          <option value="CSE">Computer Science & Engineering (CSE)</option>
          <option value="EEE">Electrical & Electronics Engineering (EEE)</option>
          <option value="BBA">Business Administration (BBA)</option>
        </select>
      </div>

      {/* Phone Number */}
      <div className="flex flex-col gap-1">
        <label htmlFor="phone" className="text-sm font-medium text-gray-600">
          Phone Number
        </label>
        <input
          id="phone"
          name="phone"
          placeholder="Enter your phone number"
          value={formData.phone}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />
      </div>

      {/* Father's Name */}
      <div className="flex flex-col gap-1">
        <label htmlFor="fatherName" className="text-sm font-medium text-gray-600">
          Father's Name
        </label>
        <input
          id="fatherName"
          name="fatherName"
          placeholder="Enter father's name"
          value={formData.fatherName}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />
      </div>

      {/* Father's Phone */}
      <div className="flex flex-col gap-1">
        <label htmlFor="fatherPhone" className="text-sm font-medium text-gray-600">
          Father's Phone Number
        </label>
        <input
          id="fatherPhone"
          name="fatherPhone"
          placeholder="Enter father's phone number"
          value={formData.fatherPhone}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />
      </div>

      {/* Address */}
      <div className="flex flex-col gap-1">
        <label htmlFor="address" className="text-sm font-medium text-gray-600">
          Address
        </label>
        <textarea
          id="address"
          name="address"
          placeholder="Enter full address"
          value={formData.address}
          onChange={handleChange}
          rows={2}
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none resize-none"
        />
      </div>

      {/* Next Button */}
      <div className="pt-4">
        <button
          onClick={nextStep}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Step1BasicInfo;
