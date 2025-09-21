import { useState } from "react";
import Step1BasicInfo from "./Step1BasicInfo";
import Step2Preferences from "./Step2Preferences";
import Step3RoomSelect from "./Step3RoomSelect";

function ApplyForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    studentId: "",
    email: "",
    password: "",
    department: "",
    isQuiet: "yes",
    sleepTime: "early",
    studyTime: "day",
    isSmoker: "no",
    cleanliness: "3",
    selectedRoom: "",
  });

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-10">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-gray-800">Hostel Registration</h1>
        <p className="text-gray-500">Step {step} of 3</p>
      </div>

      {step === 1 && (
        <Step1BasicInfo
          formData={formData}
          handleChange={handleChange}
          nextStep={nextStep}
        />
      )}
      {step === 2 && (
        <Step2Preferences
          formData={formData}
          handleChange={handleChange}
          nextStep={nextStep}
          prevStep={prevStep}
        />
      )}
      {step === 3 && (
        <Step3RoomSelect
          formData={formData}
          handleChange={handleChange}
          prevStep={prevStep}
        />
      )}
    </div>
  );
}


export default ApplyForm