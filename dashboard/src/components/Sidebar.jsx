import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse, faMoneyBillWave, faFileAlt, faGear, faPowerOff,
  faSchool, faChevronDown, faChevronUp, faLock, faXmark
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import LockedModal from "./LockedModal";

export default function Sidebar({ open, setOpen }) {
  const navigate = useNavigate();
  const storedInstitute = JSON.parse(localStorage.getItem("institute"));
  const BASE_URL = import.meta.env.VITE_API_URL;

  const [institute, setInstitute] = useState(
    storedInstitute || { email: "", logo: "/default-logo.png", plan: "" }
  );

  // const [plans, setPlans] = useState([]);
  const [openAcademics, setOpenAcademics] = useState(false);
  const [openFinance, setOpenFinance] = useState(false);
  const [openReports, setOpenReports] = useState(false);
  const [showLockedModal, setShowLockedModal] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("institute");
    navigate("/login");
  };console.log(institute);


  const handleNav = (path) => {
    navigate(path);
    if (window.innerWidth < 1024) setOpen(false);
  };
  console.log("PlanStatus:", institute.planStatus);
console.log("Features:", institute.customFeatures);

  useEffect(() => {
    if (!storedInstitute?.email) return;
    const fetchInstitute = async () => {
      try {
        const res = await axios.get(
           `${BASE_URL}/institute/by-email/${storedInstitute.email}`,
        );
        const logoUrl = res.data.logo ? (res.data.logo.startsWith("http") ? res.data.logo : `${res.data.logo}`) : "/default-logo.png";
        const updatedInstitute = { ...res.data, logo: logoUrl };
        setInstitute(updatedInstitute);
        localStorage.setItem("institute", JSON.stringify(updatedInstitute));
      } catch (error) { console.error("Failed to fetch institute:", error); }
    };
    fetchInstitute();
  }, [storedInstitute?.email]);

  // useEffect(() => {
  //   const fetchPlans = async () => {
  //     try {
  //       const { data } = await axios.get(`${BASE_URL}/plans/allPlans`,
  //       );
  //       setPlans(data.plans || []);
  //     } catch (err) { console.error("Failed to fetch plans:", err); }
  //   };
  //   fetchPlans();
  // }, []);

  // const currentPlan = plans.find((p) => p.name?.toLowerCase() === institute.currentPlan?.toLowerCase()) || plans.find((p) => p.name?.toLowerCase().includes("trial"));

const checkFeatureAccess = (path) => {
  if (!institute?.customFeatures) return false;

  if (institute.planStatus !== "active") return false;

  if (
    institute.planEndDate &&
    new Date(institute.planEndDate) < new Date()
  ) {
    return false;
  }

  const keys = path.split(".");
  let value = institute.customFeatures;

  for (let key of keys) {
    if (
      value &&
      typeof value === "object" &&
      Object.prototype.hasOwnProperty.call(value, key)
    ) {
      value = value[key];
    } else {
      return false;
    }
  }

  return value === true;
};
console.log(
  "Student Feature:",
  checkFeatureAccess("academic.studentInfo")
);

  return (
    <>
      {/* Mobile Backdrop */}
      {open && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setOpen(false)} />
      )}

      <aside className={`fixed left-0 top-0 z-50 w-64 h-screen bg-[#24324f] text-white flex flex-col transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        {/* Profile Section */}
        <div className="flex flex-col items-center py-6 border-b border-slate-700 relative">
          <button className="lg:hidden absolute right-4 top-4" onClick={() => setOpen(false)}>
            <FontAwesomeIcon icon={faXmark} />
          </button>
          <img src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOQpyCWXaTTBC203h2MvPZz7Cer2RxQr0Ktg&s"} alt="Profile" className="w-24 h-24 rounded-full border-2 border-white shadow bg-white" />
          <h2 className="mt-3 text-xl font-semibold text-center px-2">{institute.name}</h2>
          <p className="text-sm text-slate-300">{institute.email}</p>
          <p className="text-xs text-yellow-400 mt-1 uppercase">Plan: {institute.currentPlan || "Trial"}</p>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 mt-4 px-3 space-y-1 text-sm overflow-y-auto">
          <div className="px-3 py-2 rounded-md bg-[#3b5c92] flex items-center gap-2 cursor-pointer" onClick={() => handleNav("/dashboard")}>
            <FontAwesomeIcon icon={faHouse} /> <span>Dashboard</span>
          </div>

          {/* Academics */}
          <div>
            <div className="px-3 py-2 rounded-md hover:bg-slate-700 flex items-center justify-between cursor-pointer" onClick={() => setOpenAcademics(!openAcademics)}>
              <div className="flex items-center gap-2"><FontAwesomeIcon icon={faSchool} /><span>Academics</span></div>
              <FontAwesomeIcon icon={openAcademics ? faChevronUp : faChevronDown} />
            </div>
            {openAcademics && (
              <div className="ml-8 mt-1 space-y-1 border-l border-slate-600 pl-2">
                <div onClick={() => { if (!checkFeatureAccess("academic.studentInfo")) setShowLockedModal(true); else handleNav("/dashboard/students"); }} className="px-3 py-2 rounded-md flex items-center justify-between cursor-pointer hover:bg-slate-700">
                  <span>Manage Students</span>
                  {!checkFeatureAccess("academic.studentInfo") && <FontAwesomeIcon icon={faLock} />}
                </div>
                <div onClick={() => { if (!checkFeatureAccess("academic.classrooms")) setShowLockedModal(true); else handleNav("/dashboard/courses"); }} className="px-3 py-2 rounded-md flex items-center justify-between cursor-pointer hover:bg-slate-700">
                  <span>Manage Courses</span>
                  {!checkFeatureAccess("academic.classrooms") && <FontAwesomeIcon icon={faLock} />}
                </div>
              </div>
            )}
          </div>

          {/* Finance */}
          <div>
            <div className="px-3 py-2 rounded-md hover:bg-slate-700 flex items-center justify-between cursor-pointer" onClick={() => setOpenFinance(!openFinance)}>
              <div className="flex items-center gap-2"><FontAwesomeIcon icon={faMoneyBillWave} /><span>Finance</span></div>
              <FontAwesomeIcon icon={openFinance ? faChevronUp : faChevronDown} />
            </div>
            {openFinance && (
              <div className="ml-8 mt-1 space-y-1 border-l border-slate-600 pl-2">
                <div onClick={() => { if (!checkFeatureAccess("academic.exam")) setShowLockedModal(true); else handleNav("/dashboard/finance"); }} className="px-3 py-2 rounded-md flex items-center justify-between cursor-pointer hover:bg-slate-700">
                  <span>Fee Management</span>
                  {!checkFeatureAccess("academic.exam") && <FontAwesomeIcon icon={faLock} />}
                </div>
              </div>
            )}
          </div>

          {/* Reports */}
          <div>
            <div className="px-3 py-2 rounded-md hover:bg-slate-700 flex items-center justify-between cursor-pointer" onClick={() => setOpenReports(!openReports)}>
              <div className="flex items-center gap-2"><FontAwesomeIcon icon={faFileAlt} /><span>Reports</span></div>
              <FontAwesomeIcon icon={openReports ? faChevronUp : faChevronDown} />
            </div>
            {openReports && (
              <div className="ml-8 mt-1 space-y-1 border-l border-slate-600 pl-2">
                <div onClick={() => { if (!checkFeatureAccess("reports.studentsReport")) setShowLockedModal(true); else handleNav("/dashboard/reports/students"); }} className="px-3 py-2 rounded-md flex items-center justify-between cursor-pointer hover:bg-slate-700">
                  <span>Student Reports</span>
                  {!checkFeatureAccess("reports.studentsReport") && <FontAwesomeIcon icon={faLock} />}
                </div>
              </div>
            )}
          </div>

          <div className="px-3 py-2 rounded-md hover:bg-slate-700 flex items-center gap-2 cursor-pointer" onClick={() => handleNav("/dashboard/settings")}>
            <FontAwesomeIcon icon={faGear} /> <span>Settings</span>
          </div>
        </nav>

        {/* Logout Section */}
        <div className="px-4 py-4 border-t border-slate-700 bg-[#1a253a]">
          <button onClick={handleLogout} className="w-full py-2 rounded-md bg-red-500 hover:bg-red-600 text-sm font-bold flex items-center justify-center gap-2">
            <FontAwesomeIcon icon={faPowerOff} /> Logout
          </button>
        </div>
      </aside>

      <LockedModal isOpen={showLockedModal} onClose={() => setShowLockedModal(false)} />
    </>
  );
}