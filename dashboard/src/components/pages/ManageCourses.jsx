import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X, Plus, Loader2, Pencil, Trash2, ArrowRight, BookOpen, Archive, RefreshCw, LayoutGrid } from "lucide-react";

const BASE_URL = "https://institute-backend-0ncp.onrender.com/api/courses";
const FETCH_URL = `${BASE_URL}/all`;
const CREATE_URL = `${BASE_URL}/create`;

export default function ManageCourses() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingCourse, setEditingCourse] = useState(null);
  
  // ✅ State to toggle between Active and Archived view
  const [showArchivedOnly, setShowArchivedOnly] = useState(false);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await fetch(FETCH_URL);
      const data = await response.json();
      const finalData = data.courses || [];
      setCourses(finalData);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCourses(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    // Logic to handle subjects and sections as arrays
    const subjectsArray = formData.get("subjects") 
      ? formData.get("subjects").split(",").map(s => s.trim()) 
      : [];
    const sectionsArray = formData.get("sections") 
      ? formData.get("sections").split(",").map(s => s.trim()) 
      : [];

    const courseData = {
      name: formData.get("name"), 
      duration: formData.get("duration"),
      faculty: formData.get("faculty"),
      maxSeats: Number(formData.get("maxSeats")),
      description: formData.get("description") || "No description provided",
      status: formData.get("status") || "Active",
      subjects: subjectsArray, // Added subjects
      sections: sectionsArray  // Added sections
    };

    const url = editingCourse 
      ? `${BASE_URL}/updateCourse/${editingCourse.courseId}` 
      : CREATE_URL;
    
    const method = editingCourse ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(courseData),
      });

      if (response.ok) {
        setShowModal(false);
        setEditingCourse(null);
        fetchCourses(); 
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || "Failed to save"}`);
      }
    } catch (error) {
      alert("API Error: Connection failed!");
    }
  };

  const handleDelete = async (courseId) => {
    // if(!window.confirm("Are you sure? This will permanently delete the course.")) return;
    try {
      const response = await fetch(`${BASE_URL}/deleteCourse/${courseId}`, { 
        method: "DELETE" 
      });
      
      if (response.ok) {
        fetchCourses();
      } else {
        alert("Delete failed on server");
      }
    } catch (err) { 
      alert("Network Error"); 
    }
  };

  // const handleArchive = async (course) => {
  //   const isArchived = course.status === "Archived";
  //   const newStatus = isArchived ? "Active" : "Archived";
    
  //   // if(!window.confirm(`Do you want to ${isArchived ? 'restore' : 'archive'} "${course.name}"?`)) return;

  //   try {
  //     const response = await fetch(`${BASE_URL}/updateCourse/${course.courseId}`, {
  //       method: "PUT",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ ...course, status: newStatus }),
  //     });

  //     if (response.ok) {
  //       fetchCourses();
  //     } else {
  //       alert("Status update failed");
  //     }
  //   } catch (err) {
  //     alert("Network Error");
  //   }
  // };

  // ✅ Filter logic based on the toggle button
  const filteredCourses = courses.filter(course => 
    showArchivedOnly ? course.status === "Archived" : course.status !== "Archived"
  );

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#f8fafc]">
      <Loader2 className="animate-spin text-blue-600" size={40} />
    </div>
  );

  return (
    <div className="p-6 lg:p-10 bg-[#f8fafc] min-h-screen font-sans text-slate-900">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-semibold font-black text-slate-800 ">
              {showArchivedOnly ? "Archived Courses" : "Manage Courses"}
            </h1>
            <p className="text-slate-500 font-medium">
              {showArchivedOnly ? "Viewing completed or hidden courses" : "Manage your active school classes"}
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* ✅ Archive Toggle Button */}
            <button 
              onClick={() => setShowArchivedOnly(!showArchivedOnly)}
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all border ${
                showArchivedOnly 
                ? "bg-amber-100 border-amber-200 text-amber-700" 
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {showArchivedOnly ? <LayoutGrid size={18}/> : <Archive size={18}/>}
              {showArchivedOnly ? "Show Active" : "View Archives"}
            </button>

            <button 
              onClick={() => { setEditingCourse(null); setShowModal(true); }}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all"
            >
              <Plus size={18} /> Add Course
            </button>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.length > 0 ? filteredCourses.map((course) => {
            const isArchived = course.status === "Archived";
            
            return (
              <div 
                key={course.courseId} 
                className={`bg-white border rounded-[2rem] p-6 relative group transition-all duration-300 hover:shadow-xl ${isArchived ? 'border-amber-200 bg-amber-50/30' : 'border-slate-200'}`}
              >
                {/* Actions Menu */}
                <div className="absolute top-6 right-6 flex gap-2  group-hover:opacity-100 transition-opacity">
                   <button 
                    onClick={() => handleArchive(course)} 
                    title={isArchived ? "Restore Course" : "Archive Course"}
                    className={`p-2 rounded-lg transition-colors ${isArchived ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}
                   >
                     {isArchived ? <RefreshCw size={16}/> : <Archive size={16}/>}
                   </button>

                   <button 
                    onClick={() => { setEditingCourse(course); setShowModal(true); }} 
                    className="p-2 bg-blue-100 text-blue-700 rounded-lg"
                   >
                    <Pencil size={16}/>
                   </button>
                   
                   <button 
                    onClick={() => handleDelete(course.courseId)} 
                    className="p-2 bg-red-100 text-red-700 rounded-lg"
                   >
                    <Trash2 size={16}/>
                   </button>
                </div>

                <div className="flex items-center gap-4 mb-6">
                  <div className={`p-4 rounded-2xl ${isArchived ? 'bg-amber-100 text-amber-600' : 'bg-blue-50 text-blue-600'}`}>
                    <BookOpen size={28} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-lg">{course.name}</h4>
                    <p className="text-xs font-mono text-slate-400 uppercase tracking-widest">{course.courseId}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                   <div className="bg-slate-50 p-3 rounded-xl">
                      <p className="text-[10px] uppercase font-black text-slate-400 mb-1">Faculty</p>
                      <p className="font-bold text-slate-700 truncate">{course.faculty}</p>
                   </div>
                   <div className="bg-slate-50 p-3 rounded-xl">
                      <p className="text-[10px] uppercase font-black text-slate-400 mb-1">Duration</p>
                      <p className="font-bold text-slate-700">{course.duration}</p>
                   </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="text-xs font-bold text-slate-500">{course.maxSeats} Seats available</span>
                  </div>
                  <button 
                    onClick={() => navigate(`/dashboard/course/${course.courseId}`)}
                    className="text-blue-600 font-black text-sm flex items-center gap-1 hover:gap-2 transition-all"
                  >
                    DETAILS <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            );
          }) : (
            <div className="col-span-full py-20 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                <div className="inline-flex p-4 bg-white rounded-2xl shadow-sm mb-4">
                  <Archive className="text-slate-300" size={32} />
                </div>
                <p className="text-slate-500 font-bold">No courses found in {showArchivedOnly ? "Archives" : "Active list"}.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal Section */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSubmit} className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-xl font-black text-slate-800 tracking-tight">{editingCourse ? "Update Class" : "New Class Setup"}</h2>
              <button type="button" onClick={() => setShowModal(false)} className="bg-white p-2 rounded-full text-slate-400 hover:text-red-500 shadow-sm transition-colors"><X size={20}/></button>
            </div>
            
            <div className="p-8 space-y-5 h-[450px] overflow-y-auto custom-scrollbar">
              <div>
                <label className="block text-[10px] font-black text-slate-400  mb-2 ml-1"> Course Name</label>
                <input name="name" required defaultValue={editingCourse?.name || ""} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:ring-4 focus:ring-blue-100 font-bold text-slate-700 transition-all" placeholder="e.g. Advanced Mathematics" />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">Subjects / Topic Name</label>
                <input name="subjects" required defaultValue={editingCourse?.subjects?.join(", ") || ""} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:ring-4 focus:ring-blue-100 font-bold text-slate-700 transition-all" placeholder="Maths, Physics, etc." />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">Sections (Optional)</label>
                <input name="sections"  defaultValue={editingCourse?.sections?.join(", ") || ""} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:ring-4 focus:ring-blue-100 font-bold text-slate-700 transition-all" placeholder="A, B, C" />
              </div>
              
            

           

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">Quick Description</label>
                <textarea name="description" defaultValue={editingCourse?.description || ""} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 outline-none font-bold text-slate-700 resize-none focus:ring-4 focus:ring-blue-100" rows="2"></textarea>
              </div>
            </div>

            <div className="p-8 bg-slate-50/50 flex gap-4">
              <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 font-bold text-slate-500 hover:bg-white rounded-2xl transition-all border border-transparent hover:border-slate-200">Dismiss</button>
              <button type="submit" className="flex-1 py-4 font-bold bg-slate-900 text-white rounded-2xl shadow-xl hover:bg-blue-600 transition-all">
                {editingCourse ? "Confirm Update" : "Launch Course"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}