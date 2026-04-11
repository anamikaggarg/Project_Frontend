import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PlansPage() {
  const instituteState = useSelector((state) => state.Institute);
  const instituteId = instituteState?.currentInstitute?.instituteId || "";
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const [plans, setPlans] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(false);

  const [currentPlan, setCurrentPlan] = useState({
    name: "Trial",
    startDate: null,
    endDate: null,
  });

  const formatDateTime = (date) => {
    if (!date) return "-";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "-";
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = String(d.getFullYear()).slice(-2);
    let hours = d.getHours();
    const minutes = String(d.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    hours = String(hours).padStart(2, "0");
    return `${day}-${month}-${year} ${hours}:${minutes} ${ampm}`;
  };

  const getRemainingDays = (endDate) => {
    if (!endDate) return "-";
    const today = new Date();
    const end = new Date(endDate);
    today.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil((end - today) / (1000 * 60 * 60 * 24));
    if (diffDays > 1) return diffDays + " days left";
    if (diffDays === 1) return "1 day left";
    return "Expired";
  };

  const getRemainingDaysNumber = (endDate) => {
    if (!endDate) return 0;
    const today = new Date();
    const end = new Date(endDate);
    today.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil((end - today) / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const fetchPlans = async () => {
    try {
      setLoadingPlans(true);
      const res = await axios.get(`${API_URL}/plans/allPlans`, {
        headers: { "ngrok-skip-browser-warning": "true" },
      });
      if (res.data && Array.isArray(res.data.plans)) {
        setPlans(res.data.plans);
      } else {
        setPlans([]);
      }
    } catch (error) {
      console.error("Error fetching plans:", error);
      setPlans([]);
    } finally {
      setLoadingPlans(false);
    }
  };

  useEffect(() => {
    const current = instituteState?.currentInstitute;
    if (current) {
      const start = current.planStartDate
        ? new Date(current.planStartDate)
        : new Date();
      const end = current.planEndDate
        ? new Date(current.planEndDate)
        : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      setCurrentPlan({
        name: current.currentPlan || "Trial",
        startDate: start,
        endDate: end,
      });
    }
    fetchPlans();
  }, [instituteState]);

  // highest discount from discounts array
  const getBestDiscount = (plan) => {
    if (plan.price === 0 || !plan.discounts?.length) return null;
    return plan.discounts.reduce((best, d) =>
      d.discountPercent > (best?.discountPercent ?? 0) ? d : best, null
    );
  };

  const getTermLabel = (discount) => {
    if (!discount) return null;
    if (discount.duration === 36) return "For first 3-yr term";
    if (discount.duration === 24) return "For first 2-yr term";
    if (discount.duration === 12) return "For first 1-yr term";
    if (discount.duration === 6)  return "For first 6-month term";
    return `For first ${discount.duration}-month term`;
  };

  const planAccents = [
    { color: "#5F5E5A", discBg: "#F1EFE8", discText: "#444441" },
    { color: "#185FA5", discBg: "#E6F1FB", discText: "#0C447C" },
    { color: "#534AB7", discBg: "#534AB7", discText: "#fff", featured: true },
    { color: "#854F0B", discBg: "#FAEEDA", discText: "#633806" },
  ];

  const featureList = [
    { label: "Student Info",       getValue: (p) => p.features?.academic?.studentInfo },
    { label: "Classrooms",         getValue: (p) => p.features?.academic?.classrooms },
    { label: "Attendance",         getValue: (p) => p.features?.academic?.attendance },
    { label: "Exam Module",        getValue: (p) => p.features?.academic?.exam },
    { label: "Timetable",          getValue: (p) => p.features?.academic?.timetable },
    { label: "Student Reports",    getValue: (p) => p.features?.reports?.studentsReport },
    { label: "Classroom Activity", getValue: (p) => p.features?.reports?.classroomActivity },
    { label: "Certificate",        getValue: (p) => p.features?.administration?.certificate },
    { label: "ID Card",            getValue: (p) => p.features?.administration?.idCard },
  ];

  const CheckIcon = () => (
    <span
      className="w-[18px] h-[18px] rounded-full flex items-center justify-center flex-shrink-0"
      style={{ background: "#EAF3DE" }}
    >
      <svg className="w-2.5 h-2.5" viewBox="0 0 10 10" fill="none">
        <polyline
          points="1.5,5 4,7.5 8.5,2"
          stroke="#3B6D11"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );

  const remaining   = getRemainingDays(currentPlan.endDate);
  const isExpired   = remaining === "Expired";

  return (
    <div className="px-4 py-6">

      {/* ── Current Plan Card ── */}
      <div className="mb-10 rounded-3xl border border-indigo-100 bg-indigo-50 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-medium text-indigo-700">Current Plan</h2>
          <span className="text-[11px] font-medium px-3 py-1 rounded-full bg-indigo-600 text-white">
            {currentPlan.name}
          </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-white rounded-2xl p-4 border border-gray-100">
            <p className="text-[11px] text-gray-400 mb-1.5">Start Date</p>
            <p className="text-sm font-medium text-gray-800">
              {formatDateTime(currentPlan.startDate)}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-gray-100">
            <p className="text-[11px] text-gray-400 mb-1.5">End Date</p>
            <p className="text-sm font-medium text-gray-800">
              {formatDateTime(currentPlan.endDate)}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-gray-100">
            <p className="text-[11px] text-gray-400 mb-1.5">Expires In</p>
            <p className={`text-sm font-medium ${isExpired ? "text-red-500" : "text-green-600"}`}>
              {remaining}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-gray-100 flex items-center justify-center">
            {isExpired ? (
              <span className="text-[11px] font-medium text-red-500 bg-red-50 px-3 py-1.5 rounded-full text-center">
                Plan Expired — Purchase Plan
              </span>
            ) : (
              <span className="text-[11px] font-medium text-green-600 bg-green-50 px-3 py-1.5 rounded-full">
                Active Plan
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Plans Grid ── */}
      {loadingPlans && (
        <div className="flex justify-center items-center py-16">
          <div className="w-9 h-9 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {!loadingPlans && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {plans.length > 0 ? (
            plans.map((plan, i) => {
              const accent      = planAccents[i % planAccents.length];
              const isFree      = plan.price === 0;
              const isCurrent   = currentPlan.name === plan.name;
              const best        = getBestDiscount(plan);
              const hasDiscount = best && best.discountPercent > 0;
              const discPrice   = hasDiscount
                ? Math.round(plan.price * (1 - best.discountPercent / 100))
                : plan.price;
              const saving      = hasDiscount ? plan.price - discPrice : 0;
              const termLabel   = getTermLabel(best);

              return (
                <div
                  key={plan.planId}
                  className={`relative flex flex-col rounded-3xl overflow-visible
                    transition-transform duration-200 hover:-translate-y-1.5
                    bg-white
                    ${isCurrent
                      ? "border-2 border-indigo-500"
                      : accent.featured
                        ? "border-2 border-[#534AB7]"
                        : "border border-gray-100"
                    }`}
                >
                  {/* accent top bar */}
                  <div
                    className="h-[5px] rounded-t-3xl"
                    style={{ background: accent.color }}
                  />

                  {/* floating discount badge — highest % */}
                  {hasDiscount && (
                    <div
                      className="absolute -top-[13px] left-1/2 -translate-x-1/2
                                 text-[11px] font-medium px-3.5 py-1 rounded-full
                                 whitespace-nowrap z-10 tracking-wide"
                      style={{ background: accent.discBg, color: accent.discText }}
                    >
                      {best.discountPercent}% OFF
                      {accent.featured ? " · Most popular" : ""}
                    </div>
                  )}

                  <div className="px-5 pt-5 pb-4">
                    {/* name row */}
                    <div className="flex items-center justify-between mb-4">
                      <span
                        className="text-[10px] font-medium tracking-widest uppercase"
                        style={{ color: accent.featured ? accent.color : undefined }}
                      >
                        {plan.name}
                      </span>
                      {isCurrent && (
                        <span className="text-[10px] font-medium px-2.5 py-[3px] rounded-full bg-indigo-50 text-indigo-600">
                          Current
                        </span>
                      )}
                      {!isCurrent && accent.featured && (
                        <span className="text-[10px] font-medium px-2.5 py-[3px] rounded-full bg-[#EEEDFE] text-[#3C3489]">
                          Recommended
                        </span>
                      )}
                    </div>

                    {/* price block */}
                    <div className="min-h-[88px] mb-4">
                      {isFree ? (
                        <>
                          <p className="text-[40px] font-medium leading-none tracking-tight">
                            Free
                          </p>
                          <p className="text-xs text-gray-400 mt-2">Trial · 1 month</p>
                        </>
                      ) : (
                        <>
                          {hasDiscount && (
                            <p className="text-xs text-gray-400 line-through mb-1">
                              ₹{plan.price}
                              <span className="text-[10px]">/mo</span>
                            </p>
                          )}
                          <div className="flex items-baseline gap-1">
                            <span
                              className="text-[40px] font-medium leading-none tracking-tight"
                              style={{ color: accent.color }}
                            >
                              ₹{discPrice}
                            </span>
                            <span className="text-sm text-gray-400">/mo</span>
                          </div>
                          {hasDiscount && (
                            <span
                              className="mt-1.5 inline-block text-[11px] font-medium px-2.5 py-[3px] rounded-full"
                              style={{
                                background: accent.discBg === "#534AB7" ? "#EEEDFE" : accent.discBg,
                                color:      accent.discBg === "#534AB7" ? "#3C3489" : accent.discText,
                              }}
                            >
                              Save ₹{saving}/mo
                            </span>
                          )}
                          {termLabel && (
                            <p className="text-[11px] text-gray-400 mt-1.5">{termLabel}</p>
                          )}
                        </>
                      )}
                    </div>

                    {/* button — same navigate as original */}
                    <button
                      type="button"
                      disabled={isFree}
                      className="w-full py-2.5 rounded-2xl text-[13px] font-medium text-white
                                 transition-opacity hover:opacity-85 active:scale-[0.98]
                                 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ background: isFree ? "#9ca3af" : accent.color }}
                      onClick={() =>
                        navigate(
                          `/dashboard/checkout/${instituteId}/${plan.planId}?remainingDays=${getRemainingDaysNumber(currentPlan.endDate)}`
                        )
                      }
                    >
                      {isFree ? "Free Plan" : "Choose Plan"}
                    </button>
                  </div>

                  {/* features — sirf true wale */}
                  <div className="border-t border-gray-100 px-3 py-2 flex-1">
                    {/* limits row */}
                    {[
                      { label: "Students", val: `Up to ${plan.limits?.students ?? 0}` },
                      { label: "Staff",    val: `Up to ${plan.limits?.staff ?? 0}` },
                      { label: "Courses",  val: `Up to ${plan.limits?.courses ?? 0}` },
                    ].map((item, fi) => (
                      <div
                        key={item.label}
                        className={`flex items-center justify-between px-3 py-[6px] rounded-xl
                          ${fi % 2 === 0 ? "bg-gray-50" : ""}`}
                      >
                        <span className="text-[11px] text-gray-400">{item.label}</span>
                        <span className="text-[11px] font-medium text-gray-700">{item.val}</span>
                      </div>
                    ))}

                    {/* boolean features — only true */}
                    {featureList.map((f, fi) => {
                      const val = f.getValue(plan);
                      if (!val) return null;
                      return (
                        <div
                          key={f.label}
                          className={`flex items-center justify-between px-3 py-[6px] rounded-xl
                            ${(fi + 3) % 2 === 0 ? "bg-gray-50" : ""}`}
                        >
                          <span className="text-[11px] text-gray-400">{f.label}</span>
                          <CheckIcon />
                        </div>
                      );
                    })}
                  </div>

                  {/* footer */}
                  <div className="px-5 py-3 border-t border-gray-50 flex items-center justify-center gap-1.5">
                    <svg
                      className="w-3 h-3 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
                      />
                    </svg>
                    <p className="text-[11px] text-gray-400">30-day money-back guarantee</p>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-center col-span-4 text-gray-400">No Plans Available</p>
          )}
        </div>
      )}
    </div>
  );
}