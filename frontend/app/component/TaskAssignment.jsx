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

// Process types for diamond processing
const PROCESS_TYPES = ["Sarin", "Stitching", "4P Cutting"];

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

  // WebSocket reference
  const socketRef = useRef(null);

  // Connect to WebSocket
  useEffect(() => {
    // Create WebSocket connection
    socketRef.current = new WebSocket("ws://localhost:5023");

    // Connection opened
    socketRef.current.addEventListener("open", (event) => {
      console.log("WebSocket Connection established");
    });

    // Listen for messages
    socketRef.current.addEventListener("message", (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("WebSocket message received:", data);

        // Handle different types of updates
        if (data.type === "TASK_UPDATE" || data.type === "taskCompleted") {
          console.log("Task update received via WebSocket:", data);

          // Extract the task data, handling both data formats
          let taskUpdateData;

          if (data.type === "TASK_UPDATE" && data.payload) {
            // Standard format from backend
            taskUpdateData = data.payload;
          } else if (data.type === "taskCompleted") {
            // Format from EmpTaskCard
            taskUpdateData = {
              _id: data.taskId,
              status: data.status || "Completed",
            };
          } else {
            // Direct data format
            taskUpdateData = data;
          }

          console.log("Processed task update data:", taskUpdateData);

          // Update tasks in state with the new status
          setTasks((prevTasks) =>
            prevTasks.map((task) => {
              // Check if this is the task being updated
              if (
                task._id === taskUpdateData._id ||
                task._id === taskUpdateData.taskId
              ) {
                console.log(
                  `Updating task ${task._id} status to ${taskUpdateData.status}`
                );
                return {
                  ...task,
                  status: taskUpdateData.status,
                };
              }
              return task;
            })
          );

          // Also check if we need to update batch status based on task completion
          if (
            (taskUpdateData.status === "Completed" ||
              taskUpdateData.status === "completed") &&
            selectedBatch
          ) {
            fetchUpdatedBatch(selectedBatch.batchId);
          }
        } else if (data.type === "BATCH_UPDATE") {
          handleBatchUpdate(data.payload);
        }
      } catch (error) {
        console.error("Error processing WebSocket message:", error);
      }
    });

    // Handle errors
    socketRef.current.addEventListener("error", (error) => {
      console.error("WebSocket error:", error);
    });

    // Clean up on component unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  // Handle task updates from WebSocket
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

  // Handle batch updates from WebSocket
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

  // Fetch tasks for a batch
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

      const tasks = await response.json();
      console.log("Fetched tasks:", tasks);

      // Ensure tasks are stored in state
      setTasks(tasks);
      console.log("Updated tasks state:", tasks); // Debugging
    } catch (err) {
      console.error("Error fetching tasks:", err.message);
      // Set empty tasks array on error
      setTasks([]);
    }
  };

  // Handle batch selection
  const handleBatchSelect = async (batchId) => {
    const batch = batches.find((b) => b.batchId === batchId);
    setSelectedBatch(batch);
    setNewTask((prev) => ({
      ...prev,
      diamondNumber: batch.diamondNumber,
    }));

    // Fetch initial tasks
    await fetchTasksForBatch(batchId);

    // Subscribe to updates for this specific batch via WebSocket
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(
        JSON.stringify({
          type: "SUBSCRIBE",
          entity: "batch",
          id: batchId,
        })
      );
    }
  };

  // Handle process selection
  const handleProcessSelect = (process) => {
    setSelectedProcess(process);
  };

  // Handle task assignment
  const handleAssignTask = async () => {
    try {
      if (!newTask.employeeId || !newTask.description || !newTask.dueDate) {
        alert("Please fill in all required fields");
        return;
      }

      console.log("Selected Process Before Sending:", selectedProcess); // ✅ Debugging

      const taskData = {
        batchId: selectedBatch.batchId,
        employeeId: newTask.employeeId,
        description: newTask.description,
        dueDate: newTask.dueDate,
        priority: newTask.priority,
        status: "Pending",
        process: selectedProcess,
        rate: parseFloat(newTask.rate) || 0,
        diamondNumber: newTask.diamondNumber || 0,
      };

      console.log("Sending Task Data:", taskData);

      const response = await fetch("http://localhost:5023/api/batches/assign", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        throw new Error(`Failed to assign task: ${await response.text()}`);
      }

      const assignedTask = await response.json();
      console.log("Assigned task:", assignedTask);

      // Make sure there's an _id in the response
      if (!assignedTask._id) {
        console.error("API response missing _id for new task:", assignedTask);
      }

      // Update tasks with the new task that has a proper _id
      setTasks((prevTasks) => [...prevTasks, assignedTask]);

      // Find selected employee to get full details
      const selectedEmployee = employees.find(
        (emp) => emp._id === newTask.employeeId
      );

      // Create a fully detailed task object for immediate display
      const enhancedTask = {
        ...assignedTask,
        _id: assignedTask._id, // Ensure ID is preserved for deletion functionality
        batchId: selectedBatch.batchId,
        employeeId: newTask.employeeId,
        employeeName: selectedEmployee
          ? `${selectedEmployee.firstName} ${selectedEmployee.lastName}`
          : "Unknown Employee",
        description: newTask.description,
        dueDate: newTask.dueDate.toISOString(), // Format date correctly
        assignedDate: new Date().toISOString(), // Add current date as assigned date
        priority: newTask.priority,
        status: "Pending",
        currentProcess: selectedProcess, // Ensure process matches current tab
        process: selectedProcess,
        rate: parseFloat(newTask.rate) || 0,
        diamondNumber: newTask.diamondNumber || 0,
      };

      console.log("Enhanced task to be added to UI:", enhancedTask);

      // Update tasks state with the new task
      setTasks((prevTasks) => [...prevTasks, enhancedTask]);

      const employeeName = selectedEmployee
        ? `${selectedEmployee.firstName} ${selectedEmployee.lastName}`
        : "the employee";

      // Reset task form
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

      // Close the dialog before showing the alert
      setIsAssigningTask(false);

      alert(
        `Task assigned successfully to ${employeeName} for ${selectedProcess}`
      );

      await fetchUpdatedBatch(selectedBatch.batchId);
    } catch (err) {
      console.error("Error assigning task:", err.message);
      alert(`Error assigning task: ${err.message}`);
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

  // Add this effect to handle subscription changes when batch changes
  useEffect(() => {
    // When batch changes, subscribe to the new batch's updates
    if (
      selectedBatch &&
      socketRef.current &&
      socketRef.current.readyState === WebSocket.OPEN
    ) {
      // Subscribe to the new batch
      socketRef.current.send(
        JSON.stringify({
          type: "SUBSCRIBE",
          entity: "batch",
          id: selectedBatch.batchId,
        })
      );

      // Return cleanup function that unsubscribes when batch changes or component unmounts
      return () => {
        socketRef.current.send(
          JSON.stringify({
            type: "UNSUBSCRIBE",
            entity: "batch",
            id: selectedBatch.batchId,
          })
        );
      };
    }
  }, [selectedBatch?.batchId]);

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
                {batches.map((batch) => (
                  <SelectItem key={batch.batchId} value={batch.batchId}>
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
                              {employees.map((employee) => (
                                <SelectItem
                                  key={employee._id}
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
                            Rate (per piece)
                          </label>
                          <input
                            type="number"
                            className="p-2 border rounded w-full"
                            value={newTask.rate || ""}
                            onChange={(e) =>
                              setNewTask({
                                ...newTask,
                                rate: parseFloat(e.target.value),
                              })
                            }
                            required
                          />
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
                    {PROCESS_TYPES.map((process) => (
                      <TabsTrigger
                        key={process}
                        value={process}
                        onClick={() => handleProcessSelect(process)}
                        className="flex-1 py-3 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none"
                      >
                        {process}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  {PROCESS_TYPES.map((process) => (
                    <TabsContent key={process} value={process} className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredTasks.length > 0 ? (
                          filteredTasks.map((task) => (
                            <Card
                              key={task._id} // Use the MongoDB _id which is guaranteed to be unique
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
                                  onClick={async () => {
                                    try {
                                      const token =
                                        localStorage.getItem("authToken");
                                      if (!token) {
                                        throw new Error(
                                          "No authentication token found"
                                        );
                                      }

                                      const response = await fetch(
                                        `http://localhost:5023/api/tasks/${task._id}`,
                                        {
                                          method: "DELETE",
                                          headers: {
                                            "Content-Type": "application/json",
                                            Authorization: `Bearer ${token}`,
                                          },
                                        }
                                      );

                                      const responseData =
                                        await response.json();
                                      if (!response.ok) {
                                        throw new Error(
                                          responseData.message ||
                                            "Failed to delete task"
                                        );
                                      }

                                      // Remove the task from the UI
                                      setTasks((prevTasks) =>
                                        prevTasks.filter(
                                          (t) => t._id !== task._id
                                        )
                                      );
                                      alert("Task deleted successfully");
                                    } catch (error) {
                                      console.error(
                                        "Error deleting task:",
                                        error
                                      );
                                      alert("Failed to delete task");
                                    }
                                  }}
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
                    <div key={process} className="flex flex-col items-center">
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
