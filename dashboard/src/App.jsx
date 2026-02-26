import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setInstitute } from "./redux/slices/institute";

import InstituteRegister from "./components/InstituteRegister";
import Login from "./components/Login";
import DashboardLayout from "./components/DashboardLayout";
import DashboardHome from "./components/DashboardHome";
import Students from "./components/pages/Students";
import ManageCourses from "./components/pages/ManageCourses";
import Attendance from "./components/pages/Attendance";
import Timetable from "./components/pages/Timetable";
import Fees from "./components/pages/Fees";
import Notices from "./components/pages/Notices";
import Reports from "./components/pages/Reports";
import Settings from "./components/pages/Settings";
// import Checkout from "./components/pages/checkout";

import ProfilePage from "./components/pages/ProfilePage";
import PasswordPage from "./components/pages/PasswordPage";
import PlansPage from "./components/pages/PlansPage";
import BillPage from "./components/pages/BillPage";
import Checkout from "./components/pages/checkout";

function PrivateRoute({ children }) {
  const dispatch = useDispatch();
  const instituteState = useSelector(state => state.Institute);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!instituteState?.currentInstitute) {
      const stored = localStorage.getItem("institute");
      if (stored) dispatch(setInstitute(JSON.parse(stored)));
    }
    setReady(true);
  }, [dispatch, instituteState]);

  if (!ready) return null;

  const instituteId = instituteState?.currentInstitute?.instituteId;
  if (!instituteId) return <Navigate to="/login" />;

  return children;
}

export default function App() {
  return (
    <Router>
      <Routes>
     
        <Route path="/" element={<InstituteRegister />} />
        <Route path="/login" element={<Login />} />

     
        <Route
          path="dashboard"
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="students" element={<Students />} />
          <Route path="courses" element={<ManageCourses />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="timetable" element={<Timetable />} />
          <Route path="fees" element={<Fees />} />
          <Route path="notices" element={<Notices />} />
          <Route path="reports" element={<Reports />} />

          
          <Route path="settings" element={<Settings />}>
            <Route index element={<ProfilePage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="password" element={<PasswordPage/>} />
            <Route path="plans" element={<PlansPage />} />
            <Route path = "billing" element={<BillPage/>}/>
          </Route>

          {/* <Route path="checkout/:instituteId" element={<Checkout/>} /> */}

          <Route path="checkout/:instituteId/:planId" element={<Checkout/>}/>
        </Route>
      </Routes>
    </Router>
  );
}