import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { 
  ShieldCheck, CheckCircle2, Lock, ChevronRight, 
  Loader2, ArrowLeft, Info, CreditCard, Landmark, Wallet
} from "lucide-react";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function Checkout() {
  const { instituteId, planId } = useParams();
  const navigate = useNavigate();

  const [plan, setPlan] = useState(null);
  const [selectedMonths, setSelectedMonths] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [calcLoading, setCalcLoading] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [totals, setTotals] = useState(null);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/plans/plan/${planId}`);
        const planData = res.data.plan;
        setPlan(planData);
        const durations = planData.discounts || planData.discount || [];
        if (durations.length > 0) setSelectedMonths(durations[0].duration);
      } catch (err) {
        console.error("Fetch Plan Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlan();
  }, [planId]);

  useEffect(() => {
    const updateCalculations = async () => {
      if (!selectedMonths || !planId || !instituteId) return;
      setCalcLoading(true);
      try {
        const res = await axios.post(`${BASE_URL}/billing/calculate/${instituteId}/${planId}`, {
          months: Number(selectedMonths),
          promoCode: promoCode
        });
        if (res.data && res.data.finalAmount > 0) setTotals(res.data);
      } catch (err) {
        console.error("Calculation Error:", err.response?.data);
      } finally {
        setCalcLoading(false);
      }
    };
    const debounce = setTimeout(updateCalculations, 300);
    return () => clearTimeout(debounce);
  }, [selectedMonths, promoCode, instituteId, planId]);

  const handleCheckout = async () => {
    try {
      setIsProcessing(true);
      await axios.post(`${BASE_URL}/billing/create-and-activate/${instituteId}/${planId}`, {
        months: Number(selectedMonths),
        promoCode: promoCode
      });
      setShowSuccessModal(true);
    } catch (err) {
      alert(err.response?.data?.message || "Activation Failed");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <Loader2 className="w-6 h-6 text-slate-200 animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAFBFC] text-slate-600 font-sans antialiased">
      
      {/* SUCCESS MODAL */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/20 backdrop-blur-[2px] p-6">
          <div className="bg-white rounded-2xl p-10 max-w-sm w-full shadow-xl border border-slate-100 text-center">
            <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={28} className="text-emerald-500" />
            </div>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">Plan Activated</h2>
            <p className="text-slate-500 text-sm mb-8">
              Your institute has been successfully upgraded to the <b>{plan?.name}</b> plan.
            </p>
            <button 
              onClick={() => navigate("/dashboard/settings/plans")} 
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      )}

      {/* NAVIGATION */}
      <nav className="max-w-5xl mx-auto px-6 py-8 flex justify-between items-center">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors text-sm font-medium">
          <ArrowLeft size={16} /> Back
        </button>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg shadow-sm">
          <ShieldCheck size={14} className="text-emerald-500" />
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Secure Checkout</span>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 grid lg:grid-cols-12 gap-12 pb-24">
        
        {/* LEFT SECTION */}
        <div className="lg:col-span-7">
          <div className="mb-10">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Billing Cycle</h1>
            <p className="text-slate-500 text-sm">Select your preferred subscription duration.</p>
          </div>

          <div className="space-y-3">
            {(plan?.discounts || plan?.discount || []).map((d) => {
              const isActive = Number(selectedMonths) === Number(d.duration);
              const basePrice = plan.actualPrice || 299;
              const discountedMonthly = basePrice - (basePrice * d.discountPercent / 100);

              return (
                <div 
                  key={d.duration} 
                  onClick={() => setSelectedMonths(d.duration)}
                  className={`p-5 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                    isActive 
                    ? "border-indigo-600 bg-white shadow-sm ring-1 ring-indigo-600" 
                    : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${isActive ? "border-indigo-600 bg-indigo-600 shadow-sm" : "border-slate-300"}`}>
                      {isActive && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                    </div>
                    <div>
                      <h3 className={`text-sm font-semibold ${isActive ? "text-slate-900" : "text-slate-700"}`}>{d.duration} Months</h3>
                      {d.discountPercent > 0 && (
                        <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md mt-1 inline-block uppercase">Save {d.discountPercent}%</span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-slate-900">₹{Math.round(discountedMonthly)}<span className="text-xs font-normal text-slate-400">/mo</span></p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* PAYMENT METHODS ICONS */}
          <div className="mt-12 pt-8 border-t border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Payment Methods Supported</p>
            <div className="flex flex-wrap gap-4 items-center grayscale opacity-60">
              <div className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg">
                <CreditCard size={14} /> <span className="text-[11px] font-medium">Debit/Credit Card</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg">
                <Landmark size={14} /> <span className="text-[11px] font-medium">Net Banking</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg">
                <Wallet size={14} /> <span className="text-[11px] font-medium">UPI / Wallets</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SECTION (SUMMARY) */}
        <div className="lg:col-span-5">
          <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm sticky top-10">
            <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-[2px] mb-8 flex items-center justify-between">
              Order Summary <Lock size={12} />
            </h2>

            {!totals ? (
              <div className="py-10 text-center"><Loader2 className="w-5 h-5 animate-spin mx-auto text-slate-200" /></div>
            ) : (
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Selected Plan</span>
                  <span className="font-semibold text-slate-800">{plan?.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Taxes (GST 18%)</span>
                  <span className="font-semibold text-slate-800">₹{totals.gstAmount.toLocaleString()}</span>
                </div>
                
                <div className="pt-6 border-t border-slate-50 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-slate-900">Total Amount</span>
                  <span className={`text-3xl font-bold text-slate-900 tracking-tight ${calcLoading ? "opacity-30" : ""}`}>
                    ₹{totals.finalAmount.toLocaleString()}
                  </span>
                </div>
              </div>
            )}

            <div className="relative mb-6">
              <input 
                type="text" 
                placeholder="PROMO CODE" 
                value={promoCode} 
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs font-bold outline-none focus:bg-white focus:border-indigo-200 transition-all placeholder:text-slate-300 tracking-widest" 
              />
              <button className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-indigo-600">APPLY</button>
            </div>

            <button 
              onClick={handleCheckout} 
              disabled={isProcessing || calcLoading || !totals}
              className={`w-full py-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                isProcessing || !totals 
                ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
                : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-50"
              }`}
            >
              {isProcessing ? "Processing Payment..." : "Complete Activation"}
              {!isProcessing && <ChevronRight size={16} />}
            </button>

            <div className="mt-6 flex items-center justify-center gap-2 border-t border-slate-50 pt-6">
              <Info size={12} className="text-slate-300" />
              <p className="text-[10px] text-slate-400 font-medium leading-tight">
                Immediate activation after payment.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}