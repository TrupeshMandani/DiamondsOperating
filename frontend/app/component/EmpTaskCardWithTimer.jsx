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
  const [batchDetails, setBatchDetails] = useState(null);
  const [loading, setLoading] = useState(false);

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

  const fetchBatchDetails = async () => {
    if (!task.batchTitle) {
      console.error("Batch Title is missing!");
      return;
    }

    console.log("Fetching batch details for Batch Title:", task.batchTitle);
    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:5023/api/tasks/title/${encodeURIComponent(
          task.batchTitle
        )}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch batch details");
      }

      const data = await response.json();
      console.log("Fetched Batch Details:", data);

      if (task.currentProcess === "Stitching") {
        const sarinTask = data.find(
          (task) =>
            task.currentProcess === "Sarin" && task.status === "Completed"
        );

        if (!sarinTask) {
          alert(
            "Please wait until 'Sarin' task is completed before starting 'Stitching' task."
          );
          return;
        }
      }

      if (task.currentProcess === "4P Cutting") {
        const sarinTask = data.find(
          (task) =>
            task.currentProcess === "Sarin" && task.status === "Completed"
        );
        const stitchingTask = data.find(
          (task) =>
            task.currentProcess === "Stitching" && task.status === "Completed"
        );

        if (!sarinTask || !stitchingTask) {
          alert(
            "Please wait until both 'Sarin' and 'Stitching' tasks to be completed before starting the '4P Cutting' task."
          );
          return;
        }
      }

      startTask();
    } catch (error) {
      console.error("Error fetching batch details:", error);
    } finally {
      setLoading(false);
    }
  };

  const startTask = () => {
    updateTaskStatus(task._id, "In Progress");
  };

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
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all"
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-base font-semibold text-gray-900">
            {task.batchTitle || "Unknown Batch"}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {task.currentProcess || "N/A"}
          </p>
        </div>
        <Badge className={`${getPriorityColor(task.priority)} text-xs`}>
          {task.priority}
        </Badge>
      </div>

      <hr className="border-gray-100 my-3" />

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Due Date</p>
              <p className="text-gray-700">
                {new Date(task.dueDate).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Assigned</p>
              <p className="text-gray-700">
                {new Date(task.assignedDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-gray-500">Diamonds</span>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-medium">
                {task.diamondNumber}
              </Badge>
              <span className="text-xs text-gray-500">pieces</span>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-gray-500">Rate</span>
            <Badge variant="outline" className="font-medium text-green-600">
              ₹{task.rate?.toLocaleString()}/pc
            </Badge>
          </div>
        </div>
      </div>

      <div className="mt-3 p-2 bg-green-50 rounded-md border border-green-100">
        <div className="flex justify-between items-center">
          <span className="text-sm text-green-800">Total Earnings</span>
          <span className="font-medium text-green-700">
            ₹{task.earnings?.toLocaleString()}
          </span>
        </div>
      </div>

      {durationDisplay && (
        <div className="mt-3 bg-blue-50 p-2 rounded-md">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-blue-600">⏱ Time Spent:</span>
            <span className="font-medium text-blue-700">{durationDisplay}</span>
          </div>
        </div>
      )}

      {task.description && (
        <p className="mt-3 text-sm text-gray-600 italic">
          "{task.description}"
        </p>
      )}

      <div className="mt-4 space-y-2">
        {section === "assigned" && (
          <Button
            className="w-full"
            onClick={fetchBatchDetails}
            disabled={updatingTasks.has(task._id)}
          >
            {updatingTasks.has(task._id) ? "Processing..." : "Start Task →"}
          </Button>
        )}

        {section === "inProgress" && (
          <Button
            className="w-full"
            variant="success"
            onClick={() => updateTaskStatus(task._id, "Completed")}
            disabled={updatingTasks.has(task._id)}
          >
            {updatingTasks.has(task._id) ? "Completing..." : "Mark Complete ✓"}
          </Button>
        )}

        <Button
          variant="ghost"
          className="w-full text-gray-600 hover:bg-gray-50"
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
          View Full Details
        </Button>
      </div>
    </motion.div>
  );
};

export default EmpTaskCardWithTimer;