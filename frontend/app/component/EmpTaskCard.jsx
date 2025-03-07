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
    <motion.div className="w-full p-4 bg-[#e9e9e9] shadow-md text-black rounded-lg mb-4 hover:shadow-lg hover:scale-102 transition-all duration-300">
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
      </div>
    </motion.div>
  );
};

export default EmpTaskCard;
