// EmpTaskCardWithTimer.jsx
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
  const [isPartialComplete, setIsPartialComplete] = useState(false);
  const [partialDetails, setPartialDetails] = useState({
    diamonds: 0,
    reason: "",
  });

  useEffect(() => {
    if (task.status === "Partially Completed") {
      setIsPartialComplete(true);
      setPartialDetails({
        diamonds: task.partialDiamondNumber,
        reason: task.partialReason,
      });
    }
  }, [task]);

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
    if (!task.batchTitle) return alert("Batch Title is missing!");
    try {
      const response = await fetch(
        `https://diamondsoperating.onrender.com/api/tasks/title/${encodeURIComponent(
          task.batchTitle
        )}`
      );
      if (!response.ok) throw new Error("Failed to fetch batch details");
      const data = await response.json();

      const hasSarin = data.some((t) => t.currentProcess === "Sarin");
      const hasStitching = data.some((t) => t.currentProcess === "Stitching");

      if (task.currentProcess === "Stitching" && hasSarin) {
        const sarinTask = data.find(
          (t) => t.currentProcess === "Sarin" && t.status === "Completed"
        );
        if (!sarinTask) return alert("Complete 'Sarin' task first");
      }

      if (task.currentProcess === "4P Cutting") {
        if (
          hasSarin &&
          !data.find(
            (t) => t.currentProcess === "Sarin" && t.status === "Completed"
          )
        )
          return alert("Complete 'Sarin' task first");
        if (
          hasStitching &&
          !data.find(
            (t) => t.currentProcess === "Stitching" && t.status === "Completed"
          )
        )
          return alert("Complete 'Stitching' task first");
      }

      updateTaskStatus(task._id, "In Progress");
    } catch (error) {
      console.error("Batch Dependency Error:", error);
      alert("Error verifying batch dependencies");
    }
  };

  const handlePartialComplete = async (taskId) => {
    if (task.status === "Completed" || isPartialComplete) {
      alert("Task already completed");
      return;
    }

    const diamonds = prompt(`Completed diamonds (max ${task.diamondNumber}):`);
    const partialDiamonds = parseInt(diamonds);
    if (
      !partialDiamonds ||
      partialDiamonds <= 0 ||
      partialDiamonds > task.diamondNumber
    ) {
      alert(`Enter number between 1-${task.diamondNumber}`);
      return;
    }

    const reason = prompt("Reason for partial completion:");
    if (!reason?.trim()) {
      alert("Reason is required");
      return;
    }

    try {
      await updateTaskStatus(taskId, "Partially Completed", {
        partialDiamondNumber: partialDiamonds,
        partialReason: reason,
      });
      setIsPartialComplete(true);
      setPartialDetails({ diamonds: partialDiamonds, reason });
      alert("Partial completion recorded");
    } catch (error) {
      console.error("Partial Complete Error:", error);
      alert(error.message || "Failed to save partial completion");
    }
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
      className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all"
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-base font-semibold text-gray-900">
            {task.batchTitle}
          </h3>
          <p className="text-sm text-gray-500 mt-1">{task.currentProcess}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <Badge className={`${getPriorityColor(task.priority)} text-xs`}>
            {task.priority}
          </Badge>
          {task.status === "Partially Completed" && (
            <Badge className="bg-yellow-200 text-yellow-800 text-xs">
              Partial
            </Badge>
          )}
        </div>
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
          <span className="text-sm text-green-800">Earnings</span>
          <span className="font-medium text-green-700">
            ₹{task.taskEarnings?.toLocaleString()}
          </span>
        </div>
      </div>

      {durationDisplay && (
        <div className="mt-3 bg-blue-50 p-2 rounded-md">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-blue-600">⏱ Duration:</span>
            <span className="font-medium text-blue-700">{durationDisplay}</span>
          </div>
        </div>
      )}

      {task.description && (
        <p className="mt-3 text-sm text-gray-600 italic">
          "{task.description}"
        </p>
      )}

      {isPartialComplete && (
        <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-md p-3">
          <p className="text-sm font-medium text-yellow-800">
            ⚠️ Partial Completion
          </p>
          <p className="text-sm text-yellow-700 mt-1">
            Diamonds: {partialDetails.diamonds}/{task.diamondNumber}
          </p>
          <p className="text-sm text-yellow-700 mt-1">
            Reason: <span className="italic">{partialDetails.reason}</span>
          </p>
        </div>
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
          <>
            <Button
              className="w-full"
              variant="success"
              onClick={() => updateTaskStatus(task._id, "Completed")}
              disabled={updatingTasks.has(task._id)}
            >
              {updatingTasks.has(task._id) ? "Completing..." : "Complete ✓"}
            </Button>
            <Button
              className="w-full"
              variant="outline"
              onClick={() => handlePartialComplete(task._id)}
              disabled={updatingTasks.has(task._id)}
            >
              Partial Complete ⚠
            </Button>
          </>
        )}

        <Button
          variant="ghost"
          className="w-full text-gray-600 hover:bg-gray-50"
          onClick={() =>
            alert(
              `Task Details:\nID: ${task._id}\nStarted: ${
                task.startTime?.toLocaleString() || "--"
              }\nEnded: ${task.endTime?.toLocaleString() || "--"}`
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
