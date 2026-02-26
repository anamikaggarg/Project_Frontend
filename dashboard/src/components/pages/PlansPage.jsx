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
    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getRemainingDays = (endDate) => {
    if (!endDate) return "-";

    const today = new Date();
    const end = new Date(endDate);

    // Remove time part (IMPORTANT FIX)
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

      const res = await axios.get(
        `${API_URL}/plans/allPlans`,
        { headers: { "ngrok-skip-browser-warning": "true" } }
      );

      if (res.data && Array.isArray(res.data.plans)) {
        setPlans(res.data.plans);
      } else {
        setPlans([]);
      }

      const planStatus = instituteState?.currentInstitute?.planStatus;

      if (planStatus === "activated") {
        setCurrentPlan({
          name:
            instituteState?.currentInstitute?.currentPlan || "Premium Plan",
          startDate: instituteState?.currentInstitute?.planStartDate,
          endDate: instituteState?.currentInstitute?.planEndDate,
        });
      }
    } catch (error) {
      console.error("Error fetching plans:", error);
      setPlans([]);
    } finally {
      setLoadingPlans(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  return (
    <div className="px-4 py-6">
      <div className="border rounded-lg p-6 mb-10 bg-gray-50 shadow-sm">
        <div className="flex gap-10 flex-wrap">
          <div>
            <p className="text-sm text-gray-500">Plan Name</p>
            <p className="font-medium">{currentPlan.name}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Start Date</p>
            <p>{formatDateTime(currentPlan.startDate)}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">End Date</p>
            <p>{formatDateTime(currentPlan.endDate)}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Expires In</p>
            <p>{getRemainingDays(currentPlan.endDate)}</p>
          </div>
        </div>
      </div>

      {loadingPlans && (
        <p className="text-center mb-6">Loading plans...</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {!loadingPlans && plans.length > 0 ? (
          plans.map((plan) => {
            const isPurchased =
              instituteState?.currentInstitute?.hasPurchasedPlanBefore;

            return (
              <div
                key={plan.planId}
                className="flex flex-col border rounded-2xl p-6 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <h3 className="text-lg font-semibold">{plan.name}</h3>

                <div className="mt-4">
                  <p className="text-4xl font-bold text-indigo-600">
                    ₹{plan.price}
                  </p>
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
                          ${
                            isPurchased
                              ? "bg-gray-200 text-gray-500 line-through"
                              : "bg-gradient-to-r from-indigo-100 to-indigo-200 text-indigo-900"
                          }
                        `}
                      >
                        {d.discountPercent}% OFF ({d.duration}{" "}
                        {d.durationType})
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-4 text-xs space-y-1">
                  {plan.features?.academic &&
                    Object.entries(plan.features.academic).map(
                      ([key, value]) => (
                        <p key={key}>
                          {value ? "✅" : "❌"} {key}
                        </p>
                      )
                    )}
                </div>

                <button
                  type="button"
                  className="mt-6 py-2 px-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors duration-200"
                  onClick={() =>
                    navigate(
                      `/dashboard/checkout/${instituteId}/${plan.planId}`
                    )
                  }
                >
                  Choose Plan
                </button>
              </div>
            );
          })
        ) : (
          !loadingPlans && (
            <p className="text-center col-span-4">No Plans Available</p>
          )
        )}
      </div>
    </div>
  );
}