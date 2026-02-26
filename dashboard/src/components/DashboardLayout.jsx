import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  // Mobile starts closed, Desktop starts open
  const [open, setOpen] = useState(window.innerWidth > 1024);

  return (
    <div className="flex min-h-screen">
      {/* 1. Pass setOpen so Sidebar can close itself on mobile clicks */}
      <Sidebar open={open} setOpen={setOpen} />

      <div
        className={`flex-1 min-h-screen bg-[#f6f5fa] transition-all duration-300 ${
          /* Mobile: Always 0 margin. Desktop: ml-64 ONLY if open */
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