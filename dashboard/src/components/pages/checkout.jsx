import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
// import { setInstitute } from "../../redux/slices/institute";
import { 
  ArrowLeft, 
  ShieldCheck, 
  Tag, 
  CheckCircle2,
  Lock,
  ChevronRight,
  Sparkles,
  CreditCard
} from "lucide-react";

export default function Checkout() {
  const { instituteId, planId } = useParams();
  const navigate = useNavigate();
  // const dispatch = useDispatch();

  const instituteRedux = useSelector((state) => state.Institute.currentInstitute);
  const [plan, setPlan] = useState(null);
  const [selectedMonths, setSelectedMonths] = useState(null);
  const [loading, setLoading] = useState(true);
  const [promoCode, setPromoCode] = useState("");
  const [promoDiscount, setPromoDiscount] = useState(0);

  const GST_PERCENT = 18;
  const isFirstTime = !instituteRedux?.hasPurchasedPlanBefore;

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const res = await axios.get(
         `${BASE_URL}/plans/plan/${planId}`,
          { headers: { "ngrok-skip-browser-warning": "true" } }
        );
        const planData = {
          ...res.data.plan,
          actualPrice: res.data.plan.price,
          discounts: res.data.plan.discount || []
        };
        setPlan(planData);
        if (planData.discounts.length > 0) setSelectedMonths(planData.discounts[0].duration);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlan();
  }, [planId]);

  const actualPrice = Number(plan?.actualPrice || 0);
  const months = Number(selectedMonths || 0);
  const selectedDiscount = plan?.discounts?.find((d) => d.duration === months);

  const baseTotal = actualPrice * months;
  const discountAmount = selectedDiscount ? (baseTotal * selectedDiscount.discountPercent) / 100 : 0;
  const promoAmount = (baseTotal * promoDiscount) / 100;
  const taxableAmount = baseTotal - discountAmount - promoAmount;
  const gstAmount = (taxableAmount * GST_PERCENT) / 100;
  const finalAmount = taxableAmount + gstAmount;
  const BASE_URL = import.meta.env.VITE_API_URL;

  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === "FIRST10" && isFirstTime) {
      setPromoDiscount(10);
    } else {
      alert("Invalid code");
      setPromoDiscount(0);
    }
  };

  const handleCheckout = async () => {
    try {
      if (!selectedMonths) return;
      await axios.post(
       `${BASE_URL}/billing/create-and-activate/${instituteId}/${planId}`,
        { months: selectedMonths, promoCode: promoCode || "" }
      );
      alert("Plan Activated!");
      navigate("/dashboard/settings/plans");
    } catch (err) { console.error(err); }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFDFF]">
      <div className="w-5 h-5 border-2 border-slate-200 border-t-indigo-500 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFDFF] text-slate-700 font-sans selection:bg-indigo-50 selection:text-indigo-600">
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-5%] right-[-5%] w-[30%] h-[30%] bg-blue-50/60 rounded-full blur-[80px]" />
        <div className="absolute bottom-[-5%] left-[-5%] w-[30%] h-[30%] bg-indigo-50/60 rounded-full blur-[80px]" />
      </div>

      <nav className="max-w-5xl mx-auto px-6 py-10 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors text-sm">
          <ArrowLeft size={16} />
          <span>Plans</span>
        </button>
        <div className="flex items-center gap-2 px-3 py-1 bg-white border border-slate-100 rounded-full shadow-sm">
          <ShieldCheck size={14} className="text-emerald-500" />
          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">PCI Compliant</span>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 grid md:grid-cols-12 gap-12 pb-20">
        
        <div className="md:col-span-7">
          <header className="mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-500 rounded-lg text-[10px] font-bold tracking-widest mb-4 uppercase">
              <Sparkles size={12} /> Secure Checkout
            </div>
            <h1 className="text-2xl font-medium text-slate-900 mb-2 tracking-tight">Select your billing cycle</h1>
            <p className="text-sm text-slate-500 leading-relaxed font-normal">Choose how often you'd like to be billed for {plan?.name}.</p>
          </header>

          <div className="space-y-3">
            {plan?.discounts?.map((d) => {
              const isActive = selectedMonths === d.duration;
              const perMonth = (plan.price * (1 - d.discountPercent / 100)).toFixed(0);
              return (
                <div
                  key={d.duration}
                  onClick={() => setSelectedMonths(d.duration)}
                  className={`relative p-5 rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden
                    ${isActive 
                      ? "border-indigo-500 bg-white shadow-md shadow-indigo-100/50" 
                      : "border-slate-100 bg-white hover:border-slate-200"}`}
                >
                  <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-4">
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all
                        ${isActive ? "border-indigo-500 bg-indigo-500 shadow-inner" : "border-slate-200"}`}>
                        {isActive && <CheckCircle2 className="text-white w-2.5 h-2.5" strokeWidth={4} />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-medium ${isActive ? "text-slate-900" : "text-slate-600"}`}>{d.duration} Months</span>
                          {d.discountPercent > 0 && (
                            <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md uppercase">-{d.discountPercent}%</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-slate-900">₹{perMonth}<span className="text-xs text-slate-400 font-normal"> /mo</span></p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-10 flex gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 items-start">
            <div className="p-2 bg-white rounded-lg border border-slate-100 shrink-0">
               <CreditCard size={16} className="text-slate-400" />
            </div>
            <p className="text-xs text-slate-500 leading-relaxed font-light">
              Your subscription starts immediately. Tax invoices are sent to your registered email. You can cancel or upgrade your plan anytime from the billing settings.
            </p>
          </div>
        </div>

        {/* Summary Area */}
        <div className="md:col-span-5">
          <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm sticky top-10">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-[2px] mb-8 flex items-center justify-between">
              Order Detail <Lock size={12} />
            </h2>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Plan</span>
                <span className="text-slate-900 font-medium">{plan?.name}</span>
              </div>
              <div className="flex justify-between text-sm font-light">
                <span className="text-slate-500">Base total</span>
                <span className="text-slate-900 font-medium">₹{baseTotal.toLocaleString()}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-indigo-600 font-medium">Plan savings</span>
                  <span className="text-indigo-600 font-semibold">-₹{discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">GST (18%)</span>
                <span className="text-slate-900 font-medium">₹{gstAmount.toFixed(0)}</span>
              </div>
            </div>

            {/* Promo code area - compact */}
            <div className="relative mb-8">
              <input
                type="text"
                placeholder="PROMO CODE"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 pl-10 pr-20 text-xs font-medium focus:outline-none focus:bg-white focus:border-indigo-300 transition-all uppercase tracking-wider"
              />
              <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
              <button 
                onClick={handleApplyPromo}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-indigo-600 px-3 py-1.5 hover:bg-indigo-50 rounded-lg transition-colors"
              >
                APPLY
              </button>
            </div>

            <div className="pt-6 border-t border-slate-50 mb-8">
              <div className="flex justify-between items-end">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Payable</span>
                <span className="text-2xl font-medium text-slate-900">₹{finalAmount.toFixed(0)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-xl text-sm font-medium transition-all shadow-lg shadow-slate-200 flex items-center justify-center gap-2 group"
            >
              Complete Payment
              <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* Payment footer */}
            <div className="mt-8 flex flex-col items-center gap-4">
              <div className="flex gap-5 grayscale opacity-30 hover:opacity-100 hover:grayscale-0 transition-all duration-500">
                <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/UPI-Logo.png" className="h-3" alt="UPI" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-2" alt="Visa" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b7/Rupay-Logo.png" className="h-3" alt="Rupay" />
              </div>
              <p className="text-[10px] text-slate-300 font-medium uppercase tracking-[1px]">Payment handled by Razorpay</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  ); 
}