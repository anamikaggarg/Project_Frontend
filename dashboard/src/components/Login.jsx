import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { setInstitute } from '../redux/slices/institute';
import { 
  Mail, Lock, ArrowRight, Smartphone, 
  ChevronLeft, Eye, EyeOff, CheckCircle, 
  KeyRound, UserPlus, AlertCircle 
} from "lucide-react";

const InputBox = ({ icon: Icon, error, ...props }) => (
  <div className="relative group animate-in fade-in duration-300">
    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors">
      {Icon && <Icon size={19} strokeWidth={2.5} />}
    </div>
    <input 
      {...props} 
      className={`w-full bg-slate-900/40 border ${error ? 'border-red-500/50' : 'border-slate-800'} rounded-2xl py-4 pl-12 pr-4 text-sm outline-none focus:border-indigo-500/50 transition-all text-white placeholder:text-slate-600`} 
    />
  </div>
);

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0); 

  // Message States
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [view, setView] = useState("login"); // login | forgot
  const [forgotStep, setForgotStep] = useState(1);
  const [showPass, setShowPass] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  // Timer Logic
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleAuthSuccess = (data) => {
    const { institute, token } = data;
    dispatch(setInstitute(institute));
    localStorage.setItem("institute", JSON.stringify(institute));
    localStorage.setItem("token", token); 
    navigate("/dashboard");
  };

  const handleLogin = async (e) => {
    if(e) e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(`${API_URL}/institute/login`, { 
        email: email.trim().toLowerCase(), 
        password 
      },);
      if (res.data.success) handleAuthSuccess(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally { setLoading(false); }
  };

  const handleForgotSendOTP = async (e) => {
    if(e) e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMsg("");
    try {
      const res = await axios.post(`${API_URL}/institute/forget-password`, { 
        email: email.trim().toLowerCase() 
      });
      if (res.data.success) {
        setForgotStep(2);
        setTimer(120);
        if(forgotStep === 2) setSuccessMsg("OTP Resent Successfully!");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Could not send OTP.");
    } finally { setLoading(false); }
  };

  const handleVerifyOTP = async (e) => {
    if(e) e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(`${API_URL}/institute/verify-otp`, { 
        email: email.trim().toLowerCase(), 
        otp 
      });
      if (res.data.success) setForgotStep(3);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP entered");
    } finally { setLoading(false); }
  };

  const handleResetPassword = async (e) => {
    if(e) e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(`${API_URL}/institute/reset-password`, { 
        email: email.trim().toLowerCase(), 
        password: newPassword 
      });
      if (res.data.success) setForgotStep(4);
    } catch (err) {
      setError(err.response?.data?.message || "Password update failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#02040a] p-6 font-sans relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-600/10 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-600/10 blur-[120px]" />

      <div className="w-full max-w-[440px] bg-slate-950/40 backdrop-blur-3xl border border-slate-800/60 rounded-[2.5rem] p-10 shadow-2xl z-10">
        
        {/* --- LOGIN VIEW --- */}
        {view === "login" && (
          <form onSubmit={handleLogin} className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <header className="text-center">
              <h2 className="text-2xl font-bold text-white tracking-tight">Welcome Back</h2>
              <p className="text-slate-500 text-sm mt-1">Sign in to your dashboard</p>
            </header>
            <div className="space-y-4">
              <InputBox icon={Mail} type="email" placeholder="Email Address" value={email} onChange={(e) => {setEmail(e.target.value); setError("");}} required />
              
              <div className="space-y-2">
                <div className="relative group">
                  <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 ${error ? 'text-red-400' : 'text-slate-500'} group-focus-within:text-indigo-400`} size={19} />
                  <input 
                    type={showPass ? "text" : "password"} 
                    placeholder="Password" 
                    value={password} 
                    onChange={(e) => {setPassword(e.target.value); setError("");}} 
                    className={`w-full bg-slate-900/40 border ${error ? 'border-red-500/50' : 'border-slate-800'} rounded-2xl py-4 pl-12 pr-12 text-sm text-white outline-none focus:border-indigo-500/50 transition-all`} 
                    required
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white">
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {/* ERROR UNDER PASSWORD */}
                {error && (
                  <span className="text-[11px] text-red-500 font-medium ml-2 flex items-center gap-1 animate-in fade-in">
                    <AlertCircle size={12} /> {error}
                  </span>
                )}

                <div className="flex justify-end pt-1">
                  <button type="button" onClick={() => { setView("forgot"); setForgotStep(1); setError(""); }} className="text-[10px] font-black text-indigo-500 uppercase tracking-widest hover:text-indigo-400">Forgot Password?</button>
                </div>
              </div>
              
              <button type="submit" disabled={loading} className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl shadow-lg active:scale-95 flex items-center justify-center gap-2 transition-all disabled:opacity-50">
                {loading ? "Checking..." : "Login"} <ArrowRight size={18} />
              </button>
              
              <button type="button" className="w-full py-4 bg-transparent border border-slate-800 text-slate-400 font-bold rounded-2xl flex items-center justify-center gap-3 hover:bg-slate-900/50 transition-colors">
                <Smartphone size={18} /> Login with OTP
              </button>

              <div className="pt-4 border-t border-slate-900 text-center text-slate-500 text-sm">
                Don't have an account?{" "}
                <button type="button" onClick={() => navigate("/register")} className="text-indigo-400 font-bold hover:text-indigo-300 inline-flex items-center gap-1">
                  Register <UserPlus size={14} />
                </button>
              </div>
            </div>
          </form>
        )}

      
        {view === "forgot" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-left-4">
            <button onClick={() => { if(forgotStep === 1) setView("login"); else setForgotStep(f => f-1); setError(""); }} className="text-slate-500 hover:text-white flex items-center gap-2 text-xs font-bold uppercase">
              <ChevronLeft size={14} /> Back
            </button>
            <h3 className="text-2xl font-bold text-white">
              {forgotStep === 1 ? "Reset Password" : forgotStep === 2 ? "Verify OTP" : forgotStep === 3 ? "New Password" : "Success"}
            </h3>
            
            {forgotStep === 1 && (
              <form onSubmit={handleForgotSendOTP} className="space-y-4">
                <InputBox icon={Mail} type="email" placeholder="Registered Email" value={email} onChange={(e) => {setEmail(e.target.value); setError("");}} required />
                {error && <span className="text-[11px] text-red-500 ml-2 flex items-center gap-1"><AlertCircle size={12} /> {error}</span>}
                <button type="submit" disabled={loading} className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl disabled:opacity-50">
                  {loading ? "Sending..." : "Send OTP"}
                </button>
              </form>
            )}

            {forgotStep === 2 && (
              <form onSubmit={handleVerifyOTP} className="space-y-4">
                <div className="space-y-2">
                  <InputBox icon={KeyRound} type="text" placeholder="6-Digit OTP" value={otp} onChange={(e) => {setOtp(e.target.value); setError("");}} error={error} required />
                  {error && <span className="text-[11px] text-red-500 ml-2 flex items-center gap-1"><AlertCircle size={12} /> {error}</span>}
                  {successMsg && <span className="text-[11px] text-emerald-500 ml-2 flex items-center gap-1"><CheckCircle size={12} /> {successMsg}</span>}
                </div>
                <div className="flex justify-between items-center px-2 pt-1">
                  <span className="text-xs text-slate-500">{timer > 0 ? `Expires in ${timer}s` : "No code?"}</span>
                  <button type="button" disabled={loading} onClick={handleForgotSendOTP} className="text-xs font-bold text-indigo-400 hover:text-indigo-300 uppercase">
                    {loading ? "Sending..." : "Resend Now"}
                  </button>
                </div>
                <button type="submit" disabled={loading} className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl">Verify OTP</button>
              </form>
            )}

            {forgotStep === 3 && (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <InputBox icon={Lock} type="password" placeholder="New Password" value={newPassword} onChange={(e) => {setNewPassword(e.target.value); setError("");}} error={error} required />
                {error && <span className="text-[11px] text-red-500 ml-2 flex items-center gap-1"><AlertCircle size={12} /> {error}</span>}
                <button type="submit" disabled={loading} className="w-full py-4 bg-emerald-600 text-white font-bold rounded-2xl">Update Password</button>
              </form>
            )}

            {forgotStep === 4 && (
              <div className="text-center space-y-5">
                <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20"><CheckCircle size={40} className="text-emerald-500" /></div>
                <p className="text-slate-400 text-sm">Password updated successfully.</p>
                <button type="button" onClick={() => { setView("login"); setForgotStep(1); setError(""); }} className="w-full py-4 bg-white text-black font-black rounded-2xl">Login Now</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;