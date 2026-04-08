import React from "react";
import { X, ChevronDown, Camera, Upload, DownloadCloud, PlusCircle, Check } from "lucide-react"; // Added Check

// --- REUSABLE INTERNAL COMPONENTS ---
const FormInput = ({ label, name, type = "text", placeholder, value, onChange }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-medium text-slate-500 ml-1">{label}</label>
    <input
      type={type}
      name={name}
      value={value || ""}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full border border-slate-200 bg-white p-3 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 outline-none transition-all text-slate-700"
    />
  </div>
);

const FormSelect = ({ label, name, options, value, onChange }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-medium text-slate-500 ml-1">{label}</label>
    <div className="relative">
      <select
        name={name}
        value={value || ""}
        onChange={onChange}
        className="w-full border border-slate-200 bg-white p-3 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 outline-none transition-all text-slate-700 appearance-none"
      >
        <option value="">Select</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
    </div>
  </div>
);

const StaffModal = ({
  isOpen,
  onClose,
  isEditing,
  formData,
  setFormData,
  preview,
  setPreview,
  sections,
  toggleSection,
  experienceList,
  setExperienceList,
  onSave,
  availableClasses 
}) => {
  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleExpChange = (index, e) => {
    const { name, value } = e.target;
    const list = [...experienceList];
    list[index][name] = value;
    setExperienceList(list);
  };

  const addExperience = () => {
    setExperienceList([...experienceList, { PrevInstituteName: "", PrevJobTitle: "", PrevJoiningDate: "" }]);
  };

  const removeExperience = (index) => {
    setExperienceList(experienceList.filter((_, i) => i !== index));
  };

  // --- LOGIC: Toggle Class Allotment ---
  const handleClassToggle = (cls) => {
    const currentClasses = formData.assignedClasses || [];
    const updatedClasses = currentClasses.includes(cls)
      ? currentClasses.filter((c) => c !== cls)
      : [...currentClasses, cls];
    
    setFormData({ ...formData, assignedClasses: updatedClasses });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-5xl max-h-[95vh] overflow-hidden rounded-[32px] shadow-2xl flex flex-col border border-white">
        
        {/* Header */}
        <div className="flex justify-between items-center p-8 border-b border-slate-100">
          <h2 className="text-black text-2xl font-bold">{isEditing ? "Update Staff Details" : "Add New Staff Member"}</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"><X size={24} /></button>
        </div>

        <div className="p-8 overflow-y-auto space-y-10">
          {/* Photo Upload Section */}
          <div className="space-y-8">
            <div className="flex items-center gap-6 p-2">
              <div className="w-20 h-20 rounded-2xl bg-slate-50 border-2 border-slate-100 flex items-center justify-center text-slate-300 overflow-hidden">
                {preview ? <img src={preview} className="w-full h-full object-cover" alt="Preview" /> : <Camera size={28}/>}
              </div>
              <div className="space-y-1">
                <p className="font-bold text-sm text-slate-700">Upload passport size photo</p>
                <div className="flex gap-4 pt-2">
                  <label className="text-xs text-blue-600 font-bold cursor-pointer hover:underline">
                    Upload <input type="file" className="hidden" onChange={(e) => setPreview(URL.createObjectURL(e.target.files[0]))}/>
                  </label>
                  <button className="text-xs text-blue-600 font-bold flex items-center gap-1 hover:underline"><Camera size={14}/> Take Picture</button>
                </div>
              </div>
            </div>

            {/* --- NEW: CLASS ALLOTMENT SECTION (SNEHA KO ALLOT KRNE K LIYE) --- */}
            <div className="p-8 bg-slate-50 rounded-[32px] border border-slate-100">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="font-bold text-slate-800">Class Allotment</h3>
                  <p className="text-xs text-slate-500 italic">Select classes assigned to {formData.firstName || 'this staff member'}</p>
                </div>
                <div className="px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-wider">
                  {formData.assignedClasses?.length || 0} Classes Selected
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {availableClasses?.map((cls) => {
                  const isSelected = formData.assignedClasses?.includes(cls);
                  return (
                    <button
                      key={cls}
                      type="button"
                      onClick={() => handleClassToggle(cls)}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl border-2 transition-all duration-200 font-bold text-sm ${
                        isSelected
                          ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200 scale-105"
                          : "bg-white border-slate-200 text-slate-500 hover:border-blue-400 active:scale-95"
                      }`}
                    >
                      {cls}
                      {isSelected && <Check size={14} strokeWidth={3} />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 1. BASIC DETAILS */}
            <div className="border border-slate-100 rounded-[24px] bg-white shadow-sm overflow-hidden">
              <button onClick={() => toggleSection('basic')} className="flex justify-between w-full p-6 font-bold text-slate-700 bg-slate-50/50">
                Basic Details <ChevronDown className={`transition-transform ${sections.basic ? "rotate-180" : ""}`} />
              </button>
              {sections.basic && (
                <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                  <FormInput label="First Name *" name="firstName" value={formData.firstName} onChange={handleChange} />
                  <FormInput label="Last Name" name="LastName" value={formData.LastName} onChange={handleChange} />
                  <FormInput label="Employee ID *" name="EmployeeId" value={formData.EmployeeId} onChange={handleChange} />
                  <FormSelect label="User Role *" name="UserRole" options={["Teacher", "Admin", "Receptionist"]} value={formData.UserRole} onChange={handleChange} />
                  <FormInput label="Mobile Number *" name="ContactNumber" value={formData.ContactNumber} onChange={handleChange} />
                  <FormInput label="Email ID" name="Email" value={formData.Email} onChange={handleChange} />
                  <FormInput label="Date of Birth" name="Dob" type="date" value={formData.Dob} onChange={handleChange} />
                  <FormSelect label="Gender" name="Gender" options={["Male", "Female", "Other"]} value={formData.Gender} onChange={handleChange} />
                </div>
              )}
            </div>

            {/* 2. ADDITIONAL DETAILS */}
            <div className="border border-slate-100 rounded-[24px] bg-white shadow-sm overflow-hidden">
              <button onClick={() => toggleSection('additional')} className="flex justify-between w-full p-6 font-bold text-slate-700 bg-slate-50/50">
                Additional Details <ChevronDown className={`transition-transform ${sections.additional ? "rotate-180" : ""}`} />
              </button>
              {sections.additional && (
                <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                  <FormInput label="Aadhar Number" name="AadharNumber" value={formData.AadharNumber} onChange={handleChange} />
                  <FormInput label="PAN Number" name="PANNumber" value={formData.PANNumber} onChange={handleChange} />
                  <FormSelect label="Religion" name="Religion" options={["Hindu", "Muslim", "Sikh", "Christian"]} value={formData.Religion} onChange={handleChange} />
                  <FormSelect label="Category" name="Category" options={["General", "OBC", "SC/ST"]} value={formData.Category} onChange={handleChange} />
                  <FormInput label="Father's Name" name="FatherName" value={formData.FatherName} onChange={handleChange} />
                  <FormInput label="Mother's Name" name="MotherName" value={formData.MotherName} onChange={handleChange} />
                  <FormSelect label="Marital Status" name="MaritalStatus" options={["Single", "Married", "Divorced"]} value={formData.MaritalStatus} onChange={handleChange} />
                  <FormInput label="Spouse Name" name="SpouseName" value={formData.SpouseName} onChange={handleChange} />
                  <FormInput label="Emergency Contact Number" name="EmergencyContact" value={formData.EmergencyContact} onChange={handleChange} />
                </div>
              )}
            </div>

            {/* 3. EXPERIENCE SECTION */}
            <div className="border border-slate-100 rounded-[24px] bg-white shadow-sm overflow-hidden">
              <div onClick={() => toggleSection('experience')} className="flex justify-between w-full p-6 font-bold text-slate-700 bg-slate-50/50 cursor-pointer border-b">
                <span>Previous Experience</span>
                <ChevronDown className={`transition-transform ${sections.experience ? "rotate-180" : ""}`} />
              </div>
              {sections.experience && (
                <div className="p-8 space-y-6">
                  {experienceList.map((exp, index) => (
                    <div key={index} className="relative p-6 border border-slate-100 rounded-2xl bg-slate-50/30 grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-200">
                      {experienceList.length > 1 && (
                        <button onClick={() => removeExperience(index)} className="absolute -top-3 -right-3 bg-red-100 text-red-500 p-1.5 rounded-full hover:bg-red-500 hover:text-white transition-all shadow-md"><X size={14}/></button>
                      )}
                      <FormInput label="Institute Name" name="PrevInstituteName" value={exp.PrevInstituteName} onChange={(e) => handleExpChange(index, e)} />
                      <FormInput label="Job Title" name="PrevJobTitle" value={exp.PrevJobTitle} onChange={(e) => handleExpChange(index, e)} />
                      <FormInput label="Joining Date" name="PrevJoiningDate" type="date" value={exp.PrevJoiningDate} onChange={(e) => handleExpChange(index, e)} />
                    </div>
                  ))}
                  <button onClick={addExperience} className="flex items-center gap-1 text-sm text-blue-600 font-bold bg-white px-3 py-1.5 rounded-lg border border-blue-100 shadow-sm"><PlusCircle size={16}/> Add More</button>
                </div>
              )}
            </div>

            {/* 4. BANK DETAILS */}
            <div className="border border-slate-100 rounded-[24px] bg-white shadow-sm overflow-hidden">
              <button onClick={() => toggleSection('bank')} className="flex justify-between w-full p-6 font-bold text-slate-700 bg-slate-50/50">
                Bank Details <ChevronDown className={`transition-transform ${sections.bank ? "rotate-180" : ""}`} />
              </button>
              {sections.bank && (
                <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                  <FormInput label="Bank Name" name="BankName" value={formData.BankName} onChange={handleChange} />
                  <FormInput label="Bank Account Number" name="BankAccountNumber" value={formData.BankAccountNumber} onChange={handleChange} />
                  <FormInput label="IFSC Code" name="IFSC" value={formData.IFSC} onChange={handleChange} />
                  <FormInput label="Account Holder's Name" name="AccountHolder" value={formData.AccountHolder} onChange={handleChange} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex gap-4">
          <button onClick={onClose} className="flex-1 py-4 rounded-2xl font-black text-slate-400 bg-white border border-slate-200 hover:bg-slate-50 transition-colors">Cancel</button>
          <button onClick={onSave} className="flex-[2.5] py-4 rounded-2xl text-white bg-blue-600 font-bold shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all">
            {isEditing ? "Update Staff Information" : "Save Staff Member"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StaffModal;