"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const EmpTaskCard = ({ task, status, updateTaskStatus }) => {
  const normalizedStatus = status?.toLowerCase();
  const [isTaskStarted, setIsTaskStarted] = useState(
    normalizedStatus === "in progress"
  );
  const [elapsedTime, setElapsedTime] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // WebSocket connection to listen for updates
  useEffect(() => {
    const socket = new WebSocket("ws://localhost:5023");

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === "taskUpdated" && message.taskId === task._id) {
        updateTaskStatus(task._id, message.newStatus.toLowerCase());
      }
    };

    return () => socket.close();
  }, [task._id, updateTaskStatus]);

  // Time calculation effect
  useEffect(() => {
    let interval;
    const calculateElapsedTime = () => {
      if (task.startTime) {
        const start = new Date(task.startTime).getTime();
        const now = Date.now();
        return now - start;
      }
      return 0;
    };

    if (normalizedStatus === "in progress" && !task.endTime) {
      setElapsedTime(calculateElapsedTime());
      interval = setInterval(() => {
        setElapsedTime(calculateElapsedTime());
      }, 1000);
    } else if (task.endTime) {
      const start = new Date(task.startTime).getTime();
      const end = new Date(task.endTime).getTime();
      setElapsedTime(end - start);
    }

    return () => clearInterval(interval);
  }, [normalizedStatus, task.startTime, task.endTime]);

  const formatDuration = (ms) => {
    const totalSec = Math.floor(ms / 1000);
    const hours = Math.floor(totalSec / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = totalSec % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const handleTaskAction = async () => {
    const newStatus = isTaskStarted ? "Completed" : "In Progress";
    const confirmationMessage = `Are you sure you want to ${
      isTaskStarted ? "complete" : "start"
    } this task?`;

    if (!window.confirm(confirmationMessage)) return;

    try {
      setIsUpdating(true);
      const token = localStorage.getItem("authToken");

      const response = await fetch(
        `http://localhost:5023/api/tasks/${task._id}/update-status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data = await response.json();
      updateTaskStatus(task._id, newStatus.toLowerCase());
      setIsTaskStarted(!isTaskStarted);
    } catch (error) {
      console.error("Update error:", error);
      alert(`Failed to update task: ${error.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleViewDetails = () => {
    const details = [
      `Batch: ${task.batchTitle}`,
      `Process: ${task.currentProcess}`,
      `Description: ${task.description}`,
      `Priority: ${task.priority}`,
      `Status: ${task.status}`,
      `Start: ${
        task.startTime ? new Date(task.startTime).toLocaleString() : "N/A"
      }`,
      `End: ${task.endTime ? new Date(task.endTime).toLocaleString() : "N/A"}`,
      `Duration: ${elapsedTime ? formatDuration(elapsedTime) : "N/A"}`,
    ].join("\n");

    alert(`📝 Task Details:\n${details}`);
  };

  return (
    <motion.div
      className="w-full p-4 bg-[#e9e9e9] shadow-inner-deep text-black rounded-lg mb-4 hover:shadow-lg hover:scale-102 transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-start">
          <p className="text-lg font-medium">{task.batchTitle}</p>
          <span
            className={`text-sm font-semibold ${getStatusColor(
              normalizedStatus
            )}`}
          >
            {task.status}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="font-medium">Start Time</p>
            <p>
              {task.startTime
                ? new Date(task.startTime).toLocaleString()
                : "N/A"}
            </p>
          </div>
          <div>
            <p className="font-medium">End Time</p>
            <p>
              {task.endTime ? new Date(task.endTime).toLocaleString() : "N/A"}
            </p>
          </div>
        </div>

        {elapsedTime && (
          <div className="bg-blue-100 p-2 rounded">
            <p className="text-sm text-blue-600">
              ⏱ Elapsed Time: {formatDuration(elapsedTime)}
            </p>
          </div>
        )}

        <div className="flex gap-2 mt-4">
          {(normalizedStatus === "assigned" ||
            normalizedStatus === "in progress") && (
            <button
              onClick={handleTaskAction}
              disabled={isUpdating}
              className="flex-1 p-2 bg-[#236294] text-white rounded-lg hover:bg-[#1A405E] disabled:bg-gray-400 transition-colors"
            >
              {isUpdating
                ? "Updating..."
                : isTaskStarted
                ? "Complete Task"
                : "Start Task"}
            </button>
          )}
          <button
            onClick={handleViewDetails}
            className="flex-1 p-2 bg-gray-700 text-white rounded-lg hover:bg-gray-900 transition-colors"
          >
            View Details
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// Helper function for status colors
const getStatusColor = (status) => {
  switch (status) {
    case "assigned":
      return "text-blue-500";
    case "in progress":
      return "text-yellow-600";
    case "completed":
      return "text-green-600";
    default:
      return "text-gray-600";
  }
};

export default EmpTaskCard;
