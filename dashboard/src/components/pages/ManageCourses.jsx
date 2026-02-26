import { useState } from "react";
import { X } from "lucide-react";

export default function ManageCourses() {
  const [selectedCourse, setSelectedCourse] = useState("Web Development");
  const [showModal, setShowModal] = useState(false);

  const courses = [
    { name: "Web Development", students: 120, status: "Healthy" },
    { name: "Digital Marketing", students: 95, status: "Active" },
    { name: "Graphic Design", students: 80, status: "Average" },
    { name: "Data Science", students: 110, status: "Healthy" },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen relative">
      <div className="bg-white rounded-2xl shadow p-6">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Manage Courses</h1>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            + Add Course
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-xl">
            <p className="text-gray-500 text-sm">Total Courses</p>
            <h2 className="text-xl font-bold">12</h2>
          </div>
          <div className="bg-green-50 p-4 rounded-xl">
            <p className="text-gray-500 text-sm">Total Students</p>
            <h2 className="text-xl font-bold">650</h2>
          </div>
          <div className="bg-purple-50 p-4 rounded-xl">
            <p className="text-gray-500 text-sm">Avg Completion</p>
            <h2 className="text-xl font-bold">83%</h2>
          </div>
        </div>

        {/* Layout */}
        <div className="grid grid-cols-3 gap-6">
          
          {/* LEFT */}
          <div className="col-span-2 space-y-4">
            {courses.map((course, index) => (
              <div
                key={index}
                onClick={() => setSelectedCourse(course.name)}
                className={`p-4 rounded-xl cursor-pointer transition ${
                  selectedCourse === course.name
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-gray-50 hover:bg-gray-100"
                }`}
              >
                <h3 className="font-semibold">{course.name}</h3>
                <p className="text-sm">
                  Duration: 6 Months | {course.students} Students
                </p>
              </div>
            ))}
          </div>

          {/* RIGHT PANEL */}
          <div className="bg-gray-50 rounded-xl p-5 space-y-4">
            <h2 className="font-semibold text-lg">{selectedCourse}</h2>
            <p className="text-sm">Duration: 6 Months</p>
            <p className="text-sm">Faculty: Rahul Sharma</p>
            <p className="text-sm text-green-600 font-medium">Active</p>

            <div className="border-t pt-4">
              <p className="font-medium">Total Students: 120</p>
              <p className="text-sm">Active: 95</p>
              <p className="text-sm">Completed: 20</p>
              <p className="text-sm">Dropout: 5</p>
            </div>

            <div className="border-t pt-4">
              <p className="text-sm mb-1">Seats Filled: 30 / 40</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full w-[75%]"></div>
              </div>
            </div>

            <div className="border-t pt-4">
              <p className="text-sm">Next Batch: 10 Feb</p>
              <p className="text-sm text-gray-500">Starts in 12 Days</p>
            </div>
          </div>
        </div>
      </div>

      {/* ================= MODAL ================= */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          
          <div className="bg-white w-[500px] rounded-2xl shadow-xl p-6 relative">
            
            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute right-4 top-4 text-gray-500 hover:text-black"
            >
              <X />
            </button>

            <h2 className="text-xl font-semibold mb-4">
              Add New Course
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Course Name"
                className="border p-2 rounded-lg"
              />
              <input
                type="text"
                placeholder="Duration"
                className="border p-2 rounded-lg"
              />
              <input
                type="number"
                placeholder="Total Seats"
                className="border p-2 rounded-lg"
              />
              <input
                type="text"
                placeholder="Faculty Name"
                className="border p-2 rounded-lg"
              />
               <input
                type="text"
                placeholder="Fees"
                className="border p-2 rounded-lg"
              />

               <input
                type="textarea"
                placeholder="Description"
                className="border p-2 rounded-lg"
              />
             
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                Save Course
              </button>
            </div>

          </div>
        </div>
      )}
      {/* ========================================= */}
    </div>
  );
}
