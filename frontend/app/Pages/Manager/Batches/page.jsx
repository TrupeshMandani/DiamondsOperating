"use client";
import { useState, useEffect } from "react";
import io from "socket.io-client";
import Sidebar from "../../../component/Sidebar";
import BatchTabs from "../../../component/batch-tabs/batch-tabs";
import TaskAssignment from "../../../component/task-assignment/task-assignment";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const socket = io("http://localhost:5023");

export default function BatchesPage() {
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5023/api/batches");

        if (!response.ok) {
          throw new Error("Failed to fetch batches");
        }

        const data = await response.json();

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

    socket.on("batchUpdated", (updatedBatch) => {
      setBatches((prevBatches) =>
        prevBatches.map((batch) =>
          batch.batchId === updatedBatch.batchId
            ? { ...batch, ...updatedBatch }
            : batch
        )
      );

      if (selectedBatch && selectedBatch.batchId === updatedBatch.batchId) {
        setSelectedBatch((prev) => ({ ...prev, ...updatedBatch }));
      }
    });

    return () => {
      socket.off("batchUpdated");
    };
  }, [selectedBatch]);

  const handleSelectBatch = (batch) => {
    setSelectedBatch(batch);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="w-72 fixed inset-y-0 left-0 bg-[#121828] text-white shadow-xl z-10">
        <Sidebar />
      </div>

      <main className="flex-1 ml-72 p-6">
        <div className="max-w-7xl mx-auto flex flex-col gap-6">
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
              <BatchTabs
                batches={batches}
                onSelectBatch={handleSelectBatch}
                socket={socket}
              />

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
      </main>
    </div>
  );
}
