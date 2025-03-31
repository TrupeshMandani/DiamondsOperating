import Task from "../models/taskModel.js";
import Earnings from "../models/earnings.js";
import mongoose from "mongoose";
import Batch from "../models/batchModel.js";
import sendEmail from "../configurations/sendEmail.js";
import Employee from "../models/Employee.js"; // To fetch employee info
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

    if (!taskId || !mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({ message: "Invalid task ID" });
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const employee = await Employee.findById(task.employeeId);
    const batch = await Batch.findById(task.batchId);

    // Update task status and related fields
    if (status === "In Progress" && task.status !== "In Progress") {
      task.startTime = new Date();
      task.status = status;

      // 📧 Email manager when task starts
      try {
        await sendEmail({
          to: process.env.EMAIL_USER,
          subject: `Task Started by ${employee.firstName} ${employee.lastName}`,
          text: `Hello Manager,

The following task has been marked as *In Progress*:

• Employee: ${employee.firstName} ${employee.lastName}
• Task ID: ${task._id}
• Process: ${task.currentProcess}
• Batch ID: ${batch.batchId}
• Start Time: ${task.startTime.toLocaleString()}

– Diamond Management System`,
        });
        console.log("✅ Email sent to manager for 'In Progress'");
      } catch (err) {
        console.error("❌ Failed to send email to manager:", err.message);
      }

    } else if (status === "Completed" && task.status !== "Completed") {
      task.endTime = new Date();
      task.status = status;
      task.completedAt = new Date();

      // Calculate duration
      if (task.startTime) {
        task.durationInMinutes = Math.round(
          (task.endTime - task.startTime) / (1000 * 60)
        );
      }

      // Calculate earnings
      const Earning = task.diamondNumber * FIXED_CHARGE_PER_DIAMOND;

      await Earnings.findOneAndUpdate(
        {
          employeeId: task.employeeId,
          month: task.endTime.getMonth() + 1,
          year: task.endTime.getFullYear(),
        },
        {
          $inc: { totalEarnings: Earning },
          $set: { updatedAt: new Date() },
        },
        { upsert: true, new: true }
      );

      // 📧 Email manager when task is completed
      try {
        await sendEmail({
          to: process.env.EMAIL_USER,
          subject: `Task Completed by ${employee.firstName} ${employee.lastName}`,
          text: `Hello Manager,

The following task has been *Completed*:

• Employee: ${employee.firstName} ${employee.lastName}
• Task ID: ${task._id}
• Process: ${task.currentProcess}
• Batch ID: ${batch.batchId}
• Completed At: ${task.completedAt.toLocaleString()}

– Diamond Management System`,
        });
        console.log("✅ Email sent to manager for 'Completed'");
      } catch (err) {
        console.error("❌ Failed to send email to manager:", err.message);
      }

      // Emit real-time notification
      if (req.io) {
        req.io.emit("taskCompletedNotification", {
          message: `Task completed by employee: ${task.employeeId}`,
          taskId: task._id,
          employeeId: task.employeeId,
          process: task.process,
        });
      }
    } else {
      task.status = status;
    }

    await task.save();

    // Update batch status
    if (batch) {
      const allTasks = await Task.find({ batchId: batch._id });

      const allTasksCompleted = allTasks.every((t) => t.status === "Completed");
      const anyTaskInProgress = allTasks.some((t) => t.status === "In Progress");
      const anyTaskPending = allTasks.some((t) => t.status === "Pending");

      if (allTasksCompleted) {
        batch.status = "Completed";
      } else if (anyTaskInProgress) {
        batch.status = "In Progress";
      } else if (anyTaskPending) {
        batch.status = "Assigned";
      } else {
        batch.status = "Pending";
      }

      await batch.save();
    }

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

export const getTasksByBatchTitle = async (req, res) => {
  try {
    const { batchTitle } = req.params; // Get the batchTitle from request parameters

    if (!batchTitle) {
      return res.status(400).json({ message: "Batch Title is required" });
    }

    // Find the batch using the batchTitle
    const batch = await Task.findOne({ batchTitle });

    if (!batch) {
      return res
        .status(404)
        .json({ message: "No batch found with this title" });
    }

    // Fetch tasks that belong to the batch
    const tasks = await Task.find({ batchTitle })
      .populate("employeeId", "firstName lastName") // Populate employee details
      .populate("batchId", "batchId currentProcess"); // Populate batch details

    if (!tasks.length) {
      return res.status(404).json({ message: "No tasks found for this batch" });
    }

    res.status(200).json(tasks); // Return the tasks
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({
      message: "Error fetching tasks",
      error: error.message,
    });
  }
};
