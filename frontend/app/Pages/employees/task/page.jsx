"use client";

import EmpSidebar from "@/app/component/EmpSidebar";
import EmpTaskList from "@/app/component/EmpTaskList";

export default function page() {
  return (
    <div className="flex h-screen bg-[#e9e9e9] text-[#1A405E]">
      {/* Sidebar */}
      <EmpSidebar />

      {/* Main Content */}
      <div className="flex-1 p-6 ml-72">
        {" "}
        {/* Added ml-72 to offset content from sidebar */}
        <EmpTaskList />
      </div>
    </div>
  );
}
