import Navbar from "./components/Navbar";
import { closesidenav } from "./redux/Slices/SidenavSlice";
import { useDispatch, useSelector } from "react-redux";
import Sidenav from "./components/Sidenav";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./components/pages/subPages/Dashboard";
import Home from "./components/pages/Home";
import Loginpage from "./components/pages/Loginpage";
import ProtectedRoutes from "./components/pages/ProtectedRoutes/ProtectedRoutes";
import ClassRoom from "./components/pages/subPages/ClassRoom";
import { useEffect } from "react";
function App() {
  const theme = useSelector((state) => state.Theme);
  useEffect(() => {
    if (theme) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ProtectedRoutes />}>
          <Route path="/" element={<Home />}>
            <Route index element={<Home />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="classroom" element={<ClassRoom />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
