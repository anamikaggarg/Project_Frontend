import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import {
  BookMarked,
  BookOpen,
  ChevronRight,
  GraduationCap,
} from "lucide-react";
import { setSubject } from "../../../../redux/Slices/CourseSlice";
import { offSubjectTab, toggleSubjectTab } from "../../../../redux/Slices/SubjectTabToggleSlice";

const Subjects = () => {
  const dispatch = useDispatch();

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    show: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] },
    }),
  };

  const statusPill = (s) =>
    s === "Active"
      ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
      : "bg-amber-100 text-amber-700 border border-amber-200";

  const Course = useSelector((state) => state.Course);
  const allSubjects = Course.course?.subjects ?? []; // ✅ safe access with fallback

  return (
    <div>
      {/* Subjects List */}
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 100 }}
        transition={{ duration: 0.4 }}
        custom={2}
        className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
      >
        <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100">
          <BookMarked size={15} className="text-indigo-500" />
          <h3 className="text-sm font-bold text-slate-700">Subjects</h3>
          <span className="bg-indigo-100 text-indigo-600 text-xs font-bold px-2 py-0.5 rounded-full ml-1">
            {allSubjects.length}
          </span>
        </div>

        <div className="p-2 space-y-1">
          {allSubjects.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <BookMarked size={26} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">No subjects in this course.</p>
            </div>
          ) : (
            allSubjects.map((subject, i) => {
              return (
                <motion.div
                  key={subject.subjectId || i}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  animate="show"
                  whileHover={{ x: 3, transition: { duration: 0.15 } }}
                  onClick={() => {dispatch(setSubject(subject))
                    dispatch(offSubjectTab())}
                  } // ✅ pass subject as payload
                  className="flex items-center gap-2 p-2 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/50 cursor-pointer transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                    <BookOpen size={16} className="text-indigo-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-slate-800 truncate">
                        {subject.name}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 mt-0.5 text-xs text-slate-400">
                      <span className="font-mono">{subject.subjectId}</span>
                      <span className="flex items-center gap-1">
                        <GraduationCap size={11} />{" "}
                        {subject.subjectTeacher?.length ?? 0} teacher
                        {subject.subjectTeacher?.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full hidden sm:block ${statusPill(subject.status)}`}
                    >
                      {subject.status}
                    </span>
                    <ChevronRight
                      size={16}
                      className="text-slate-300 group-hover:text-indigo-400 transition-colors"
                    />
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Subjects;