import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock } from "lucide-react";

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
        assigned: data.filter((task) => task.status === "Pending"),
        inProgress: data.filter((task) => task.status === "In Progress"),
        completed: data.filter((task) => task.status === "Completed"),
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
          <Clock className="h-4 w-4 text-gray-600" />
          <span className="text-sm">
            Assigned: {new Date(task.assignedDate).toLocaleDateString()}
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
      {Object.keys(tasks).map((section) => (
        <div key={section} className="w-full p-6 bg-white shadow-md rounded-lg">
          <h2 className="text-xl font-semibold text-black text-center mb-6">
            {section.replace(/([A-Z])/g, " $1").trim()} Tasks
          </h2>
          <div className="bg-white p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {renderTaskRows(tasks[section], section)}
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
