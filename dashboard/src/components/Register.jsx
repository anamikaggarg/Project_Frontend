// import { useState } from "react";
// import axios from "axios";

// function Register() {
//   const [role, setRole] = useState("student");
//   const [darkMode, setDarkMode] = useState(true);

//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [contact, setContact] = useState("");
//   const [city, setCity] = useState("");
//   const [instituteName, setInstituteName] = useState(""); // student only
//   const [numberOfStudents, setNumberOfStudents] = useState("");
//   const [address, setAddress] = useState("");
//   const [aadhaarNumber, setAadhaarNumber] = useState("");
//   const [alternatePhone, setAlternatePhone] = useState("");
//   const [courses, setCourses] = useState("");
//   const [gstNumber, setGstNumber] = useState("");
  
//   const [file, setFile] = useState(null);

  
//   const API_URL = import.meta.env.VITE_API_URL + "/institute/register";

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const formData = new FormData();
//       formData.append("name", name);
//       formData.append("email", email);
//       formData.append("password", password);
//       formData.append("contact", contact);
//       formData.append("city", city);
//       formData.append("numberOfStudents", numberOfStudents);
//       formData.append("address", address);
//       formData.append("aadhaarNumber", aadhaarNumber);
//       formData.append("alternatePhone", alternatePhone);
//       formData.append("courses", courses);
//       formData.append("gstNumber", gstNumber);

//       if (role === "student") formData.append("instituteName", instituteName);

//       if (file) formData.append("logo", file);

//       const res = await axios.post(API_URL, formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       console.log("Response:", res.data);
//       alert("Account created successfully!");
//     } catch (err) {
//       console.error(err.response?.data || err.message);
//       alert("Error: " + (err.response?.data?.message || err.message));

//     }
//   };

//   return (
//     <div
//       className={`min-h-screen flex items-center justify-center transition-colors duration-300
//       ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}
//     >
//       <button
//         onClick={() => setDarkMode(!darkMode)}
//         className={`absolute top-6 right-6 px-4 py-2 rounded
//         ${darkMode ? "bg-gray-700" : "bg-gray-300"}`}
//       >
//         {darkMode ? "Light Mode " : "Dark Mode "}
//       </button>

//       <div
//         className={`w-full max-w-md rounded-2xl p-8 shadow-xl transition-colors
//         ${darkMode ? "bg-gray-800" : "bg-white"}`}
//       >
//         <h2
//           className={`text-3xl font-bold mb-6
//           ${darkMode ? "text-indigo-400" : "text-indigo-600"}`}
//         >
//           Create Account
//         </h2>

      
//         <div className="flex space-x-6 mb-5">
//           <label className="flex items-center space-x-2">
//             <input
//               type="radio"
//               name="role"
//               value="student"
//               checked={role === "student"}
//               onChange={(e) => setRole(e.target.value)}
//               className="accent-blue-500"
//             />
//             <span>Student</span>
//           </label>

//           <label className="flex items-center space-x-2">
//             <input
//               type="radio"
//               name="role"
//               value="teacher"
//               checked={role === "teacher"}
//               onChange={(e) => setRole(e.target.value)}
//               className="accent-blue-500"
//             />
//             <span>Teacher</span>
//           </label>
//         </div>

//         <form onSubmit={handleSubmit}>
       
//           <div className="mb-4">
//             <label className="block mb-1 text-sm">Full Name</label>
//             <input
//               type="text"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               placeholder="Your full name"
//               className={`w-full px-4 py-2 rounded border placeholder-gray-400
//                 ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-100 border-gray-300 text-black"}`}
//               required
//             />
//           </div>

//           {/* Email */}
//           <div className="mb-4">
//             <label className="block mb-1 text-sm">Email</label>
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="you@example.com"
//               className={`w-full px-4 py-2 rounded border placeholder-gray-400
//                 ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-100 border-gray-300 text-black"}`}
//               required
//             />
//           </div>

         
//           <div className="mb-4">
//             <label className="block mb-1 text-sm">Contact Number</label>
//             <input
//               type="text"
//               value={contact}
//               onChange={(e) => setContact(e.target.value)}
//               placeholder="Contact number"
//               className={`w-full px-4 py-2 rounded border placeholder-gray-400
//                 ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-100 border-gray-300 text-black"}`}
//               required
//             />
//           </div>

        
//           <div className="mb-4">
//             <label className="block mb-1 text-sm">City</label>
//             <input
//               type="text"
//               value={city}
//               onChange={(e) => setCity(e.target.value)}
//               placeholder="City"
//               className={`w-full px-4 py-2 rounded border placeholder-gray-400
//                 ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-100 border-gray-300 text-black"}`}
//               required
//             />
//           </div>

          
//           {role === "student" && (
//             <div className="mb-4">
//               <label className="block mb-1 text-sm">Institute Name</label>
//               <input
//                 type="text"
//                 value={instituteName}
//                 onChange={(e) => setInstituteName(e.target.value)}
//                 placeholder="Enter institute name"
//                 className={`w-full px-4 py-2 rounded border placeholder-gray-400
//                   ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-100 border-gray-300 text-black"}`}
//                 required
//               />
//             </div>
//           )}

       
//           <div className="mb-4">
//             <label className="block mb-1 text-sm">Password</label>
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="****"
//               className={`w-full px-4 py-2 rounded border placeholder-gray-400
//                 ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-100 border-gray-300 text-black"}`}
//               required
//             />
//           </div>

//           <div className="mb-4">
//             <label className="block mb-1 text-sm">Number of Students</label>
//             <input
//               type="number"
//               value={numberOfStudents}
//               onChange={(e) => setNumberOfStudents(e.target.value)}
//               placeholder="Number of students"
//               className={`w-full px-4 py-2 rounded border placeholder-gray-400
//                 ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-100 border-gray-300 text-black"}`}
//               required
//             />
//           </div>

          
//           <div className="mb-4">
//             <label className="block mb-1 text-sm">Address</label>
//             <input
//               type="text"
//               value={address}
//               onChange={(e) => setAddress(e.target.value)}
//               placeholder="Address"
//               className={`w-full px-4 py-2 rounded border placeholder-gray-400
//                 ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-100 border-gray-300 text-black"}`}
//               required
//             />
//           </div>

          
//           <div className="mb-4">
//             <label className="block mb-1 text-sm">Aadhaar Number</label>
//             <input
//               type="text"
//               value={aadhaarNumber}
//               onChange={(e) => setAadhaarNumber(e.target.value)}
//               placeholder="Aadhaar Number"
//               className={`w-full px-4 py-2 rounded border placeholder-gray-400
//                 ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-100 border-gray-300 text-black"}`}
//             />
//           </div>

         
//           <div className="mb-4">
//             <label className="block mb-1 text-sm">Alternate Phone</label>
//             <input
//               type="text"
//               value={alternatePhone}
//               onChange={(e) => setAlternatePhone(e.target.value)}
//               placeholder="Alternate Phone"
//               className={`w-full px-4 py-2 rounded border placeholder-gray-400
//                 ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-100 border-gray-300 text-black"}`}
//             />
//           </div>

         
//           <div className="mb-4">
//             <label className="block mb-1 text-sm">Courses</label>
//             <input
//               type="text"
//               value={courses}
//               onChange={(e) => setCourses(e.target.value)}
//               placeholder="Courses"
//               className={`w-full px-4 py-2 rounded border placeholder-gray-400
//                 ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-100 border-gray-300 text-black"}`}
//             />
//           </div>

          
//           <div className="mb-4">
//             <label className="block mb-1 text-sm">GST Number</label>
//             <input
//               type="text"
//               value={gstNumber}
//               onChange={(e) => setGstNumber(e.target.value)}
//               placeholder="GST Number"
//               className={`w-full px-4 py-2 rounded border placeholder-gray-400
//                 ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-100 border-gray-300 text-black"}`}
//             />
//           </div>

         
//           <div className="mb-4">
//             <label className="block mb-1 text-sm">Upload Logo (optional)</label>
//             <input
//               type="file"
//               onChange={(e) => setFile(e.target.files[0])}
//               className={`w-full px-4 py-2 rounded border placeholder-gray-400
//                 ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-100 border-gray-300 text-black"}`}
//             />
//           </div>

          
//           <button
//             type="submit"
//             className="w-full py-3 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
//           >
//             Create Account
//           </button>
//         </form>

     
//         <p className="text-sm text-center mt-6 text-gray-600">
//           Already have an account?{" "}
//           <a href="/login" className="text-indigo-600 font-semibold hover:underline">
//             Login
//           </a>
//         </p>
//       </div>
//     </div>
//   );
// }

// export default Register;
