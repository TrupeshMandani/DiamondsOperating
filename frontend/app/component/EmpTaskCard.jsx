"use client";
import { motion } from "framer-motion";
import { useState } from "react";

const EmpTaskCard = ({ task, status, updateTaskStatus }) => {
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
      const newStatus = isTaskStarted ? "completed" : "inProgress";
      updateTaskStatus(task.id, newStatus);
      setIsTaskStarted(!isTaskStarted); // Toggle task start/end state
      alert(`${action} for Batch ID: ${task.id} confirmed`);
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
