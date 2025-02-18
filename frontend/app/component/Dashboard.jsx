"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import StatsCard from "./StatsCard";
import Sidebar from "./Sidebar";
import { motion } from "framer-motion";

const Dashboard = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // ✅ Ensure client-side rendering before using theme
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="min-h-screen bg-[#001F3F] text-white flex justify-center items-center">Loading...</div>;
  }

  return (
    <div className="flex">
      <Sidebar />
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ duration: 0.5 }}
        className="flex-1 p-8 text-white"
      >
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Manager Dashboard</h1>
          <button 
            className="bg-[#0056A3] text-white px-4 py-2 rounded hover:bg-[#004080]"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            Toggle Theme
          </button>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <StatsCard title="Employees" value="150" icon="Users" />
          <StatsCard title="Completed Tasks" value="24" icon="CheckCircle" />
          <StatsCard title="Pending Tasks" value="6" icon="ClipboardList" />
          <StatsCard title="Notifications" value="5" icon="Bell" />
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
