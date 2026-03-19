import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setInstitute } from "../../redux/slices/institute";
import { Save, Upload } from "lucide-react";

export default function ExecutiveInstituteProfile() {
  const dispatch = useDispatch();
  const API_URL = import.meta.env.VITE_API_URL;

  const institute = useSelector(
    (state) => state?.Institute?.currentInstitute
  );

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    alternatePhone: "",
    city: "",
    address: "",
    numberOfStudents: "",
    aadhaarNumber: "",
    gstNumber: "",
    courses: "",
    logo: ""
  });

  useEffect(() => {
    if (!institute) return;

    setFormData({
      name: institute?.name || "",
      email: institute?.email || "",
      contact: institute?.contact || "",
      alternatePhone: institute?.alternatePhone || "",
      city: institute?.city || "",
      address: institute?.address || "",
      numberOfStudents: institute?.numberOfStudents || "",
      aadhaarNumber: institute?.aadhaarNumber || "",
      gstNumber: institute?.gstNumber || "",
      courses: institute?.courses?.join(", ") || "",
      logo: institute?.logo || ""
    });
  }, [institute]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        logo: reader.result
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    try {
      if (!institute?.instituteId) {
        alert("Institute ID missing");
        return;
      }

      setLoading(true);

      const payload = {
        ...formData,
        numberOfStudents: Number(formData.numberOfStudents),
        courses: formData.courses
          ? formData.courses.split(",").map((c) => c.trim())
          : []
      };

      const res = await axios.put(
        `${API_URL}/institute/updateInstitute/${institute.instituteId}`,
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      if (res.data?.data) {
        dispatch(setInstitute(res.data.data));
      }

      alert("Profile Updated Successfully 🎉");
    } catch (error) {
      console.error("Update Error:", error.response?.data || error.message);
      alert("Update Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-10 px-4">

      
      <div className="max-w-6xl mx-auto mb-6">
        <div className="bg-slate-900 text-slate-300 text-xs py-3 px-6 rounded-lg shadow tracking-widest uppercase">
          Institute ID: {institute?.instituteId || "UNREGISTERED"}
        </div>
      </div>

      <div className="max-w-6xl mx-auto bg-white/70 backdrop-blur-xl shadow-2xl rounded-2xl p-10 border border-white/40">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
          <div className="flex items-center gap-8">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-100">
                {formData.logo ? (
                  <img
                    src={formData.logo}
                    alt="Institute Logo"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-sm text-gray-400">
                    No Logo
                  </div>
                )}
              </div>
              <label className="absolute bottom-0 right-0 bg-slate-900 text-white p-2 rounded-full cursor-pointer shadow hover:bg-slate-800 transition">
                <Upload size={16} />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div>
              <h1 className="text-3xl font-bold text-slate-800">
                Institute Profile
              </h1>
              <p className="text-sm text-slate-500 mt-2">
                Manage and update your institute information
              </p>
            </div>
          </div>
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex items-center gap-2 px-8 py-3 bg-slate-900 text-white rounded-xl font-semibold shadow-lg hover:scale-105 hover:bg-slate-800 transition-all duration-200 disabled:opacity-60"
          >
            <Save size={18} />
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {[
            { label: "Institute Name", name: "name", type: "text" },
            { label: "Email", name: "email", type: "email" },
            { label: "Contact", name: "contact", type: "text" },
            { label: "Alternate Phone", name: "alternatePhone", type: "text" },
            { label: "City", name: "city", type: "text" },
            { label: "Address", name: "address", type: "text" },
            { label: "Number of Students", name: "numberOfStudents", type: "number" },
            { label: "Aadhaar Number", name: "aadhaarNumber", type: "text" },
            { label: "GST Number", name: "gstNumber", type: "text" },
            { label: "Courses (comma separated)", name: "courses", type: "text" }
          ].map((field) => (
            <div key={field.name} className="flex flex-col">
              <label className="text-sm font-medium text-slate-600 mb-2">
                {field.label}
              </label>
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                className="w-full border border-slate-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-slate-800 focus:outline-none transition shadow-sm bg-white"
              />
            </div>
          ))}

        </div>

      </div>
    </div>
  );
}