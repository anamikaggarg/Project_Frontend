import React from "react";
import ClassStatics from "../../Dashborad/ClassStatics";
import OverallPerformance from "../../Dashborad/OverallPerformance";
import PerformanceSummary from "../../Dashborad/PerformanceSummary";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

const Dashboard = () => {
  const user = useSelector((state) => state.User);
  console.log(user)
  return (
    <div className=" bg-gray-200 w-full h-full">
      <div className="w-full flex justify-between items-center">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="font-semibold lg:text-2xl lg:p-2"
        >
          Dashboard
        </motion.h2>
        <motion.select
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="text-blue-700 font-bold lg:text-lg"
          name="classes"
          id=""
        >
          <option value="classA">CLass A</option>
          <option value="classB">CLass B</option>
          <option value="classC">CLass C</option>
        </motion.select>
      </div>
      {user.role === "Teacher" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          <ClassStatics />
          <OverallPerformance />
          <PerformanceSummary />
          <div className="bg-white p-4 rounded-xl w-full h-full"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          <div className="bg-white p-4 rounded-xl w-full h-full"></div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
