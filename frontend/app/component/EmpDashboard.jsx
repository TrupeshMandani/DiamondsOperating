"use client";
import { useState } from "react";
import EmpSidebar from "./EmpSidebar";

const EmpDashboard = () => {
  const tasks = {
    assigned: [
      { id: "B001", start: "10:00 AM", end: "12:00 PM" },
      { id: "B002", start: "12:30 PM", end: "2:30 PM" },
      { id: "B003", start: "12:45 PM", end: "2:30 PM" },
      { id: "B004", start: "8:00 AM", end: "10:00 AM" },
      { id: "B005", start: "9:00 AM", end: "11:00 AM" },
      { id: "B006", start: "10:00 AM", end: "12:00 PM" },
      { id: "B007", start: "1:00 PM", end: "3:00 PM" },
    ],
    inProgress: [
      { id: "B003", start: "3:00 PM", end: "5:00 PM" },
      { id: "B008", start: "11:00 AM", end: "1:00 PM" },
      { id: "B009", start: "2:00 PM", end: "4:00 PM" },
    ],
    completed: [
      { id: "B004", start: "8:00 AM", end: "10:00 AM" },
      { id: "B005", start: "9:00 AM", end: "11:00 AM" },
    ],
  };

  // Extract task counts
  const assignedTasks = tasks?.assigned || [];
  const inProgressTasks = tasks?.inProgress || [];
  const completedTasks = tasks?.completed || [];

  const renderTaskSummaryCard = (title, count, bgColor, textColor) => (
    <div className={`w-full p-6 shadow-md rounded-lg text-center ${bgColor}`}>
      <h3 className={`text-xl font-semibold mb-4 ${textColor}`}>{title}</h3>
      <p className={`text-4xl font-bold ${textColor}`}>{count}</p>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#e9e9e9] text-[#1A405E]">
      {/* Sidebar */}
      <EmpSidebar />

      {/* Main Content */}
      <div className="flex-1 p-6 ml-72">
        {/* Dashboard Summary Cards */}
        <h1 className="text-2xl font-bold mb-6">Employee Dashboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 mb-8">
          {renderTaskSummaryCard(
            "Assigned Tasks",
            assignedTasks.length,
            "bg-[#1A405E]",
            "text-white"
          )}
          {renderTaskSummaryCard(
            "In Progress Tasks",
            inProgressTasks.length,
            "bg-[#236294]",
            "text-white"
          )}
          {renderTaskSummaryCard(
            "Completed Tasks",
            completedTasks.length,
            "bg-white",
            "text-black"
          )}
        </div>
      </div>
    </div>
  );
};

export default EmpDashboard;
