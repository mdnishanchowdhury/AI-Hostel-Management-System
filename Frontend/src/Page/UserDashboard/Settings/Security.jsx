import React, { useState } from "react";

export default function Security() {
  const [password, setPassword] = useState("********");
  const handleSave = () => alert("Password updated!");

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Security Settings</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-gray-700 dark:text-gray-300 mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-md px-4 py-2 dark:bg-gray-800 dark:text-white dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Update Password
        </button>
      </div>
    </div>
  );
}
