"use client";
import { motion } from "framer-motion";

const EmpTaskCard = ({ task, status }) => {
  return (
    <motion.div
      className="p-3 bg-gray-700 rounded-lg mb-2"
      whileHover={{ scale: 1.02 }}
    >
      <p className="text-lg font-medium">Batch ID: {task.id}</p>
      <p className="text-sm">
        Start: {task.start} - End: {task.end}
      </p>
      {status === "inProgress" && (
        <p className="text-yellow-500">In Progress</p>
      )}
    </motion.div>
  );
};

export default EmpTaskCard;
