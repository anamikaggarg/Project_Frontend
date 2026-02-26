import React from "react";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

export default function Header({ open, setOpen }) {
  const instituteRedux = useSelector((state) => state.Institute.currentInstitute);

  const planName = instituteRedux?.currentPlan || "Trial";
  
  
  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return new Date(dateStr).toLocaleDateString("en-IN", options);
  };

  const planStart = formatDate(instituteRedux?.planStartDate);
  const planEnd = formatDate(instituteRedux?.planEndDate);

  return (
    <header className="flex items-center justify-between p-4 bg-white shadow">
      
      {/* Left side: toggle + plan info */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => setOpen(!open)}
          className="text-gray-600 p-2 hover:bg-gray-100 rounded transition"
        >
          <FontAwesomeIcon icon={faBars} size="lg" />
        </button>

        <div className="flex flex-col">
          <span className="text-sm font-semibold text-blue-600">
            {planName}
          </span>
          <span className="text-xs text-gray-500">
            {planStart} - {planEnd}
          </span>
        </div>
      </div>

      {/* Right side: title */}
      <h1 className="text-xl font-semibold">Dashboard</h1>
    </header>
  );
}