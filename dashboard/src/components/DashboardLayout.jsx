import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  
  const [open, setOpen] = useState(window.innerWidth > 1024);

  return (
    <div className="flex min-h-screen">
  
      <Sidebar open={open} setOpen={setOpen} />

      <div
        className={`flex-1 min-h-screen bg-white transition-all duration-300 ${
         
          open ? "lg:ml-64 ml-0" : "ml-0"
        }`}
      >
        <Header open={open} setOpen={setOpen} />
        <main className="p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}