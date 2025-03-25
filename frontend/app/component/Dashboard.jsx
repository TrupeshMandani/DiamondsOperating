import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import BatchModal from "./BatchModal";
import InfoModal from "./InfoModal";
import { motion } from "framer-motion";
import { Bell, CheckCircle, ClipboardList, Loader2, Users } from "lucide-react";
import StatsCard from "./StatsCard";
import io from "socket.io-client";

const socket = io("http://localhost:5023");

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

  const fetchBatches = async () => {
    try {
      const response = await fetch("http://localhost:5023/api/batches");
      if (!response.ok) throw new Error("Failed to fetch batches");
      const data = await response.json();
      setBatches(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await fetch("http://localhost:5023/api/employees");
      if (!response.ok) throw new Error("Failed to fetch employees");
      const data = await response.json();
      setEmployees(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await fetch("http://localhost:5023/api/tasks");
      if (!response.ok) throw new Error("Failed to fetch tasks");
      const data = await response.json();
      const completed = data.filter((task) => task.status === "Completed");
      const pending = data.filter(
        (task) => task.status === "Pending" || task.status === "In Progress"
      );
      setCompletedTasks(completed);
      setPendingTasks(pending);
    } catch (err) {
      console.error("Task fetch error:", err.message);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchEmployees();
    fetchBatches();
    fetchTasks();

    socket.on("taskCompletedNotification", (data) => {
      setNotifications((prev) => [
        `${data.message} (Task ID: ${data.taskId})`,
        ...prev,
      ]);
      fetchTasks();
    });

    return () => {
      socket.off("taskCompletedNotification");
    };
  }, []);

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

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg border border-red-200">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-700">{error}</p>
          <button
            onClick={() => fetchBatches()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
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
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-12"
        >
          <div className="flex justify-between items-center mb-8">
            <motion.h1
              initial={{ x: -20 }}
              animate={{ x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-3xl font-bold text-[#121828] border-l-4 border-blue-500 pl-4"
            >
              Dashboard
            </motion.h1>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.4 }}
              className="flex space-x-2"
            >
              <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-md font-medium">
                {new Date().toLocaleDateString()}
              </span>
            </motion.div>
          </div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6"
          >
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
          </motion.div>

          <h2 className="text-2xl font-bold text-[#121828] mb-6 border-b-2 border-blue-200 pb-2">
            Batches
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {batches.map((batch, index) => (
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
          </div>
        </motion.div>

        {modalOpen && (
          <BatchModal
            isOpen={modalOpen}
            onClose={closeBatchModal}
            batch={selectedBatch}
          />
        )}

        {infoModalOpen && (
          <InfoModal
            isOpen={infoModalOpen}
            onClose={() => setInfoModalOpen(false)}
            title={infoModalTitle}
            items={infoModalItems}
          />
        )}
      </motion.div>
    </div>
  );
};

export default Dashboard;