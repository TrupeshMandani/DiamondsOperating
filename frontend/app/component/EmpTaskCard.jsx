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
    <motion.div className="w-[300px] p-3 bg-[#e9e9e9] shadow-inner text-black rounded-lg mb-4 hover:scale-105 transition-all">
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
