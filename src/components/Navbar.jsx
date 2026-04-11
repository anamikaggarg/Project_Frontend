import { Bell, Filter, Menu, Plus, Search, Settings, Sun } from "lucide-react";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { sidenavtoggle } from "../redux/Slices/SidenavSlice";
// import { searchboxclose, searchboxopen } from "../redux/Slices/searchslice";
import { FaAngleDown } from "react-icons/fa6";
import { AiOutlineSun } from "react-icons/ai";
import { toggleTheme } from "../redux/Slices/ThemeSlice";
import { logout } from "../redux/Slices/UserSlice";
import { useNavigate } from "react-router-dom";
import { RiMessage2Line } from "react-icons/ri";
import SearchBox from "./SearchBox";

function Navbar() {
  const [notification, setNotification] = useState([
    { title: "New Student", body: "John Doe enrolled" },
    { title: "Payment", body: "Payment of $500 received" },
    { title: "Update", body: "System update completed" },
    { title: "Alert", body: "New inquiry received" },
    { title: "Success", body: "Course published" },
  ]);
  const [notificationDropDown, setNotificationDropDown] = useState(false);
  const [loggingOut, setIsloggingOut] = useState(false);
  const [isProfileDropdown, setIsProfileDrowdown] = useState(false);
  const navigate = useNavigate();
  const user = useSelector((state) => state.User);
  const dispatch = useDispatch();
  const search = true;
  // const search = useSelector((state) => state.search);

  const searchboxhandle = (e) => {
    e.preventDefault();
    if (e.target.value !== "") {
      dispatch(searchboxopen());
    } else {
      dispatch(searchboxclose());
    }
  };

  const handleLogout = () => {
    setIsloggingOut(true);
    setTimeout(() => {
      dispatch(logout());
      navigate("/admin/login");
    }, 2000);
  };

  const notificationVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, y: -10, scale: 0.95, transition: { duration: 0.15 } },
  };

  const profileVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, y: -10, scale: 0.95, transition: { duration: 0.15 } },
  };

  const menuItemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (custom) => ({
      opacity: 1,
      x: 0,
      transition: { delay: custom * 0.05, duration: 0.2 },
    }),
  };

  return (
    <motion.div
      className="bg-white/80 dark:bg-gray-900 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-700/50 flex items-center  w-full px-4 lg:px-2 py-3 shadow-sm"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center w-full h-full">
        <div className="flex lg:mx-3 items-center justify-between w-full">
          <motion.button
            onClick={() => dispatch(sidenavtoggle())}
            className="lg:p-2 p-1 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Menu className="lg:w-5 lg:h-5 w-4 h-4" />
          </motion.button>

          <div className="hidden lg:flex flex-1 max-w-md  relative">
            <div className=" w-full ">
              <SearchBox />
            </div>
          </div>
          <div className="flex items-center space-x-2 lg:space-x-3 justify-end">
            <motion.button
              onClick={() => dispatch(toggleTheme())}
              className="p-1 lg:p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <AiOutlineSun className="w-5 h-5" />
            </motion.button>

            <div className="relative flex items-center justify-center">
              <motion.button
                onClick={() => {
                  setNotificationDropDown(!notificationDropDown);
                  setIsProfileDrowdown(false);
                }}
                className="relative flex items-center  p-1 lg:p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Bell className="w-4 h-4 lg:w-5 lg:h-5" />
                <motion.span
                  className="absolute -top-1 right-0 lg:-top-1 lg:right-1 w-4 h-4 lg:w-5 lg:h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {notification.length}
                </motion.span>
              </motion.button>

              <AnimatePresence>
                {notificationDropDown && (
                  <motion.div
                    variants={notificationVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="absolute top-12 -right-2 lg:right-0 w-72 max-h-80 bg-white dark:bg-gray-800 flex flex-col rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden z-50"
                  >
                    <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50">
                      <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <RiMessage2Line className="text-base" />
                        Recent Notifications
                      </h2>
                    </div>
                    <ul className="overflow-y-auto demo flex flex-col">
                      {notification.map((noti, idx) => (
                        <motion.li
                          key={idx}
                          custom={idx}
                          variants={menuItemVariants}
                          initial="hidden"
                          animate="visible"
                          className="px-4 py-3 border-b border-slate-100 dark:border-slate-700 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer"
                        >
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">
                            {noti.title}
                          </p>
                          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                            {noti.body}
                          </p>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="relative">
              <motion.div
                onClick={() => {
                  setIsProfileDrowdown(!isProfileDropdown);
                  setNotificationDropDown(false);
                }}
                className="flex items-center lg:pl-4 lg:gap-3 gap-2 border-l border-slate-200 dark:border-slate-700 cursor-pointer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold text-sm border-2 border-blue-200 dark:border-blue-800">
                  {user.currentUser ? user.currentUser.Name : "null"}
                </motion.div>
                <div className="hidden lg:flex dark:text-white font-semibold lg:gap-2 items-center text-sm">
                  <p>{user.currentUser?.Name || "User"}</p>
                  <motion.div
                    animate={{ rotate: isProfileDropdown ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FaAngleDown className="text-sm" />
                  </motion.div>
                </div>
              </motion.div>

              <AnimatePresence>
                {isProfileDropdown && (
                  <motion.div
                    variants={profileVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="absolute top-14 -right-4 lg:right-0 w-56 bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden z-50"
                  >
                    <motion.button
                      onClick={handleLogout}
                      className="w-full px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-sm font-semibold text-left flex items-center gap-2"
                      whileHover={{ backgroundColor: "rgba(239, 68, 68, 0.1)" }}
                    >
                      {loggingOut ? (
                        <div className="flex items-center gap-2">
                          <motion.div
                            className="w-3 h-3 border-2 border-red-300 border-t-red-600 rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                          />
                          <span>Logging Out...</span>
                        </div>
                      ) : (
                        "Logout"
                      )}
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default Navbar;