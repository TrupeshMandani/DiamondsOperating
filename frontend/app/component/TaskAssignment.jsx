"use client";

import { useState, useEffect, useRef } from "react";
import { Calendar, Clock, Users, AlertCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DatePicker } from "@/components/ui/date-picker";
import io from "socket.io-client";

// Process types for diamond processing
const PROCESS_TYPES = ["Sarin", "Stitching", "4P Cutting"];
const socket = io("http://localhost:5023");

export default function TaskAssignment() {
  const [batches, setBatches] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [selectedProcess, setSelectedProcess] = useState(PROCESS_TYPES[0]);
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [isAssigningTask, setIsAssigningTask] = useState(false);
  const [newTask, setNewTask] = useState({
    employeeId: "",
    description: "",
    dueDate: new Date(),
    priority: "Medium",
    status: "Pending",
    rate: 0,
    diamondNumber: 0,
    firstName: "",
  });

  // Use a ref to store task IDs that don't have a real _id
  const tempTaskIds = useRef(new Map());

  useEffect(() => {
    // Listen for real-time task assignments
    socket.on("taskAssigned", (newTask) => {
      console.log("Real-time Task Assigned:", newTask);
      // Only add the task if it doesn't already exist in the tasks array
      setTasks((prevTasks) => {
        // Check if this task already exists in our state
        const taskExists = prevTasks.some(
          (task) =>
            (task._id && task._id === newTask._id) ||
            (task.employeeId === newTask.employeeId &&
              task.description === newTask.description &&
              task.process === newTask.process)
        );

        // Only add if it doesn't exist
        return taskExists ? prevTasks : [...prevTasks, newTask];
      });
    });

    // Listen for task deletions
    socket.on("taskDeleted", (deletedTaskData) => {
      const deletedTaskId = deletedTaskData.taskId || deletedTaskData;
      console.log("Real-time Task Deleted:", deletedTaskId);
      setTasks((prevTasks) =>
        prevTasks.filter((task) => task._id !== deletedTaskId)
      );
    });

    return () => {
      socket.off("taskAssigned");
      socket.off("taskDeleted");
    };
  }, []);

  // Handle task updates (previously from WebSocket)
  const handleTaskUpdate = (updatedTask) => {
    console.log("Handling task update:", updatedTask);

    // Update the task in state if it exists
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task._id === updatedTask._id
          ? {
              ...task,
              status: updatedTask.status,
              // Update other fields that might have changed
              description: updatedTask.description || task.description,
              priority: updatedTask.priority || task.priority,
              dueDate: updatedTask.dueDate || task.dueDate,
              currentProcess: updatedTask.currentProcess || task.currentProcess,
            }
          : task
      )
    );

    // Also check if we need to update batch status based on the task update
    if (updatedTask.status === "Completed" && selectedBatch) {
      // Fetch the latest batch data to reflect any process changes
      fetchUpdatedBatch(selectedBatch.batchId);
    }
  };

  // Handle batch updates (previously from WebSocket)
  const handleBatchUpdate = (updatedBatch) => {
    // Update batches list
    setBatches((prevBatches) =>
      prevBatches.map((batch) =>
        batch.batchId === updatedBatch.batchId
          ? { ...batch, ...updatedBatch }
          : batch
      )
    );

    // Update selected batch if it's the one that got updated
    if (selectedBatch && selectedBatch.batchId === updatedBatch.batchId) {
      setSelectedBatch((prev) => ({ ...prev, ...updatedBatch }));
    }
  };

  // Fetch batch data
  const fetchBatches = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5023/api/batches");
      if (!response.ok) throw new Error("Failed to fetch batches");
      const data = await response.json();
      setBatches(data);
    } catch (err) {
      console.error("Error fetching batches:", err);
      // Fallback to mock data if API fails
    } finally {
      setLoading(false);
    }
  };

  // Fetch Employee with the ID
  const fetchEmployeeDetails = async (employeeId) => {
    try {
      const response = await fetch(
        `http://localhost:5023/api/employees/id/${employeeId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch employee details");
      }
      const employeeData = await response.json();
      return `${employeeData.firstName} ${employeeData.lastName}`;
    } catch (err) {
      console.error("Error fetching employee details:", err.message);
      return "Unknown Employee"; // Fallback if there's an error
    }
  };

  // Fetch employees
  const fetchEmployees = async () => {
    try {
      const response = await fetch("http://localhost:5023/api/employees");
      if (!response.ok) throw new Error("Failed to fetch employees");
      const data = await response.json();
      setEmployees(data); // Store employees in state
    } catch (error) {
      console.error("Error fetching employees:", error);
      setEmployees([]); // Ensure state updates even on failure
    }
  };

  // Improved fetchTasksForBatch function
  const fetchTasksForBatch = async (batchId) => {
    try {
      console.log(`Fetching tasks for batch: ${batchId}`);

      const response = await fetch(
        `http://localhost:5023/api/batches/${batchId}/tasks`
      );

      if (!response.ok) {
        // If no tasks found, set empty array instead of throwing error
        if (response.status === 404) {
          setTasks([]);
          return;
        }
        const errorMessage = await response.text();
        throw new Error(`Error fetching tasks: ${errorMessage}`);
      }

      const fetchedTasks = await response.json();
      console.log("Fetched tasks:", fetchedTasks);

      // Validate and clean up task data
      const validTasks = fetchedTasks.filter((task) => task && task._id);

      // Ensure tasks are stored in state
      setTasks(validTasks);
      console.log("Updated tasks state:", validTasks); // Debugging

      // Clear any temporary IDs that might be causing issues
      tempTaskIds.current.clear();

      return validTasks;
    } catch (err) {
      console.error("Error fetching tasks:", err.message);
      // Set empty tasks array on error
      setTasks([]);
      return [];
    }
  };

  // Handle batch selection
  const handleBatchSelect = async (batchId) => {
    // Clear existing tasks and temp IDs when switching batches
    setTasks([]);
    tempTaskIds.current.clear();

    const batch = batches.find((b) => b.batchId === batchId);
    setSelectedBatch(batch);
    setNewTask((prev) => ({
      ...prev,
      diamondNumber: batch.diamondNumber,
    }));

    // Fetch initial tasks
    await fetchTasksForBatch(batchId);
  };

  // Handle process selection
  const handleProcessSelect = (process) => {
    setSelectedProcess(process);
  };

  // Get a stable ID for a task
  const getTaskId = (task) => {
    if (task._id) return task._id;

    // Create a unique identifier based on task properties
    const taskIdentifier = `${task.employeeId}-${task.description}-${
      task.process
    }-${task.assignedDate || Date.now()}`;

    // Check if we already have a temporary ID for this task
    if (!tempTaskIds.current.has(taskIdentifier)) {
      // Only generate a new UUID if we don't have one yet
      tempTaskIds.current.set(taskIdentifier, `temp-${crypto.randomUUID()}`);
    }

    // Return the stable temporary ID
    return tempTaskIds.current.get(taskIdentifier);
  };

  // Handle task assignment
  const handleAssignTask = async () => {
    try {
      if (!newTask.employeeId || !newTask.description || !newTask.dueDate) {
        alert("Please fill in all required fields");
        return;
      }

      console.log("Selected Process Before Sending:", selectedProcess);

      const taskData = {
        batchId: selectedBatch.batchId,
        employeeId: newTask.employeeId,
        description: newTask.description,
        dueDate: newTask.dueDate,
        priority: newTask.priority,
        status: "Pending",
        process: selectedProcess,
        rate: Number.parseFloat(newTask.rate) || 0,
        diamondNumber: newTask.diamondNumber || 0,
      };

      console.log("Sending Task Data:", taskData);

      const response = await fetch("http://localhost:5023/api/batches/assign", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        throw new Error(`Failed to assign task: ${await response.text()}`);
      }

      const assignedTask = await response.json();
      console.log("Assigned task:", assignedTask);

      const selectedEmployee = employees.find(
        (emp) => emp._id === newTask.employeeId
      );

      // Create a task identifier for stable key generation
      const taskIdentifier = `${newTask.employeeId}-${newTask.description}-${selectedProcess}`;
      const tempId = assignedTask._id || `temp-${crypto.randomUUID()}`;

      // Store the temporary ID if needed
      if (!assignedTask._id) {
        tempTaskIds.current.set(taskIdentifier, tempId);
      }

      const enhancedTask = {
        ...assignedTask,
        _id: tempId, // This ensures the task has a unique ID
        batchId: selectedBatch.batchId,
        employeeId: newTask.employeeId,
        employeeName: selectedEmployee
          ? `${selectedEmployee.firstName} ${selectedEmployee.lastName}`
          : "Unknown Employee",
        description: newTask.description,
        dueDate: newTask.dueDate.toISOString(),
        assignedDate: new Date().toISOString(),
        priority: newTask.priority,
        status: "Pending",
        currentProcess: selectedProcess,
        process: selectedProcess,
        rate: Number.parseFloat(newTask.rate) || 0,
        diamondNumber: newTask.diamondNumber || 0,
      };

      console.log("Enhanced task to be added to UI:", enhancedTask);

      // 🔹 Update the state with the new task
      setTasks((prevTasks) => [...prevTasks, enhancedTask]);

      const employeeName = selectedEmployee
        ? `${selectedEmployee.firstName} ${selectedEmployee.lastName}`
        : "the employee";

      // Reset the form
      setNewTask({
        employeeId: "",
        description: "",
        dueDate: new Date(),
        priority: "Medium",
        status: "Pending",
        rate: 0,
        diamondNumber: selectedBatch.diamondNumber || 0,
        firstName: "",
      });

      setIsAssigningTask(false);
      alert(
        `Task assigned successfully to ${employeeName} for ${selectedProcess}`
      );

      await fetchUpdatedBatch(selectedBatch.batchId);

      // 🔹 Emit WebSocket event for real-time update
      if (socket && socket.connected) {
        // Only emit to others, not back to ourselves
        socket.emit("taskAssigned", enhancedTask, { selfExclude: true });
      } else {
        console.warn(
          "WebSocket is not connected. Task assignment not broadcasted."
        );
      }

      // Refresh tasks in the background to ensure we have proper IDs
      setTimeout(() => {
        fetchTasksForBatch(selectedBatch.batchId);
      }, 500);
    } catch (err) {
      console.error("Error assigning task:", err.message);
      alert(`Error assigning task: ${err.message}`);
    }
  };

  // Handle task deletion - FIXED FUNCTION
  const handleDeleteTask = async (taskId) => {
    try {
      // Validate task ID format
      if (!taskId || typeof taskId !== "string") {
        console.error("Invalid task ID:", taskId);

        // Refresh tasks to get proper IDs
        if (selectedBatch) {
          await fetchTasksForBatch(selectedBatch.batchId);
        }

        throw new Error("Invalid task ID format");
      }

      // Confirm task deletion
      const isConfirmed = window.confirm(
        "Are you sure you want to delete this task?"
      );
      if (!isConfirmed) {
        console.log("Task deletion canceled by the user.");
        return; // Exit if the user cancels the deletion
      }

      // First update the UI immediately to provide instant feedback
      setTasks((prevTasks) => prevTasks.filter((t) => t._id !== taskId));

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

      // Parse response data
      let responseData;
      try {
        responseData = await response.json();
      } catch (e) {
        // If response is not JSON, use empty object
        responseData = {};
      }

      // Handle the response
      if (!response.ok) {
        throw new Error(responseData.message || "Failed to delete task");
      }

      console.log(`Task deleted: ${taskId}`);

      // Emit WebSocket event for real-time task deletion
      if (socket && socket.connected) {
        socket.emit("taskDeleted", { taskId });
        console.log("Emitted taskDeleted event for task:", taskId);
      } else {
        console.warn(
          "WebSocket is not connected. Task deletion not broadcasted."
        );
      }

      // Show success alert
      alert("Task successfully deleted!");

      // No need to alert here as we've already updated the UI
    } catch (error) {
      console.error("Error deleting task:", error);

      // If there was an error, fetch the tasks again to ensure UI is in sync
      if (selectedBatch) {
        await fetchTasksForBatch(selectedBatch.batchId);
      }

      // Show failure alert
      alert("Failed to delete task: " + error.message);
    }
  };

  const fetchUpdatedBatch = async (batchId) => {
    try {
      const response = await fetch(
        `http://localhost:5023/api/batches/${batchId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch updated batch");
      }
      const updatedBatch = await response.json();
      console.log("Updated Batch Data:", updatedBatch); // ✅ Debugging

      // ✅ Ensure the selected batch state is updated
      setSelectedBatch((prevBatch) => ({
        ...prevBatch,
        currentProcess: updatedBatch.currentProcess, // ✅ Update current process
      }));
    } catch (err) {
      console.error("Error fetching updated batch:", err.message);
    }
  };

  // Format date for display
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get priority badge color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Delayed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  useEffect(() => {
    console.log("Updated Process:", selectedBatch?.currentProcess);
  }, [selectedBatch]);

  // Filter tasks by process
  const filteredTasks = tasks.filter(
    (task) => task.currentProcess === selectedProcess
  );

  useEffect(() => {
    fetchBatches();
    fetchEmployees();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 text-black ">
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Task Assignment</h1>
          <div className="flex space-x-4 text-black">
            <Select
              onValueChange={handleBatchSelect}
              value={selectedBatch?.batchId || ""}
            >
              <SelectTrigger className=" text-black w-[200px]">
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
        </div>

        {selectedBatch ? (
          <>
            <Card className="bg-white shadow-md">
              <CardHeader className="bg-gray-50 border-b">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Batch: {selectedBatch.batchId}</CardTitle>
                    <CardDescription>
                      Current Process: {selectedBatch.currentProcess} | Status:{" "}
                      {selectedBatch.status}
                    </CardDescription>
                  </div>
                  <Dialog
                    open={isAssigningTask}
                    onOpenChange={setIsAssigningTask}
                  >
                    <DialogTrigger asChild>
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        Assign New Task
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px] bg-gray-50 text-black rounded-lg p-6">
                      <DialogHeader>
                        <DialogTitle className="text-lg font-medium">
                          Assign Task for {selectedProcess}
                        </DialogTitle>
                        <DialogDescription className="text-sm text-gray-600">
                          Create a new task for batch {selectedBatch.batchId}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4">
                        <div className="flex flex-col space-y-2">
                          <label className="text-sm font-medium">
                            Employee
                          </label>
                          <Select
                            onValueChange={(value) =>
                              setNewTask({ ...newTask, employeeId: value })
                            }
                            value={newTask.employeeId}
                            className="text-black"
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select Employee" />
                            </SelectTrigger>
                            <SelectContent className="text-black bg-white w-full">
                              {employees.map((employee, index) => (
                                <SelectItem
                                  key={`employee-${employee._id}-${index}`}
                                  value={employee._id.toString()}
                                >
                                  {employee.firstName} {employee.lastName}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex flex-col space-y-2">
                          <label className="text-sm font-medium">
                            Description
                          </label>
                          <Textarea
                            className="p-2 border rounded w-full"
                            placeholder="Task description"
                            value={newTask.description}
                            onChange={(e) =>
                              setNewTask({
                                ...newTask,
                                description: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="flex flex-col space-y-2">
                          <label className="text-sm font-medium">
                            Due Date
                          </label>
                          <DatePicker
                            date={newTask.dueDate}
                            setDate={(date) =>
                              setNewTask({ ...newTask, dueDate: date })
                            }
                          />
                        </div>
                        <div className="flex flex-col space-y-2">
                          <label className="text-sm font-medium">
                            Priority
                          </label>
                          <Select
                            onValueChange={(value) =>
                              setNewTask({ ...newTask, priority: value })
                            }
                            value={newTask.priority}
                            className="text-black"
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select Priority" />
                            </SelectTrigger>
                            <SelectContent className="text-black bg-white w-full">
                              <SelectItem value="High">High</SelectItem>
                              <SelectItem value="Medium">Medium</SelectItem>
                              <SelectItem value="Low">Low</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <DialogFooter className="flex justify-end mt-4">
                        <Button
                          variant="outline"
                          onClick={() => setIsAssigningTask(false)}
                        >
                          Cancel
                        </Button>
                        <Button onClick={handleAssignTask} className="ml-2">
                          Assign Task
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Tabs defaultValue={PROCESS_TYPES[0]} className="w-full">
                  <TabsList className="w-full justify-start border-b rounded-none bg-gray-50 p-0">
                    {PROCESS_TYPES.map((process, index) => (
                      <TabsTrigger
                        key={`process-tab-${process}-${index}`}
                        value={process}
                        onClick={() => handleProcessSelect(process)}
                        className="flex-1 py-3 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none"
                      >
                        {process}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  {PROCESS_TYPES.map((process, index) => (
                    <TabsContent
                      key={`tab-content-${process}-${index}`}
                      value={process}
                      className="p-4"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredTasks.length > 0 ? (
                          filteredTasks.map((task, index) => (
                            // This is the code for Assigned task section which is in manager side
                            <Card
                              key={`${getTaskId(task)}-${index}`}
                              className="border border-gray-200 hover:shadow-md transition-shadow"
                            >
                              <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <CardTitle className="text-base font-medium">
                                      {task.description}
                                    </CardTitle>
                                    <CardDescription className="flex items-center mt-1 ">
                                      <Users className="h-4 w-4 mr-1" />
                                      {task.employeeName}
                                    </CardDescription>
                                  </div>
                                  <Badge
                                    className={getStatusColor(task.status)}
                                  >
                                    {task.status}
                                  </Badge>
                                </div>
                              </CardHeader>
                              <CardContent className="pb-2 pt-0">
                                <div className="flex flex-col space-y-2 text-sm">
                                  <div className="flex items-center text-gray-600">
                                    <Calendar className="h-4 w-4 mr-2" />
                                    Due: {formatDate(task.dueDate)}
                                  </div>
                                  <div className="flex items-center text-gray-600">
                                    <Clock className="h-4 w-4 mr-2" />
                                    Assigned: {formatDate(task.assignedDate)}
                                  </div>
                                  <div className="flex items-center">
                                    <span className="mr-2">Priority:</span>
                                    <Badge
                                      className={getPriorityColor(
                                        task.priority
                                      )}
                                    >
                                      {task.priority}
                                    </Badge>
                                  </div>
                                </div>
                              </CardContent>
                              <CardFooter className="pt-2 flex justify-end">
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleDeleteTask(task._id)}
                                >
                                  Delete Task
                                </Button>
                              </CardFooter>
                            </Card>
                          ))
                        ) : (
                          <div className="col-span-full flex flex-col items-center justify-center py-8 text-gray-500">
                            <AlertCircle className="h-12 w-12 mb-2 text-gray-400" />
                            <p>No tasks assigned for {process} yet</p>
                            <Button
                              variant="outline"
                              className="mt-4"
                              onClick={() => setIsAssigningTask(true)}
                            >
                              Assign First Task
                            </Button>
                          </div>
                        )}
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-md">
              <CardHeader>
                <CardTitle>Process Flow</CardTitle>
                <CardDescription>
                  Current batch processing status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  {PROCESS_TYPES.map((process, index) => (
                    <div
                      key={`process-flow-${process}-${index}`}
                      className="flex flex-col items-center"
                    >
                      <div
                        className={`w-16 h-16 rounded-full flex items-center justify-center ${
                          selectedBatch.currentProcess === process
                            ? "bg-blue-100 text-blue-700 border-2 border-blue-500"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        <span className="text-lg font-bold">{index + 1}</span>
                      </div>
                      <span className="mt-2 text-sm font-medium">
                        {process}
                      </span>
                      <div className="flex items-center mt-1">
                        {filteredTasks.filter((t) => t.process === process)
                          .length > 0 ? (
                          <Badge className="bg-blue-100 text-blue-800">
                            {
                              filteredTasks.filter((t) => t.process === process)
                                .length
                            }{" "}
                            tasks
                          </Badge>
                        ) : (
                          <Badge variant="outline">No tasks</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="relative mt-4">
                  <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2 z-0"></div>
                  <div
                    className="absolute top-1/2 left-0 h-0.5 bg-blue-500 -translate-y-1/2 z-10"
                    style={{
                      width: `${
                        ((PROCESS_TYPES.indexOf(selectedBatch.currentProcess) +
                          0.5) *
                          100) /
                        PROCESS_TYPES.length
                      }%`,
                    }}
                  ></div>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <Card className="bg-white shadow-md">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="bg-blue-50 p-4 rounded-full mb-4">
                <ArrowRight className="h-8 w-8 text-blue-500" />
              </div>
              <h3 className="text-xl font-medium text-gray-800 mb-2">
                Select a Batch to Begin
              </h3>
              <p className="text-gray-500 text-center max-w-md">
                Choose a batch from the dropdown above to view and assign tasks
                to employees
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
