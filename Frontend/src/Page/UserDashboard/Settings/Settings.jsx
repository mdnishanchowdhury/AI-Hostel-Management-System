import React, { useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import Account from "./Account";
import Security from "./Security";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("account");

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-10 flex flex-col md:flex-row gap-6">
      
      {/* Sidebar */}
      <div className="md:w-1/4 bg-white dark:bg-gray-900 rounded-xl shadow-md p-5">
        <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-gray-100">Settings</h2>
        <ul className="space-y-4 text-gray-700 dark:text-gray-300">
          <li
            className={`cursor-pointer px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 ${
              activeTab === "account" ? "bg-gray-100 dark:bg-gray-800 font-semibold" : ""
            }`}
            onClick={() => setActiveTab("account")}
          >
            <FaUser className="inline mr-2" /> Account
          </li>
          <li
            className={`cursor-pointer px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 ${
              activeTab === "security" ? "bg-gray-100 dark:bg-gray-800 font-semibold" : ""
            }`}
            onClick={() => setActiveTab("security")}
          >
            <FaLock className="inline mr-2" /> Security
          </li>
        </ul>
      </div>

      {/* Content */}
      <div className="md:w-3/4 bg-white dark:bg-gray-900 rounded-xl shadow-md p-8">
        {activeTab === "account" ? <Account /> : <Security />}
      </div>
    </div>
  );
}
