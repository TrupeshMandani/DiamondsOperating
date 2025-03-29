import Task from "../models/taskModel.js";
import Earnings from "../models/earnings.js";
import mongoose from "mongoose";
import Batch from "../models/batchModel.js";
const FIXED_CHARGE_PER_DIAMOND = 0.25;

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

// Update task status and record start/end time, calculate earnings
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

      const Earning = task.diamondNumber * FIXED_CHARGE_PER_DIAMOND;
      task.completedAt = new Date();

      console.log("Task completed by employee:", task.employeeId);
      console.log("Diamonds completed:", task.diamondNumber);
      console.log("Calculated earnings:", Earning);

      // Use task.endTime to determine the month and year
      const endTime = task.endTime;
      console.log("Updating earnings for:", {
        employeeId: task.employeeId,
        month: endTime.getMonth() + 1, // getMonth() returns 0-11
        year: endTime.getFullYear(),
      });

      // Add logging before the update query to verify the data being sent to the database
      console.log("Updating earnings in the database for:", {
        employeeId: task.employeeId,
        month: endTime.getMonth() + 1, // The month (1-12)
        year: endTime.getFullYear(), // The year
        earnings: Earning,
      });

      // Save earnings to Earning model using task's endTime
      const earningsUpdate = await Earnings.findOneAndUpdate(
        {
          employeeId: task.employeeId,
          month: endTime.getMonth() + 1,
          year: endTime.getFullYear(),
        },
        {
          $inc: { totalEarnings: Earning }, // Increment earnings by the calculated value
          $set: { updatedAt: new Date() }, // Set updatedAt to the current time
        },
        { upsert: true, new: true } // Create new document if it doesn't exist, return the updated document
      );

      console.log("Earnings updated:", earningsUpdate);

      // 🔔 Emit taskCompletedNotification to manager
      if (req.io) {
        req.io.emit("taskCompletedNotification", {
          message: `Task completed by employee: ${task.employeeId}`,
          taskId: task._id,
          employeeId: task.employeeId,
          process: task.process,
        });
      }
    }

    task.status = status;
    await task.save();

    // Update batch status based on task status
    const batch = await Batch.findById(task.batchId); // Assuming task has a batchId field
    if (batch) {
      if (status === "In Progress") {
        // Set the batch status to In Progress if any task is in progress
        batch.status = "In Progress";
        await batch.save();
      }

      if (status === "Completed") {
        // Check if all tasks in the batch are completed
        const allTasksCompleted = await Task.find({
          batchId: batch._id,
          status: { $ne: "Completed" },
        });
        if (allTasksCompleted.length === 0) {
          batch.status = "Completed"; // Set batch status to Completed if all tasks are completed
          await batch.save();
        }
      }
    }

    // Emit task updated event for real-time update
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
