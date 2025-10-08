import { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../Hook/useAuth";

function Security() {
  const { user, userPasswordReset, userLogOut } = useAuth();
  const navigate = useNavigate();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = async () => {
    const oldPass = oldPassword.trim();
    const newPass = newPassword.trim();
    const confirmPass = confirmPassword.trim();

    if (!oldPass || !newPass || !confirmPass) {
      return Swal.fire("Warning", "Please fill all fields.", "warning");
    }

    if (newPass !== confirmPass) {
      return Swal.fire("Warning", "New password and confirm password do not match.", "warning");
    }

    if (!user?.email) {
      return Swal.fire("Error", "No user is currently logged in.", "error");
    }
    setLoading(true); 

    try {
      await userPasswordReset(oldPass, newPass);

      Swal.fire("Success", "Password updated successfully! Please log in again.", "success");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");

      await userLogOut();
      navigate("/login");
    } catch (error) {
      Swal.fire("Error", error.message || "Password update failed.", "error");
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 p-6 rounded-md shadow">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
        Change Password
      </h2>

      <div className="space-y-4">
        <input
          type="password"
          placeholder="Old Password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
        />

        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
        />
        <input
          type="password"
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
        />

        {/* Button */}
        <button
          onClick={handlePasswordChange}
          disabled={loading}
          className="w-full px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Updating..." : "Set Password"}
        </button>
      </div>
    </div>
  );
}
export default Security;