"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import BatchCard from "./batch-card";
import { categorizeBatches, updateBatchAfterTaskDeletion } from "./utils";

export default function BatchTabs({ batches, onSelectBatch, socket }) {
  const [categorizedBatches, setCategorizedBatches] = useState({
    notAssigned: [],
    assigned: [],
    inProgress: [],
    completed: [],
  });

  const [allBatches, setAllBatches] = useState([]);

  // Store all batches and categorize them whenever the batches prop changes
  useEffect(() => {
    if (batches && batches.length > 0) {
      setAllBatches(batches);
      setCategorizedBatches(categorizeBatches(batches));
    }
  }, [batches]);

  // Listen for real-time batch and task updates
  useEffect(() => {
    if (!socket) return;

    // Handle batch updates
    const handleBatchUpdate = (updatedBatch) => {
      console.log("Batch updated event received:", updatedBatch);

      // Update the allBatches state with the updated batch
      setAllBatches((prevBatches) => {
        const newBatches = prevBatches.map((batch) =>
          batch.batchId === updatedBatch.batchId
            ? { ...batch, ...updatedBatch }
            : batch
        );

        // Re-categorize all batches
        setCategorizedBatches(categorizeBatches(newBatches));

        return newBatches;
      });
    };

    // Handle task assignment
    const handleTaskAssigned = (newTask) => {
      console.log("Task assigned event received:", newTask);

      if (!newTask || !newTask.batchId) return;

      // Update the allBatches state to reflect the new task assignment
      setAllBatches((prevBatches) => {
        const newBatches = prevBatches.map((batch) => {
          if (batch.batchId === newTask.batchId) {
            // Create a new progress object if it doesn't exist
            const progress = batch.progress || {};

            // Add or update the process in the progress object
            // Default to 0% progress for a newly assigned task
            if (newTask.process || newTask.currentProcess) {
              const processName = newTask.process || newTask.currentProcess;
              progress[processName] = progress[processName] || 0;
            }

            return {
              ...batch,
              progress,
            };
          }
          return batch;
        });

        // Re-categorize all batches
        setCategorizedBatches(categorizeBatches(newBatches));

        return newBatches;
      });
    };

    // Handle task deletion
    const handleTaskDeleted = ({ taskId, batchId, process }) => {
      console.log("Task deleted event received:", { taskId, batchId, process });

      if (!process) {
        console.warn("No process information provided with taskDeleted event");
        return;
      }

      // Update the allBatches state to reflect the task deletion
      setAllBatches((prevBatches) => {
        const newBatches = prevBatches.map((batch) => {
          // If this is the affected batch, update its progress
          if (
            batch.batchId === batchId ||
            batch._id === batchId ||
            (batch.progress && batch.progress[process] !== undefined)
          ) {
            console.log(
              `Updating batch ${batch.batchId} after task deletion for process ${process}`
            );

            // Create a new progress object without the deleted process
            const updatedBatch = updateBatchAfterTaskDeletion(batch, process);

            // Log the updated batch
            console.log("Batch after update:", updatedBatch);

            return updatedBatch;
          }
          return batch;
        });

        // Re-categorize all batches
        const categorized = categorizeBatches(newBatches);
        console.log("Re-categorized batches:", {
          notAssigned: categorized.notAssigned.length,
          assigned: categorized.assigned.length,
          inProgress: categorized.inProgress.length,
          completed: categorized.completed.length,
        });

        setCategorizedBatches(categorized);

        return newBatches;
      });
    };

    // Handle task status updates
    const handleTaskUpdated = ({
      taskId,
      batchId,
      process,
      status,
      progress,
    }) => {
      console.log("Task updated event received:", {
        taskId,
        batchId,
        process,
        status,
        progress,
      });

      if (!process) return;

      // Update the allBatches state to reflect the task status update
      setAllBatches((prevBatches) => {
        const newBatches = prevBatches.map((batch) => {
          // If this is the affected batch, update its progress
          if (
            batch.batchId === batchId ||
            (batch.progress && batch.progress[process] !== undefined)
          ) {
            // Create a new progress object
            const newProgress = { ...batch.progress };

            // Update the progress value based on status
            if (status === "Completed") {
              newProgress[process] = 100;
            } else if (status === "In Progress") {
              // If a specific progress value is provided, use it
              // Otherwise, set to 50% as a default for "In Progress"
              newProgress[process] = progress !== undefined ? progress : 50;
            } else if (status === "Pending") {
              newProgress[process] = 0;
            }

            return {
              ...batch,
              progress: newProgress,
            };
          }
          return batch;
        });

        // Re-categorize all batches
        setCategorizedBatches(categorizeBatches(newBatches));

        return newBatches;
      });
    };

    // Register event listeners
    socket.on("batchUpdated", handleBatchUpdate);
    socket.on("taskAssigned", handleTaskAssigned);
    socket.on("taskDeleted", handleTaskDeleted);
    socket.on("taskUpdated", handleTaskUpdated);

    // Clean up event listeners on unmount
    return () => {
      socket.off("batchUpdated", handleBatchUpdate);
      socket.off("taskAssigned", handleTaskAssigned);
      socket.off("taskDeleted", handleTaskDeleted);
      socket.off("taskUpdated", handleTaskUpdated);
    };
  }, [socket]);

  return (
    <div className="w-full">
      <Tabs defaultValue="notAssigned" className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="notAssigned" className="relative">
            Not Assigned
            <Badge className="ml-2 bg-gray-200 text-gray-800">
              {categorizedBatches.notAssigned.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="assigned" className="relative">
            Assigned
            <Badge className="ml-2 bg-blue-200 text-blue-800">
              {categorizedBatches.assigned.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="inProgress" className="relative">
            In Progress
            <Badge className="ml-2 bg-yellow-200 text-yellow-800">
              {categorizedBatches.inProgress.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="completed" className="relative">
            Completed
            <Badge className="ml-2 bg-green-200 text-green-800">
              {categorizedBatches.completed.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        {/* Not Assigned Tab */}
        <TabsContent value="notAssigned">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categorizedBatches.notAssigned.length > 0 ? (
              categorizedBatches.notAssigned.map((batch) => (
                <motion.div
                  key={batch.batchId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <BatchCard
                    batch={batch}
                    onSelect={onSelectBatch}
                    category="notAssigned"
                  />
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-10 text-gray-500">
                No batches without assignments
              </div>
            )}
          </div>
        </TabsContent>

        {/* Assigned Tab */}
        <TabsContent value="assigned">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categorizedBatches.assigned.length > 0 ? (
              categorizedBatches.assigned.map((batch) => (
                <motion.div
                  key={batch.batchId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <BatchCard
                    batch={batch}
                    onSelect={onSelectBatch}
                    category="assigned"
                  />
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-10 text-gray-500">
                No fully assigned batches
              </div>
            )}
          </div>
        </TabsContent>

        {/* In Progress Tab */}
        <TabsContent value="inProgress">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categorizedBatches.inProgress.length > 0 ? (
              categorizedBatches.inProgress.map((batch) => (
                <motion.div
                  key={batch.batchId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <BatchCard
                    batch={batch}
                    onSelect={onSelectBatch}
                    category="inProgress"
                  />
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-10 text-gray-500">
                No batches in progress
              </div>
            )}
          </div>
        </TabsContent>

        {/* Completed Tab */}
        <TabsContent value="completed">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categorizedBatches.completed.length > 0 ? (
              categorizedBatches.completed.map((batch) => (
                <motion.div
                  key={batch.batchId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <BatchCard
                    batch={batch}
                    onSelect={onSelectBatch}
                    category="completed"
                  />
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-10 text-gray-500">
                No completed batches
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
