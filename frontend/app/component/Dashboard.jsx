<<<<<<< Updated upstream
"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import StatsCard from "./StatsCard";
import Sidebar from "./Sidebar";
import Modal from "./Modal";
import { motion } from "framer-motion";
=======
"use client"

import { useEffect, useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { ChevronRight, ChevronLeft } from "lucide-react"
import Sidebar from "./Sidebar"
import OverviewCard from "./OverviewCard"
import TaskList from "./TaskList"
import TeamPerformance from "./TeamPerformance"
import NotificationCenter from "./NotificationCenter"
>>>>>>> Stashed changes

const Dashboard = () => {
  const [mounted, setMounted] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const [overviewData, setOverviewData] = useState({
    totalEmployees: 0,
    completedTasks: 0,
    pendingTasks: 0,
    notifications: 0,
  })

  const { scrollY } = useScroll()
  const headerOpacity = useTransform(scrollY, [0, 100], [1, 0])
  const headerTranslateY = useTransform(scrollY, [0, 100], [0, -100])

  useEffect(() => {
    setMounted(true)
    // Simulate fetching data
    setOverviewData({
      totalEmployees: 24,
      completedTasks: 18,
      pendingTasks: 7,
      notifications: 5,
    })
  }, [])

  if (!mounted) {
<<<<<<< Updated upstream
    return <div className="min-h-screen flex justify-center items-center bg-[#001F3F] text-white">Loading...</div>;
=======
    return <div className="min-h-screen flex justify-center items-center bg-[#FCFCFC] text-[#111827]">Loading...</div>
>>>>>>> Stashed changes
  }

  return (
<<<<<<< Updated upstream
    <div className="flex h-screen w-full">
      <div className="w-72 h-screen fixed top-0 left-0 bg-[#002A5E] shadow-lg">
        <Sidebar />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex-1 ml-72 p-8 text-white bg-[#000F2A] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Manager Dashboard</h1>
          <button
            className="bg-[#0056A3] text-white px-4 py-2 rounded hover:bg-[#004080]"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
=======
    <div className="flex h-screen w-full bg-[#FCFCFC] text-[#111827] overflow-hidden">
      <Sidebar collapsed={sidebarCollapsed} />
      <main
        className={`flex-1 p-8 transition-all duration-300 ${sidebarCollapsed ? "ml-20" : "ml-64"} overflow-y-auto`}
      >
        <motion.div
          className="flex justify-between items-center mb-8 sticky top-0 bg-[#FCFCFC] z-10 py-4"
          style={{
            opacity: headerOpacity,
            y: headerTranslateY,
          }}
        >
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 rounded-full bg-[#1A405E] hover:bg-[#236294] transition-colors duration-200 text-[#FCFCFC]"
>>>>>>> Stashed changes
          >
            {sidebarCollapsed ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
          </button>
          <h1 className="text-3xl font-bold text-[#111827]">Manager Dashboard</h1>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <OverviewCard title="Total Employees" value={overviewData.totalEmployees} icon="Users" />
          <OverviewCard title="Completed Tasks" value={overviewData.completedTasks} icon="CheckCircle" />
          <OverviewCard title="Pending Tasks" value={overviewData.pendingTasks} icon="ClipboardList" />
          <OverviewCard title="Notifications" value={overviewData.notifications} icon="Bell" />
        </div>

<<<<<<< Updated upstream
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <StatsCard title="Employees" value={employees.length} icon="Users" onClick={() => openModal("Total Employees", employees)} />
          <StatsCard title="Completed Tasks" value={completedTasks.length} icon="CheckCircle" onClick={() => openModal("Completed Tasks", completedTasks)} />
          <StatsCard title="Pending Tasks" value={pendingTasks.length} icon="ClipboardList" onClick={() => openModal("Pending Tasks", pendingTasks)} />
          <StatsCard title="Notifications" value={notifications.length} icon="Bell" onClick={() => openModal("Notifications", notifications)} />
        </div>

        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={modalTitle} data={modalData} />
      </motion.div>
=======
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <TaskList />
          </div>
          <div className="space-y-8">
            <TeamPerformance />
            <NotificationCenter />
          </div>
        </div>
      </main>
>>>>>>> Stashed changes
    </div>
  )
}

export default Dashboard

