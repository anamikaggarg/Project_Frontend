import { useState } from "react";
import { Lock, KeyRound } from "lucide-react";
import axios from "axios";

export default function PasswordPage() {
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;

  const handleUpdatePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      alert("All fields required");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {

      const res = await axios.post(
        `${API_URL}/institute/update-password`,
        {
          oldPassword,
          newPassword
        },
        {
          withCredentials: true
        }
      );

      alert(res.data.message);

      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowUpdateModal(false);

    } catch (error) {
      alert(error.response?.data?.message || "Error updating password");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-8 h-full w-full">

      <h2 className="text-2xl font-semibold mb-8 text-gray-800 flex items-center gap-2">
        ⚙️ Security Settings
      </h2>

      <div className="grid md:grid-row-2 gap-6">

        <div
          onClick={() => setShowUpdateModal(true)}
          className="group cursor-pointer p-6 rounded-2xl border border-gray-200 hover:border-[#24324F] hover:shadow-lg transition-all duration-300"
        >
          <div className="flex items-center gap-4">
            <div className="bg-[#24324F]/10 p-3 rounded-xl group-hover:bg-[#24324F] transition">
              <Lock className="text-[#24324F] group-hover:text-white" />
            </div>

            <div>
              <h3 className="font-semibold text-lg text-gray-800">
                Update Password
              </h3>
              <p className="text-sm text-gray-500">
                Change your current account password
              </p>
            </div>
          </div>
        </div>

        <div
          onClick={() => setShowForgotModal(true)}
          className="group cursor-pointer p-6 rounded-2xl border border-gray-200 hover:border-[#24324F] hover:shadow-lg transition-all duration-300"
        >
          <div className="flex items-center gap-4">
            <div className="bg-[#24324F]/10 p-3 rounded-xl group-hover:bg-[#24324F] transition">
              <KeyRound className="text-[#24324F] group-hover:text-white" />
            </div>

            <div>
              <h3 className="font-semibold text-lg text-gray-800">
                Forgot Password
              </h3>
              <p className="text-sm text-gray-500">
                Reset your password via email
              </p>
            </div>
          </div>
        </div>

      </div>

      {showUpdateModal && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setShowUpdateModal(false)}
        >
          <div
            className="bg-white w-full max-w-md p-6 rounded-2xl shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-5">
              Update Password
            </h3>

            <div className="space-y-4">
              <input
                type="password"
                placeholder="Old Password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#24324F] outline-none"
              />

              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#24324F] outline-none"
              />

              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#24324F] outline-none"
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowUpdateModal(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdatePassword}
                className="px-4 py-2 bg-[#24324F] text-white rounded-lg hover:bg-slate-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {showForgotModal && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setShowForgotModal(false)}
        >
          <div
            className="bg-white w-full max-w-md p-6 rounded-2xl shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4">
              Forgot Password
            </h3>

            <p className="text-sm text-gray-600 mb-6">
              We will send a password reset link to your registered email.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowForgotModal(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  alert("Reset link sent to your email");
                  setShowForgotModal(false);
                }}
                className="px-4 py-2 bg-[#24324F] text-white rounded-lg hover:bg-slate-700"
              >
                Send Link
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}