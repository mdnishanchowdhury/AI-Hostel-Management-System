import { useState, useEffect } from "react";

function Step1BasicInfo({ formData, handleChange, nextStep, setFormData }) {
  const [uploading, setUploading] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const imgApiKey = import.meta.env.VITE_IMGBB_API_KEY;

  // Image upload handler
  const handleImageUpload = async (e) => {
    const imageFile = e.target.files[0];
    if (!imageFile) return;

    setUploading(true);

    const imageForm = new FormData();
    imageForm.append("image", imageFile);

    try {
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${imgApiKey}`, {
        method: "POST",
        body: imageForm,
      });
      const data = await res.json();
      const imageURL = data.data.display_url;
      setFormData((prev) => ({ ...prev, imageURL }));
    } catch (error) {
      console.error("Image upload failed:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    const requiredFields = [
      "name",
      "studentId",
      "email",
      "department",
      "imageURL"
    ];

    const allFilled = requiredFields.every(
      (field) => formData[field] && formData[field].toString().trim() !== ""
    );

    setIsValid(allFilled);
  }, [formData]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-poppins font-bold text-center text-gray-700 mb-6">
        Step 1: Basic Information
      </h2>

      {/* Student Name */}
      <div className="flex flex-col gap-1">
        <label htmlFor="name" className="font-poppins text-sm font-medium text-gray-600">
          Student Name
        </label>
        <input
          id="name"
          name="name"
          placeholder="Enter your name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-red-400 focus:outline-none"
        />
      </div>

      {/* Student ID */}
      <div className="flex flex-col gap-1">
        <label htmlFor="studentId" className="text-sm font-poppins font-medium text-gray-600">
          Student ID
        </label>
        <input
          id="studentId"
          name="studentId"
          placeholder="Enter your student ID"
          value={formData.studentId}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-red-400 focus:outline-none"
        />
      </div>

      {/* Email */}
      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-sm font-poppins font-medium text-gray-600">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-red-400 focus:outline-none"
        />
      </div>

      {/* Department */}
      <div className="flex flex-col gap-1">
        <label htmlFor="department" className="font-poppins text-sm font-medium text-gray-600">
          Department
        </label>
        <select
          id="department"
          name="department"
          value={formData.department}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-red-400 focus:outline-none"
        >
          <option value="">Select Department</option>
          <option value="CSE">Computer Science & Engineering (CSE)</option>
          <option value="EEE">Electrical & Electronics Engineering (EEE)</option>
          <option value="BBA">Business Administration (BBA)</option>
        </select>
      </div>

      {/* Optional fields */}
      <div className="flex flex-col gap-1">
        <label htmlFor="phone" className="text-sm font-poppins font-medium text-gray-600">
          Phone Number
        </label>
        <input
          id="phone"
          name="phone"
          placeholder="Enter your phone number"
          value={formData.phone}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-red-400 focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="fatherName" className="text-sm font-poppins font-medium text-gray-600">
          Father's Name
        </label>
        <input
          id="fatherName"
          name="fatherName"
          placeholder="Enter father's name"
          value={formData.fatherName}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-red-400 focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="fatherPhone" className="text-sm font-poppins font-medium text-gray-600">
          Father's Phone Number
        </label>
        <input
          id="fatherPhone"
          name="fatherPhone"
          placeholder="Enter father's phone number"
          value={formData.fatherPhone}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-red-400 focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="address" className="text-sm font-poppins font-medium text-gray-600">
          Address
        </label>
        <textarea
          id="address"
          name="address"
          placeholder="Enter full address"
          value={formData.address}
          onChange={handleChange}
          rows={2}
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-red-400 focus:outline-none resize-none"
        />
      </div>

      {/* Upload Photo */}
      <div className="flex flex-col gap-1">
        <label htmlFor="photo" className="text-sm font-poppins font-medium text-gray-600">
          Upload Photo
        </label>
        <input
          id="photo"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="file-input file-input-bordered w-full max-w-xs"
        />
        {uploading && <p className="text-sm text-gray-500 mt-1">Uploading...</p>}
        {formData.imageURL && (
          <img
            src={formData.imageURL}
            alt="Uploaded"
            className="w-24 h-24 rounded-md mt-2 object-cover border"
          />
        )}
      </div>

      {/* Next Button */}
      <div className="pt-4">
        <button
          onClick={nextStep}
          disabled={uploading || !isValid}
          className={`w-full font-poppins text-white font-medium py-2 px-6 rounded-lg transition duration-200 ${
            uploading || !isValid ? "bg-gray-400 cursor-not-allowed" : "bg-[#FA8370] hover:bg-red-600"
          }`}
        >
          {uploading ? "Uploading..." : "Next"}
        </button>
      </div>
    </div>
  );
}

export default Step1BasicInfo;
