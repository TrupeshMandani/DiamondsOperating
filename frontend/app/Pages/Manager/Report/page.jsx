// Improved ReportPage with consistent and professional UI
"use client";
import React, { useState } from "react";
import BatchReport from "@/app/component/report/BatchReport";
import EmployeeReport from "@/app/component/report/EmpReport";
import Sidebar from "@/app/component/Sidebar";

const ReportPage = () => {
  const [tab, setTab] = useState("batch");

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - fixed for desktop */}
      <div className="w-64 md:w-72 fixed inset-y-0 left-0 bg-[#121828] text-white shadow-xl z-10">
        <Sidebar />
      </div>

      {/* Main Content */}
      <main className="flex-1 ml-64 md:ml-72 p-4 sm:p-6 md:p-8 overflow-y-auto w-full">
        <div className="flex flex-col gap-6 w-full">
          <h1 className="text-3xl font-bold text-gray-800">Reports</h1>

          {/* Tabs */}
          <div className="flex gap-4 flex-wrap">
            <button
              onClick={() => setTab("batch")}
              className={`px-5 py-2.5 rounded-lg font-medium transition shadow ${
                tab === "batch"
                  ? "bg-[#003566] text-white hover:bg-[#001d3d]"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-700"
              }`}
            >
              Batch Report
            </button>
            <button
              onClick={() => setTab("employee")}
              className={`px-5 py-2.5 rounded-lg font-medium transition shadow ${
                tab === "employee"
                  ? "bg-[#001d3d] text-white hover:bg-[#003566]"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-700"
              }`}
            >
              Employee Report
            </button>
          </div>

          {/* Report Section */}
          <div className="w-full bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
            {tab === "batch" ? <BatchReport /> : <EmployeeReport />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ReportPage;
