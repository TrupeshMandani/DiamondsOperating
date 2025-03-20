"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";

const EmpTaskCardWithTimer = ({
  task,
  section,
  updateTaskStatus,
  updatingTasks,
  getPriorityColor,
}) => {
  const [elapsedTime, setElapsedTime] = useState(null);

  useEffect(() => {
    let interval;

    if (task.status === "In Progress" && task.startTime && !task.endTime) {
      const start = new Date(task.startTime).getTime();
      interval = setInterval(() => {
        const now = new Date().getTime();
        setElapsedTime(now - start);
      }, 1000);
    }

    if (task.status === "Completed" && task.startTime && task.endTime) {
      const start = new Date(task.startTime).getTime();
      const end = new Date(task.endTime).getTime();
      setElapsedTime(end - start);
    }

    return () => clearInterval(interval);
  }, [task.status, task.startTime, task.endTime]);

  const formatDuration = (ms) => {
    const totalSec = Math.floor(ms / 1000);
    const hours = Math.floor(totalSec / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = totalSec % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const durationDisplay =
    task.startTime && task.endTime
      ? formatDuration(new Date(task.endTime) - new Date(task.startTime))
      : task.status === "In Progress" && elapsedTime
      ? formatDuration(elapsedTime)
      : null;

  return (
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
          Number of Diamonds: {task.diamondNumber}
        </span>
      </div>

      <div className="flex items-center gap-2 mt-2">
        <Clock className="h-4 w-4 text-gray-600" />
        <span className="text-sm">
          Assigned: {new Date(task.assignedDate).toLocaleDateString()}
        </span>
      </div>

      {/* Timer Display */}
      {durationDisplay && (
        <div className="text-sm text-blue-600 mt-1">
          ⏱ Time: {durationDisplay}
        </div>
      )}

      <Badge className={`mt-2 ${getPriorityColor(task.priority)}`}>
        {task.priority}
      </Badge>

      <div className="flex flex-col gap-2 mt-3">
        {section === "assigned" && (
          <Button
            className="w-full"
            onClick={() => updateTaskStatus(task._id, "In Progress")}
            disabled={updatingTasks.has(task._id)}
          >
            {updatingTasks.has(task._id) ? "Updating..." : "Start Task"}
          </Button>
        )}

        {section === "inProgress" && (
          <Button
            className="w-full"
            onClick={() => updateTaskStatus(task._id, "Completed")}
            disabled={updatingTasks.has(task._id)}
          >
            {updatingTasks.has(task._id) ? "Updating..." : "Complete Task"}
          </Button>
        )}

        <Button
          className="w-full bg-gray-700 hover:bg-gray-900 text-white"
          onClick={() =>
            alert(
              `Task ID: ${task._id}\nStart: ${
                task.startTime ? new Date(task.startTime).toLocaleString() : "—"
              }\nEnd: ${
                task.endTime ? new Date(task.endTime).toLocaleString() : "—"
              }\nTime Spent: ${durationDisplay || "—"}`
            )
          }
        >
          View Details
        </Button>
      </div>
    </motion.div>
  );
};

export default EmpTaskCardWithTimer;
