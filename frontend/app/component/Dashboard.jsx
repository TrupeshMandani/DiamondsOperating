import { useEffect, useState, useMemo } from "react";
import Sidebar from "./Sidebar";
import BatchModal from "./BatchModal";
import InfoModal from "./InfoModal";
import { motion } from "framer-motion";
import {
  Bell,
  CheckCircle,
  ClipboardList,
  Loader2,
  Users,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import StatsCard from "./StatsCard";
import io from "socket.io-client";

const ITEMS_PER_PAGE = 8; // Number of batches per page

const Dashboard = () => {
  const [mounted, setMounted] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [infoModalTitle, setInfoModalTitle] = useState("");
  const [infoModalItems, setInfoModalItems] = useState([]);

  const [batches, setBatches] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [pendingTasks, setPendingTasks] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // Memoized batch pagination
  const paginatedBatches = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return batches.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [batches, currentPage]);

  // Calculate total pages
  const totalPages = useMemo(() => {
    return Math.ceil(batches.length / ITEMS_PER_PAGE);
  }, [batches]);

  // Pagination handlers
  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  // Optimized data fetching with AbortController
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    setMounted(true);
    setLoading(true);

    const fetchData = async () => {
      try {
        // Parallel fetching with timeout and error handling
        const fetchWithTimeout = async (url, options = {}, timeout = 5000) => {
          const controller = new AbortController();
          const id = setTimeout(() => controller.abort(), timeout);
          try {
            const response = await fetch(url, {
              ...options,
              signal: controller.signal,
            });
            clearTimeout(id);
            if (!response.ok)
              throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
          } catch (error) {
            clearTimeout(id);
            if (error.name === "AbortError") {
              throw new Error("Request timed out");
            }
            throw error;
          }
        };

        const [batches, employees, tasks] = await Promise.all([
          fetchWithTimeout("http://localhost:5023/api/batches"),
          fetchWithTimeout("http://localhost:5023/api/employees"),
          fetchWithTimeout("http://localhost:5023/api/tasks"),
        ]);

        setBatches(batches);
        setEmployees(employees);

        const completed = tasks.filter((task) => task.status === "Completed");
        const pending = tasks.filter(
          (task) => task.status === "Pending" || task.status === "In Progress"
        );
        setCompletedTasks(completed);
        setPendingTasks(pending);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Cleanup function
    return () => {
      controller.abort();
    };
  }, []);

  // Render loading state
  if (!mounted || loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-[#121828] text-white">
        <Loader2 className="h-12 w-12 animate-spin text-blue-400 mb-4" />
        <p className="text-lg font-medium animate-pulse">
          Loading dashboard...
        </p>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg border border-red-200">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-700">{error}</p>
        </div>
      </div>
    );
  }

  const openBatchModal = (batch) => {
    setSelectedBatch(batch);
    setModalOpen(true);
  };

  const closeBatchModal = () => {
    setSelectedBatch(null);
    setModalOpen(false);
  };

  const openModal = (title, items) => {
    setInfoModalTitle(title);
    setInfoModalItems(items);
    setInfoModalOpen(true);
  };

  const getIcon = (iconName) => {
    switch (iconName) {
      case "Users":
        return <Users className="h-6 w-6" />;
      case "CheckCircle":
        return <CheckCircle className="h-6 w-6" />;
      case "ClipboardList":
        return <ClipboardList className="h-6 w-6" />;
      case "Bell":
        return <Bell className="h-6 w-6" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen w-full bg-gray-50">
      <div className="w-72 h-screen fixed top-0 left-0 bg-[#121828] text-white shadow-xl z-10">
        <Sidebar />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-1 ml-72 p-8 text-gray-800 bg-gradient-to-br from-gray-50 to-blue-50 overflow-y-auto"
      >
        {/* Summary Section */}
        <div className="mt-12">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-[#121828] border-l-4 border-blue-500 pl-4">
              Dashboard
            </h1>
            <div className="flex space-x-2">
              <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-md font-medium">
                {new Date().toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
            <StatsCard
              title="Employees"
              value={employees.length}
              icon="Users"
              iconComponent={getIcon("Users")}
              onClick={() => openModal("Total Employees", employees)}
              color="from-blue-500 to-blue-600"
            />
            <StatsCard
              title="Completed Tasks"
              value={completedTasks.length}
              icon="CheckCircle"
              iconComponent={getIcon("CheckCircle")}
              onClick={() => openModal("Completed Tasks", completedTasks)}
              color="from-green-500 to-green-600"
            />
            <StatsCard
              title="Pending Tasks"
              value={pendingTasks.length}
              icon="ClipboardList"
              iconComponent={getIcon("ClipboardList")}
              onClick={() => openModal("Pending Tasks", pendingTasks)}
              color="from-amber-500 to-amber-600"
            />
            <StatsCard
              title="Notifications"
              value={notifications.length}
              icon="Bell"
              iconComponent={getIcon("Bell")}
              onClick={() => openModal("Notifications", notifications)}
              color="from-purple-500 to-purple-600"
            />
          </div>
        </div>

        {/* Batches Section */}
        <h2 className="text-2xl font-bold text-[#121828] mb-6 border-b-2 pt-5 border-blue-200 pb-2">
          Batches (Page {currentPage} of {totalPages})
        </h2>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6"
        >
          {paginatedBatches.map((batch, index) => (
            <motion.div
              key={batch.batchId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100"
            >
              <h3 className="text-xl font-bold text-[#121828] mb-2">
                {batch.batchId}
              </h3>
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-gray-600">
                  <span className="font-medium mr-2">Status:</span>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      batch.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : batch.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {batch.status}
                  </span>
                </div>
                <p className="text-gray-600">
                  <span className="font-medium">Process:</span>{" "}
                  {batch.currentProcess}
                </p>
              </div>
              <button
                className="w-full bg-[#121828] text-white px-4 py-2 rounded-md hover:bg-[#1c2540] transition-colors duration-200 flex items-center justify-center"
                onClick={() => openBatchModal(batch)}
              >
                View Details
              </button>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
