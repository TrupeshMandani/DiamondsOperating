import { motion } from "framer-motion";
import { Users, CheckCircle, ClipboardList, Bell } from "lucide-react";

const iconComponents = { Users, CheckCircle, ClipboardList, Bell };

const StatsCard = ({ title, value, icon }) => {
  const IconComponent = iconComponents[icon];

  return (
    <motion.div 
      className="bg-[#003366] p-6 rounded-lg shadow-md hover:scale-105 transition-transform duration-300 cursor-pointer"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <IconComponent className="text-white w-10 h-10 mb-3" />
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-2xl font-bold">{value}</p>
    </motion.div>
  );
};

export default StatsCard;
