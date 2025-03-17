"use client";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useState } from "react";

const EmpTaskCard = ({ task, status, updateTaskStatus }) => {
  // WebSocket connection to listen for updates
  useEffect(() => {
    const socket = new WebSocket("ws://localhost:5023");

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === "taskCompleted" && message.taskId === task.id) {
        updateTaskStatus(task.id, "completed");
      }
    };

    return () => {
      socket.close();
    };
  }, [task.id, updateTaskStatus]);
  const [isTaskStarted, setIsTaskStarted] = useState(status === "inProgress");

  const getStatusClass = () => {
    switch (status) {
      case "assigned":
        return "text-blue-400";
      case "inProgress":
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
      const newStatus = isTaskStarted ? "Completed" : "In Progress";

      // Send request to update task status
      fetch(`http://localhost:5023/api/tasks/update-status/${task._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
          // Include task ID for clarity
          taskId: task._id,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Task status updated:", data);
          updateTaskStatus(task._id, newStatus.toLowerCase().replace(" ", ""));
          setIsTaskStarted(!isTaskStarted);
          alert(`${action} for Batch ID: ${task.id || task.batchId} confirmed`);
        })
        .catch((error) => {
          console.error("Error updating task status:", error);
          alert("Failed to update task status");
        });
    }
  };

  return (
    <motion.div className="w-full p-4 bg-[#e9e9e9] shadow-inner-deep text-black rounded-lg mb-4 hover:shadow-lg hover:scale-102 transition-all duration-300">
      <div className="flex flex-col gap-2">
        <p className="text-lg font-medium">Batch ID: {task.id}</p>
        <div className="flex justify-between items-center">
          <p className="text-sm">
            <span className="font-medium">Start:</span> {task.start}
          </p>
          <p className="text-sm">
            <span className="font-medium">End:</span> {task.end}
          </p>
        </div>
        <p className={`text-sm font-semibold ${getStatusClass()}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </p>

        {/* Task Action Button */}
        {(status === "assigned" || status === "inProgress") && (
          <button
            onClick={handleTaskAction}
            className="mt-4 p-2 bg-[#236294] text-white rounded-lg transition-all duration-200 hover:bg-[#1A405E]"
          >
            {isTaskStarted ? "End Task" : "Start Task"}
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default EmpTaskCard;
