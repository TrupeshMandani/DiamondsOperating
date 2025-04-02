"use client";

import { useState, useEffect, useRef } from "react";

export function useTaskManagement(
  socket,
  selectedBatch,
  selectedProcess,
  fetchUpdatedBatch
) {
  const [tasks, setTasks] = useState([]);
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

    // Handle task updates
    socket.on("taskUpdated", (updatedTaskData) => {
      const updatedTask = updatedTaskData.task; // 👈 get the actual task object from emitted data
      console.log("🔄 Real-time Task Updated:", updatedTask);
    
      // Update the full task object in state
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === updatedTask._id ? { ...task, ...updatedTask } : task
        )
      );
    });
    

    return () => {
      socket.off("taskAssigned");
      socket.off("taskDeleted");
      socket.off("taskUpdated");
    };
  }, [socket]);

  useEffect(() => {
    // Update newTask when selectedBatch changes
    if (selectedBatch) {
      setNewTask((prev) => ({
        ...prev,
        diamondNumber: selectedBatch.diamondNumber,
      }));

      // Fetch tasks for the selected batch
      fetchTasksForBatch(selectedBatch.batchId);
    }
  }, [selectedBatch]);

  // Handle task updates
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

      // Check if the selected process is available for this batch
      const availableProcesses =
        selectedBatch.selectedProcesses ||
        (Array.isArray(selectedBatch.currentProcess)
          ? selectedBatch.currentProcess
          : [selectedBatch.currentProcess]);

      // Flatten the array if it's nested (handles both [["Sarin", "Stitching"]] and ["Sarin", "Stitching"] formats)
      const flattenedProcesses = availableProcesses.flat();

      if (!flattenedProcesses.includes(selectedProcess)) {
        alert(
          `Process "${selectedProcess}" is not available for this batch. Available processes: ${flattenedProcesses.join(
            ", "
          )}`
        );
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
        const errorText = await response.text();
        throw new Error(`Failed to assign task: ${errorText}`);
      }

      const assignedTask = await response.json();
      console.log("Assigned task:", assignedTask);

      const selectedEmployee = await fetchEmployeeDetails(newTask.employeeId);

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
        employeeName: selectedEmployee || "Unknown Employee",
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

      const employeeName = selectedEmployee || "the employee";

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

  // Handle task deletion
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

  return {
    tasks,
    newTask,
    setNewTask,
    tempTaskIds,
    handleAssignTask,
    handleDeleteTask,
    fetchTasksForBatch,
    getTaskId,
  };
}
