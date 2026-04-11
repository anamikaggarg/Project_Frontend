import React from "react";
import { motion } from "framer-motion";
import { IoIosSearch } from "react-icons/io";

const SearchBox = () => {
  const containerVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  };

  return (
    <motion.div
      className="w-full border-2 border-slate-300 dark:border-slate-600 rounded-full px-4 py-2 lg:py-3 flex justify-center items-center relative bg-white dark:bg-slate-800 shadow-lg"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <input
        type="text"
        placeholder="Search..."
        className="w-full border-0 outline-0 bg-transparent text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 text-sm lg:text-base"
      />
      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
        <IoIosSearch className="text-slate-600 dark:text-slate-400 text-xl lg:text-2xl cursor-pointer transition-colors hover:text-slate-800 dark:hover:text-slate-200" />
      </motion.div>
    </motion.div>
  );
};

export default SearchBox;
