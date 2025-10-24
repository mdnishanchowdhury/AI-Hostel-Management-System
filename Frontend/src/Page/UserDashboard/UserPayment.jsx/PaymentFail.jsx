import React from "react";
import { useNavigate } from "react-router-dom";

export default function PaymentFail() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-sm">
        <h1 className="text-4xl font-bold text-red-600 mb-4">Payment Failed!</h1>
        <p className="text-gray-700 mb-6" aria-live="polite">
          Oops! Something went wrong with your payment. Please try again.
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate("/")}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
          >
            Try Again
          </button>
          <a
            href="mailto:support@example.com"
            className="text-red-600 underline hover:text-red-800"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}
