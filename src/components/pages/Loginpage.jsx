import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { Mail, Lock } from "lucide-react";
import { motion } from "framer-motion";
import DialogBox from "../DialogBox";

export default function Login() {
  const user = useSelector((state) => state.User);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logging, setLogging] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (user.isAuthenticated) navigate("/");
  }, [user.isAuthenticated]);

  const formSubmit = async (e) => {
    e.preventDefault();
    setLogging(true);

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_REACT_API}Sadmin/login`,
        data
      );

      if (res.data.success) {
        dispatch(setUser(res.data.data));
        sessionStorage.setItem("admin", JSON.stringify(res.data.data));
        navigate("/");
      } else {
        throw new Error(res.data.message);
      }
    } catch (err) {
      dispatch(logout());
      setErrorMsg(err.response?.data?.message || err.message);
      setOpenDialog(true);
    } finally {
      setLogging(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 px-4">
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md rounded-3xl bg-white/10 backdrop-blur-2xl border border-white/10 shadow-2xl p-8"
      >
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-white"> Staff Login</h2>
          <p className="text-gray-400 text-sm mt-2">
            Sign in to manage your dashboard
          </p>
        </div>

        <form onSubmit={formSubmit} className="space-y-6">
          <div className="relative group">
            <Mail className="absolute left-3 top-3 text-gray-400 group-focus-within:text-indigo-400 transition" />
            <input
              type="email"
              name="email"
              required
              placeholder="Email address"
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            />
          </div>

          <div className="relative group">
            <Lock className="absolute left-3 top-3 text-gray-400 group-focus-within:text-indigo-400 transition" />
            <input
              type="password"
              name="password"
              required
              placeholder="Password"
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            />
          </div>

          <div className="flex justify-between items-center text-sm">
     

            <Link
              to="/forgot-password"
              className="text-indigo-400 hover:text-indigo-300"
            >
              Forgot?
            </Link>
          </div>

          <button
            type="submit"
            disabled={logging}
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 text-white font-semibold transition-all shadow-lg shadow-indigo-600/30"
          >
            {logging ? (
              <div className="flex justify-center items-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Logging in...
              </div>
            ) : (
              "Log In"
            )}
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-6">
          Secure Staff access • Protected system
        </p>
      </motion.div>

      <DialogBox
        isOpen={openDialog}
        onClose={() => setOpenDialog(false)}
        title="Login Error"
        message={errorMsg}
      />
    </div>
  );
}
