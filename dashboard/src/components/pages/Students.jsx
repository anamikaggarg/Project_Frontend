import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Search, Plus, UserCheck, Mail, Phone, BookOpen, X, Loader2 } from "lucide-react";
const BASE_URL = import.meta.env.VITE_API_URL;

const API_URL = `${BASE_URL}/student/all`;
const UPDATE_API_URL = `${BASE_URL}/student/updateStudent`;
const ADD_API_URL = `${BASE_URL}/student/addStudent`;

export default function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [courses, setCourses] = useState([]);
  const [approving, setApproving] = useState(false);
  const [adding, setAdding] = useState(false);
  const [newStudent, setNewStudent] = useState({ fullName: "", email: "", contactNo: "" });

  useEffect(() => {
    const fetchStudents = async () => {
     try {
  const res = await axios.get(API_URL);
  setStudents(Array.isArray(res.data.students) ? res.data.students : []);
} catch (err) {
  console.error("Fetch Students Error:", err);
  alert(err.response?.data?.message || err.message || "Failed to fetch students");
  setStudents([]);
} finally {
  setLoading(false);
}
    };
    fetchStudents();
  }, []);

  useEffect(() => {
    const institute = JSON.parse(localStorage.getItem("institute") || "{}");
    setCourses(Array.isArray(institute.courses) && institute.courses.length > 0 
      ? institute.courses 
      : ["React JS", "Node JS", "Python", "Data Science"]);
  }, []);

  const filteredStudents = useMemo(() => {
    const searchLower = search.toLowerCase();
    return students.filter(s =>
      s.fullName?.toLowerCase().includes(searchLower) ||
      s.email?.toLowerCase().includes(searchLower) ||
      s.contactNo?.includes(searchLower)
    );
  }, [students, search]);

  const handleApproveClick = (student) => {
    setSelectedStudent(student);
    setSelectedCourse("");
    setShowApproveModal(true);
  };

  const handleApproveStudent = async () => {
    if (!selectedCourse) return;
    setApproving(true);
    try {
      const res = await axios.put(`${UPDATE_API_URL}/${selectedStudent.email}`, 
        { status: "Approved", course: selectedCourse },
        { headers: { "ngrok-skip-browser-warning": "true" } }
      );
      if (res.data.success) {
        setStudents(prev => prev.map(s => s.email === selectedStudent.email ? { ...s, status: "Approved", course: selectedCourse } : s));
        setShowApproveModal(false);
      }
    } catch (err) {
      console.error("Fetch Students Error:", err);
      alert("Something went wrong");
    } finally {
      setApproving(false);
    }
  };

  const handleAddStudent = async () => {
    if (!newStudent.fullName || !newStudent.email) return;
    setAdding(true);
    try {
      const res = await axios.post(ADD_API_URL, newStudent, { headers: { "ngrok-skip-browser-warning": "true" } });
      if (res.data.success) {
        setStudents(prev => [...prev, res.data.student]);
        setShowAddModal(false);
        setNewStudent({ fullName: "", email: "", contactNo: "" });
      }
    } catch (err) {
      console.error("Fetch Students Error:", err);
    } finally {
      setAdding(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
      <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
      <p className="text-slate-500 font-medium animate-pulse">Syncing student records...</p>
    </div>
  );

  return (
    <main className="p-4 md:p-10 bg-slate-50 min-h-screen text-slate-900 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* TOP HEADER SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Student Directory</h1>
            <p className="text-slate-500 mt-1">Manage enrollments, approve applications, and track courses.</p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-grow md:flex-grow-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search students..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl w-full md:w-80 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
              />
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Student</span>
            </button>
          </div>
        </div>

        {/* STATS SUMMARY (Optional but looks great) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <p className="text-slate-500 text-sm font-medium">Total Students</p>
                <h3 className="text-2xl font-bold">{students.length}</h3>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <p className="text-slate-500 text-sm font-medium">Approved</p>
                <h3 className="text-2xl font-bold text-emerald-600">{students.filter(s => s.status === 'Approved').length}</h3>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <p className="text-slate-500 text-sm font-medium">Pending Review</p>
                <h3 className="text-2xl font-bold text-amber-500">{students.filter(s => s.status !== 'Approved').length}</h3>
            </div>
        </div>

        {/* MAIN TABLE CARD */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-200">
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Student</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Contact Info</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Course</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.length > 0 ? filteredStudents.map((s) => (
                  <tr key={s.email} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                            <img
                            src={s.profileImage ? (s.profileImage.startsWith("http") ? s.profileImage : `https://effie-uncandied-dumpily.ngrok-free.dev/${s.profileImage}`) : `https://ui-avatars.com/api/?name=${s.fullName}&background=6366f1&color=fff`}
                            alt=""
                            className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-sm"
                            />
                            <span className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full ${s.status === 'Approved' ? 'bg-emerald-500' : 'bg-amber-400'}`}></span>
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{s.fullName}</p>
                          <p className="text-xs text-slate-400 uppercase font-medium">ID: {s.email.split('@')[0]}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Mail className="w-3.5 h-3.5 text-slate-400" /> {s.email}
                        </div>
                        {s.contactNo && (
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                <Phone className="w-3.5 h-3.5 text-slate-400" /> {s.contactNo}
                            </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wide ${
                        s.status === "Approved" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-amber-50 text-amber-700 border border-amber-100"
                      }`}>
                        {s.status || "Pending"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-700">
                        {s.course ? (
                            <div className="flex items-center gap-2">
                                <BookOpen className="w-4 h-4 text-indigo-400" />
                                {s.course}
                            </div>
                        ) : <span className="text-slate-300 italic">Unassigned</span>}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {s.status === "Approved" ? (
                        <div className="flex items-center justify-end gap-1 text-emerald-600 font-bold text-sm">
                            <UserCheck className="w-4 h-4" /> Verified
                        </div>
                      ) : (
                        <button
                          onClick={() => handleApproveClick(s)}
                          className="px-4 py-1.5 bg-white border border-slate-200 text-indigo-600 rounded-lg text-sm font-bold shadow-sm hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all"
                        >
                          Approve
                        </button>
                      )}
                    </td>
                  </tr>
                )) : (
                    <tr>
                        <td colSpan="5" className="px-6 py-20 text-center">
                            <div className="flex flex-col items-center opacity-40">
                                <Search className="w-12 h-12 mb-4" />
                                <p className="text-xl font-semibold">No students found</p>
                                <p>Try adjusting your search criteria</p>
                            </div>
                        </td>
                    </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODAL COMPONENT (Reusable style) */}
      {(showApproveModal || showAddModal) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl transform transition-all scale-100">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-900">
                    {showApproveModal ? "Assign & Approve" : "Add New Student"}
                </h3>
                <button 
                    onClick={() => { setShowApproveModal(false); setShowAddModal(false); }}
                    className="p-1 hover:bg-slate-100 rounded-full transition-colors"
                >
                    <X className="w-5 h-5 text-slate-400" />
                </button>
            </div>

            {showApproveModal ? (
              <>
                <p className="text-slate-500 mb-6">Select a curriculum to assign to <span className="font-bold text-slate-800">{selectedStudent?.fullName}</span>.</p>
                <select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl mb-8 outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                >
                  <option value="">Select a Course</option>
                  {courses.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </>
            ) : (
              <div className="space-y-4 mb-8">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={newStudent.fullName}
                  onChange={(e) => setNewStudent({ ...newStudent, fullName: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={newStudent.email}
                  onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
                <input
                  type="text"
                  placeholder="Contact Number"
                  value={newStudent.contactNo}
                  onChange={(e) => setNewStudent({ ...newStudent, contactNo: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => { setShowApproveModal(false); setShowAddModal(false); }}
                className="px-4 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={showApproveModal ? handleApproveStudent : handleAddStudent}
                disabled={approving || adding}
                className="px-4 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center"
              >
                {(approving || adding) ? <Loader2 className="w-5 h-5 animate-spin" /> : (showApproveModal ? "Confirm" : "Add Student")}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}