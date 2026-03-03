import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setInstitute } from "../../redux/slices/institute";
import { Upload, Save } from "lucide-react";

export default function ExecutiveInstituteProfile() {
  const dispatch = useDispatch();

  const institute = useSelector(
    (state) => state?.Institute?.currentInstitute
  );

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    address: "",
    website: "",
    registrationNumber: "",
    inaugurationYear: "",
    gstin: "",
    pan: ""
  });

  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");

  useEffect(() => {
     console.log("Redux Institute Data", institute);
    if (!institute) return;

    setFormData({
      name: institute?.name || "",
      email: institute?.email || "",
      contact: institute?.contact || "",
      address: institute?.address || "",
      website: institute?.website || "",
      registrationNumber: institute?.registrationNumber || "",
      inaugurationYear: institute?.inaugurationYear || "",
      gstin: institute?.gstin || "",
      pan: institute?.pan || ""
    });

    setLogoPreview(institute?.logo || "");
  }, [institute]);

  // ✅ Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // ✅ Handle Logo Upload
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file.");
      return;
    }

    setLogoFile(file);

    const previewURL = URL.createObjectURL(file);
    setLogoPreview(previewURL);
  };

  // ✅ Save Profile
  const handleSave = async () => {
    if (!institute?.instituteId) {
      alert("Institute ID missing");
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();

      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key] || "");
      });

      if (logoFile) {
        data.append("logo", logoFile);
      }

      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/institute/update/${institute.instituteId}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      dispatch(setInstitute(res?.data?.data));
      alert("Profile Updated Successfully 🎉");
    } catch (error) {
      console.error("Update Error:", error?.response?.data || error.message);
      alert("Something went wrong while updating.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 text-slate-900">
      
      {/* Top Bar */}
      <div className="bg-slate-900 text-xs text-slate-400 py-3 px-8 uppercase tracking-widest">
        Institute ID: {institute?.instituteId || "UNREGISTERED"}
      </div>

      <div className="max-w-7xl mx-auto px-8 py-12">

        {/* Header */}
        <div className="flex justify-between items-center mb-10 border-b border-slate-300 pb-6">
          <div>
            <h1 className="text-3xl font-light">
              Update your <span className="font-bold">Profile</span>
            </h1>
            <p className="text-slate-500 text-sm mt-2">
              Configure branding, identity & fiscal details.
            </p>
          </div>

          <button
            onClick={handleSave}
            disabled={loading}
            className="flex items-center gap-2 px-8 py-3 bg-slate-900 text-white text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition shadow-lg disabled:opacity-60"
          >
            <Save size={14} />
            {loading ? "Saving..." : "Commit Changes"}
          </button>
        </div>

        {/* Logo Section */}
        <div className="bg-white border border-slate-200 p-8 mb-8 shadow-sm rounded-xl">
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6">
            Institute Logo
          </h2>

          <div className="flex items-center gap-8">
            <div className="w-32 h-32 border border-slate-300 rounded-lg overflow-hidden bg-slate-50 flex items-center justify-center">
              {logoPreview ? (
                <img
                  src={logoPreview}
                  alt="Logo Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xs text-slate-400">No Logo</span>
              )}
            </div>

            <label className="cursor-pointer flex items-center gap-2 px-6 py-3 bg-slate-900 text-white text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition">
              <Upload size={14} />
              Upload Logo
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                hidden
              />
            </label>
          </div>
        </div>

        {/* Form Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white border border-slate-200 p-8 shadow-sm rounded-xl">
          {Object.keys(formData).map((key) => (
            <div key={key}>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                {key.replace(/([A-Z])/g, " $1")}
              </label>
              <input
                type={
                  key === "email"
                    ? "email"
                    : key === "inaugurationYear"
                    ? "number"
                    : "text"
                }
                name={key}
                value={formData[key]}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 px-4 py-3 text-sm focus:bg-white focus:border-slate-900 outline-none"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}