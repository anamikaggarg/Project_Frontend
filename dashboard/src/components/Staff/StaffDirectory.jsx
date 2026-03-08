import React, { useState, useEffect } from "react";
import { Search, Plus, X, Trash2 } from "lucide-react";

export default function StaffDirectory() {
  const API = "http://localhost:1234/api/staff";

  const [staff, setStaff] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAddStaff, setShowAddStaff] = useState(false);

  const emptyForm = {
    InstituteId: "INS-1001",
    InstituteName: "Smart Institute",
    ReferenceName: "Admin",
    firstName: "",
    LastName: "",
    email: "",
    ContactNumber: "",
    UserRole: "",
    subject: "",
    classTeacher: "",
    Gender: "",
    BloodGroup: "",
    Dob: "",
    Address: "",
    Country: "India",
    State: "",
    HighestQualification: "",
    AppointmentDate: "",
    status: "Active",
  };

  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/allStaff`);
      const data = await res.json();
      setStaff(data.staff || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!formData.firstName || !formData.ContactNumber) {
      alert("First Name and Phone required");
      return;
    }

    try {
      const res = await fetch(`${API}/addStaff`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log("ADD STAFF RESPONSE:", data);

      if (data.success) {
        alert("Staff Added Successfully");
        fetchStaff();
        setFormData(emptyForm);
        setShowAddStaff(false);
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const deleteStaff = async (id) => {
    if (!window.confirm("Delete this staff?")) return;
    try {
      await fetch(`${API}/deleteStaff/${id}`, { method: "DELETE" });
      fetchStaff();
    } catch (err) {
      console.log(err);
    }
  };

  const filteredStaff = (staff || []).filter((s) =>
    `${s.firstName} ${s.LastName} ${s.UserRole}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="p-8 bg-slate-100 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Staff Directory</h1>
          <p className="text-gray-500">Manage school staff</p>
        </div>
        <button
          onClick={() => setShowAddStaff(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          <Plus size={18} />
          Add Staff
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="relative w-80">
          <Search className="absolute left-3 top-3 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search staff..."
            className="pl-10 border rounded-lg py-2 w-full"
          />
        </div>
      </div>

      {/* Table */}
     {/* Table */}
<div className="bg-white rounded-lg shadow overflow-x-auto">
  <table className="w-full min-w-[700px] border-collapse">
    <thead className="bg-blue-50">
      <tr>
        <th className="p-4 text-left text-sm font-medium text-blue-700">Name</th>
        <th className="p-4 text-left text-sm font-medium text-blue-700">Email</th>
        <th className="p-4 text-left text-sm font-medium text-blue-700">Phone</th>
        <th className="p-4 text-left text-sm font-medium text-blue-700">Role</th>
        <th className="p-4 text-center text-sm font-medium text-blue-700">Status</th>
        <th className="p-4 text-center text-sm font-medium text-blue-700">Action</th>
      </tr>
    </thead>

    <tbody>
      {loading ? (
        <tr>
          <td colSpan="6" className="text-center p-6 text-gray-500">
            Loading...
          </td>
        </tr>
      ) : filteredStaff.length > 0 ? (
        filteredStaff.map((s) => (
          <tr
            key={s._id}
            className="border-b hover:bg-blue-50 transition-colors duration-200"
          >
            <td className="p-4 flex items-center gap-2">
              {/* <div className="bg-blue-200 text-blue-700 rounded-full w-8 h-8 flex items-center justify-center font-semibold uppercase">
                {s.firstName[0]}
              </div> */}
              <span>{s.firstName} {s.LastName}</span>
            </td>
            <td className="p-4 text-gray-600 truncate">{s.email}</td>
            <td className="p-4 text-gray-600">{s.ContactNumber}</td>
            <td className="p-4 text-gray-600">{s.UserRole}</td>
            <td className="p-4 text-center">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                s.status === "Active"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}>
                {s.status}
              </span>
            </td>
            <td className="p-4 text-center">
              <button
                onClick={() => deleteStaff(s._id)}
                className="text-red-500 hover:text-red-700 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="6" className="text-center p-6 text-gray-500">
            No Staff Found
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>

      {/* Add Staff Drawer */}
      {showAddStaff && (
        <div className="fixed inset-0 bg-black/40 flex justify-end">
          <div className="w-[500px] bg-white h-screen p-6 overflow-y-auto">
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-semibold">Add Staff</h2>
              <X
                onClick={() => setShowAddStaff(false)}
                className="cursor-pointer"
              />
            </div>

            <div className="space-y-4">
              <div>
                <label>First Name</label>
                <input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full border rounded p-2"
                />
              </div>

              <div>
                <label>Last Name</label>
                <input
                  name="LastName"
                  value={formData.LastName}
                  onChange={handleChange}
                  className="w-full border rounded p-2"
                />
              </div>

              <div>
                <label>Email</label>
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border rounded p-2"
                />
              </div>

              <div>
                <label>Phone</label>
                <input
                  name="ContactNumber"
                  value={formData.ContactNumber}
                  onChange={handleChange}
                  className="w-full border rounded p-2"
                />
              </div>

              <div>
                <label>Role</label>
                <select
                  name="UserRole"
                  value={formData.UserRole}
                  onChange={handleChange}
                  className="w-full border rounded p-2"
                >
                  <option value="">Select Role</option>
                  <option>Teacher</option>
                  <option>Receptionist</option>
                  <option>Accountant</option>
                </select>
              </div>

              <div>
                <label>Subject</label>
                <input
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full border rounded p-2"
                />
              </div>

              <div>
                <label>Qualification</label>
                <input
                  name="HighestQualification"
                  value={formData.HighestQualification}
                  onChange={handleChange}
                  className="w-full border rounded p-2"
                />
              </div>

              <div>
                <label>Date of Birth</label>
                <input
                  type="date"
                  name="Dob"
                  value={formData.Dob}
                  onChange={handleChange}
                  className="w-full border rounded p-2"
                />
              </div>

              <div>
                <label>Gender</label>
                <select
                  name="Gender"
                  value={formData.Gender}
                  onChange={handleChange}
                  className="w-full border rounded p-2"
                >
                  <option value="">Select</option>
                  <option>Male</option>
                  <option>Female</option>
                </select>
              </div>

              <div>
                <label>Address</label>
                <textarea
                  name="Address"
                  value={formData.Address}
                  onChange={handleChange}
                  className="w-full border rounded p-2"
                />
              </div>
            </div>

            <button
              onClick={handleSubmit}
              className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg"
            >
              Add Staff
            </button>
          </div>
        </div>
      )}
    </div>
  );
}