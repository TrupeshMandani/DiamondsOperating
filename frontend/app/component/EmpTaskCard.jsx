"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const EmpTaskCard = ({ task, status, updateTaskStatus }) => {
  const normalizedStatus = status?.toLowerCase(); // "In Progress" => "in progress"
  const [isTaskStarted, setIsTaskStarted] = useState(normalizedStatus === "in progress");
  const [elapsedTime, setElapsedTime] = useState(null);

  useEffect(() => {
    let interval;

    if (normalizedStatus === "in progress" && task.startTime && !task.endTime) {
      const start = new Date(task.startTime).getTime();

      interval = setInterval(() => {
        const now = Date.now();
        setElapsedTime(now - start);
      }, 1000);
    }

    if (normalizedStatus === "completed" && task.startTime && task.endTime) {
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

  const getStatusClass = () => {
    switch (normalizedStatus) {
      case "assigned":
        return "text-blue-400";
      case "in progress":
        return "text-yellow-500";
      case "completed":
        return "text-green-400";
      default:
        return "";
    }
  };

  const handleTaskAction = () => {
    const action = isTaskStarted ? "End Task" : "Start Task";
    const confirmationMessage = isTaskStarted
      ? "Are you sure you want to end the task?"
      : "Are you sure you want to start the task?";

    if (window.confirm(confirmationMessage)) {
      const newStatus = isTaskStarted ? "Completed" : "In Progress"; // Capitalized for backend
      updateTaskStatus(task._id, newStatus);
      setIsTaskStarted(!isTaskStarted);
      alert(`${action} for Batch ID: ${task._id} confirmed`);
    }
  };

  const handleViewDetails = () => {
    alert(
      `📝 Task Details:
Batch: ${task.batchTitle}
Process: ${task.currentProcess}
Description: ${task.description}
Priority: ${task.priority}
Status: ${task.status}
Start: ${task.startTime ? new Date(task.startTime).toLocaleString() : "—"}
End: ${task.endTime ? new Date(task.endTime).toLocaleString() : "—"}
Duration: ${task.durationInMinutes ? task.durationInMinutes + " mins" : elapsedTime ? formatDuration(elapsedTime) : "—"}`
    );
  };

  return (
    <motion.div className="w-full p-4 bg-[#e9e9e9] shadow-inner-deep text-black rounded-lg mb-4 hover:shadow-lg hover:scale-102 transition-all duration-300">
      <div className="flex flex-col gap-2">
        <p className="text-lg font-medium">Batch ID: {task.batchTitle}</p>
        <div className="flex justify-between items-center text-sm">
          <p>
            <span className="font-medium">Start:</span>{" "}
            {task.startTime ? new Date(task.startTime).toLocaleString() : "—"}
          </p>
          <p>
            <span className="font-medium">End:</span>{" "}
            {task.endTime ? new Date(task.endTime).toLocaleString() : "—"}
          </p>
        </div>

        {/* ⏱️ Timer or fixed duration */}
        {elapsedTime && (
          <p className="text-sm text-blue-600">
            ⏱ Time Spent: {formatDuration(elapsedTime)}
          </p>
        )}

        <p className={`text-sm font-semibold ${getStatusClass()}`}>
          {task.status}
        </p>

        <div className="flex gap-2 mt-4">
          {(normalizedStatus === "assigned" || normalizedStatus === "in progress") && (
            <button
              onClick={handleTaskAction}
              className="flex-1 p-2 bg-[#236294] text-white rounded-lg transition-all duration-200 hover:bg-[#1A405E]"
            >
              {isTaskStarted ? "End Task" : "Start Task"}
            </button>
          )}
          <button
            onClick={handleViewDetails}
            className="flex-1 p-2 bg-gray-700 text-white rounded-lg transition-all duration-200 hover:bg-gray-900"
          >
            View Details
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default EmpTaskCard;
