"use client";
import { motion } from "framer-motion";

const EmpTaskCard = ({ task, status }) => {
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

  return (
    <motion.div
      className="p-3 bg-gray-700 rounded-lg mb-2 hover:scale-105 transition-all"
      whileHover={{ scale: 1.02 }}
    >
      <p className="text-lg font-medium">Batch ID: {task.id}</p>
      <p className="text-sm">
        Start: {task.start} - End: {task.end}
      </p>
      <p className={`text-sm ${getStatusClass()}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </p>
    </motion.div>
  );
};

export default EmpTaskCard;
