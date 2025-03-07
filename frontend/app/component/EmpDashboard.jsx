"use client";

import EmpSidebar from "./EmpSidebar";
import EmpTaskList from "./EmpTaskList";

export default function EmpDashboard() {
  return (
    <div className="flex h-screen bg-[#e9e9e9] text-[#1A405E]">
      {/* Sidebar */}
      <EmpSidebar />

      {/* Main Content */}
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Employee Dashboard</h1>
        <EmpTaskList />
      </div>
    </div>
  );
}
