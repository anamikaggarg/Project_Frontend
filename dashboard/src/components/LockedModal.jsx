import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

export default function LockedModal({ isOpen, onClose }) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleViewPlans = () => {
    onClose(); // close modal
    navigate("/dashboard/settings?tab=plans"); // correct route
  };

  return (
    <div className="fixed  inset-0 z-[100] flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-xs"
        onClick={onClose}
      ></div>

      
      <div className="relative bg-white rounded-xl shadow-2xl w-[420px] p-6">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-lg"
        >
          ✕
        </button>

        <div className="flex justify-center mb-4">
          <div className="bg-red-100 p-4 rounded-full">
            <FontAwesomeIcon icon={faLock} className="text-red-500 text-3xl" />
          </div>
        </div>

        <h2 className="text-xl font-semibold text-center mb-2">
          Feature Locked
        </h2>

        <p className="text-gray-600 text-center text-sm mb-6">
          Please upgrade your subscription to unlock this feature.
        </p>

        <div className="flex justify-center">
          <button
            onClick={handleViewPlans}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md transition"
          >
            View Plans
          </button>
        </div>
      </div>
    </div>
  );
}
