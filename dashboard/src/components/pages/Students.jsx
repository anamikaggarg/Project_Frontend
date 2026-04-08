import React, { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Search, UserCheck, X, Loader2, CheckCircle, GraduationCap, Mail, CreditCard } from "lucide-react";

const BASE_URL = "https://institute-backend-0ncp.onrender.com";

export default function Students() {
  const instituteState = useSelector((state) => state.Institute);
  const TARGET_INSTITUTE_ID = instituteState?.currentInstitute?.instituteId || "";

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [approving, setApproving] = useState(false);

  const fetchStudents = useCallback(async (id) => {
    if (!id) return;
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/student/studentsByInstitute/${id}`);
      const rawData = res.data.students || [];

      const processedData = rawData.map((student) => {
        const instReq = student.appliedInstitutes?.find((i) => {
          const target = id.toLowerCase();
          const checkCode = i.instituteCode?.toString().toLowerCase();
          const checkId = i.instituteId?.toString().toLowerCase();
          return checkCode === target || checkId === target;
        });

        return {
          _id: student._id,
          fullName: student.fullName || "N/A",
          email: student.email || "N/A",
          studentID: student.studentID,
          status: instReq?.status ? instReq.status.toUpperCase() : "PENDING",
        };
      });
      setStudents(processedData);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (TARGET_INSTITUTE_ID) {
      fetchStudents(TARGET_INSTITUTE_ID);
    }
  }, [TARGET_INSTITUTE_ID, fetchStudents]);

  const filteredStudents = useMemo(() => {
    const sLower = search.toLowerCase();
    return students.filter(
      (s) =>
        s.fullName?.toLowerCase().includes(sLower) ||
        s.studentID?.toLowerCase().includes(sLower)
    );
  }, [students, search]);

  const handleApproveStudent = async () => {
    if (!selectedStudent || !TARGET_INSTITUTE_ID) return;
    setApproving(true);
    try {
      const payload = {
        studentId: selectedStudent.studentID,
        instituteId: TARGET_INSTITUTE_ID,
      };
      const res = await axios.put(`${BASE_URL}/institute/approveStudent`, payload);
      if (res.data) {
        setStudents((prev) =>
          prev.map((s) =>
            s.studentID === selectedStudent.studentID ? { ...s, status: "APPROVED" } : s
          )
        );
        setShowApproveModal(false);
        setSelectedStudent(null);
      }
    } catch (err) {
      console.error("Approval Error:", err);
      alert("Approval failed.");
    } finally {
      setApproving(false);
    }
  };

  if (!TARGET_INSTITUTE_ID || (loading && students.length === 0)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#f8fafc] p-6">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        <p className="mt-4 text-slate-500 font-bold uppercase tracking-widest text-[10px] text-center">Syncing Student Records...</p>
      </div>
    );
  }

  return (
    <main className="p-4 sm:p-6 md:p-10 lg:p-12 bg-[#f8fafc] min-h-screen">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2 bg-indigo-600 rounded-lg hidden sm:block">
                <GraduationCap className="text-white w-6 h-6" />
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 uppercase">Student Management</h1>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm font-medium">
              Institute ID: <span className="text-indigo-600 font-bold">{TARGET_INSTITUTE_ID}</span>
            </p>
          </div>
          
          <div className="relative w-full lg:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by name or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 sm:py-3.5 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
            />
          </div>
        </div>

        {/* Desktop Table View (Hidden on Mobile) */}
        <div className="hidden md:block bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Student</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">ID Card</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredStudents.map((s) => (
                <tr key={s.studentID} className="hover:bg-indigo-50/20 transition-all group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold">{s.fullName[0]}</div>
                      <div>
                        <p className="font-bold text-slate-800 leading-none mb-1">{s.fullName}</p>
                        <p className="text-xs text-slate-400">{s.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-sm font-bold text-slate-500 font-mono tracking-tighter">{s.studentID}</td>
                  <td className="px-8 py-5">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      s.status === "APPROVED" ? "bg-emerald-100 text-emerald-600" : "bg-orange-100 text-orange-600"
                    }`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    {s.status !== "APPROVED" ? (
                      <button
                        onClick={() => { setSelectedStudent(s); setShowApproveModal(true); }}
                        className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase hover:bg-indigo-600 transition-all active:scale-95"
                      >
                        Approve
                      </button>
                    ) : (
                      <div className="flex items-center justify-end text-emerald-500 gap-1.5 text-[10px] font-black uppercase">
                        <CheckCircle className="w-4 h-4" /> Approved
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile & Tablet Card View (Hidden on Desktop) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
          {filteredStudents.map((s) => (
            <div key={s.studentID} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold">{s.fullName[0]}</div>
                  <div className="max-w-[140px] overflow-hidden">
                    <p className="font-bold text-slate-800 text-sm truncate">{s.fullName}</p>
                    <span className={`text-[8px] font-black uppercase tracking-widest ${s.status === "APPROVED" ? "text-emerald-500" : "text-orange-500"}`}>{s.status}</span>
                  </div>
                </div>
                {s.status === "APPROVED" ? (
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
                )}
              </div>
              
              <div className="space-y-2 mb-5">
                <div className="flex items-center gap-2 text-slate-400">
                  <Mail className="w-3.5 h-3.5" />
                  <p className="text-xs truncate tracking-tight">{s.email}</p>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <CreditCard className="w-3.5 h-3.5" />
                  <p className="text-xs font-mono font-bold tracking-tighter">{s.studentID}</p>
                </div>
              </div>

              {s.status !== "APPROVED" && (
                <button
                  onClick={() => { setSelectedStudent(s); setShowApproveModal(true); }}
                  className="w-full py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase hover:bg-indigo-600 active:scale-[0.98] transition-all"
                >
                  Approve Admission
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredStudents.length === 0 && !loading && (
          <div className="p-16 sm:p-24 bg-white rounded-[2.5rem] border border-dashed border-slate-200 text-center">
            <Search className="w-10 h-10 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-300 font-bold uppercase tracking-widest text-[10px]">No matches found</p>
          </div>
        )}
      </div>

      {/* Responsive Modal */}
      {showApproveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] sm:rounded-[3rem] p-6 sm:p-10 w-full max-w-sm shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-lg sm:text-xl font-black text-slate-900 uppercase">Confirm</h3>
              <button onClick={() => setShowApproveModal(false)} className="p-2 hover:bg-slate-50 rounded-full transition-all">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="text-center mb-8">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-4">
                <UserCheck className="w-8 h-8 sm:w-10 sm:h-10" />
              </div>
              <p className="text-slate-500 text-sm font-medium px-2">Approve admission for <br/><span className="text-slate-900 font-black">{selectedStudent?.fullName}</span>?</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={() => setShowApproveModal(false)} className="order-2 sm:order-1 flex-1 py-4 bg-slate-50 text-slate-400 font-black rounded-2xl text-[10px] uppercase">Cancel</button>
              <button
                onClick={handleApproveStudent}
                disabled={approving}
                className="order-1 sm:order-2 flex-1 py-4 bg-indigo-600 text-white font-black rounded-2xl text-[10px] uppercase shadow-lg shadow-indigo-200 disabled:opacity-50"
              >
                {approving ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}