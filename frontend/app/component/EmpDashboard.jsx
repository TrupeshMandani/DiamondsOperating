import EmpSidebar from "./EmpSidebar";
import EmpTaskList from "./EmpTaskList";

import TaskList from "./TaskList";

export default function EmpDashboard() {
  return (
    <div className="flex h-screen bg-[#fcfcfc] text-[#1A405E]">
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
