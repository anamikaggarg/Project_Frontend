import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function InstituteRegister() {
  const [formData, setFormData] = useState({
    instituteName: "",
    email: "",
    password: "",
    confirmPassword: "",
    establishedDate: "",
    city: "",
    phone: "",
    alternatePhone: "",
    aadhaar: "",
    gstNumber: "",
  });

  const [logoPreview, setLogoPreview] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    if (!formData.phone || !formData.instituteName || !formData.establishedDate || !formData.city) {
      alert("Please fill all mandatory fields!");
      return;
    }

    try {
      setLoading(true);

      const payload = new FormData();
      payload.append("name", formData.instituteName);
      payload.append("email", formData.email);
      payload.append("password", formData.password);
      payload.append("contact", formData.phone);
      payload.append("alternatePhone", formData.alternatePhone);
      payload.append("city", formData.city);
      
      
      payload.append("aadhaarNumber", formData.aadhaar);
      
      payload.append("gstNumber", formData.gstNumber);
      payload.append("establishedDate", formData.establishedDate);

      if (logoFile) payload.append("logo", logoFile);

      const res = await axios.post(
        "  https://effie-uncandied-dumpily.ngrok-free.dev/institute/register",
        payload,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (res.data.success) {
        alert("Institute Registered Successfully!");
        setFormData({
          instituteName: "",
          email: "",
          password: "",
          confirmPassword: "",
          establishedDate: "",
          city: "",
         
          phone: "",
          alternatePhone: "",
         
          aadhaar: "",
          gstNumber: "",
        });
        setLogoPreview(null);
        setLogoFile(null);
      } else {
        alert(res.data.message || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Server Error!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
  
      <nav className="bg-white border-b border-slate-300">
        <div className="max-w-7xl mx-auto px-4 md:px-10 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img
              src="https://t4.ftcdn.net/jpg/04/91/76/63/360_F_491766301_yF6pxwvJnyY4I43PlU6zPEPoY5ZjJLEL.jpg"
              alt="Institute Logo"
              className="w-16 h-16 object-contain"
            />
            <h1 className="text-2xl font-bold text-blue-700">INSTITUTE</h1>
          </div>
          <div>
            <Link
              to="/login"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-1.5 rounded-md shadow font-medium"
            >
              Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Form Container */}
      <div className="max-w-5xl mx-auto p-4 md:p-6 mt-6">
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-200">
          <div className="bg-blue-500 text-white rounded-xl p-5 mb-6">
            <h2 className="text-3xl font-semibold">Institute Registration Form</h2>
            <p className="text-sm opacity-90">
              Fill all details carefully. Fields marked (*) are mandatory
            </p>
          </div>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <h3 className="font-semibold text-indigo-700 mb-4 text-xl">
                Institute Basic Information
              </h3>

              <div className="mb-4 flex flex-col md:flex-row items-center gap-6">
                <div className="flex-1">
                  <label className="text-sm text-slate-600">Institute Logo *</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="block mt-2 text-sm text-slate-600
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:bg-blue-600 file:text-white
                      hover:file:bg-blue-700 cursor-pointer"
                  />
                  <p className="text-xs text-slate-400 mt-1">
                    Upload institute logo (JPG / PNG)
                  </p>
                </div>
                {logoPreview && (
                  <div className="w-28 h-28 border border-slate-300 rounded-lg flex items-center justify-center overflow-hidden">
                    <img src={logoPreview} alt="Logo Preview" className="object-contain w-full h-full" />
                  </div>
                )}
              </div>

              <div className="flex flex-col md:flex-row gap-3 mb-3">
                <div className="flex-1">
                  <label className="text-sm text-slate-600">Institute Name *</label>
                  <input
                    name="instituteName"
                    value={formData.instituteName}
                    onChange={handleChange}
                    className="w-full border border-slate-300 rounded-md px-3 py-2 mt-1"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-sm text-slate-600">Institute Email</label>
                  <input
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border border-slate-300 rounded-md px-3 py-2 mt-1"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-sm text-slate-600">Enter Password</label>
                  <input
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full border border-slate-300 rounded-md px-3 py-2 mt-1"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-sm text-slate-600">Confirm Password</label>
                  <input
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full border border-slate-300 rounded-md px-3 py-2 mt-1"
                  />
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1">
                  <label className="text-sm text-slate-600">Established Date *</label>
                  <input
                    type="date"
                    name="establishedDate"
                    value={formData.establishedDate}
                    onChange={handleChange}
                    className="w-full border border-slate-300 rounded-md px-3 py-2 mt-1"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-sm text-slate-600">City *</label>
                  <input
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full border border-slate-300 rounded-md px-3 py-2 mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <h3 className="font-semibold text-indigo-700 mb-3">Contact Information</h3>
              <div className="flex flex-col md:flex-row gap-3 mb-3">
               
                <input
                  name="phone"
                  placeholder="Phone Number *"
                  value={formData.phone}
                  onChange={handleChange}
                  className="flex-1 border border-slate-300 rounded-md px-3 py-2"
                />
              </div>
              <input
                name="alternatePhone"
                placeholder="Alternate Phone"
                value={formData.alternatePhone}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-md px-3 py-2"
              />
            </div>

       
           

            {/* Legal Info */}
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <h3 className="font-semibold text-indigo-700 mb-3">Legal Information</h3>
              <div className="flex flex-col md:flex-row gap-3">
                <input
                  name="aadhaar"
                  placeholder="Aadhar Number (Optional)"
                  value={formData.aadhaar}
                  onChange={handleChange}
                  className="flex-1 border border-slate-300 rounded-md px-3 py-2"
                />
                <input
                  name="gstNumber"
                  placeholder="GST Number (Optional)"
                  value={formData.gstNumber}
                  onChange={handleChange}
                  className="flex-1 border border-slate-300 rounded-md px-3 py-2"
                />
              </div>
            </div>

            {/* Already have account */}
            <p className="text-sm text-center mt-2 text-slate-600">
              Already have an account?{" "}
               <Link to="/login" className="text-indigo-600 font-semibold hover:underline">
                Login
              </Link>
            </p>

            {/* Submit */}
            <div className="flex justify-end mt-4">
              <button
                type="submit"
                disabled={loading}
                className={`bg-blue-600 text-white px-10 py-3 rounded-lg shadow-lg hover:opacity-90 ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Registering..." : "Register Institute"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Footer */}
       <footer className="bg-slate-50 border-t border-slate-200 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex flex-col md:flex-row justify-between gap-8">
            <div className="md:w-1/3">
              <h2 className="text-xl font-bold text-indigo-700">EduManage</h2>
              <p className="text-sm text-slate-600 mt-2">
                Smart platform to manage institute registrations,
                compliance, and academic data efficiently.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-slate-700 mb-3">Quick Links</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="hover:text-emerald-600 cursor-pointer">Home</li>
                <li className="hover:text-emerald-600 cursor-pointer">Institutes</li>
                <li className="hover:text-emerald-600 cursor-pointer">Register Institute</li>
                <li className="hover:text-emerald-600 cursor-pointer">Contact</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-slate-700 mb-3">Contact</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>New Delhi, India</li>
                <li>support@edumanage.com</li>
                <li>+91 98765 43210</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-200 mt-8 pt-4 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
            <p>© 2026 EduManage. All rights reserved.</p>
            <div className="flex gap-4 mt-2 md:mt-0">
              <span className="hover:text-emerald-600 cursor-pointer">Privacy Policy</span>
              <span className="hover:text-emerald-600 cursor-pointer">Terms & Conditions</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
