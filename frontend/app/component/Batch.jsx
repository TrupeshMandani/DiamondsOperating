"use client";

import { useEffect, useState } from "react";
import BatchModal from "./BatchModal";
import { motion } from "framer-motion";

const ITEMS_PER_PAGE = 6; // Set the number of batches per page

const Dashboard = () => {
  const [mounted, setMounted] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch batch data
  const fetchBatches = async () => {
    try {
      const response = await fetch(
        "https://diamondsoperating.onrender.com/api/batches"
      );
      if (!response.ok) throw new Error("Failed to fetch batches");

      const data = await response.json();
      setBatches(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchBatches();
  }, []);

  if (!mounted || loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-[#121828] text-white">
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

  // Calculate total pages
  const totalPages = Math.ceil(batches.length / ITEMS_PER_PAGE);

  // Get current page's batch data
  const paginatedBatches = batches.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const openModal = (batch) => {
    setSelectedBatch(batch);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedBatch(null);
    setModalOpen(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-8 text-gray-800 bg-gradient-to-br from-gray-50 to-blue-50 overflow-y-auto"
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="mt-12"
      >
        <h2 className="text-2xl font-bold text-[#121828] mb-6 border-b-2 border-blue-200 pb-2">
          Batches
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                onClick={() => openModal(batch)}
              >
                View Details
              </button>
            </motion.div>
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center items-center mt-8 space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-md ${
              currentPage === 1
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            } transition-colors`}
          >
            Previous
          </button>

          <span className="text-lg font-medium">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-md ${
              currentPage === totalPages
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            } transition-colors`}
          >
            Next
          </button>
        </div>
      </motion.div>

      {modalOpen && (
        <BatchModal
          isOpen={modalOpen}
          onClose={closeModal}
          batch={selectedBatch}
        />
      )}
    </motion.div>
  );
};

export default Dashboard;
