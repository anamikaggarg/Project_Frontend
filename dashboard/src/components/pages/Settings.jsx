import { NavLink, Outlet } from "react-router-dom";

export default function Settings() {
  return (
    <div className="min-h-screen bg-gray-50 flex justify-center p-6">
      <div className="w-full max-w-7xl bg-white rounded-2xl shadow-xl p-8 flex flex-col gap-8">

        {/* TABS */}
        <div className="flex gap-4 border-b pb-4">

          <NavLink
            to="profile"
            end
            className={({ isActive }) =>
              `px-5 py-2 rounded-full text-sm font-medium transition ${
                isActive
                  ? "bg-indigo-600 text-white shadow"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`
            }
          >
            Profile
          </NavLink>

          <NavLink
            to="password"
            className={({ isActive }) =>
              `px-5 py-2 rounded-full text-sm font-medium transition ${
                isActive
                  ? "bg-indigo-600 text-white shadow"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`
            }
          >
            Security
          </NavLink>

          <NavLink
            to="plans"
            className={({ isActive }) =>
              `px-5 py-2 rounded-full text-sm font-medium transition ${
                isActive
                  ? "bg-indigo-600 text-white shadow"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`
            }
          >
            Plans
          </NavLink>
            <NavLink
            to="billing"
            className={({ isActive }) =>
              `px-5 py-2 rounded-full text-sm font-medium transition ${
                isActive
                  ? "bg-indigo-600 text-white shadow"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`
            }
          >
            Billing
          </NavLink>

        </div>

        {/* Yaha child routes render honge */}
        <Outlet />

      </div>
    </div>
  );
}