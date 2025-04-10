import React from "react";
import EmpDashboard from "@/app/component/EmpDashboard";
import AuthProtection from "@/utils/AuthProtection";
import EmpSidebar from "../../../component/EmpSidebar";

const Page = () => {
  return (
    <AuthProtection>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <div className="w-64">
          <EmpSidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-gray-100 p-6 overflow-auto">
          <EmpDashboard />
        </div>
      </div>
    </AuthProtection>
  );
};

export default Page;
