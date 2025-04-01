"use client";
import { useState, useEffect, memo } from "react";
import { useErrorBoundary, ErrorBoundary } from "react-error-boundary";
import EmpSidebar from "./EmpSidebar";

// Error Fallback Component
const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <div className="flex flex-col items-center justify-center h-screen bg-red-50 space-y-4">
    <h2 className="text-2xl font-bold text-red-600">⚠️ Error</h2>
    <p className="text-red-500">{error.message}</p>
    <button
      onClick={resetErrorBoundary}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg"
    >
      Try Again
    </button>
  </div>
);

// Loading Spinner
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
  </div>
);

// Task Summary Card
const RenderTaskSummaryCard = memo(({ title, count, bgColor, textColor }) => (
  <div className={`w-full p-6 shadow-lg rounded-xl text-center ${bgColor}`}>
    <h3 className={`text-xl font-semibold mb-2 ${textColor}`}>{title}</h3>
    <p className={`text-4xl font-bold ${textColor}`}>{count}</p>
  </div>
));

function EmployeeDashboard() {
  const [tasks, setTasks] = useState({
    counts: { assigned: 0, inProgress: 0, completed: 0 },
  });
  const [loading, setLoading] = useState(true);
  const { showBoundary } = useErrorBoundary();

  const fetchEmployeeData = async (empId) => {
    try {
      const response = await fetch(
        `http://localhost:5023/api/tasks/employee/${empId}/summary`
      );
      if (!response.ok) throw new Error("Failed to fetch task summary");

      const { data } = await response.json();
      setTasks({
        counts: {
          assigned: data.assigned || 0,
          inProgress: data.inProgress || 0,
          completed: data.completed || 0,
        },
      });
    } catch (error) {
      console.error("Fetch error:", error);
      showBoundary(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const empId = localStorage.getItem("employeeId");
    if (!empId) {
      showBoundary(new Error("No employee ID found in storage"));
      return;
    }

    fetchEmployeeData(empId);

    const interval = setInterval(() => {
      fetchEmployeeData(empId);
    }, 30000);

    return () => clearInterval(interval);
  }, [showBoundary]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800">
      <EmpSidebar />
      <div className="flex-1 p-8 ml-72">
        <h1 className="text-3xl font-bold mb-8">Employee Dashboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
          <RenderTaskSummaryCard
            title="Assigned Tasks"
            count={tasks.counts.assigned}
            bgColor="bg-blue-800"
            textColor="text-white"
          />
          <RenderTaskSummaryCard
            title="In Progress"
            count={tasks.counts.inProgress}
            bgColor="bg-blue-600"
            textColor="text-white"
          />
          <RenderTaskSummaryCard
            title="Completed"
            count={tasks.counts.completed}
            bgColor="bg-white"
            textColor="text-blue-800"
          />
        </div>
      </div>
    </div>
  );
}

export default function DashboardWrapper() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <EmployeeDashboard />
    </ErrorBoundary>
  );
}
