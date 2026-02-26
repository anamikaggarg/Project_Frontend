import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux'
import { setInstitute } from '../redux/slices/institute'

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);


  // If already logged in, redirect
  useEffect(() => {
    // const stored = localStorage.getItem("institute");
    // if (stored) navigate("/dashboard");
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please fill all mandatory fields");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        "https://effie-uncandied-dumpily.ngrok-free.dev/institute/login",
        { email: email.trim(), password },
        { withCredentials: true }
      );

      if (res.data.success) {
        const institute = res.data.institute;
        dispatch(setInstitute(res.data.institute))
        const logoUrl = institute.logo
          ? `https://effie-uncandied-dumpily.ngrok-free.dev${institute.logo}`
          : "/default-logo.png";

        localStorage.setItem(
          "institute",
          JSON.stringify({ ...institute, logo: logoUrl })

        );
        console.log("Logo URL after login:", institute.logo);

        alert("Login Successful");
        navigate("/dashboard");
      } else {
        alert(res.data.message || "Login failed");
      }
    } catch (err) {
      console.error("LOGIN ERROR ", err.response?.data || err);
      alert(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center transition-colors duration-300
      ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}
    >
      <button
        onClick={() => setDarkMode(!darkMode)}
        className={`absolute top-6 right-6 px-4 py-2 rounded transition
        ${darkMode ? "bg-gray-700" : "bg-gray-300"}`}
      >
        {darkMode ? "Light Mode ☀️" : "Dark Mode 🌙"}
      </button>

      <div
        className={`w-full max-w-md rounded-2xl p-8 shadow-xl transition-colors
        ${darkMode ? "bg-gray-800" : "bg-white"}`}
      >
        <h2
          className={`text-3xl font-bold mb-6
          ${darkMode ? "text-indigo-400" : "text-indigo-600"}`}
        >
          Institute Login
        </h2>

        <div className="mb-4">
          <label className="block mb-1 text-sm">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter Institute Email"
            className={`w-full px-4 py-2 rounded border
            ${darkMode
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-gray-100 border-gray-300 text-black"}`}
          />
        </div>

        <div className="mb-6">
          <label className="block mb-1 text-sm">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="****"
            className={`w-full px-4 py-2 rounded border
            ${darkMode
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-gray-100 border-gray-300 text-black"}`}
          />
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full py-3 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <button
          className={`mt-5 w-full py-2 rounded border transition
          ${darkMode
              ? "border-gray-600 hover:bg-gray-700"
              : "border-gray-300 hover:bg-gray-200"}`}
        >
          Forget Password? Please Reset
        </button>
      </div>
    </div>
  );
}

export default Login;
