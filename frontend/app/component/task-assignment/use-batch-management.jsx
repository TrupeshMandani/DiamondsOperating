"use client";

import { useState, useEffect, useCallback } from "react";

export function useBatchManagement(socket) {
  const [batches, setBatches] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [loading, setLoading] = useState(true);

  // 📡 Handle real-time batch updates
  useEffect(() => {
    const handleBatchUpdate = (updatedBatch) => {
      setBatches((prev) =>
        prev.map((batch) =>
          batch.batchId === updatedBatch.batchId ? { ...batch, ...updatedBatch } : batch
        )
      );

      if (selectedBatch?.batchId === updatedBatch.batchId) {
        setSelectedBatch((prev) => ({ ...prev, ...updatedBatch }));
      }
    };

    socket.on("batchUpdated", handleBatchUpdate);

    return () => {
      socket.off("batchUpdated", handleBatchUpdate);
    };
  }, [socket, selectedBatch]);

  // 📦 Fetch batch list
  const fetchBatches = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5023/api/batches");
      if (!res.ok) throw new Error("Failed to fetch batches");
      const data = await res.json();
      setBatches(data);
    } catch (err) {
      console.error("Error fetching batches:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // 👥 Fetch employee list
  const fetchEmployees = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:5023/api/employees");
      if (!res.ok) throw new Error("Failed to fetch employees");
      const data = await res.json();
      setEmployees(data);
    } catch (error) {
      console.error("Error fetching employees:", error);
      setEmployees([]);
    }
  }, []);

  // ✅ Select a batch
  const handleBatchSelect = useCallback((batchId) => {
    const batch = batches.find((b) => b.batchId === batchId);
    setSelectedBatch(batch || null);
  }, [batches]);

  // 🔁 Fetch updated batch
  const fetchUpdatedBatch = useCallback(async (batchId) => {
    try {
      const res = await fetch(`http://localhost:5023/api/batches/${batchId}`);
      if (!res.ok) throw new Error("Failed to fetch updated batch");

      const updatedBatch = await res.json();
      console.log("Updated Batch Data:", updatedBatch);

      setSelectedBatch((prev) => ({
        ...prev,
        currentProcess: updatedBatch.currentProcess,
      }));
    } catch (err) {
      console.error("Error fetching updated batch:", err.message);
    }
  }, []);

  return {
    batches,
    employees,
    selectedBatch,
    loading,
    fetchBatches,
    fetchEmployees,
    handleBatchSelect,
    fetchUpdatedBatch,
  };
}
