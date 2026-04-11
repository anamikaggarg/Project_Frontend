import React from "react";
import Navbar from "../Navbar";
import Sidenav from "../Sidenav";
import { Outlet, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import { closesidenav } from "../../redux/Slices/SidenavSlice";
import Subjects from "./subPages/ClassRoom/Subjects";
import { toggleSubjectTab } from "../../redux/Slices/SubjectTabToggleSlice";
import { PanelLeftOpen } from "lucide-react";

const Home = () => {
  const location = useLocation();
  const issidenav = useSelector((state) => state.sidenav);
  const Course = useSelector((state) => state.Course);
  const isSubjectTab = useSelector((state) => state.SubjectTabToggle);
  const dispatch = useDispatch();

  return (
    <div className="h-screen">
      <div className="flex h-full w-full">
        <div className="flex items-center h-full">
          <div className="z-998 h-full left-0 top-0 flex absolute lg:static">
            <Sidenav />
          </div>
          {issidenav && (
            <div
              onClick={() => dispatch(closesidenav())}
              className="fixed inset-0 bg-black/40 z-997 lg:hidden"
            />
          )}
        </div>

        <div className="bg-gray-200 h-full w-full lg:grid-rows-12 lg:grid-cols-12 lg:gap-3 overflow-hidden grid relative">
          <AnimatePresence>
            {isSubjectTab && (
              <motion.div
                key="backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => dispatch(toggleSubjectTab())}
                className="inset-0 bg-transparent backdrop-blur-xs absolute z-2 lg:hidden"
              />
            )}
          </AnimatePresence>

          <div className="lg:col-span-12 lg:row-span-1 z-4">
            <Navbar />
          </div>

          <main className="lg:col-span-9 lg:row-span-11 lg:mt-3 overflow-y-scroll scrollhide">
            <Outlet />
          </main>

          <AnimatePresence>
            {isSubjectTab && (
              <>
                <motion.button
                  key="close-btn"
                  onClick={() => dispatch(toggleSubjectTab())}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="bg-indigo-500 px-3 py-2 rounded-lg border-indigo-900 flex items-center lg:text-base text-sm text-white lg:gap-3 gap-2 lg:hidden visible cursor-pointer font-semibold active:scale-97 duration-300 ease-in-out transition-all top-15 left-5 absolute z-3"
                >
                  <PanelLeftOpen className="lg:w-6 lg:h-6 w-4 h-4" />
                  close
                </motion.button>

                <motion.div
                  key="subject-panel"
                  initial={{ x: "100%", opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: "100%", opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="lg:col-span-3  overflow-y-scroll scrollhide  lg:row-span-11 row-span-2 rounded-2xl lg:mt-3 mr-2 top-15 lg:visible lg:relative absolute right-0 z-3"
                >
                  {Course.iscourse && <Subjects />}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Home;