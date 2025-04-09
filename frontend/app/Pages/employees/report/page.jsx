import EmployeeDashboard from "../../../component/Emp-report/EmployeeDashboard";
import EmpSidebar from "../../../component/EmpSidebar";  // Adjust the import path accordingly
import React from "react";

const Page = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-1/4 p-4">
        <EmpSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-semibold text-center mb-6 text-gray-800">
          Earnings Dashboard
        </h1>
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-5xl mx-auto">
          <EmployeeDashboard />
        </div>
      </div>
    </div>
  );
};

export default Page;