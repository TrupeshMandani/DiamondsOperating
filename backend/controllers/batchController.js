import Task from "../models/taskModel.js";
import mongoose from "mongoose";
import Batch from "../models/batchModel.js";
import Earning from "../models/earningModel.js";
import sendEmail from "../configurations/sendEmail.js";
import Employee from "../models/Employee.js";

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

// Update task status
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

      // Email manager when task starts
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

      // Calculate and update earnings
      const earningAmount = task.diamondNumber * FIXED_CHARGE_PER_DIAMOND;
      
      await Earning.findOneAndUpdate(
        {
          employeeId: task.employeeId,
          month: task.endTime.getMonth() + 1,
          year: task.endTime.getFullYear(),
        },
        {
          $inc: { totalEarnings: earningAmount },
          $set: { updatedAt: new Date() },
        },
        { upsert: true, new: true }
      );

      // Email manager when task is completed
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

      // Emit real-time notification
      if (req.io) {
        req.io.emit("taskCompletedNotification", {
          message: `Task completed by employee: ${task.employeeId}`,
          taskId: task._id,
          employeeId: task.employeeId,
          process: task.process,
        });
      }
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

    if (!taskId || !mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({ message: "Invalid task ID" });
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Delete the task and related earnings
    const deletedTask = await Task.findByIdAndDelete(taskId);
    await Earning.deleteMany({ taskId });

    // Update batch status
    const batch = await Batch.findById(task.batchId);
    if (batch) {
      batch.status = "Pending";
      await batch.save();
    }

    // Real-time updates
    if (req.io) {
      req.io.emit("batchStatusUpdate", {
        batchId: batch?.batchId,
        status: "Pending",
      });
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
    });
  }
};

// Get task count summary for an employee
export const getTaskSummaryForEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;

    const counts = await Task.aggregate([
      { $match: { employeeId: new mongoose.Types.ObjectId(employeeId) } },
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    const summary = counts.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {});

    res.status(200).json({
      assigned: summary.Pending || 0,
      inProgress: summary["In Progress"] || 0,
      completed: summary.Completed || 0,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching task summary",
      error: error.message,
    });
  }
};

// Get tasks by batch title
export const getTasksByBatchTitle = async (req, res) => {
  try {
    const { batchTitle } = req.params;

    const tasks = await Task.find({ batchTitle })
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