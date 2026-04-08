import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Search, UserCheck, X, Loader2, CheckCircle } from "lucide-react";

// Postman ke mutabik check karein (Localhost vs Render)
const BASE_URL = "https://institute-backend-0ncp.onrender.com"; 

export default function Students() {
  const instituteState = useSelector((state) => state.Institute);
  const instituteId = instituteState?.currentInstitute?.instituteId || "";

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [approving, setApproving] = useState(false);

  // 1. Fetch Students (Ab hum PENDING aur APPROVED dono dikhayenge)
  useEffect(() => {
    const fetchStudents = async () => {
      if (!instituteId) return;
      try {
        setLoading(true);
        const res = await axios.get(`${BASE_URL}/student/studentsByInstitute/${instituteId}`);
        const rawData = res.data.students || [];

        const processedData = rawData.map(student => {
          const instReq = student.appliedInstitutes?.find(i => i.instituteCode === instituteId);
          return {
            _id: student._id,
            fullName: student.fullName || "N/A",
            email: student.email || "N/A",
            studentID: student.studentID,
            status: instReq ? instReq.status.toUpperCase() : "PENDING"
          };
        });

        // Yahan se filter hata diya taaki list se gayab na hon
        setStudents(processedData); 
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [instituteId]);

  // 2. Search Logic
  const filteredStudents = useMemo(() => {
    const sLower = search.toLowerCase();
    return students.filter(s =>
      s.fullName?.toLowerCase().includes(sLower) ||
      s.studentID?.toLowerCase().includes(sLower)
    );
  }, [students, search]);

  // 3. Approve Logic (Update status in UI instead of removing)
  const handleApproveStudent = async () => {
    if (!selectedStudent || !instituteId) return;
    
    setApproving(true);
    try {
      const payload = {
        studentId: selectedStudent.studentID,
        instituteId: instituteId
      };

      const res = await axios.put(`${BASE_URL}/institute/approveStudent`, payload);

      if (res.data.success) {
        // UI UPDATE: Student ko remove nahi kar rahe, status badal rahe hain
        setStudents(prev => prev.map(s => 
          s.studentID === selectedStudent.studentID 
          ? { ...s, status: "APPROVED" } 
          : s
        ));
        
        setShowApproveModal(false);
        alert("Student Approved Successfully!");
      }
    } catch (err) {
      console.error("Error:", err.response?.data);
      alert(err.response?.data?.message || "Approval failed.");
    } finally {
      setApproving(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#f8fafc]">
      <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
      <p className="mt-4 text-slate-500 font-medium">Loading Students...</p>
    </div>
  );

  return (
    <main className="p-6 md:p-12 bg-[#f8fafc] min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-10">
          <div>
            <h1 className="text-2xl font-black text-slate-900">Manage Students</h1>
            <p className="text-slate-500">Institute ID: <span className="text-indigo-600 font-bold">{instituteId}</span></p>
          </div>
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by ID or Name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl w-full outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>
        </div>

        <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-slate-100">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase">Student</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase">Student ID</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase">Status</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredStudents.map((s) => (
                <tr key={s.studentID} className="hover:bg-slate-50/50 transition-all">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 font-bold uppercase">{s.fullName[0]}</div>
                      <div>
                        <p className="font-bold text-slate-800">{s.fullName}</p>
                        <p className="text-xs text-slate-400">{s.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-sm font-medium text-slate-600">{s.studentID}</td>
                  <td className="px-8 py-5">
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                      s.status === "APPROVED" 
                      ? "bg-emerald-50 text-emerald-600" 
                      : "bg-amber-50 text-amber-600"
                    }`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    {s.status === "PENDING" ? (
                      <button
                        onClick={() => { setSelectedStudent(s); setShowApproveModal(true); }}
                        className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase hover:bg-indigo-700 shadow-md active:scale-95"
                      >
                        Approve
                      </button>
                    ) : (
                      <div className="flex items-center justify-end text-emerald-600 gap-1 text-xs font-bold">
                        <CheckCircle className="w-4 h-4" /> Done
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showApproveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] p-10 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-black text-slate-900 uppercase">Confirm</h3>
              <button onClick={() => setShowApproveModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-4">
                <UserCheck className="w-10 h-10" />
              </div>
              <p className="text-slate-600">Approve <span className="font-bold text-slate-900">{selectedStudent?.fullName}</span>?</p>
            </div>
            <div className="flex gap-4">
              <button onClick={() => setShowApproveModal(false)} className="flex-1 py-4 bg-slate-100 text-slate-600 font-black rounded-2xl">CANCEL</button>
              <button
                onClick={handleApproveStudent}
                disabled={approving}
                className="flex-1 py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 disabled:opacity-50"
              >
                {approving ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "YES, APPROVE"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}