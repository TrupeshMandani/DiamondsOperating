"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"

import DashboardHeader from "./dashboard-component/dashboard-header"
import DashboardKPIs from "./dashboard-component/dashboard-kpis"
import DashboardCharts from "./dashboard-component/dashboard-charts"
import DashboardTabs from "./dashboard-component/dashboard-tabs"
import Sidebar from "../Sidebar"
import BatchModal from "./batch-modal"
import InfoModal from "./info-modal"

// Mock data
import { batches, employees, tasks, notifications, revenueData } from "./mock-data"

const ITEMS_PER_PAGE = 8 // Number of batches per page

const Dashboard = () => {
  const [mounted, setMounted] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedBatch, setSelectedBatch] = useState(null)
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [infoModalOpen, setInfoModalOpen] = useState(false)
  const [infoModalTitle, setInfoModalTitle] = useState("")
  const [infoModalItems, setInfoModalItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)

  // Filter completed and pending tasks
  const completedTasks = tasks.filter((task) => task.status === "Completed")
  const pendingTasks = tasks.filter((task) => task.status === "Pending" || task.status === "In Progress")

  // Memoized batch pagination
  const paginatedBatches = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    return batches.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  }, [currentPage])

  // Calculate total pages
  const totalPages = useMemo(() => {
    return Math.ceil(batches.length / ITEMS_PER_PAGE)
  }, [])

  // Pagination handlers
  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  }

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1))
  }

  const openBatchModal = (batch) => {
    setSelectedBatch(batch)
    setModalOpen(true)
  }

  const closeBatchModal = () => {
    setSelectedBatch(null)
    setModalOpen(false)
  }

  const openModal = (title, items) => {
    setInfoModalTitle(title)
    setInfoModalItems(items)
    setInfoModalOpen(true)
  }

  // Calculate KPIs
  const totalBatches = batches.length
  const activeBatches = batches.filter((batch) => batch.status === "Active").length
  const completionRate = Math.round((completedTasks.length / tasks.length) * 100) || 0
  const employeeUtilization =
    Math.round((employees.filter((e) => e.assignedTasks > 0).length / employees.length) * 100) || 0

  // Prepare dashboard data object to pass to child components
  const dashboardData = {
    batches,
    paginatedBatches,
    employees,
    tasks,
    completedTasks,
    pendingTasks,
    notifications,
    revenueData,
    totalBatches,
    activeBatches,
    completionRate,
    employeeUtilization,
    currentPage,
    totalPages,
    handleNextPage,
    handlePrevPage,
    openBatchModal,
    openModal,
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-[#121828] text-white">
        <div className="h-12 w-12 animate-spin text-blue-400 mb-4">
          <svg className="animate-spin h-12 w-12" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
        <p className="text-lg font-medium animate-pulse">Loading dashboard...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg border border-red-200">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-700">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen w-full bg-background">
      <div className="w-72 h-screen fixed top-0 left-0 bg-[#121828] text-white shadow-xl z-10">
        <Sidebar />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-1 ml-72 p-8 overflow-y-auto"
      >
        {/* Header Section */}
        <DashboardHeader notifications={notifications} />

        {/* KPI Cards */}
        <DashboardKPIs data={dashboardData} />

        {/* Charts Section */}
        <DashboardCharts data={dashboardData} />

        {/* Tabs Section */}
        <DashboardTabs data={dashboardData} />
      </motion.div>

      {/* Modals */}
      {modalOpen && selectedBatch && <BatchModal batch={selectedBatch} onClose={closeBatchModal} />}

      {infoModalOpen && (
        <InfoModal title={infoModalTitle} items={infoModalItems} onClose={() => setInfoModalOpen(false)} />
      )}
    </div>
  )
}

export default Dashboard

