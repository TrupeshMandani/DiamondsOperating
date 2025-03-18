import Task from "../models/taskModel.js";
import mongoose from "mongoose";
import { broadcastTaskUpdate } from "../index.js";

// Get all tasks
export const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("batchId", "batchId currentProcess")
      .populate("employeeId", "firstName lastName");

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching tasks",
      error: error.message,
    });
  }
};

// Get tasks by batchId
export const getTasksByBatchId = async (req, res) => {
  try {
    const { batchId } = req.params;
    const tasks = await Task.find({
      batchId: new mongoose.Types.ObjectId(batchId),
    })
      .populate("employeeId", "firstName lastName")
      .populate("batchId", "batchId currentProcess");

    if (!tasks.length) {
      return res.status(404).json({ message: "No tasks found for this batch" });
    }

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching tasks",
      error: error.message,
    });
  }
};

// Update task status and record start/end time
export const updateTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;

    const validStatuses = ["Pending", "In Progress", "Completed"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Start time
    if (status === "In Progress" && !task.startTime) {
      task.startTime = new Date();
    }

    // End time + Duration
    if (status === "Completed" && !task.endTime) {
      task.endTime = new Date();
      if (task.startTime) {
        const durationMs = task.endTime.getTime() - task.startTime.getTime();
        task.durationInMinutes = Math.round(durationMs / 60000); // convert ms to minutes
      }
    }

    task.status = status;
    await task.save();

    // Broadcast the update
    broadcastTaskUpdate(task);

    res.status(200).json({
      message: "Task status updated successfully",
      task,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating task status",
      error: error.message,
    });
  }
};

// Delete task
export const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    console.log("Received taskId:", taskId);

    if (!taskId || !mongoose.Types.ObjectId.isValid(taskId)) {
      return res
        .status(400)
        .json({ message: "Invalid task ID format", taskId });
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found", taskId });
    }

    console.log("Task found:", task);

    const deletedTask = await Task.findByIdAndDelete(taskId);
    console.log("Deleted Task:", deletedTask);

    if (!deletedTask) {
      return res.status(500).json({ message: "Task could not be deleted" });
    }

    res.status(200).json({
      message: "Task deleted successfully",
      deletedTaskId: taskId,
    });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({
      message: "Failed to delete task",
      error: error.message,
      taskId,
    });
  }
};
