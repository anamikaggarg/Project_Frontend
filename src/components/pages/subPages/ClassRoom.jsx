import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
  BookOpen,
  Users,
  Clock,
  ChevronRight,
  ArrowLeft,
  Plus,
  Search,
  UserPlus,
  X,
  CheckCircle,
  AlertCircle,
  GraduationCap,
  BookMarked,
  Hash,
  Layers,
  Loader2,
  Star,
  Tag,
  Bell,
  Check,
  Ban,
  FileSpreadsheet,
  MoveLeft,
  PanelLeftClose,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  offCourseTab,
  onCourseTab,
  resetCourse,
  resetSubject,
  setCourse,
} from "../../../redux/Slices/CourseSlice";
import Subjects from "./ClassRoom/Subjects"; // ✅ import Subjects component
import {
  onSubjectTab,
  toggleSubjectTab,
} from "../../../redux/Slices/SubjectTabToggleSlice";

const TEACHER_ID = "STAFF-9909";
const BASE_URL = "https://institute-backend-0ncp.onrender.com";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getInitials = (id = "") =>
  id
    .replace(/[^a-zA-Z0-9]/g, "")
    .slice(-3)
    .toUpperCase();

const statusPill = (s) =>
  s === "Active"
    ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
    : "bg-amber-100 text-amber-700 border border-amber-200";

// ─── Animation variants ───────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  }),
};

const slideRight = {
  hidden: { opacity: 0, x: 40 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
  },
  exit: { opacity: 0, x: -30, transition: { duration: 0.2 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.94 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.25 } },
  exit: { opacity: 0, scale: 0.94 },
};

// ─── Breadcrumb ───────────────────────────────────────────────────────────────
const Breadcrumb = ({ crumbs }) => (
  <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-5 flex-wrap">
    {crumbs.map((c, i) => (
      <React.Fragment key={i}>
        {i > 0 && <ChevronRight size={12} className="text-slate-300" />}
        <span
          onClick={c.onClick}
          className={
            i === crumbs.length - 1
              ? "text-indigo-600 font-semibold"
              : "hover:text-slate-600 cursor-pointer transition-colors"
          }
        >
          {c.label}
        </span>
      </React.Fragment>
    ))}
  </div>
);

// ─── Back Button ──────────────────────────────────────────────────────────────
const BackBtn = ({ onClick }) => (
  <motion.button
    whileHover={{ x: -2 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className="w-9 h-9 rounded-xl border-2 border-slate-200 flex items-center justify-center hover:border-indigo-400 hover:bg-indigo-50 transition-all mr-3 flex-shrink-0"
  >
    <ArrowLeft size={16} className="text-slate-600" />
  </motion.button>
);

// ─── Add Student Modal ────────────────────────────────────────────────────────
const AddStudentModal = ({ courseId, onClose, onAdded }) => {
  const [studentId, setStudentId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleAdd = async () => {
    const id = studentId.trim();
    if (!id) return setError("Please enter a Student ID.");
    setError("");
    setLoading(true);
    try {
      await axios.post(`${BASE_URL}/api/courses/${courseId}/students`, {
        studentId: id,
      });
      setSuccess(true);
      setTimeout(() => {
        onAdded(id);
        onClose();
      }, 800);
    } catch (err) {
      setError(
        err?.response?.data?.message || "Could not add student. Check the ID.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <motion.div
        variants={scaleIn}
        initial="hidden"
        animate="show"
        exit="exit"
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-br from-indigo-600 to-violet-600 px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
              <UserPlus size={18} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Add Student</h2>
              <p className="text-indigo-200 text-xs">Enroll by Student ID</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"
          >
            <X size={15} className="text-white" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Student ID
            </label>
            <div className="relative">
              <Hash
                size={14}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                autoFocus
                type="text"
                value={studentId}
                onChange={(e) => {
                  setStudentId(e.target.value);
                  setError("");
                }}
                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                placeholder="e.g. STU-005"
                className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-400 transition-colors placeholder:text-slate-400"
              />
            </div>
            {error && (
              <p className="mt-2 text-xs text-red-600 flex items-center gap-1">
                <AlertCircle size={12} /> {error}
              </p>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border-2 border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleAdd}
              disabled={loading || success}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white text-sm font-semibold disabled:opacity-60 flex items-center justify-center gap-2 shadow-md shadow-indigo-200"
            >
              {loading ? (
                <Loader2 size={15} className="animate-spin" />
              ) : success ? (
                <>
                  <CheckCircle size={15} /> Added!
                </>
              ) : (
                <>
                  <UserPlus size={15} /> Add Student
                </>
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ─── Student Badge ────────────────────────────────────────────────────────────
const StudentBadge = ({key, id, index }) => (
  <motion.div
    custom={index}
    variants={fadeUp}
    initial="hidden"
    animate="show"
    className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-100 hover:border-indigo-100 transition-all"
  >
    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
      {index}
    </div>
    <div>
      <p className="text-sm font-semibold text-slate-800">{id}</p>
      <p className="text-xs text-slate-400">Enrolled</p>
    </div>
  </motion.div>
);

// ─── Join Requests Panel ──────────────────────────────────────────────────────
const JoinRequestsPanel = ({ courseId, onApproved }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await axios(`http://localhost:1234/student/allStudents`);
      if (res.data.success === true) {
        setLoading(false);
        setRequests(res.data.students);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const approve = async (stuid) => {
    try {
      const res = await axios(
        `http://localhost:1234/institute/approveStudent/${stuid}/${courseId}`,
      );
      if (res.data.success === true) {
        fetchStudents();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const reject = async (stuid) => {
    console.log(stuid);
    try {
      const res = await axios(
        `http://localhost:1234/institute/rejectStudent/${stuid}/${courseId}`,
      );
      console.log(res.data);
      fetchStudents();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="show"
      custom={2}
      className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
    >
      <div className="p-4">
        {loading && (
          <div className="flex items-center justify-center py-8 gap-2 text-slate-400">
            <Loader2 size={18} className="animate-spin" />
            <span className="text-sm">Loading requests…</span>
          </div>
        )}

        {!loading && requests.length === 0 && (
          <div className="text-center py-8 text-slate-400">
            <Bell size={26} className="mx-auto mb-2 opacity-25" />
            <p className="text-sm">No pending join requests.</p>
          </div>
        )}

        {!loading && requests.length > 0 && (
          <div className="space-y-2">
            {requests.map((req, i) => {
              const rid = req.studentID;
              const isActing = actionId === rid;
              console.log(req.approvalStatus)
              return req.approvalStatus === "PENDING" ? (
                <motion.div
                  key={rid}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  animate="show"
                  className="flex items-center gap-3 p-3 rounded-xl border border-amber-100 bg-amber-50"
                >
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {getInitials(req.studentId)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800">
                      {req.studentID}
                    </p>
                    <p className="text-xs text-slate-400">
                      Wants to join this course
                    </p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      disabled={isActing}
                      onClick={() => approve(rid)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-50"
                    >
                      {isActing ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : (
                        <Check size={12} />
                      )}
                      Approve
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      disabled={isActing}
                      onClick={() => reject(rid)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-red-50 text-slate-500 hover:text-red-600 border border-slate-200 hover:border-red-200 text-xs font-semibold rounded-lg transition-colors disabled:opacity-50"
                    >
                      <Ban size={12} />
                      Reject
                    </motion.button>
                  </div>
                </motion.div>
              ) : null;
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
};

// ─── Students Panel ───────────────────────────────────────────────────────────
const StudentsPanel = ({
  students,
  courseId,
  showAddButton,
  onStudentAdded,
}) => {
  const [allStudents, setAllStudents] = useState([]);
  const fetchStudents = async () => {
    try {
      const res = await axios(`http://localhost:1234/student/allStudents`);
      if (res.data.success === true) {
        if (res.data.success === true) {
          setAllStudents(res.data.students.filter((s) => s.courseCodes.includes(courseId)))
        }
      }

      console.log(allStudents);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  // allStudents = students.filter((s) =>
  //   s.toLowerCase().includes(search.toLowerCase()),
  // );

  return (
    <>
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        custom={3}
        className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
      >
        <div className="px-5 py-3 border-b border-slate-100">
          <div className="relative">
            <Search
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search student ID…"
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-400 transition-colors placeholder:text-slate-400"
            />
          </div>
        </div>

        {allStudents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {allStudents.map((s, i) => (
              <StudentBadge key={s.studentID} id={s.fullName} index={i} />
            ))}
          </div>
        ) : (
          <div className="p-5">
            {allStudents.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {allStudents.map((id, i) => (
                  <StudentBadge key={id} id={id} index={i} />
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-slate-400">
                <Users size={28} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm">
                  {search
                    ? "No students match your search."
                    : "No students enrolled yet."}
                </p>
                {!search && showAddButton && (
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="mt-3 text-indigo-500 text-xs font-semibold hover:underline"
                  >
                    + Add the first student
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </motion.div>

      <AnimatePresence>
        {showAddModal && (
          <AddStudentModal
            courseId={courseId}
            onClose={() => setShowAddModal(false)}
            onAdded={(id) => {
              onStudentAdded(id);
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
};

// ─── LEVEL 3 — Subject Detail ─────────────────────────────────────────────────
const SubjectDetail = ({
  subject,
  course,
  allCourseStudents,
  onBack,
  onBackToList,
}) => {
  const [showJoinTab, setShowJoinTab] = useState(false);
  const [enrolledStudents, setEnrolledStudents] = useState(
    course.enrolledStudents ?? [],
  );

  const handleStudentAdded = (studentId) => {
    setEnrolledStudents((prev) =>
      prev.includes(studentId) ? prev : [...prev, studentId],
    );
  };

  return (
    <motion.div
      variants={slideRight}
      initial="hidden"
      animate="show"
      exit="exit"
      className="space-y-5"
    >
      <Breadcrumb
        crumbs={[
          { label: "My Courses", onClick: onBackToList },
          { label: course.name, onClick: onBack },
          { label: subject.name },
        ]}
      />

      {/* Header */}
      <div className="flex items-center">
        <BackBtn onClick={onBack} />
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold text-slate-800">{subject.name}</h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            {subject.subjectId}
          </p>
        </div>
        <span
          className={`ml-2 text-xs font-semibold px-3 py-1.5 rounded-full flex-shrink-0 ${statusPill(subject.status)}`}
        >
          {subject.status}
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          {
            icon: Users,
            label: "Students",
            value: allCourseStudents.length,
            grad: "from-violet-400 to-violet-500",
          },
          {
            icon: GraduationCap,
            label: "Teachers",
            value: subject.subjectTeacher?.length ?? 0,
            grad: "from-indigo-400 to-indigo-500",
          },
          {
            icon: CheckCircle,
            label: "Status",
            value: subject.status,
            grad: "from-emerald-400 to-emerald-500",
          },
        ].map(({ icon: Icon, label, value, grad }, i) => (
          <motion.div
            key={label}
            custom={i}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm"
          >
            <div
              className={`w-9 h-9 rounded-xl bg-gradient-to-br ${grad} flex items-center justify-center mb-3 shadow-sm`}
            >
              <Icon size={16} className="text-white" />
            </div>
            <p className="text-xs text-slate-400">{label}</p>
            <p className="text-base font-bold text-slate-800">{value}</p>
          </motion.div>
        ))}
      </div>

      {/* Teachers */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        custom={1}
        className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5"
      >
        <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
          <GraduationCap size={15} className="text-indigo-500" /> Teachers
        </h3>
        <div className="flex flex-wrap gap-2">
          {subject.subjectTeacher?.map((tid) => (
            <span
              key={tid}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${tid === TEACHER_ID ? "bg-indigo-100 text-indigo-700 border-indigo-200" : "bg-slate-100 text-slate-600 border-slate-200"}`}
            >
              {tid}
              {tid === TEACHER_ID && " (You)"}
            </span>
          ))}
        </div>
      </motion.div>

      <motion.div variants={fadeUp} className="flex lg:w-1/2 w-full relative">
        <div
          onClick={() => setShowJoinTab(false)}
          className="flex items-center justify-between px-5 py-4 border-b border-slate-100 cursor-pointer"
        >
          <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2 lg:text-base text-xs">
            <Users size={15} className="text-indigo-500 " />
            All Students
            <span className="bg-indigo-100 text-indigo-600 text-xs font-bold px-2 py-0.5 rounded-full ml-1">
              {enrolledStudents.length}
            </span>
          </h3>
        </div>

        <div
          onClick={() => setShowJoinTab(true)}
          className="flex items-center gap-2 px-5 py-4 border-b  border-slate-100 cursor-pointer"
        >
          <Bell size={15} className="text-amber-500" />
          <h3 className="text-sm font-bold text-slate-700 lg:text-base text-xs">
            Join Requests
          </h3>
        </div>
        <motion.div
          className="lg:w-1/3 h-1 w-1/2 absolute bg-indigo-600 rounded-full bottom-0"
          initial={false}
          animate={{
            left: !showJoinTab ? "0" : "auto",
            right: showJoinTab ? "0" : "auto",
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      </motion.div>

      {showJoinTab ? (
        <JoinRequestsPanel
          courseId={course.courseId}
          onApproved={handleStudentAdded}
        />
      ) : (
        <StudentsPanel
          students={enrolledStudents}
          courseId={course.courseId}
          showAddButton={true}
          onStudentAdded={handleStudentAdded}
        />
      )}
    </motion.div>
  );
};

// ─── LEVEL 2 — Course Detail ──────────────────────────────────────────────────
const CourseDetail = ({ course, onBack }) => {
  console.log(course)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const [isCourseTab, setIsCourseTab] = useState(false);
  const SubjectState = useSelector((state) => state.Course);
  const dispatch = useDispatch();
  const [enrolledStudents, setEnrolledStudents] = useState(
    course.enrolledStudents ?? [],
  );
  const [showAddModal, setShowAddModal] = useState(false);
  const [showJoinTab, setShowJoinTab] = useState(false);
  const allSubjects = course.subjects ?? [];
  const mySubjects = allSubjects.filter((s) =>
    s.subjectTeacher?.includes(TEACHER_ID),
  );

  const handleStudentAdded = (studentId) => {
    setEnrolledStudents((prev) =>
      prev.includes(studentId) ? prev : [...prev, studentId],
    );
  };

  // ✅ Fix: pass only the actual subject object, not the whole Redux state
  if (SubjectState.subjects.isSubject === true) {
    return (
      <SubjectDetail
        subject={SubjectState.subjects.subject}
        course={course}
        allCourseStudents={enrolledStudents}
        onBack={() => {
          dispatch(onSubjectTab());
          dispatch(onCourseTab());
          dispatch(resetSubject());
        }}
        onBackToList={onBack}
      />
    );
  }

  return (
    <motion.div
      variants={slideRight}
      initial="hidden"
      animate="show"
      exit="exit"
      className="space-y-5"
    >
      <div className="flex items-center justify-between w-full">
        <Breadcrumb
          crumbs={[
            { label: "My Courses", onClick: onBack },
            { label: course.name },
          ]}
        />
        <motion.button
          onClick={() => dispatch(toggleSubjectTab())}
          initial={{ x: 20 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.5, delay: 0 }}
          className="bg-indigo-500 px-3 py-2 rounded-lg border-indigo-900 flex items-center lg:text-base text-sm text-white lg:gap-3 gap-2 lg:hidden visible cursor-pointer font-semibold active:scale-97 duration-300 ease-in-out transition-all"
        >
          <PanelLeftClose className="lg:w-6 lg:h-6 w-4 h-4" />
          Subjects
        </motion.button>
      </div>

      {/* Header */}
      <div className="flex items-start gap-3">
        <BackBtn onClick={onBack} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-2xl font-bold text-slate-800 truncate">
              {course.name}
            </h2>
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${statusPill(course.status)}`}
            >
              {course.status}
            </span>
          </div>
          {course.description && (
            <p className="text-sm text-slate-500 mt-1">{course.description}</p>
          )}
        </div>
      </div>

      {/* Meta cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            icon: Tag,
            label: "Course ID",
            value: course.courseId,
            grad: "from-blue-400 to-blue-500",
          },
          {
            icon: Layers,
            label: "My Subjects",
            value: mySubjects.length,
            grad: "from-indigo-400 to-indigo-500",
          },
          {
            icon: FileSpreadsheet,
            label: "Attendance",
            value: 0,
            grad: "from-yellow-400 to-yellow-500",
          },
          {
            icon: Users,
            label: "Total Students",
            value: enrolledStudents.length,
            grad: "from-emerald-400 to-emerald-500",
          },
        ].map(({ icon: Icon, label, value, grad }, i) => (
          <motion.div
            key={label}
            custom={i}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm"
          >
            <div
              className={`w-9 h-9 rounded-xl bg-gradient-to-br ${grad} flex items-center justify-center mb-3 shadow-sm`}
            >
              <Icon size={16} className="text-white" />
            </div>
            <p className="text-xs text-slate-400">{label}</p>
            <p className="text-sm font-bold text-slate-800 truncate">{value}</p>
          </motion.div>
        ))}
      </div>

      {/* Class teacher */}
      {course.classTeacher?.length > 0 && (
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={1}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5"
        >
          <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
            <Star size={14} className="text-amber-400 fill-amber-400" /> Class
            Teacher
          </h3>
          <div className="flex flex-wrap gap-2">
            {course.classTeacher.map((id) => (
              <span
                key={id}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${id === TEACHER_ID ? "bg-amber-100 text-amber-700 border-amber-200" : "bg-slate-100 text-slate-600 border-slate-200"}`}
              >
                {id}
                {id === TEACHER_ID && " (You)"}
              </span>
            ))}
          </div>
        </motion.div>
      )}

      {/* ✅ Subjects component rendered here — reads from Redux automatically */}

      <motion.div
        variants={fadeUp}
        className="flex lg:w-1/2 w-full relative lg:justify-start justify-between"
      >
        <div
          onClick={() => setShowJoinTab(false)}
          className="flex items-center justify-between lg:px-5 px-3 py-4 border-b border-slate-100 cursor-pointer"
        >
          <h3 className="lg:text-sm text-xs font-bold text-slate-700 flex items-center gap-2">
            <Users size={15} className="text-indigo-500" />
            All Students
            <span className="bg-indigo-100 text-indigo-600 text-xs font-bold px-2 py-0.5 rounded-full ml-1">
              {enrolledStudents.length}
            </span>
          </h3>
        </div>
        <div
          onClick={() => setShowJoinTab(true)}
          className="flex items-center gap-2 lg:px-5 px-3 py-4 border-b border-slate-100 cursor-pointer"
        >
          <Bell size={15} className="text-amber-500" />
          <h3 className="lg:text-sm text-xs font-bold text-slate-700">
            Join Requests
          </h3>
        </div>
        <motion.div
          className="lg:w-1/3 w-1/2 h-1 absolute bg-indigo-600 rounded-full bottom-0"
          initial={false}
          animate={
            isMobile
              ? {
                  left: !showJoinTab ? "0" : "auto",
                  right: showJoinTab ? "0" : "auto",
                }
              : {
                  left: !showJoinTab ? "1rem" : "auto",
                  right: showJoinTab ? "6.5rem" : "auto",
                }
          }
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      </motion.div>

      {showJoinTab ? (
        <JoinRequestsPanel
          courseId={course.courseId}
          onApproved={handleStudentAdded}
        />
      ) : (
        <StudentsPanel
          students={enrolledStudents}
          courseId={course.courseId}
          showAddButton={true}
          onStudentAdded={handleStudentAdded}
        />
      )}
    </motion.div>
  );
};

// ─── LEVEL 1 — Course Card ────────────────────────────────────────────────────
const CourseCard = ({ course, index, onClick }) => {
  const mySubjectCount = (course.subjects ?? []).filter((s) =>
    s.subjectTeacher?.includes(TEACHER_ID),
  ).length;

  return (
    <motion.div
      custom={index}
      variants={fadeUp}
      initial="hidden"
      animate="show"
      whileHover={{ y: -4, transition: { duration: 0.18 } }}
      onClick={onClick}
      className="cursor-pointer bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all overflow-hidden group"
    >
      <div className="h-1.5 bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500" />
      <div className="lg:p-5 p-3">
        <div className="flex items-start justify-between mb-4 gap-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center group-hover:from-indigo-200 group-hover:to-violet-200 transition-colors flex-shrink-0">
            <BookOpen size={22} className="text-indigo-600" />
          </div>
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${statusPill(course.status)}`}
          >
            {course.status}
          </span>
        </div>
        <h3 className="text-lg font-bold text-slate-800 leading-snug mb-0.5">
          {course.name}
        </h3>
        {course.description && (
          <p className="text-xs text-slate-400 mb-4 line-clamp-2">
            {course.description}
          </p>
        )}
        <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap">
          <span className="flex items-center gap-1.5">
            <Clock size={12} className="text-indigo-400" />
            {course.duration}
          </span>
          <span className="flex items-center gap-1.5">
            <BookMarked size={12} className="text-indigo-400" />
            {mySubjectCount} subject{mySubjectCount !== 1 ? "s" : ""}
          </span>
          <span className="flex items-center gap-1.5">
            <Users size={12} className="text-indigo-400" />
            {course.enrolledStudents?.length ?? 0} enrolled
          </span>
        </div>
      </div>
      <div className="lg:px-5 px-3 lg:py-3 py-1 bg-slate-50 group-hover:bg-indigo-50 border-t border-slate-100 flex items-center justify-between transition-colors">
        <span className="text-xs text-slate-400 font-mono">
          {course.courseId}
        </span>
        <div className="flex items-center gap-1 text-xs text-indigo-500 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
          Open <ChevronRight size={14} />
        </div>
      </div>
    </motion.div>
  );
};

// ─── ROOT ─────────────────────────────────────────────────────────────────────
const ClassRoom = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [search, setSearch] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/courses/all`);
        const raw = res.data.courses;
        const data = Array.isArray(raw)
          ? raw
          : Array.isArray(raw?.data)
            ? raw.data
            : [];
        setCourses(data);
      } catch {
        setError("Could not load courses. Please check your connection.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const myCourses = courses.filter((c) => c.classTeacher?.includes(TEACHER_ID));
  const filtered = myCourses.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.courseId?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/20 to-slate-50 lg:py-8 py-4 lg:px-4 px-2 ">
      <div className="max-w-5xl mx-auto">
        <AnimatePresence mode="wait">
          {selectedCourse ? (
            <CourseDetail
              key={`course-${selectedCourse.courseId}`}
              course={selectedCourse}
              onBack={() => {
                setSelectedCourse(null);
                dispatch(offCourseTab());
                dispatch(resetSubject());
              }}
            />
          ) : (
            <motion.div
              key="list"
              initial="hidden"
              animate="show"
              exit="exit"
              variants={fadeUp}
            >
              {/* Header */}
              <div className="mb-7">
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-200">
                    <GraduationCap size={20} className="text-white" />
                  </div>
                  <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
                    ClassRoom
                  </h1>
                </div>
                <p className="text-slate-400 text-sm ml-1">
                  Courses assigned to{" "}
                  <span className="font-semibold text-indigo-500">
                    {TEACHER_ID}
                  </span>
                </p>
              </div>

              {/* Search */}
              <div className="relative mb-6">
                <Search
                  size={15}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by course name or ID…"
                  className="w-full pl-11 pr-4 lg:py-3.5 py-2 bg-white border border-slate-200 rounded-2xl text-sm shadow-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all placeholder:text-slate-400"
                />
              </div>

              {loading && (
                <div className="flex flex-col items-center justify-center py-28 gap-3 text-slate-400">
                  <Loader2 size={36} className="animate-spin text-indigo-400" />
                  <p className="text-sm font-medium">Loading your courses…</p>
                </div>
              )}

              {error && !loading && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-7 text-center">
                  <AlertCircle
                    size={28}
                    className="mx-auto mb-2 text-red-400"
                  />
                  <p className="text-sm text-red-700 font-medium">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="mt-3 text-xs text-red-500 underline"
                  >
                    Retry
                  </button>
                </div>
              )}

              {!loading && !error && filtered.length === 0 && (
                <div className="bg-white border border-slate-100 rounded-2xl p-14 text-center shadow-sm">
                  <BookOpen size={34} className="mx-auto mb-3 text-slate-300" />
                  <p className="text-slate-500 font-semibold">
                    {search
                      ? "No courses match your search."
                      : "No courses assigned yet."}
                  </p>
                  {!search && (
                    <p className="text-slate-400 text-sm mt-1">
                      Check that you are set as class teacher.
                    </p>
                  )}
                </div>
              )}

              {!loading && !error && filtered.length > 0 && (
                <>
                  <p className="text-xs text-slate-400 mb-3 font-medium">
                    {filtered.length} course{filtered.length !== 1 ? "s" : ""}{" "}
                    found
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map((course, i) => (
                      <CourseCard
                        key={course.courseId || course._id}
                        course={course}
                        index={i}
                        onClick={() => {
                          setSelectedCourse(course);
                          dispatch(onSubjectTab());
                          dispatch(setCourse(course));
                        }}
                      />
                    ))}
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ClassRoom;
