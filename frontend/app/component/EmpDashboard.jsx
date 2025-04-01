"use client";
import { useState, useEffect, memo } from "react";
import { useErrorBoundary, ErrorBoundary } from "react-error-boundary";
import EmpSidebar from "./EmpSidebar";

const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <div className="flex flex-col items-center justify-center h-screen bg-red-50 space-y-4">
    <h2 className="text-2xl font-bold text-red-600">⚠️ Error</h2>
    <p className="text-red-500">{error.message}</p>
    <button
      onClick={resetErrorBoundary}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
    >
      Try Again
    </button>
  </div>
);

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
  </div>
);

const RenderTaskSummaryCard = memo(({ title, count, bgColor, textColor }) => (
  <div
    className={`w-full p-6 shadow-lg rounded-xl text-center ${bgColor} transition-all hover:scale-105`}
  >
    <h3 className={`text-xl font-semibold mb-2 ${textColor}`}>{title}</h3>
    <p className={`text-4xl font-bold ${textColor}`}>{count}</p>
  </div>
));

function EmployeeDashboard() {
  const [tasks, setTasks] = useState({
    counts: { assigned: 0, inProgress: 0, completed: 0 },
  });
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState("");
  const { showBoundary } = useErrorBoundary();

  const fetchEmployeeData = async (empId) => {
    try {
      const response = await fetch(
        `http://localhost:5023/api/tasks/employee/${empId}/summary`
      );

      if (!response.ok) throw new Error("Failed to fetch task summary");

      const result = await response.json();

      setTasks({
        counts: {
          assigned: result?.assigned || 0,
          inProgress: result?.inProgress || 0,
          completed: result?.completed || 0,
        },
      });
      setLastUpdated(new Date().toLocaleTimeString());
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Employee Dashboard</h1>
          <span className="text-sm text-gray-500">
            Last updated: {lastUpdated}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
          <RenderTaskSummaryCard
            title="Assigned Tasks"
            count={tasks.counts.assigned}
            bgColor="bg-blue-800 hover:bg-blue-900"
            textColor="text-white"
          />
          <RenderTaskSummaryCard
            title="In Progress"
            count={tasks.counts.inProgress}
            bgColor="bg-blue-600 hover:bg-blue-700"
            textColor="text-white"
          />
          <RenderTaskSummaryCard
            title="Completed"
            count={tasks.counts.completed}
            bgColor="bg-white hover:bg-gray-50"
            textColor="text-blue-800"
          />
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Task Statistics</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h3 className="text-sm font-medium text-gray-500">Total Tasks</h3>
              <p className="text-2xl font-bold">
                {tasks.counts.assigned +
                  tasks.counts.inProgress +
                  tasks.counts.completed}
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="text-sm font-medium text-gray-500">
                Completion Rate
              </h3>
              <p className="text-2xl font-bold">
                {Math.round(
                  (tasks.counts.completed /
                    (tasks.counts.assigned +
                      tasks.counts.inProgress +
                      tasks.counts.completed || 1)) *
                    100
                )}
                %
              </p>
            </div>
          </div>
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
