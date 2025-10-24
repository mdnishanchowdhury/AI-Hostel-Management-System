import React from "react";
import { useNavigate } from "react-router-dom";

export default function PaymentCancel() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-yellow-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
        <h1 className="text-4xl font-bold text-yellow-600 mb-4">Payment Cancelled!</h1>
        <p className="text-gray-700 mb-6">
          Your payment has been cancelled. No charges were made.
        </p>
        <button
          onClick={() => navigate("/")}
          className="bg-yellow-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-700 transition"
        >
          Go Back to Payment
        </button>
      </div>
    </div>
  );
}
