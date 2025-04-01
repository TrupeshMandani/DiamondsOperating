import Task from "../models/taskModel.js";
import mongoose from "mongoose";
import Batch from "../models/batchModel.js";
import Earning from "../models/earningModel.js"; // Ensure Earning model is imported

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

// Update task status
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
        task.durationInMinutes = Math.round(durationMs / 60000);
      }
      task.completedAt = new Date();
    }

    // Recalculate earnings based on diamondNumber and rate
    if (status === "Completed") {
      task.earnings = task.diamondNumber * task.rate; // Recalculate earnings
    }

    task.status = status;
    await task.save();

    // Create earning using the earnings calculated from diamondNumber * rate
    if (status === "Completed") {
      const earning = new Earning({
        employeeId: task.employeeId,
        taskId: task._id,
        totalEarnings: task.earnings, // Use task's earnings directly
        date: task.completedAt,
        month: task.completedAt.getUTCMonth() + 1,
        year: task.completedAt.getUTCFullYear(),
        periodStart: task.startTime, // Set periodStart to task start time
        periodEnd: task.endTime, // Set periodEnd to task end time
      });

      await earning.save();
    }

    // Update batch status
    const batch = await Batch.findById(task.batchId);
    if (batch) {
      if (status === "In Progress") {
        batch.status = "In Progress";
        await batch.save();
      }

      if (status === "Completed") {
        const allTasksCompleted = await Task.find({
          batchId: batch._id,
          status: { $ne: "Completed" },
        });
        if (allTasksCompleted.length === 0) {
          batch.status = "Completed";
          await batch.save();
        }
      }
    }

    // Real-time update
    if (req.io) {
      req.io.emit("taskUpdated", {
        message: `Task status updated to ${status} for task: ${taskId}`,
        task,
      });
    }

    res.status(200).json({
      message: "Task status updated successfully",
      task,
    });
  } catch (error) {
    console.error("Error updating task status:", error);
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

    // Delete the task
    const deletedTask = await Task.findByIdAndDelete(taskId);
    console.log("Deleted Task:", deletedTask);

    if (!deletedTask) {
      return res.status(500).json({ message: "Task could not be deleted" });
    }

    // Delete related earnings
    await Earning.deleteMany({ taskId: taskId });

    // Find the related batch
    const batch = await Batch.findById(task.batchId);
    if (!batch) {
      return res
        .status(404)
        .json({ message: "Batch not found", batchId: task.batchId });
    }

    // Set the batch status to "Pending"
    batch.status = "Pending";
    await batch.save();
    console.log("Batch status updated to Pending");

    // Emit batch status update for real-time update
    if (req.io) {
      req.io.emit("batchStatusUpdate", {
        batchId: batch.batchId,
        status: "Pending",
      });
    }

    // Emit taskDeleted event for real-time update
    if (req.io) {
      req.io.emit("taskDeleted", { taskId, employeeId: task.employeeId });
    }

    res.status(200).json({
      message: "Task deleted successfully and batch status updated",
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

// Get task count summary for an employee
export const getTaskSummaryForEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;

    if (!employeeId) {
      return res.status(400).json({ message: "Employee ID is required" });
    }

    const assignedCount = await Task.countDocuments({
      employeeId,
      status: "Pending",
    });
    const inProgressCount = await Task.countDocuments({
      employeeId,
      status: "In Progress",
    });
    const completedCount = await Task.countDocuments({
      employeeId,
      status: "Completed",
    });

    res.status(200).json({
      success: true,
      data: {
        assigned: assignedCount,
        inProgress: inProgressCount,
        completed: completedCount,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching task summary",
      error: error.message,
    });
  }
};
