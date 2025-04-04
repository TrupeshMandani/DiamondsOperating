"use client";
import { useState, useEffect } from "react";
import io from "socket.io-client";
import Sidebar from "../../../component/Sidebar";
import BatchTabs from "../../../component/batch-tabs/batch-tabs";
import TaskAssignment from "../../../component/task-assignment/task-assignment";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Initialize socket connection
const socket = io("http://localhost:5023");

export default function BatchesPage() {
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch batches on component mount
  useEffect(() => {
    const fetchBatches = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5023/api/batches");

        if (!response.ok) {
          throw new Error("Failed to fetch batches");
        }

        const data = await response.json();

        // Ensure each batch has a selectedProcesses property
        const processedBatches = data.map((batch) => ({
          ...batch,
          selectedProcesses:
            batch.selectedProcesses ||
            (Array.isArray(batch.currentProcess)
              ? batch.currentProcess
              : [batch.currentProcess]),
        }));

        setBatches(processedBatches);
        setError(null);
      } catch (err) {
        console.error("Error fetching batches:", err);
        setError("Failed to load batches. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchBatches();

    // Listen for real-time batch updates
    socket.on("batchUpdated", (updatedBatch) => {
      setBatches((prevBatches) =>
        prevBatches.map((batch) =>
          batch.batchId === updatedBatch.batchId
            ? { ...batch, ...updatedBatch }
            : batch
        )
      );

      // Update selected batch if it's the one that was updated
      if (selectedBatch && selectedBatch.batchId === updatedBatch.batchId) {
        setSelectedBatch((prev) => ({ ...prev, ...updatedBatch }));
      }
    });

    // Clean up socket listeners on unmount
    return () => {
      socket.off("batchUpdated");
    };
  }, [selectedBatch]);

  const handleSelectBatch = (batch) => {
    setSelectedBatch(batch);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Fixed Sidebar */}
      <div className="w-72 h-screen fixed top-0 left-0 bg-[#121828] text-white shadow-xl z-10">
        <Sidebar />
      </div>

      <div className="flex-1 ml-64 p-6">
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">
              Batch Management
            </h1>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
            </div>
          ) : error ? (
            <Card className="bg-red-50 border-red-200">
              <CardContent className="pt-6">
                <div className="text-red-600">{error}</div>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Batch Tabs Component */}
              <BatchTabs
                batches={batches}
                onSelectBatch={handleSelectBatch}
                socket={socket}
              />

              {/* Task Assignment Component */}
              {selectedBatch && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>
                      Task Assignment - {selectedBatch.batchId}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <TaskAssignment selectedBatchId={selectedBatch.batchId} />
                  </CardContent>
                </Card>
              )}
            </>
          )}
          <div className="w-full">
            <TaskAssignment />
          </div>
        </div>
      </div>
    </div>
  );
}
