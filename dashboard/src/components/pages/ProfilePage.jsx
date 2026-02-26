import React from "react";
import { 
  Building2, Mail, Phone, MapPin, ShieldCheck, 
  Fingerprint, Save, Camera, Globe, ChevronRight 
} from "lucide-react";

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-[#F9FAFB] text-[#2D3748] font-sans p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        
        {/* HEADER: SIMPLE & AIRY */}
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Institute Settings</h1>
            <p className="text-slate-500 text-sm mt-1">Manage your public profile and legal data.</p>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
            <Save className="w-4 h-4" /> Save
          </button>
        </header>

        <div className="space-y-6">
          
          {/* CARD 1: IDENTITY */}
          <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm group hover:border-indigo-200 transition-all">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg">General Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Institute Name</label>
                <input type="text" className="w-full bg-slate-50 border-transparent border-2 px-4 py-3 rounded-xl focus:bg-white focus:border-indigo-500 outline-none transition-all" placeholder="Enter name" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Official Email</label>
                <input type="email" className="w-full bg-slate-50 border-transparent border-2 px-4 py-3 rounded-xl focus:bg-white focus:border-indigo-500 outline-none transition-all" placeholder="email@domain.com" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Contact Number</label>
                <input type="text" className="w-full bg-slate-50 border-transparent border-2 px-4 py-3 rounded-xl focus:bg-white focus:border-indigo-500 outline-none transition-all" placeholder="+91" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Alternate Phone</label>
                <input type="text" className="w-full bg-slate-50 border-transparent border-2 px-4 py-3 rounded-xl focus:bg-white focus:border-indigo-500 outline-none transition-all" placeholder="Optional" />
              </div>
            </div>
          </div>

          {/* CARD 2: LEGAL (YELLOW TINT) */}
          <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm group hover:border-amber-200 transition-all">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
                <Fingerprint className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg">Verification & Tax</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Aadhaar Number</label>
                <input type="text" className="w-full bg-slate-50 border-transparent border-2 px-4 py-3 rounded-xl focus:bg-white focus:border-amber-500 outline-none transition-all" placeholder="0000 0000 0000" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">GST Number</label>
                <input type="text" className="w-full bg-slate-50 border-transparent border-2 px-4 py-3 rounded-xl focus:bg-white focus:border-amber-500 outline-none transition-all uppercase" placeholder="GSTIN-001" />
              </div>
            </div>
          </div>

          {/* CARD 3: LOCATION (GREEN TINT) */}
          <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm group hover:border-emerald-200 transition-all">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg">Location</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1 space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">City</label>
                <input type="text" className="w-full bg-slate-50 border-transparent border-2 px-4 py-3 rounded-xl focus:bg-white focus:border-emerald-500 outline-none transition-all" />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Address</label>
                <input type="text" className="w-full bg-slate-50 border-transparent border-2 px-4 py-3 rounded-xl focus:bg-white focus:border-emerald-500 outline-none transition-all" />
              </div>
            </div>
          </div>

        </div>

        {/* FOOTER METRICS */}
        <footer className="mt-12 p-8 bg-slate-900 rounded-[2rem] text-white flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
             <div className="p-3 bg-white/10 rounded-xl">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
             </div>
             <div>
               <p className="text-xs font-bold opacity-60 uppercase tracking-widest">Plan Status</p>
               <h4 className="font-bold">Enterprise Active</h4>
             </div>
          </div>
          <div className="flex gap-4">
            <button className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold transition-all">Update Logo</button>
            <button className="px-6 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-xl text-xs font-bold transition-all">View Analytics</button>
          </div>
        </footer>
      </div>
    </main>
  );
}