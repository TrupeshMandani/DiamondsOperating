"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock } from "lucide-react";
// Removed the import for Switch

const EmpTaskList = () => {
  const [tasks, setTasks] = useState({
    assigned: [],
    inProgress: [],
    completed: [],
  });
  const [taskLimits, setTaskLimits] = useState({
    assigned: 4,
    inProgress: 4,
    completed: 4,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingTasks, setUpdatingTasks] = useState(new Set());
  const [filters, setFilters] = useState({
    priority: null,
    timeRange: null,
    customStartDate: null,
    customEndDate: null,
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filtersEnabled, setFiltersEnabled] = useState(false);

  const fetchAssignedTasks = async () => {
    try {
      const employeeId = localStorage.getItem("employeeId");
      const token = localStorage.getItem("authToken");
      if (!employeeId || !token)
        throw new Error("Employee ID or token not found. Please log in again.");

      const response = await fetch(
        `http://localhost:5023/api/employees/${employeeId}/tasks`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok)
        throw new Error(`Failed to fetch tasks: ${await response.text()}`);

      const data = await response.json();
      setTasks({
        Assigned: data.filter((task) => task.status === "Pending"),
        InProgress: data.filter((task) => task.status === "In Progress"),
        Completed: data.filter((task) => task.status === "Completed"),
      });
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignedTasks();
  }, []);

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      // Validate inputs
      if (!taskId || !/^[0-9a-fA-F]{24}$/.test(taskId)) {
        throw new Error("Invalid task ID format");
      }

      setUpdatingTasks((prev) => {
        const newSet = new Set(prev);
        newSet.add(taskId);
        return newSet;
      });

      const token = localStorage.getItem("authToken");
      const url = `http://localhost:5023/api/tasks/update-status/${taskId}`;

      console.log("Making request to:", url); // Debug log

      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const errorText = await response.text(); // Instead of response.json()
        console.error("Full server response:", errorText);
        throw new Error(errorText || "Failed to update task");
      }

      // Optimistic update
      setTasks((prev) => {
        const moveTask = (from, to) => ({
          ...prev,
          [from]: prev[from].filter((t) => t._id !== taskId),
          [to]: [
            ...prev[to],
            ...prev[from]
              .filter((t) => t._id === taskId)
              .map((t) => ({ ...t, status: newStatus })),
          ],
        });

        if (newStatus === "In Progress")
          return moveTask("assigned", "inProgress");
        if (newStatus === "Completed")
          return moveTask("inProgress", "completed");
        return prev;
      });
    } catch (err) {
      setError(err.message);
      console.error("Update error:", err);
      fetchAssignedTasks();
    } finally {
      setUpdatingTasks((prev) => {
        const newSet = new Set(prev);
        newSet.delete(taskId);
        return newSet;
      });
    }
  };

  const handleTaskLimitChange = (section, increment) => {
    setTaskLimits((prev) => ({
      ...prev,
      [section]: prev[section] + (increment ? 4 : -4),
    }));
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const renderTaskRows = (taskList, section) =>
    taskList.slice(0, taskLimits[section]).map((task) => (
      <motion.div
        key={task._id}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white p-4 shadow-md rounded-lg border border-gray-200 hover:shadow-lg transition-shadow"
      >
        <h3 className="text-lg font-semibold">
          Batch ID: {task.batchTitle || "Unknown"}
        </h3>
        <p className="text-gray-600 text-sm">
          Process: {task.currentProcess || "N/A"}
        </p>
        <p className="text-gray-600 text-sm">
          Description: {task.description || "No details"}
        </p>
        <div className="flex items-center gap-2 mt-2">
          <Calendar className="h-4 w-4 text-gray-600" />
          <span className="text-sm">
            Due: {new Date(task.dueDate).toLocaleDateString()}
          </span>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-sm font-medium">
            Earnings: ₹{(task.rate * task.diamondNumber || 0).toFixed(2)}
          </span>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-sm font-medium">
            Number of Diamonds: {task.diamondNumber}
          </span>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <Clock className="h-4 w-4 text-gray-600" />
          <span className="text-sm">
            assigned: {new Date(task.assignedDate).toLocaleDateString()}
          </span>
        </div>
        <Badge className={`mt-2 ${getPriorityColor(task.priority)}`}>
          {task.priority}
        </Badge>

        {section === "assigned" && (
          <Button
            className="w-full mt-3"
            onClick={() => updateTaskStatus(task._id, "In Progress")}
            disabled={updatingTasks.has(task._id)}
          >
            {updatingTasks.has(task._id) ? "Updating..." : "Start Task"}
          </Button>
        )}

        {section === "inProgress" && (
          <Button
            className="w-full mt-3"
            onClick={() => updateTaskStatus(task._id, "Completed")}
            disabled={updatingTasks.has(task._id)}
          >
            {updatingTasks.has(task._id) ? "Updating..." : "Complete Task"}
          </Button>
        )}
      </motion.div>
    ));

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
      </div>
    );

  const handleFilterChange = (type, value) => {
    setFilters((prev) => ({
      ...prev,
      [type]: value === "All" ? null : value,
    }));
  };

  const getDateRange = (timeRange) => {
    const now = new Date();
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);

    switch (timeRange) {
      case "Today":
        const todayStart = new Date(now);
        todayStart.setHours(0, 0, 0, 0);
        return {
          start: todayStart,
          end: endDate,
        };
      case "1 Week":
        const weekStart = new Date(now);
        weekStart.setDate(weekStart.getDate() - 7);
        weekStart.setHours(0, 0, 0, 0);
        return {
          start: weekStart,
          end: endDate,
        };
      case "1 Month":
        const monthStart = new Date(now);
        monthStart.setMonth(monthStart.getMonth() - 1);
        monthStart.setHours(0, 0, 0, 0);
        return {
          start: monthStart,
          end: endDate,
        };
      case "3 Months":
        const threeMonthsStart = new Date(now);
        threeMonthsStart.setMonth(threeMonthsStart.getMonth() - 3);
        threeMonthsStart.setHours(0, 0, 0, 0);
        return {
          start: threeMonthsStart,
          end: endDate,
        };
      case "6 Months":
        const sixMonthsStart = new Date(now);
        sixMonthsStart.setMonth(sixMonthsStart.getMonth() - 6);
        sixMonthsStart.setHours(0, 0, 0, 0);
        return {
          start: sixMonthsStart,
          end: endDate,
        };
      case "1 Year":
        const yearStart = new Date(now);
        yearStart.setFullYear(yearStart.getFullYear() - 1);
        yearStart.setHours(0, 0, 0, 0);
        return {
          start: yearStart,
          end: endDate,
        };
      default:
        return null;
    }
  };

  const filterTasks = (tasks) => {
    // If filters are disabled, return all tasks
    if (!filtersEnabled) return tasks;

    return tasks.filter((task) => {
      // Priority filter
      if (filters.priority && task.priority !== filters.priority) return false;

      // Time filter
      // Time range filter
      if (filters.timeRange) {
        const range = getDateRange(filters.timeRange);
        const taskDate = new Date(task.assignedDate);
        if (taskDate < range.start || taskDate > range.end) return false;
      }

      // Custom date range filter
      if (filters.customStartDate && filters.customEndDate) {
        const taskDate = new Date(task.assignedDate);
        if (
          taskDate < new Date(filters.customStartDate) ||
          taskDate > new Date(filters.customEndDate)
        )
          return false;
      }

      return true;
    });
  };

  if (error)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500 text-center">
          <p>{error}</p>
          <button
            onClick={fetchAssignedTasks}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Employee Task List</h1>
        <div className="relative">
          <div className="inline-flex items-center">
            <Button
              variant="outline"
              size="sm"
              className="rounded-r-none border-r-0"
            >
              Filters {filtersEnabled && "(On)"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-l-none px-2"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              {isFilterOpen ? (
                <IoIosArrowUp className="h-4 w-4" />
              ) : (
                <IoIosArrowDown className="h-4 w-4" />
              )}
            </Button>
          </div>

          {isFilterOpen && (
            <div className="absolute z-10 right-0 mt-1 w-64 bg-white rounded-md shadow-lg border border-gray-200 p-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b">
                  <label
                    htmlFor="filter-toggle"
                    className="font-medium text-sm"
                  >
                    Enable Filters
                  </label>
                  {/* Custom toggle switch */}
                  <div className="relative inline-block w-10 h-5 align-middle select-none transition duration-200 ease-in">
                    <input
                      type="checkbox"
                      name="filter-toggle"
                      id="filter-toggle"
                      checked={filtersEnabled}
                      onChange={() => setFiltersEnabled(!filtersEnabled)}
                      className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer"
                    />
                    <label
                      htmlFor="filter-toggle"
                      className={`toggle-label block overflow-hidden h-5 rounded-full cursor-pointer ${
                        filtersEnabled ? "bg-blue-500" : "bg-gray-300"
                      }`}
                    ></label>
                  </div>
                  <style jsx>{`
                    .toggle-checkbox {
                      transform: translateX(${filtersEnabled ? "100%" : "0"});
                      transition: transform 0.2s ease-in-out;
                      border-color: ${filtersEnabled ? "#3b82f6" : "#ccc"};
                    }
                    .toggle-label {
                      transition: background-color 0.2s ease-in-out;
                      background-color: ${filtersEnabled
                        ? "#3b82f6"
                        : "#d1d5db"};
                    }
                  `}</style>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Priority
                  </label>
                  <select
                    className="w-full p-2 border rounded"
                    onChange={(e) =>
                      handleFilterChange("priority", e.target.value)
                    }
                    value={filters.priority || "All"}
                    disabled={!filtersEnabled}
                  >
                    <option value="All">All</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Time Range
                  </label>
                  <select
                    className="w-full p-2 border rounded"
                    onChange={(e) =>
                      handleFilterChange("timeRange", e.target.value)
                    }
                    value={filters.timeRange || "All"}
                    disabled={!filtersEnabled}
                  >
                    <option value="All">All</option>
                    <option value="Today">Today</option>
                    <option value="1 Week">1 Week</option>
                    <option value="1 Month">1 Month</option>
                    <option value="3 Months">3 Months</option>
                    <option value="6 Months">6 Months</option>
                    <option value="1 Year">1 Year</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Custom Date Range
                  </label>
                  <div className="space-y-2">
                    <div>
                      <label className="text-xs text-gray-500">
                        Start Date
                      </label>
                      <input
                        type="date"
                        className="w-full p-2 border rounded"
                        value={filters.customStartDate || ""}
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            customStartDate: e.target.value,
                          }))
                        }
                        disabled={!filtersEnabled}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">End Date</label>
                      <input
                        type="date"
                        className="w-full p-2 border rounded"
                        value={filters.customEndDate || ""}
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            customEndDate: e.target.value,
                          }))
                        }
                        disabled={!filtersEnabled}
                      />
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full"
                  onClick={() => setIsFilterOpen(false)}
                  variant="ghost"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      {Object.keys(tasks).map((section) => (
        <div
          key={section}
          className="w-full p-6 bg-white shadow-md rounded-lg mb-8"
        >
          <h2 className="text-xl font-semibold text-black mb-6">
            {section.replace(/([A-Z])/g, " $1").trim()} Tasks
          </h2>
          <div className="bg-white p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {renderTaskRows(filterTasks(tasks[section]), section)}
          </div>
          <div className="flex justify-center mt-4 gap-4">
            {taskLimits[section] < tasks[section].length && (
              <button
                onClick={() => handleTaskLimitChange(section, true)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-black rounded-full flex items-center gap-2 transition-all"
              >
                <span>See More</span> <IoIosArrowDown className="text-xl" />
              </button>
            )}
            {taskLimits[section] > 4 && (
              <button
                onClick={() => handleTaskLimitChange(section, false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-black rounded-full flex items-center gap-2 transition-all"
              >
                <span>See Less</span> <IoIosArrowUp className="text-xl" />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default EmpTaskList;
