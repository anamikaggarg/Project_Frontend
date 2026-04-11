import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const teacher_id = "STAFF-001";

const isLiveLecture = (lecture) => {
  const today = new Date().toISOString().split("T")[0];
  return lecture.date === today && lecture.upcoming;
};

const formatLectureTime = (time, duration) => {
  if (!time || !duration) return time;

  let minutes = 0;

  if (typeof duration === "string" && duration.includes("hr")) {
    minutes = parseFloat(duration) * 60;
  } else {
    minutes = parseInt(duration);
  }

  const start = new Date(`1970-01-01 ${time}`);
  const end = new Date(start.getTime() + minutes * 60000);

  const format = (date) =>
    date.toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

  return `${format(start)} - ${format(end)}`;
};

const UpcomingLectures = () => {
  const navigate = useNavigate();
  const [lectures, setLectures] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      const url = "http://localhost:1234/api/courses/all";
      try {
        const response = await axios(url);
        const courses = response.data.data;

        const allLectures = courses.flatMap((course) =>
          (course.subjects || []).map((subject) => ({
            ...subject,
            courseName: course.name,
            courseId: course.courseId,
          }))
        );

        const staffLectures = allLectures.filter((lecture) =>
          lecture.subjectTeacher?.includes(teacher_id)
        );
        setLectures(staffLectures);
      } catch (error) {
        console.log(error);
      }
    };

    fetchCourses();
  }, []);

  const handleLectureClick = (lecture) => {
    if (isLiveLecture(lecture)) {
      navigate("classroom", { state: { activeLecture: lecture } });
    }
  };

  return (
    <div className="p-4 bg-gray-50 rounded-2xl shadow-md w-full max-w-md">
      <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-600 rounded-full">
        Upcoming
      </span>

      <div className="space-y-2 mt-3">
        {/* ✅ Fixed condition */}
        {lectures.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-400 py-6"
          >
            No lectures assigned to you
          </motion.div>
        ) : (
          lectures.map((lecture, index) => {
            const live = isLiveLecture(lecture);

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.03 }}
                onClick={() => handleLectureClick(lecture)}
                className={`bg-white rounded-xl p-4 shadow-sm flex justify-between items-center
                ${
                  live
                    ? "cursor-pointer ring-2 ring-blue-400 ring-offset-1"
                    : "cursor-default opacity-70"
                }`}
              >
                <div className="flex lg:gap-3 items-center">
                  <div
                    className={`w-2 h-10 rounded-full ${
                      live ? "bg-blue-500" : "bg-violet-600"
                    }`}
                  />
                  <div>
                    <h2 className="font-semibold text-gray-800">
                      {lecture.name || lecture.subject}
                      <span className="ml-1 text-xs text-gray-400">
                        ({lecture.courseName})
                      </span>

                      {live && (
                        <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                          Live
                        </span>
                      )}
                    </h2>

                    {/* ✅ FIXED TIME DISPLAY */}
                    <p className="text-sm text-gray-500">
                      {formatLectureTime(
                        lecture.time,
                        lecture.duration
                      )}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default UpcomingLectures;