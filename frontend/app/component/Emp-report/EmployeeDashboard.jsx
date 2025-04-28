"use client";
import { useState, useEffect } from "react";
import axios from "axios";

import EarningsReport from "./EarningsReport";
import TaskHistory from "./TaskHistory";

const EmployeeDashboard = () => {
  const [employeeId, setEmployeeId] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [earningsData, setEarningsData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [monthlyEarnings, setMonthlyEarnings] = useState(0);
  const [yearlyEarnings, setYearlyEarnings] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("earnings");

  // ✅ Safely get employee ID on client side
  useEffect(() => {
    if (typeof window !== "undefined") {
      const idFromStorage = localStorage.getItem("employeeId");
      setEmployeeId(idFromStorage);
    }
  }, []);

  useEffect(() => {
    if (!employeeId) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch tasks
        const tasksResponse = await axios.get(
          `https://diamondsoperating.onrender.com/api/employees/${employeeId}/tasks`
        );
        const tasksData = tasksResponse.data;
        setTasks(tasksData);

        // Fetch earnings
        const earningsResponse = await axios.get(
          `https://diamondsoperating.onrender.com/api/earnings/${employeeId}`
        );
        const earningsData = earningsResponse.data?.monthlyEarnings;

        if (!Array.isArray(earningsData)) {
          throw new Error("Invalid earnings data format received");
        }

        setEarningsData(earningsData);

        // Calculate monthly earnings
        const selectedMonthData = earningsData.find(
          (entry) => entry.month === selectedMonth
        );
        const monthly = selectedMonthData ? selectedMonthData.totalEarnings : 0;

        // Calculate yearly earnings
        const yearly = earningsData
          .filter((entry) => entry.year === new Date().getFullYear())
          .reduce((acc, entry) => acc + entry.totalEarnings, 0);

        setMonthlyEarnings(monthly);
        setYearlyEarnings(yearly);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [employeeId, selectedMonth]);

  const handleMonthChange = (month) => {
    setSelectedMonth(month);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl font-semibold">Loading performance data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl font-semibold text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">
          Employee Performance Dashboard
        </h1>

        {/* Tabs */}
        <div className="flex mb-6 border-b">
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "earnings"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-600 hover:text-blue-500"
            }`}
            onClick={() => setActiveTab("earnings")}
          >
            Earnings Report
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "tasks"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-600 hover:text-blue-500"
            }`}
            onClick={() => setActiveTab("tasks")}
          >
            Task History
          </button>
        </div>

        {/* Tabs Content */}

        {activeTab === "earnings" && (
          <EarningsReport
            earningsData={earningsData}
            selectedMonth={selectedMonth}
            monthlyEarnings={monthlyEarnings}
            yearlyEarnings={yearlyEarnings}
            onMonthChange={handleMonthChange}
          />
        )}

        {activeTab === "tasks" && <TaskHistory tasks={tasks} />}
      </div>
    </div>
  );
};

export default EmployeeDashboard;
