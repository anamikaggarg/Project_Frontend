import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 
import { Search, Plus, Trash2, Pencil, UserCircle, ChevronDown, Check } from "lucide-react";
import StaffModal from "./staffModal"; 

export default function ProfessionalDirectory() {
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_URL + "/api/staff";
  const COURSE_API = "https://institute-backend-0ncp.onrender.com/api/courses/all"; 
  const dropdownRef = useRef(null);

  // --- States ---
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [staff, setStaff] = useState([]);
  const [courses, setCourses] = useState([]); 
  const [preview, setPreview] = useState(null);
  const [staffType, setStaffType] = useState("Teaching");
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [isClassOpen, setIsClassOpen] = useState(false);

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
    BankName: "", BankAccountNumber: "", IFSC: "", AccountHolder: "",
    assignedClasses: []
  };

  const [formData, setFormData] = useState(initialFormState);

  // --- FETCH STAFF & COURSES (FIXED MAPPING BASED ON YOUR CONSOLE) ---
  const fetchData = async () => {
    try {
      const [staffRes, courseRes] = await Promise.all([
        axios.get(`${API}/allStaff`),
        axios.get(COURSE_API)
      ]);
      
      setStaff(staffRes.data.staff || []);

      // FIXED: Console ke hisaab se data 'courses' key mein hai
      if (courseRes.data && courseRes.data.courses) {
        setCourses(courseRes.data.courses);
      }
    } catch (err) { 
      console.error("Fetch Error:", err); 
    }
  };

  useEffect(() => { fetchData(); }, []);

  // --- Outside Click Logic ---
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsClassOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  // --- FILTER LOGIC ---
  const filteredStaff = staff.filter((member) => {
    const query = search.toLowerCase();
    const matchesSearch = 
      member.firstName?.toLowerCase().includes(query) || 
      member.LastName?.toLowerCase().includes(query) ||
      member.EmployeeId?.toLowerCase().includes(query);

    const role = (member.UserRole || "").toLowerCase();
    const isTeacher = role === "teacher" || role === "faculty";
    const matchesType = staffType === "Teaching" ? isTeacher : !isTeacher;

    const matchesClass = selectedClasses.length === 0 || 
      (member.assignedClasses && member.assignedClasses.some(cls => selectedClasses.includes(cls)));

    return matchesSearch && matchesType && matchesClass;
  });

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
      setSections({ basic: true, employment: false, additional: false, experience: false, bank: false });
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
    if(window.confirm("Are you sure?")) {
        try {
            await axios.delete(`${API}/deleteStaff/${id}`);
            fetchData();
        } catch (err) { alert("Delete failed"); }
    }
  };

  const openProfile = (empId) => {
    if (!empId) return;
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
        fetchData();
        toggleModal();
      }
    } catch (err) {
      alert(`Error: ${err.response?.data?.error || "Failed to save"}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 lg:py-10">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
          <div>
            <h1 className="text-2xl sm:text-3xl text-slate-800 font-bold tracking-tight">Staff Directory</h1>
            <p className="text-slate-500 mt-1 font-medium">Manage personnel</p>
          </div>
          <button onClick={toggleModal} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3.5 rounded-xl shadow-lg hover:bg-blue-700 transition-all font-bold active:scale-95">
            <Plus size={18} /> Add Staff
          </button>
        </div>

        {/* --- FILTERS --- */}
        <div className="flex flex-col gap-6 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="flex w-full md:w-auto gap-1 bg-slate-200/50 p-1.5 rounded-2xl">
              {["Teaching", "NonTeaching"].map((type) => (
                <button 
                  key={type}
                  onClick={() => setStaffType(type)} 
                  className={`flex-1 md:flex-none px-6 py-2 rounded-xl text-[11px] font-black transition-all ${staffType === type ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                >
                  {type === "Teaching" ? "TEACHING" : "NON TEACHING"}
                </button>
              ))}
            </div>

            {/* --- DROPDOWN (FIXED FIELD TO 'name') --- */}
            <div className="relative w-full md:w-auto" ref={dropdownRef}>
              <button 
                onClick={() => setIsClassOpen(!isClassOpen)}
                className={`w-full md:min-w-[200px] flex items-center justify-between gap-3 px-5 py-2.5 border rounded-xl text-sm font-bold shadow-sm transition-all ${selectedClasses.length > 0 ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-white border-slate-200 text-slate-600'}`}
              >
                <span className="truncate">{selectedClasses.length > 0 ? `${selectedClasses.length} Selected` : "Select Courses"}</span>
                <ChevronDown size={16} className={`transition-transform ${isClassOpen ? 'rotate-180' : ''}`} />
              </button>

              {isClassOpen && (
                <div className="absolute left-0 mt-2 w-full md:w-64 bg-white border border-slate-100 rounded-2xl shadow-2xl z-50 p-2">
                  <div className="px-3 py-2 border-b border-slate-50 flex justify-between items-center mb-1">
                    <span className="text-[10px] font-black uppercase text-slate-400">Courses</span>
                    {selectedClasses.length > 0 && (
                      <button onClick={(e) => { e.stopPropagation(); setSelectedClasses([]); }} className="text-[10px] font-bold text-rose-500 hover:underline">Clear All</button>
                    )}
                  </div>
                  <div className="max-h-56 overflow-y-auto">
                    {courses.map((course) => (
                      <label key={course._id} className="flex items-center gap-3 p-2.5 hover:bg-slate-50 rounded-xl cursor-pointer group">
                        <div className="relative flex items-center">
                          <input 
                            type="checkbox" 
                            checked={selectedClasses.includes(course.name)} 
                            onChange={() => setSelectedClasses(prev => prev.includes(course.name) ? prev.filter(i => i !== course.name) : [...prev, course.name])}
                            className="w-5 h-5 appearance-none border-2 border-slate-200 rounded-md checked:bg-blue-600 checked:border-blue-600 cursor-pointer" 
                          />
                          {selectedClasses.includes(course.name) && <Check size={14} className="absolute text-white left-0.5" />}
                        </div>
                        <span className={`text-sm font-bold ${selectedClasses.includes(course.name) ? 'text-blue-600' : 'text-slate-600'}`}>
                          {course.name}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20}/>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search staff..." className="w-full bg-white shadow-sm border border-slate-200 pl-12 pr-4 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-100 font-medium text-sm" />
          </div>
        </div>

        {/* --- TABLE --- */}
        <div className="hidden lg:block bg-white rounded-[24px] border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/50 text-[11px] uppercase text-slate-400 font-black tracking-widest border-b border-slate-100">
              <tr>
                <th className="px-8 py-5 text-center w-20">Profile</th>
                <th className="px-4 py-5">Staff Member</th>
                <th className="px-8 py-5">Role & Classes</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredStaff.map((member) => (
                <tr key={member._id} onClick={() => openProfile(member.EmployeeId)} className="hover:bg-slate-50/80 transition-colors group cursor-pointer">
                  <td className="px-8 py-4 text-center"><UserCircle size={24} className="mx-auto text-slate-300 group-hover:text-blue-500" /></td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold border border-blue-100">{member.firstName?.charAt(0)}</div>
                      <div>
                        <p className="font-bold text-slate-700">{member.firstName} {member.LastName}</p>
                        <p className="text-[10px] text-slate-400 font-bold">ID: {member.EmployeeId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-4">
                    <p className="text-sm font-bold text-slate-600">{member.UserRole}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {member.assignedClasses?.map(c => (
                        <span key={c} className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md font-black border border-blue-100 uppercase">{c}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-8 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-end gap-2">
                      <button onClick={(e) => handleEdit(e, member)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Pencil size={18}/></button>
                      <button onClick={(e) => handleDelete(e, member._id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={18}/></button>
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
        // FIXED: Modal ko bhi string array chahiye (name field)
        availableClasses={courses.map(c => c.name)} 
      />
    </div>
  );
}