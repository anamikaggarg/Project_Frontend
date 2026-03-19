import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 
import { Search, Plus, Trash2, Pencil, UserCircle } from "lucide-react";
import StaffModal from "./staffModal"; 

export default function ProfessionalDirectory() {
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_URL + "/api/staff";

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [staff, setStaff] = useState([]);
  const [preview, setPreview] = useState(null);
  const [staffType, setStaffType] = useState("Teaching");

  const [sections, setSections] = useState({ 
    basic: true, employment: false, additional: false, experience: false, bank: false 
  });

  const [experienceList, setExperienceList] = useState([{ PrevInstituteName: "", PrevJobTitle: "", PrevJoiningDate: "" }]);

  const initialFormState = {
    firstName: "", LastName: "", middleName: "", EmployeeId: "", UserRole: "",
    Email: "", ContactNumber: "", Gender: "", Dob: "",
    JobTitle: "", Designation: "", Department: "", EmploymentType: "", AppointmentDate: "",
    AadharNumber: "", PANNumber: "", Religion: "", Category: "", FatherName: "", MotherName: "",
    MaritalStatus: "", SpouseName: "", EmergencyContact: "",
    BankName: "", BankAccountNumber: "", IFSC: "", AccountHolder: ""
  };

  const [formData, setFormData] = useState(initialFormState);

  const fetchStaff = async () => {
    try {
      const res = await axios.get(`${API}/allStaff`);
      setStaff(res.data.staff || []);
    } catch (err) { console.error("Fetch Error:", err); }
  };

  useEffect(() => { fetchStaff(); }, []);

  const toggleSection = (sectionName) => {
    setSections(prev => ({ ...prev, [sectionName]: !prev[sectionName] }));
  };

  const toggleModal = () => {
    setShowModal(!showModal);
    if (!showModal) {
      setFormData(initialFormState);
      setExperienceList([{ PrevInstituteName: "", PrevJobTitle: "", PrevJoiningDate: "" }]);
      setPreview(null);
      setIsEditing(false);
      setEditId(null);
      setSections({ basic: true, additional: false, experience: false, bank: false });
    }
  };

  const handleEdit = (e, member) => {
    e.stopPropagation();
    setFormData({ ...member });
    setExperienceList(member.experience?.length ? member.experience : [{ PrevInstituteName: "", PrevJobTitle: "", PrevJoiningDate: "" }]);
    setEditId(member._id);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if(window.confirm("Are you sure you want to delete this staff?")) {
        try {
            await axios.delete(`${API}/deleteStaff/${id}`);
            fetchStaff();
        } catch (err) { alert("Error deleting staff",err); }
    }
  };

  // --- UPDATED OPEN PROFILE (Using EmployeeId) ---
  const openProfile = (empId) => {
    if (!empId) return alert("Employee ID not found for this member");
    navigate(`/dashboard/staff/${empId}`); 
  };

  const saveStaff = async () => {
    try {
      const cleanExp = experienceList.filter(exp => exp.PrevInstituteName?.trim() !== "");
      const finalPayload = { ...formData, experience: cleanExp };

      let res;
      if (isEditing) {
        res = await axios.put(`${API}/updateStaff/${editId}`, finalPayload);
      } else {
        res = await axios.post(`${API}/addStaff`, finalPayload);
      }

      if (res.data.success) {
        fetchStaff();
        toggleModal();
      }
    } catch (err) {
      const serverError = err.response?.data?.error || "Error saving data";
      alert(`Backend Error: ${serverError}`);
    }
  };

  const filteredStaff = staff.filter((member) => {
    const query = search.toLowerCase();
    const matchesSearch = 
      member.firstName?.toLowerCase().includes(query) || 
      member.LastName?.toLowerCase().includes(query) ||
      member.EmployeeId?.toLowerCase().includes(query);

    const role = member.UserRole?.toLowerCase() || "";
    const isTeacher = role === "teacher" || role === "faculty";
    const matchesType = staffType === "Teaching" ? isTeacher : !isTeacher;

    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl text-slate-800 font-semibold tracking-tight">Staff Directory</h1>
            <p className="text-slate-500 mt-1">Manage and update your institute personnel</p>
          </div>
          <button onClick={toggleModal} className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3.5 rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all font-bold">
            <Plus size={18} /> Add Staff
          </button>
        </div>

        <div className="flex flex-col gap-6 mb-8">
          <div className="flex gap-3">
            {["Teaching", "NonTeaching"].map((type) => (
              <button 
                key={type}
                onClick={() => setStaffType(type)} 
                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${staffType === type ? "bg-slate-800 text-white shadow-md" : "bg-white border text-slate-500 hover:bg-slate-50"}`}
              >
                {type === "Teaching" ? "Teaching Staff" : "Non Teaching Staff"}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20}/>
            <input 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              placeholder={`Search in ${staffType}...`} 
              className="w-full bg-white shadow-sm border border-slate-200 pl-12 pr-4 py-3.5 rounded-2xl outline-none focus:ring-2 focus:ring-blue-100 transition-all" 
            />
          </div>
        </div>

        <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/50 text-[11px] uppercase text-slate-400 font-black tracking-widest border-b border-slate-100">
              <tr>
                <th className="px-8 py-5 text-center w-20">Profile</th>
                <th className="px-4 py-5">Staff Member</th>
                <th className="px-8 py-5">Role & Dept</th>
                <th className="px-8 py-5">Contact</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredStaff.map((member) => (
                <tr 
                  key={member._id} 
                  onClick={() => openProfile(member.EmployeeId)} // Trigger by EmployeeId
                  className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                >
                  <td className="px-8 py-4">
                    <button 
                      onClick={(e) => { e.stopPropagation(); openProfile(member.EmployeeId); }}
                      className="p-2 text-blue-500 hover:bg-blue-50 rounded-full transition-all"
                    >
                      <UserCircle size={24} />
                    </button>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold border border-slate-200 uppercase">
                        {member.firstName?.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-700">{member.firstName} {member.LastName}</p>
                        <p className="text-xs text-slate-400">ID: {member.EmployeeId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-4">
                    <p className="text-sm font-semibold text-slate-600">{member.UserRole}</p>
                    {/* <p className="text-[10px] text-slate-400 uppercase font-bold">{member.Department || 'No Dept'}</p> */}
                  </td>
                  <td className="px-8 py-4 text-slate-600 text-sm font-medium">{member.ContactNumber}</td>
                  <td className="px-8 py-4 text-right">
                    <div className="flex justify-end gap-2 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                      <button 
                        onClick={(e) => handleEdit(e, member)} 
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      >
                        <Pencil size={18}/>
                      </button>
                      <button 
                        onClick={(e) => handleDelete(e, member._id)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 size={18}/>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        
        </div>
      </main>

      <StaffModal 
        isOpen={showModal} onClose={toggleModal} isEditing={isEditing}
        formData={formData} setFormData={setFormData}
        preview={preview} setPreview={setPreview}
        sections={sections} toggleSection={toggleSection}
        experienceList={experienceList} setExperienceList={setExperienceList}
        onSave={saveStaff}
      />
    </div>
  );
}