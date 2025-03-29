"use client";

import { useState, useEffect } from "react";
import { ArrowRight, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import io from "socket.io-client";

import { TaskAssignmentDialog } from "./task-assignment-dialog";
import { TaskCard } from "./task-card";
import { EmptyTasksPlaceholder } from "./empty-tasks-placeholder";
import { useTaskManagement } from "./use-task-management";
import { useBatchManagement } from "./use-batch-management";

const PROCESS_TYPES = ["Sarin", "Stitching", "4P Cutting"];
const socket = io("http://localhost:5023");
const ITEMS_PER_PAGE = 6;

export default function TaskAssignment({ selectedBatchId }) {
  const [selectedProcess, setSelectedProcess] = useState(PROCESS_TYPES[0]);
  const [isAssigningTask, setIsAssigningTask] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [availableProcesses, setAvailableProcesses] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);

  const {
    batches,
    employees,
    selectedBatch: selectedBatchFromHook,
    loading,
    fetchBatches,
    fetchEmployees,
    handleBatchSelect,
    fetchUpdatedBatch,
  } = useBatchManagement(socket, selectedBatchId);

  const {
    tasks: tasksFromHook,
    newTask,
    setNewTask,
    handleAssignTask,
    handleDeleteTask: handleDeleteTaskFromHook,
    fetchTasksForBatch,
    getTaskId,
  } = useTaskManagement(
    socket,
    selectedBatchFromHook,
    selectedProcess,
    fetchUpdatedBatch
  );

  useEffect(() => {
    fetchBatches();
    fetchEmployees();
  }, [fetchBatches, fetchEmployees]);

  useEffect(() => {
    // Update available processes when selected batch changes
    if (selectedBatchFromHook) {
      // Check if selectedProcesses exists (new format) or use currentProcess (old format)
      let processes =
        selectedBatchFromHook.selectedProcesses ||
        (Array.isArray(selectedBatchFromHook.currentProcess)
          ? selectedBatchFromHook.currentProcess
          : [selectedBatchFromHook.currentProcess]);

      // Flatten the array if it's nested
      processes = Array.isArray(processes[0]) ? processes.flat() : processes;

      setAvailableProcesses(processes);

      // If current selected process is not in available processes, select the first available one
      if (processes.length > 0 && !processes.includes(selectedProcess)) {
        setSelectedProcess(processes[0]);
      }
    }
  }, [selectedBatchFromHook, selectedProcess]);

  // If a selectedBatchId is provided, select that batch
  useEffect(() => {
    if (selectedBatchId && batches.length > 0) {
      handleBatchSelect(selectedBatchId);
    }
  }, [selectedBatchId, batches, handleBatchSelect]);

  const handleProcessSelect = (process) => {
    // Only allow selecting processes that are available for this batch
    if (availableProcesses.includes(process)) {
      setSelectedProcess(process);
      setCurrentPage(1);
    }
  };

  const filteredTasks = tasksFromHook.filter(
    (task) => task.currentProcess === selectedProcess
  );
  const paginatedTasks = filteredTasks.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  const totalPages = Math.ceil(filteredTasks.length / ITEMS_PER_PAGE);

  const handleDeleteTask = async (taskId) => {
    try {
      const taskToDelete = tasksFromHook.find((task) => task._id === taskId);
      if (!taskToDelete) throw new Error("Task not found");

      const isConfirmed = window.confirm(
        "Are you sure you want to delete this task?"
      );
      if (!isConfirmed) return;

      // Optimistically update UI
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));

      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("No authentication token found");

      const response = await fetch(
        `http://localhost:5023/api/tasks/${taskId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }

      console.log(`Task deleted: ${taskId}`);

      // Find the batch that had this task
      const batchId = taskToDelete.batchId; // Ensure tasks have a batchId field
      const remainingTasks = tasksFromHook.filter(
        (task) => task.batchId === batchId && task._id !== taskId
      );

      if (remainingTasks.length === 0) {
        // Move batch back to "Unassigned"
        setBatches((prevBatches) =>
          prevBatches.map((batch) =>
            batch._id === batchId ? { ...batch, status: "Unassigned" } : batch
          )
        );

        if (socket && socket.connected) {
          socket.emit("batchUpdated", { batchId, status: "Unassigned" });
        }
      }

      alert("Task successfully deleted!");
    } catch (error) {
      console.error("Error deleting task:", error);
      alert("Failed to delete task: " + error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto text-black"
    >
      <div className="flex flex-col space-y-6">
        {!selectedBatchId && (
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">
              Task Assignment
            </h1>
            <Select
              onValueChange={handleBatchSelect}
              value={selectedBatchFromHook?.batchId || ""}
            >
              <SelectTrigger className="text-black w-[200px]">
                <SelectValue placeholder="Select Batch" />
              </SelectTrigger>
              <SelectContent className="text-black bg-white">
                {batches.map((batch, index) => (
                  <SelectItem
                    key={`batch-${batch.batchId}-${index}`}
                    value={batch.batchId}
                  >
                    {batch.batchId} - {batch.status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {selectedBatchFromHook ? (
          <Card className="bg-white shadow-md">
            <CardHeader className="bg-gray-50 border-b">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Batch: {selectedBatchFromHook.batchId}</CardTitle>
                  <CardDescription>
                    Current Process: {selectedBatchFromHook.currentProcess} |
                    Status: {selectedBatchFromHook.status}
                  </CardDescription>
                  <div className="mt-1 text-sm text-gray-500">
                    Available Processes: {availableProcesses.join(", ")}
                  </div>
                </div>
                <TaskAssignmentDialog
                  isOpen={isAssigningTask}
                  setIsOpen={setIsAssigningTask}
                  selectedProcess={selectedProcess}
                  selectedBatch={selectedBatchFromHook}
                  newTask={newTask}
                  setNewTask={setNewTask}
                  employees={employees}
                  handleAssignTask={handleAssignTask}
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Tabs
                defaultValue={availableProcesses[0] || PROCESS_TYPES[0]}
                className="w-full"
              >
                <TabsList className="w-full justify-start border-b rounded-none bg-gray-50 p-0">
                  {PROCESS_TYPES.map((process, index) => {
                    const isAvailable = availableProcesses.includes(process);
                    return (
                      <TabsTrigger
                        key={`process-tab-${process}-${index}`}
                        value={process}
                        onClick={() => handleProcessSelect(process)}
                        className={`flex-1 py-3 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none ${
                          !isAvailable ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        disabled={!isAvailable}
                      >
                        {process}
                        {!isAvailable && " (N/A)"}
                      </TabsTrigger>
                    );
                  })}
                </TabsList>
                {PROCESS_TYPES.map((process, index) => {
                  const isAvailable = availableProcesses.includes(process);
                  return (
                    <TabsContent
                      key={`tab-content-${process}-${index}`}
                      value={process}
                      className="p-4"
                    >
                      {!isAvailable ? (
                        <div className="col-span-full flex flex-col items-center justify-center py-8 text-gray-500">
                          <AlertCircle className="h-12 w-12 mb-2 text-gray-400" />
                          <p>
                            Process {process} was not selected for this batch
                          </p>
                        </div>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5 }}
                          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                        >
                          {paginatedTasks.length > 0 ? (
                            paginatedTasks.map((task, index) => (
                              <TaskCard
                                key={`${getTaskId(task)}-${index}`}
                                task={task}
                                handleDeleteTask={handleDeleteTask}
                              />
                            ))
                          ) : (
                            <EmptyTasksPlaceholder
                              process={process}
                              setIsAssigningTask={setIsAssigningTask}
                            />
                          )}
                        </motion.div>
                      )}
                      {isAvailable && paginatedTasks.length > 0 && (
                        <div className="flex justify-center space-x-4 mt-4">
                          <button
                            onClick={() =>
                              setCurrentPage((prev) => Math.max(prev - 1, 1))
                            }
                            disabled={currentPage === 1}
                          >
                            Prev
                          </button>
                          <span>
                            Page {currentPage} of {totalPages}
                          </span>
                          <button
                            onClick={() =>
                              setCurrentPage((prev) =>
                                Math.min(prev + 1, totalPages)
                              )
                            }
                            disabled={currentPage === totalPages}
                          >
                            Next
                          </button>
                        </div>
                      )}
                    </TabsContent>
                  );
                })}
              </Tabs>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-white shadow-md text-center p-6">
            <ArrowRight className="h-8 w-8 text-blue-500 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-800">
              Select a Batch to Begin
            </h3>
          </Card>
        )}
      </div>
    </motion.div>
  );
}
