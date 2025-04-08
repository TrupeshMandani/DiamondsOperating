// EmpTaskList.jsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock } from "lucide-react";
import TaskCardWithTimer from "./EmpTaskCardWithTimer";
import { io } from "socket.io-client";

const socket = io("http://localhost:5023");

const EmpTaskList = () => {
  const [tasks, setTasks] = useState({
    assigned: [],
    inProgress: [],
    partiallyCompleted: [],
    completed: [],
  });
  const [taskLimits, setTaskLimits] = useState({
    assigned: 4,
    inProgress: 4,
    partiallyCompleted: 4,
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
        partiallyCompleted: data.filter(
          (task) => task.status === "Partially Completed"
        ),
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

    socket.on("taskAssigned", (newTask) => {
      const employeeId = localStorage.getItem("employeeId");
      if (newTask.employeeId === employeeId) {
        setTasks((prevTasks) => ({
          ...prevTasks,
          assigned: [...prevTasks.assigned, newTask],
        }));
      }
      fetchAssignedTasks();
    });

    socket.on("taskDeleted", ({ taskId }) => {
      setTasks((prevTasks) => ({
        assigned: prevTasks.assigned.filter((task) => task._id !== taskId),
        inProgress: prevTasks.inProgress.filter((task) => task._id !== taskId),
        partiallyCompleted: prevTasks.partiallyCompleted.filter(
          (task) => task._id !== taskId
        ),
        completed: prevTasks.completed.filter((task) => task._id !== taskId),
      }));
    });

    return () => {
      socket.off("taskAssigned");
      socket.off("taskDeleted");
    };
  }, []);

  const updateTaskStatus = async (taskId, newStatus, extraData = {}) => {
    try {
      if (!taskId) throw new Error("Task ID is missing");

      setUpdatingTasks((prev) => new Set([...prev, taskId]));

      const token = localStorage.getItem("authToken");
      const url = `http://localhost:5023/api/tasks/${taskId}/update-status`;

      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus, ...extraData }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        try {
          const errorData = JSON.parse(errorText);
          throw new Error(errorData.message || "Failed to update task status");
        } catch (e) {
          throw new Error(`Failed to update task status: ${errorText}`);
        }
      }

      const responseData = await response.json();
      const updatedTask = responseData.task;

      const statusMap = {
        Pending: "assigned",
        "In Progress": "inProgress",
        "Partially Completed": "partiallyCompleted",
        Completed: "completed",
      };

      setTasks((prev) => {
        const newState = { ...prev };
        const oldStatusKey = Object.keys(prev).find((key) =>
          prev[key].some((t) => t._id === taskId)
        );

        if (oldStatusKey) {
          newState[oldStatusKey] = newState[oldStatusKey].filter(
            (t) => t._id !== taskId
          );
        }

        const newStatusKey = statusMap[newStatus];
        if (newStatusKey) {
          newState[newStatusKey] = [
            ...(newState[newStatusKey] || []),
            updatedTask,
          ];
        }

        return newState;
      });

      socket.emit("taskUpdated", { taskId, status: newStatus });
      return updatedTask;
    } catch (err) {
      setError(err.message);
      console.error("Update error:", err);
      return null;
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

  const renderTaskRows = (taskList, section) => {
    if (taskList.length === 0) {
      return (
        <div className="col-span-full text-center text-gray-500">
          No tasks {section.replace(/([A-Z])/g, " ").toLowerCase()}
        </div>
      );
    }

    return taskList
      .slice(0, taskLimits[section])
      .map((task) => (
        <TaskCardWithTimer
          key={task._id}
          task={task}
          section={section}
          updateTaskStatus={updateTaskStatus}
          updatingTasks={updatingTasks}
          getPriorityColor={getPriorityColor}
        />
      ));
  };

  const sectionLabels = {
    assigned: "Assigned",
    inProgress: "In Progress",
    partiallyCompleted: "Partially Completed",
    completed: "Completed",
  };

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
      <h1 className="text-2xl font-bold">Employee Task List</h1>
      {Object.keys(tasks).map((section) => (
        <div
          key={section}
          className="w-full p-6 bg-white shadow-md rounded-lg mb-8"
        >
          <h2 className="text-xl font-semibold text-black mb-6">
            {sectionLabels[section] || section} Tasks
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
