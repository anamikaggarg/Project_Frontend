import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Trash2, ArrowLeft, Plus, X, Loader2, UserPlus, 
  BookOpen, GraduationCap, CheckCircle2, UserCircle2
} from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:1234";
const BASE_URL = `${API_BASE}/api/courses`;
const STUDENT_API = `${API_BASE}/student`; 

export default function CourseDetail() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [isTopicDrawerOpen, setIsTopicDrawerOpen] = useState(false);
  
  const [allStaff, setAllStaff] = useState([]);
  const [staffLoading, setStaffLoading] = useState(false);
  const [newTopic, setNewTopic] = useState("");
  const [addingTopic, setAddingTopic] = useState(false);

  const [students, setStudents] = useState([]);
  const [assignedLocal, setAssignedLocal] = useState({});

  // 1. Fetch Course Details
  const fetchCourse = async () => {
    if (!courseId) return;
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/course/${courseId}`);
      const data = await res.json();
      if (data.success) setCourse(data.course);
    } catch (err) { 
      console.error("Error fetching course:", err); 
    } finally { 
      setLoading(false); 
    }
  };

  // 2. Fetch All Students
  const fetchStudents = async () => {
    try {
      const res = await fetch(`${STUDENT_API}/allStudents`);
      const data = await res.json();
      if (data.students) setStudents(data.students);
    } catch (err) {
      console.error("Error fetching students:", err);
    }
  };

  useEffect(() => { 
    fetchCourse(); 
    fetchStudents();
  }, [courseId]);

  // 3. Assign Student Logic
  const handleAssignStudent = async (studentMongoId, studentCustomID) => {
    try {
      const res = await fetch(`${BASE_URL}/assignStudent/${courseId}/${studentCustomID}`, { method: "PUT" });
      const data = await res.json();
      if (data.success) {
        alert("Student Added ✅");
        setAssignedLocal((prev) => ({ ...prev, [studentCustomID]: true }));
        fetchCourse();
      }
    } catch (err) {
      console.error("Error assigning student:", err);
    }
  };

  // 4. Fetch Staff for Selection
  const fetchStaff = async () => {
    setIsStaffModalOpen(true);
    setStaffLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/staff/allStaff`);
      const data = await res.json();
      if (data.success || data.staff) setAllStaff(data.staff);
    } catch (err) { 
      console.error("Error fetching staff:", err); 
    } finally { 
      setStaffLoading(false); 
    }
  };

  // 5. Assign Teacher (Backend array sync)
  const handleAssignTeacher = async (staffMember) => {
    try {
      const res = await fetch(`${BASE_URL}/updateCourse/${courseId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          classTeacher: staffMember.staffId 
        })
      });

      const data = await res.json();
      if (data.success) {
        alert("Teacher Assigned ✅");
        setIsStaffModalOpen(false);
        fetchCourse(); 
      } else {
        alert("Server error: " + (data.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Assign teacher error:", err);
      alert("Failed to connect to server");
    }
  };

  // 6. Remove Teacher Logic
  const handleRemoveTeacher = async (teacherId) => {
    if(!window.confirm("Remove this teacher?")) return;
    
    // Agar backend array update kar raha hai, toh filtered array bhejna hoga
    const currentTeachers = Array.isArray(course.classTeacher) ? course.classTeacher : [];
    const updatedTeachers = currentTeachers.filter(t => (typeof t === 'object' ? t.staffId : t) !== teacherId);

    try {
      const res = await fetch(`${BASE_URL}/updateCourse/${courseId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ classTeacher: updatedTeachers })
      });
      const data = await res.json();
      if (data.success) {
        alert("Teacher Removed!");
        fetchCourse();
      }
    } catch (err) { 
      alert("Failed to remove teacher"); 
    }
  };

  // 7. Topic Management
  const handleAddTopic = async () => {
    if (!newTopic.trim()) return;
    setAddingTopic(true);
    const currentSubjects = course?.subjects || [];
    try {
      const res = await fetch(`${BASE_URL}/updateCourse/${courseId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subjects: [...currentSubjects, newTopic] })
      });
      const data = await res.json();
      if (data.success) {
        setCourse(data.course);
        setNewTopic("");
        setIsTopicDrawerOpen(false);
      }
    } catch (err) { 
      alert("Failed to add subject"); 
    } finally { 
      setAddingTopic(false); 
    }
  };

  const deleteTopic = async (indexToDelete) => {
    if(!window.confirm("Delete this subject?")) return;
    const updatedSubjects = course.subjects.filter((_, index) => index !== indexToDelete);
    try {
      const res = await fetch(`${BASE_URL}/updateCourse/${courseId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subjects: updatedSubjects })
      });
      const data = await res.json();
      if (data.success) setCourse(data.course);
    } catch (err) { 
      console.error("Delete error:", err); 
    }
  };

  if (loading) return (
    <div className="flex h-screen w-full items-center justify-center bg-white">
      <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 font-sans text-slate-900">
      
      {/* HEADER */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-50 rounded-lg transition-all">
            <ArrowLeft size={20} className="text-slate-400" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-800">{course?.name}</h1>
            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Course ID: {courseId}</p>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto p-6 md:p-10 space-y-10">

        {/* TEACHER LIST SECTION */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex justify-between items-center">
            <div>
              <h3 className="text-base font-bold text-slate-800 tracking-tight">Class Teachers</h3>
              <p className="text-sm text-slate-400 mt-0.5">Teachers assigned to manage daily activities.</p>
            </div>
            <button onClick={fetchStaff} className="bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-blue-600 transition-all shadow-md active:scale-95">
              + Assign Teacher
            </button>
          </div>

          <div className="p-6 space-y-4">
            {course?.classTeacher && Array.isArray(course.classTeacher) && course.classTeacher.length > 0 ? (
              course.classTeacher.map((teacher, index) => {
                const name = typeof teacher === 'object' ? `${teacher.firstName} ${teacher.LastName}` : teacher;
                const id = typeof teacher === 'object' ? teacher.staffId : teacher;
                
                return (
                  <div key={id || index} className="flex items-center justify-between bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 font-bold border border-blue-100">
                        {name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm">{name}</h4>
                        <p className="text-[10px] text-slate-400 font-mono uppercase">{id}</p>
                      </div>
                    </div>
                    <button onClick={() => handleRemoveTeacher(id)} className="p-2 text-rose-400 hover:bg-rose-50 rounded-lg transition-all">
                      <Trash2 size={16} />
                    </button>
                  </div>
                );
              })
            ) : (
              <div className="flex items-center gap-4 text-slate-400 italic text-sm py-2">
                <UserPlus size={18} /> No teacher assigned yet
              </div>
            )}
          </div>
        </div>

        {/* SUBJECTS TABLE */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 px-2">
            <BookOpen size={20} className="text-blue-500" />
            <h2 className="text-lg font-bold text-slate-800">Course Curriculum</h2>
            <button onClick={() => setIsTopicDrawerOpen(true)} className="ml-auto text-xs font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 transition-all flex items-center gap-1">
              <Plus size={14} /> Add Subject
            </button>
          </div>
          
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                <tr>
                  <th className="py-4 px-8 w-16 text-center">#</th>
                  <th className="py-4 px-8">Subject Name</th>
                  <th className="py-4 px-8 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {course?.subjects?.map((sub, i) => (
                    <tr key={`sub-${i}`} className="group hover:bg-slate-50/40 transition-all">
                      <td className="py-5 px-8 text-center font-mono text-slate-300">{i + 1}</td>
                      <td className="py-5 px-8">
                        <p className="font-bold text-slate-700">{typeof sub === 'object' ? sub.name : sub}</p>
                      </td>
                      <td className="py-5 px-8 text-right">
                        <button onClick={() => deleteTopic(i)} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                          <Trash2 size={16}/>
                        </button>
                      </td>
                    </tr>
                )) || (
                  <tr>
                    <td colSpan="3" className="py-20 text-center text-slate-400 italic font-medium">No subjects added yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* STUDENT TABLE */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 px-2">
            <GraduationCap size={22} className="text-emerald-500" />
            <h2 className="text-lg font-bold text-slate-800">Student Enrollment</h2>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                <tr>
                  <th className="py-4 px-8">Student Detail</th>
                  <th className="py-4 px-8 text-center">Status</th>
                  <th className="py-4 px-8 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((s) => {
                  const isEnrolled = course?.enrolledStudents?.some((stu) => stu.studentId === s.studentID) || assignedLocal[s.studentID];
                  return (
                    <tr key={s.studentID} className="hover:bg-slate-50/40 transition-all">
                      <td className="py-5 px-8">
                        <div className="flex items-center gap-4">
                          <div className="h-11 w-11 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 font-bold border border-slate-200">
                            {s.fullName?.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-700">{s.fullName}</p>
                            <p className="text-[10px] text-slate-400 font-medium tracking-wide">{s.studentID}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-5 px-8 text-center">
                        <span className={`px-3 py-1 rounded-md text-[10px] font-black uppercase border ${isEnrolled ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-orange-50 text-orange-600 border-orange-100"}`}>
                          {isEnrolled ? "Enrolled" : "Available"}
                        </span>
                      </td>
                      <td className="py-5 px-8 text-right">
                        {!isEnrolled ? (
                          <button onClick={() => handleAssignStudent(s._id, s.studentID)} className="text-[11px] font-black text-white px-4 py-1.5 bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm">Enroll Now</button>
                        ) : (
                          <button className="p-2 text-slate-300 hover:text-rose-500 transition-all"><Trash2 size={18}/></button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* DRAWER: ADD SUBJECT */}
      {isTopicDrawerOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-end">
          <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm" onClick={() => setIsTopicDrawerOpen(false)} />
          <div className="relative h-full w-full max-w-md bg-white shadow-2xl p-8 flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold text-slate-800">Add New Subject</h2>
              <button onClick={() => setIsTopicDrawerOpen(false)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors"><X size={24}/></button>
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Subject Name</label>
              <input value={newTopic} onChange={(e) => setNewTopic(e.target.value)} placeholder="e.g. Mathematics" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 outline-none transition-all font-medium focus:ring-2 focus:ring-blue-100 focus:border-blue-400" onKeyPress={(e) => e.key === 'Enter' && handleAddTopic()} />
            </div>
            <div className="mt-auto flex gap-3">
              <button onClick={() => setIsTopicDrawerOpen(false)} className="flex-1 py-4 text-sm font-bold text-slate-400">Cancel</button>
              <button onClick={handleAddTopic} disabled={addingTopic || !newTopic.trim()} className="flex-1 bg-blue-600 text-white py-4 rounded-xl text-sm font-bold shadow-lg disabled:bg-slate-200 flex items-center justify-center gap-2 transition-all active:scale-95">
                {addingTopic ? <Loader2 size={18} className="animate-spin" /> : <><CheckCircle2 size={18} /> Save Subject</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: SELECT STAFF */}
      {isStaffModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-end">
           <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-[2px]" onClick={() => setIsStaffModalOpen(false)} />
           <div className="relative h-full w-full max-w-md bg-white shadow-2xl p-8 flex flex-col animate-in slide-in-from-right duration-300">
              <div className="flex justify-between items-center mb-8">
                 <h2 className="text-xl font-bold text-slate-800">Select Teacher</h2>
                 <button onClick={() => setIsStaffModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors"><X size={24}/></button>
              </div>
              <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                 {staffLoading ? (
                   <div className="flex justify-center py-10"><Loader2 className="animate-spin text-blue-600" /></div>
                 ) : allStaff.map((staff) => (
                    <div key={staff._id || staff.staffId} className="flex items-center justify-between p-5 bg-[#F8FAFC] rounded-2xl border border-slate-100 hover:bg-white hover:border-blue-100 hover:shadow-md transition-all group">
                       <div className="flex items-center gap-4">
                          <div className="h-11 w-11 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 font-bold group-hover:bg-blue-600 group-hover:text-white transition-all">
                            {staff.firstName?.charAt(0)}
                          </div>
                          <div>
                             <p className="text-sm font-bold text-slate-800">{staff.firstName} {staff.LastName}</p>
                             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{staff.staffId}</p>
                          </div>
                       </div>
                       <button onClick={() => handleAssignTeacher(staff)} className="text-[11px] font-black text-blue-600 px-4 py-1.5 bg-blue-50 rounded-lg hover:bg-blue-600 hover:text-white transition-all shadow-sm">Assign</button>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      )}
    </div>
  );
}