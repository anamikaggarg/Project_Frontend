import React from "react";

const YourSubjects = () => {
  return (
    <div>
      <h3 className="text-sm font-bold text-slate-600 mb-3 flex items-center gap-2">
        <BookMarked size={14} className="text-indigo-400" />
        Your Subjects ({mySubjects.length})
      </h3>

      {mySubjects.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-2xl p-10 text-center shadow-sm">
          <BookOpen size={28} className="mx-auto mb-2 text-slate-300" />
          <p className="text-sm text-slate-400">
            No subjects assigned to you in this course.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {mySubjects.map((subject, i) => (
            <motion.div
              key={subject.subjectId}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              whileHover={{ x: 3, transition: { duration: 0.18 } }}
              onClick={() => setSelectedSubject(subject)}
              className="cursor-pointer bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all overflow-hidden group flex items-center"
            >
              {/* Left accent bar */}
              <div className="w-1.5 self-stretch bg-gradient-to-b from-indigo-400 to-violet-500 rounded-l-2xl flex-shrink-0" />

              <div className="flex items-center flex-1 px-5 py-4 gap-4">
                {/* Icon */}
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-50 to-violet-100 flex items-center justify-center group-hover:from-indigo-100 group-hover:to-violet-200 transition-colors flex-shrink-0">
                  <BookMarked size={20} className="text-indigo-500" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-base font-bold text-slate-800">
                      {subject.name}
                    </span>
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusPill(subject.status)}`}
                    >
                      {subject.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                    <span className="font-mono">{subject.subjectId}</span>
                    <span className="flex items-center gap-1">
                      <Users size={11} /> {subject.students?.length ?? 0}{" "}
                      students
                    </span>
                  </div>
                </div>

                <ChevronRight
                  size={18}
                  className="text-slate-300 group-hover:text-indigo-400 transition-colors flex-shrink-0"
                />
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default YourSubjects;
