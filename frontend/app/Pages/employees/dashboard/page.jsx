"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Clock, Play, Square, CheckCircle } from "lucide-react";

const TaskBox = ({
  id,
  task,
  startTime,
  endTime,
  status,
  progress,
  isExpanded,
  onClick,
  onStart,
  onEnd,
}) => (
  <motion.div
    layoutId={`box-${id}`}
    onClick={() => onClick(id)}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    animate={{ scale: isExpanded ? 1.2 : 1, zIndex: isExpanded ? 10 : 1 }}
    transition={{ duration: 0.3 }}
    className="bg-gradient-to-br from-blue-500 to-purple-600 p-6 rounded-lg shadow-lg cursor-pointer relative overflow-hidden"
  >
    <div className="absolute top-0 left-0 w-full h-1 bg-gray-200">
      <div
        className="h-full bg-green-400"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
    <h3 className="text-xl font-bold mb-3 text-white">{task}</h3>
    <div className="flex justify-between items-center mb-2">
      <p className="text-sm text-white flex items-center">
        <Clock className="inline-block mr-1" size={14} />
        {startTime}
      </p>
      <p className="text-sm text-white flex items-center">
        <Clock className="inline-block mr-1" size={14} />
        {endTime}
      </p>
    </div>
    <div className="flex items-center justify-between mt-4">
      <span
        className={`px-2 py-1 rounded-full text-xs font-semibold ${
          status === "Not Started"
            ? "bg-yellow-200 text-yellow-800"
            : status === "In Progress"
            ? "bg-blue-200 text-blue-800"
            : "bg-green-200 text-green-800"
        }`}
      >
        {status}
      </span>
      <div>
        {status !== "Completed" && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              status === "Not Started" ? onStart(id) : onEnd(id);
            }}
            className={`p-2 rounded-full ${
              status === "Not Started"
                ? "bg-green-500 hover:bg-green-600"
                : "bg-red-500 hover:bg-red-600"
            } text-white mr-2`}
          >
            {status === "Not Started" ? (
              <Play size={16} />
            ) : (
              <Square size={16} />
            )}
          </button>
        )}
        {status === "Completed" && (
          <CheckCircle size={24} className="text-green-400" />
        )}
      </div>
    </div>
  </motion.div>
);

export default function EmployeeDashboard() {
  const [expandedId, setExpandedId] = useState(null);
  const [tasks, setTasks] = useState([
    {
      id: 1,
      task: "Polishing Diamond D001",
      startTime: "09:00 AM",
      endTime: "11:00 AM",
      status: "In Progress",
      progress: 75,
    },
    {
      id: 2,
      task: "Cutting Diamond D002",
      startTime: "10:30 AM",
      endTime: "02:30 PM",
      status: "Not Started",
      progress: 0,
    },
    {
      id: 3,
      task: "Grading Diamond D003",
      startTime: "08:00 AM",
      endTime: "12:00 PM",
      status: "Completed",
      progress: 100,
    },
    {
      id: 4,
      task: "Cleaning Diamond D004",
      startTime: "11:00 AM",
      endTime: "01:00 PM",
      status: "In Progress",
      progress: 60,
    },
    {
      id: 5,
      task: "Inspecting Diamond D005",
      startTime: "02:00 PM",
      endTime: "04:00 PM",
      status: "Not Started",
      progress: 0,
    },
    {
      id: 6,
      task: "Packaging Diamond D006",
      startTime: "03:30 PM",
      endTime: "05:30 PM",
      status: "Not Started",
      progress: 0,
    },
  ]);

  const handleClick = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleStart = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, status: "In Progress", progress: 1 } : task
      )
    );
  };

  const handleEnd = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, status: "Completed", progress: 100 } : task
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Your Tasks</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((task) => (
          <TaskBox
            key={task.id}
            {...task}
            isExpanded={expandedId === task.id}
            onClick={handleClick}
            onStart={handleStart}
            onEnd={handleEnd}
          />
        ))}
      </div>
    </div>
  );
}
