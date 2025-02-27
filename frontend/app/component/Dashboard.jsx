"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import StatsCard from "./StatsCard";
import Sidebar from "./Sidebar";
import Modal from "./Modal";
import { motion } from "framer-motion";

const Dashboard = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalData, setModalData] = useState([]);

  const [batches, setBatches] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [pendingTasks, setPendingTasks] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch batch data
  const fetchBatches = async () => {
    try {
      const response = await fetch("http://localhost:5023/api/batches");
      if (!response.ok) throw new Error("Failed to fetch batches");

      const data = await response.json();
      setBatches(data); // Set the fetched data in state
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);

    // Simulate fetching static data
    setEmployees([
      { id: 1, name: "John Doe", status: "Active" },
      { id: 2, name: "Jane Smith", status: "Active" },
      { id: 3, name: "Michael Johnson", status: "Active" },
    ]);

    setCompletedTasks([
      { id: 1, task: "Complete Report", status: "Completed" },
      { id: 2, task: "Approve Budget", status: "Completed" },
    ]);

    setPendingTasks([
      { id: 3, task: "Review Code", status: "Pending" },
      { id: 4, task: "Client Meeting", status: "Pending" },
    ]);

    setNotifications([
      "New project assigned to John Doe",
      "Meeting scheduled with CEO",
      "Deadline reminder for Budget Approval",
    ]);

    // Fetch batches from the API
    fetchBatches();
  }, []);

  if (!mounted || loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#121828] text-white">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  const openModal = (title, data) => {
    setModalTitle(title);
    setModalData(data);
    setModalOpen(true);
  };

  return (
    <div className="flex h-screen w-full">
      {/* Sidebar */}
      <div className="w-72 h-screen fixed top-0 left-0 bg-[#121828] text-white shadow-lg">
        <Sidebar />
      </div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex-1 ml-72 p-8 text-[#121828] bg-[#f7f7f7] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-[#121828]">Dashboard</h1>
          <button
            className="bg-[#121828] text-white px-4 py-2 rounded hover:bg-[#0e1625]"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            Toggle Theme
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <StatsCard
            title="Employees"
            value={employees.length}
            icon="Users"
            onClick={() => openModal("Total Employees", employees)}
          />
          <StatsCard
            title="Completed Tasks"
            value={completedTasks.length}
            icon="CheckCircle"
            onClick={() => openModal("Completed Tasks", completedTasks)}
          />
          <StatsCard
            title="Pending Tasks"
            value={pendingTasks.length}
            icon="ClipboardList"
            onClick={() => openModal("Pending Tasks", pendingTasks)}
          />
          <StatsCard
            title="Notifications"
            value={notifications.length}
            icon="Bell"
            onClick={() => openModal("Notifications", notifications)}
          />
        </div>

        {/* Batches List */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold">Batches</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            {batches.map((batch) => (
              <div
                key={batch.batchId}
                className="bg-white p-4 rounded shadow-lg"
              >
                <h3 className="text-xl font-bold">{batch.batchId}</h3>
                <p>Status: {batch.status}</p>
                <p>Current Process: {batch.currentProcess}</p>
                <button
                  className="bg-[#121828] text-white px-4 py-2 rounded hover:bg-[#0e1625]"
                  onClick={() => openModal("Batch Details", batch)}
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Modal */}
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={modalTitle}
          data={modalData}
        />
      </motion.div>
    </div>
  );
};

export default Dashboard;
