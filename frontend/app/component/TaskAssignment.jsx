"use client";

import { useState, useEffect } from "react";
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
  });

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
  // TODO you have to make this function again Because this is not the correct api call
  const fetchTasksForBatch = async (batchId) => {
    try {
      // Make an API call to fetch assigned batches for a given batchId
      const response = await fetch("http://localhost:5023/api/batches/assign"); // Make sure the URL is correct

      // Check if the response is okay (status code 200-299)
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      // Parse the JSON response body
      const assignedBatches = await response.json();

      // Filter tasks for the specific batchId (if needed)
      const filteredTasks = assignedBatches.filter(
        (task) => task.batchId === batchId
      );

      // Map the data to the format you need for the frontend
      const tasks = filteredTasks.map((task) => ({
        id: task._id, // Assuming the task has a unique ID
        batchId: task.batchId,
        employeeId: task.assignedEmployee, // Assuming 'assignedEmployee' is the employee's ID
        employeeName: `${task.assignedEmployee.firstName} ${task.assignedEmployee.lastName}`, // If populated with employee details
        process: task.process, // Assuming 'process' is stored in the task
        description: task.description, // Assuming 'description' is part of the task
        dueDate: new Date(task.dueDate),
        assignedDate: new Date(task.assignedDate),
        priority: task.priority, // Assuming priority is part of the task
        status: task.status, // Assuming status is part of the task
      }));

      // Set the tasks to state or any other logic
      setTasks(tasks);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  // Handle batch selection
  const handleBatchSelect = (batchId) => {
    const batch = batches.find((b) => b.batchId === batchId);
    setSelectedBatch(batch);
    fetchTasksForBatch(batchId);
  };

  // Handle process selection
  const handleProcessSelect = (process) => {
    setSelectedProcess(process);
  };

  // Handle task assignment
  // Handle task assignment
  const handleAssignTask = async () => {
    try {
      if (!newTask.employeeId || !newTask.description || !newTask.dueDate) {
        alert("Please fill in all required fields");
        return;
      }

      // First, fetch the employee name before making any other API calls
      const employeeNameStr = await fetchEmployeeDetails(newTask.employeeId);

      const taskData = {
        batchId: selectedBatch.batchId,
        employeeId: newTask.employeeId,
      };

      console.log(selectedBatch.batchId);
      console.log("Employee Name:", employeeNameStr); // Log to verify the name is coming back

      // Send request to the backend to assign the task
      const response = await fetch("http://localhost:5023/api/batches/assign", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData),
      });

      // Check if the response is successful
      if (!response.ok) {
        const errorDetails = await response.text();
        console.error("Error details:", errorDetails);
        throw new Error("Failed to assign task");
      }

      const assignedTask = await response.json();

      const newTaskObj = {
        id: tasks.length + 1,
        batchId: selectedBatch.batchId,
        employeeId: newTask.employeeId,
        employeeName: employeeNameStr,
        process: selectedProcess,
        description: newTask.description,
        dueDate: newTask.dueDate,
        assignedDate: new Date(),
        priority: newTask.priority,
        status: "Pending",
      };

      setTasks([...tasks, newTaskObj]);

      // Use the fetched employee name in the alert
      alert(`Task assigned to ${employeeNameStr} for ${selectedProcess}`);

      // Reset form fields
      setNewTask({
        employeeId: "",
        description: "",
        dueDate: new Date(),
        priority: "Medium",
        status: "Pending",
      });

      setIsAssigningTask(false);
    } catch (err) {
      console.error("Error assigning task:", err.message);
      alert(`Error assigning task: ${err.message}`);
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

  // Filter tasks by process
  const filteredTasks = tasks.filter(
    (task) => task.process === selectedProcess
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
                    <DialogContent className="sm:max-w-[500px] bg-gray-50 text-black">
                      <DialogHeader>
                        <DialogTitle>
                          Assign Task for {selectedProcess}
                        </DialogTitle>
                        <DialogDescription>
                          Create a new task for batch {selectedBatch.batchId}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4 w-full">
                          <label className="text-right text-sm font-medium">
                            Employee
                          </label>
                          <Select
                            onValueChange={(value) =>
                              setNewTask({ ...newTask, employeeId: value })
                            }
                            value={newTask.employeeId}
                            className="col-span-3 text-black"
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select Employee" />
                            </SelectTrigger>
                            <SelectContent className="text-black bg-white w-max">
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
                        <div className="grid grid-cols-4 items-center gap-4">
                          <label className="text-right text-sm font-medium">
                            Description
                          </label>
                          <Textarea
                            className="col-span-3"
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
                        <div className="grid grid-cols-4 items-center gap-4">
                          <label className="text-right text-sm font-medium">
                            Due Date
                          </label>
                          <div className="col-span-3">
                            <DatePicker
                              date={newTask.dueDate}
                              setDate={(date) =>
                                setNewTask({ ...newTask, dueDate: date })
                              }
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <label className="text-right text-sm font-medium">
                            Priority
                          </label>
                          <Select
                            onValueChange={(value) =>
                              setNewTask({ ...newTask, priority: value })
                            }
                            value={newTask.priority}
                            className="col-span-3"
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select Priority" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="High">High</SelectItem>
                              <SelectItem value="Medium">Medium</SelectItem>
                              <SelectItem value="Low">Low</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setIsAssigningTask(false)}
                        >
                          Cancel
                        </Button>
                        <Button onClick={handleAssignTask}>Assign Task</Button>
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
                              key={task.id}
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
                                <Button variant="outline" size="sm">
                                  Update Status
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
