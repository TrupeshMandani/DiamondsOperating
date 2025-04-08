import EarningsDashboard from "@/app/component/EarningsDashboard";
import EmpSidebar from "@/app/component/EmpSidebar";
import Sidebar from "@/app/component/Sidebar";
import React from "react";

const Page = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <EmpSidebar />
      <h1 className="text-3xl font-semibold text-center mb-6 text-gray-800">
        Earnings Dashboard
      </h1>
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-5xl w-full mx-4">
        <EarningsDashboard />
      </div>
    </div>
  );
};

export default Page;
