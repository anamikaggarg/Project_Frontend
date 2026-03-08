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

    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 1) return diffDays + " days left";
    if (diffDays === 1) return "1 day left";
    return "Expired";
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
      
      const start = current.planStartDate ? new Date(current.planStartDate) : new Date();
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

  return (
    <div className="px-4 py-6">
    <div className="mb-10">
  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 
                  border border-indigo-200 
                  rounded-2xl p-8 shadow-md">

    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold text-indigo-700">
        Current Plan
      </h2>

      <span className="px-4 py-1 text-sm font-medium 
                       bg-indigo-600 text-white rounded-full shadow">
        {currentPlan.name}
      </span>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition">
        <p className="text-xs text-gray-500 mb-1">Start Date</p>
        <p className="font-semibold text-gray-800">
          {formatDateTime(currentPlan.startDate)}
        </p>
      </div>

      
      <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition">
        <p className="text-xs text-gray-500 mb-1">End Date</p>
        <p className="font-semibold text-gray-800">
          {formatDateTime(currentPlan.endDate)}
        </p>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition">
        <p className="text-xs text-gray-500 mb-1">Expires In</p>
        <p
          className={`font-semibold text-lg ${
            getRemainingDays(currentPlan.endDate) === "Expired"
              ? "text-red-500"
              : "text-green-600"
          }`}
        >
          {getRemainingDays(currentPlan.endDate)}
        </p>
      </div>


      <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition flex items-center justify-center">
        {getRemainingDays(currentPlan.endDate) === "Expired" ? (
          <span className="px-4 py-2 bg-red-100 text-red-600 font-medium ">
             Plan Expired , To continue again  - Purchase Plan
          </span>
        ) : (
          <span className="px-4 py-2 bg-green-100 text-green-600 font-medium rounded-full">
            ✅ Active Plan
          </span>
        )}
      </div>

    </div>
  </div>
</div>

      
      {loadingPlans && <p className="text-center mb-6">Loading plans...</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {!loadingPlans && plans.length > 0 ? (
          plans.map((plan) => {
            const isPurchased = instituteState?.currentInstitute?.hasPurchasedPlanBefore;

            return (
              <div
                key={plan.planId}
                className={`flex flex-col border rounded-2xl p-6 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300
                  ${currentPlan.name === plan.name ? "border-indigo-600" : ""}
                `}
              >
                <h3 className="text-lg font-semibold">{plan.name}</h3>

                <div className="mt-4">
                  <p className="text-4xl font-bold text-indigo-600">₹{plan.price}</p>
                </div>

                <div className="mt-4 text-sm text-gray-600 space-y-1">
                  <p>Students: {plan.limits?.students || 0}</p>
                  <p>Staff: {plan.limits?.staff || 0}</p>
                  <p>Courses: {plan.limits?.courses || 0}</p>
                </div>

                {plan.discounts && plan.discounts.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {plan.discounts.map((d, idx) => (
                      <span
                        key={idx}
                        className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium
                          ${isPurchased
                            ? "bg-gray-200 text-gray-500 line-through"
                            : "bg-gradient-to-r from-indigo-100 to-indigo-200 text-indigo-900"
                          }`}
                      >
                        {d.discountPercent}% OFF ({d.duration} {d.durationType})
                      </span>
                    ))}
                  </div>
                )}


                <div className="mt-4 text-xs space-y-1">
                  {plan.features?.academic &&
                    Object.entries(plan.features.academic).map(([key, value]) => (
                      <p key={key}>
                        {value ? "✅" : "❌"} {key}
                      </p>
                    ))}
                </div>

                <button
                  type="button"
                  className="mt-6 py-2 px-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors duration-200"
                  onClick={() =>
                    navigate(`/dashboard/checkout/${instituteId}/${plan.planId}`)
                  }
                >
                  Choose Plan
                </button>
              </div>
            );
          })
        ) : (
          !loadingPlans && <p className="text-center col-span-4">No Plans Available</p>
        )}
      </div>
    </div>
  );
}