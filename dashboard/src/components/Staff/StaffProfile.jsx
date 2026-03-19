import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  ChevronRight, MoreVertical, FileText, Plus, 
  User, Loader2, CheckCircle2, ChevronUp, ChevronDown, Edit2, MapPin 
} from "lucide-react";

// Reusable Sub-component for data items
function InfoItem({ label, value }) {
  return (
    <div className="space-y-1">
      <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">{label}</p>
      <p className="text-sm font-bold text-slate-700">{value || "-"}</p>
    </div>
  );
}

export default function StaffProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState(null);
  // const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  // const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploadingDoc, setUploadingDoc] = useState(null);
  
  const [activeTab, setActiveTab] = useState("personal");
  const [showFullInfo, setShowFullInfo] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    basic: true, // Default open rakha hai taaki user ko dikhe
    address: true,
  });

  const API_BASE = import.meta.env.VITE_API_URL;

  const fetchMember = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/api/staff/getStaffByEmpId/${id}`);
      if (res.data.success) {
        setMember(res.data.staff);
      }
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchMember();
  }, [id]);

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // --- EDIT LOGIC ---
  const handleEdit = () => {
    // 1. Current member ka data edit state mein daalein
    // setEditData(member); 
    // 2. Modal open karein
    // setIsEditModalOpen(true);
    // console.log(`Opening edit modal for ${section}`);
  };

  const handleFileUpload = async (e, docName) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("document", file);
    formData.append("docType", docName);
    formData.append("employeeId", id);

    try {
      setUploadingDoc(docName);
      const res = await axios.post(`${API_BASE}/api/staff/upload-document`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (res.data.success) {
        alert(`${docName} uploaded successfully!`);
        fetchMember(); 
      }
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploadingDoc(null);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
      <Loader2 className="animate-spin text-blue-500" size={40} />
    </div>
  );

  if (!member) return <div className="p-10 text-center text-slate-500">Staff profile not found.</div>;

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
      {/* 1. Breadcrumb Nav */}
      <nav className="flex items-center gap-2 text-sm text-slate-400 mb-6">
        <span 
          className="cursor-pointer hover:text-blue-600 font-medium transition-colors" 
          onClick={() => navigate('/dashboard/staff')}
        >
          Staff Directory
        </span>
        <ChevronRight size={14} />
        <span 
          className="cursor-pointer hover:text-blue-600 font-semibold transition-colors text-slate-600"
          onClick={() => setShowFullInfo(false)}
        >
          {member.firstName} {member.LastName}
        </span>
        {showFullInfo && (
          <>
            <ChevronRight size={14} />
            <span className="text-slate-400 font-medium uppercase text-[10px] tracking-widest">Profile Detail</span>
          </>
        )}
      </nav>

      {/* 2. Top Tabs Switcher */}
      {showFullInfo && (
        <div className="flex gap-2 mb-8 bg-slate-200/50 p-1.5 rounded-2xl w-fit">
          <button 
            onClick={() => setActiveTab("personal")}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === "personal" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Personal Information
          </button>
          <button 
            onClick={() => setActiveTab("documents")}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === "documents" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Documents
          </button>
        </div>
      )}

      {/* Overview Header */}
      {!showFullInfo && (
        <h1 className="text-2xl font-bold text-slate-800 mb-6">
          Overview of {member.firstName}'s profile
        </h1>
      )}

      {/* 3. Profile Header Card */}
      {!showFullInfo && (
        <div className="bg-white rounded-[24px] border border-slate-200 p-6 md:p-8 mb-8 relative shadow-sm">
          <button className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full transition-colors">
            <MoreVertical size={20} className="text-slate-400" />
          </button>

          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-24 h-24 rounded-2xl bg-slate-100 flex items-center justify-center border-2 border-slate-50 overflow-hidden shrink-0 shadow-inner">
              {member.photo ? (
                <img src={member.photo} alt="profile" className="w-full h-full object-cover" />
              ) : (
                <User size={40} className="text-slate-300" />
              )}
            </div>

            <div className="flex-1 w-full">
              <h2 className="text-3xl font-semibold text-slate-800 tracking-tight mb-1">
                {member.firstName} {member.LastName}
              </h2>
              <p className="text-slate-500 text-sm font-medium mb-8">
                {member.ContactNumber} • {member.Email}
              </p>
              <h3 className="text-slate-400 uppercase text-[11px] font-black tracking-[0.1em] mb-4">
                Employment Details
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-4">
                <InfoItem label="User Role" value={member.UserRole} />
                <InfoItem label="Employee ID" value={member.EmployeeId} />
              </div>
            </div>

            <button 
              onClick={() => setShowFullInfo(true)}
              className="w-full md:w-auto bg-blue-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-blue-700 self-end transition-all shadow-lg shadow-blue-100"
            >
              View Full Information
            </button>
          </div>
        </div>
      )}

      {/* 4. Full Information View */}
      {showFullInfo && activeTab === "personal" && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* Basic Details Card */}
          <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm overflow-hidden">
            <div 
              className="flex justify-between items-center p-6 border-b border-slate-50 cursor-pointer hover:bg-slate-50/50 transition-colors"
              onClick={() => toggleSection('basic')}
            >
              <h3 className="text-lg font-bold text-slate-800 tracking-tight">Basic Details</h3>
              <div className="flex items-center gap-4">
                <button 
                  className="text-blue-600 flex items-center gap-1.5 text-sm font-bold hover:underline"
                  onClick={(e) => {
                    e.stopPropagation(); // Card toggle hone se rokega
                    handleEdit('basic');
                  }}
                >
                  <Edit2 size={14} /> Edit
                </button>
                <div className="text-slate-400">
                  {expandedSections.basic ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </div>
            </div>
            {expandedSections.basic && (
              <div className="p-8 grid grid-cols-1 md:grid-cols-4 gap-y-8 gap-x-4">
                <InfoItem label="Mobile Number" value={member.ContactNumber} />
                <InfoItem label="Email ID" value={member.Email} />
                <InfoItem label="Employee ID" value={member.EmployeeId} />
                <InfoItem label="First Name" value={member.firstName} />
                <InfoItem label="Middle Name" value={member.middleName} />
                <InfoItem label="Last Name" value={member.LastName} />
                <InfoItem label="Date of Birth" value={member.Dob} />
                <InfoItem label="Gender" value={member.Gender} />
                <InfoItem label="Blood Group" value={member.BloodGroup} />
              </div>
            )}
          </div>

          {/* Address Details Card */}
          <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm overflow-hidden">
            <div 
              className="flex justify-between items-center p-6 border-b border-slate-100 cursor-pointer hover:bg-slate-50/50 transition-colors"
              onClick={() => toggleSection('address')}
            >
              <h3 className="text-lg font-bold text-slate-800 tracking-tight">Address Details</h3>
              <div className="flex items-center gap-4">
                <button 
                  className="text-blue-600 flex items-center gap-1.5 text-sm font-bold hover:underline"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit('address');
                  }}
                >
                  <Edit2 size={14} /> Edit
                </button>
                <div className="text-slate-400">
                  {expandedSections.address ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </div>
            </div>
            {expandedSections.address && (
              <div className="p-8">
                <h4 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <MapPin size={16} className="text-blue-500" /> Current Address
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-y-8 gap-x-4">
                  <InfoItem label="Address Line 1" value={member.AddressLine1} />
                  <InfoItem label="City/Town" value={member.City} />
                  <InfoItem label="State" value={member.State} />
                  <InfoItem label="PIN Code" value={member.PIN} />
                  <InfoItem label="Country" value={member.Country || "India"} />
                </div>
              </div>
            )}
          </div>
          
          <button 
            onClick={() => setShowFullInfo(false)}
            className="text-slate-400 text-sm font-bold hover:text-blue-600 flex items-center gap-1 transition-colors"
          >
            ← Back to Overview
          </button>
        </div>
      )}

      {/* 5. Documents Section */}
      {(!showFullInfo || activeTab === "documents") && (
        <div className="bg-white rounded-[24px] border border-slate-200 overflow-hidden shadow-sm mt-8">
          <div className="flex justify-between items-center p-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                <FileText size={20} />
              </div>
              <h3 className="font-bold text-slate-800 tracking-tight">Documents</h3>
            </div>
          </div>

          <div className="p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {["PAN Card", "Driving License", "10th Marksheet", "12th Marksheet"].map((doc) => (
              <div key={doc} className="group">
                <input 
                  type="file" 
                  id={`upload-${doc}`} 
                  className="hidden" 
                  onChange={(e) => handleFileUpload(e, doc)}
                  accept=".jpg,.jpeg,.png,.pdf"
                />
                <label 
                  htmlFor={`upload-${doc}`}
                  className="aspect-[16/9] border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center bg-slate-50/50 group-hover:border-blue-400 group-hover:bg-blue-50/30 transition-all mb-3 cursor-pointer"
                >
                  {uploadingDoc === doc ? (
                    <Loader2 className="animate-spin text-blue-500" />
                  ) : member.documents?.[doc] ? (
                    <CheckCircle2 size={24} className="text-emerald-500" />
                  ) : (
                    <>
                      <Plus size={24} className="text-slate-300 group-hover:text-blue-500 mb-1" />
                      <span className="text-[10px] text-slate-400 font-bold group-hover:text-blue-500 uppercase">Select File</span>
                    </>
                  )}
                </label>
                <p className="text-[10px] font-black text-slate-500 ml-1 uppercase tracking-widest">{doc}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}