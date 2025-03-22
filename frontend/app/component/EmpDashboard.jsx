"use client";
import { useState, useEffect } from "react";
import EmpSidebar from "./EmpSidebar";

export default function EmployeeDashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    // Fetch initial employee data and tasks
    const fetchEmployeeData = async () => {
      try {
        // Get employee ID from localStorage or session
        const empId = localStorage.getItem("employeeId");
        if (!empId) {
          console.error("No employee ID found in storage");
          return;
        }

        // Fetch employee details
        const empResponse = await fetch(
          `http://localhost:5023/api/employees/${empId}`
        );
        const empData = await empResponse.json();
        setEmployee(empData);

        // Fetch employee tasks
        const tasksResponse = await fetch(
          `http://localhost:5023/api/tasks/employee/${empId}`
        );
        const tasksData = await tasksResponse.json();
        setTasks(tasksData);
      } catch (error) {
        console.error("Error fetching employee data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeData();
  }, []);

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
}
