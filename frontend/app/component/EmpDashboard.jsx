"use client";
import { useState, useEffect, useMemo, memo } from "react";
import dynamic from "next/dynamic";
import EmpSidebar from "./EmpSidebar";

// Lazy load EmpSidebar to improve performance

// Memoized component to avoid re-rendering
const RenderTaskSummaryCard = memo(({ title, count, bgColor, textColor }) => (
  <div className={`w-full p-6 shadow-md rounded-lg text-center ${bgColor}`}>
    <h3 className={`text-xl font-semibold mb-4 ${textColor}`}>{title}</h3>
    <p className={`text-4xl font-bold ${textColor}`}>{count}</p>
  </div>
));

export default function EmployeeDashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const empId = localStorage.getItem("employeeId");
        if (!empId) {
          console.error("No employee ID found in storage");
          return;
        }

        // Fetch employee details and tasks
        const empResponse = await fetch(
          `http://localhost:5023/api/employees/${empId}`
        );
        const empData = await empResponse.json();
        setEmployee(empData);

        const tasksResponse = await fetch(
          `http://localhost:5023/api/batches/${empId}/tasks`
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

  // Memoize task counts
  const assignedTasks = useMemo(() => tasks?.assigned || [], [tasks]);
  const inProgressTasks = useMemo(() => tasks?.inProgress || [], [tasks]);
  const completedTasks = useMemo(() => tasks?.completed || [], [tasks]);

  if (loading) {
    return <div>Loading...</div>; // Show loading state
  }

  return (
    <div className="flex h-screen bg-[#e9e9e9] text-[#1A405E]">
      <EmpSidebar />
      <div className="flex-1 p-6 ml-72">
        <h1 className="text-2xl font-bold mb-6">Employee Dashboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 mb-8">
          <RenderTaskSummaryCard
            title="Assigned Tasks"
            count={assignedTasks.length}
            bgColor="bg-[#1A405E]"
            textColor="text-white"
          />
          <RenderTaskSummaryCard
            title="In Progress Tasks"
            count={inProgressTasks.length}
            bgColor="bg-[#236294]"
            textColor="text-white"
          />
          <RenderTaskSummaryCard
            title="Completed Tasks"
            count={completedTasks.length}
            bgColor="bg-white"
            textColor="text-black"
          />
        </div>
      </div>
    </div>
  );
}
