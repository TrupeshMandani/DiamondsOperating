import Task from "../models/taskModel.js";
import mongoose from "mongoose";
import Batch from "../models/batchModel.js";
import Earning from "../models/earningModel.js";
import sendEmail from "../configurations/sendEmail.js";
import Employee from "../models/Employee.js";

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
      .select("+partialReason +partiallyCompleted")
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
    const { status, completedDiamonds } = req.body;

    const validStatuses = ["Pending", "In Progress", "Completed", "Partially Completed"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Handle Partially Completed status
    if (status === "Partially Completed") {
      const completed = Number(completedDiamonds);
      const reason = req.body.partialReason;
    
      if (isNaN(completed) || completed < 0) {
        return res.status(400).json({ message: "Invalid completedDiamonds value" });
      }
    
      if (completed > task.diamondNumber) {
        return res.status(400).json({ message: "Completed diamonds exceed assigned quantity" });
      }
    
      if (!reason || typeof reason !== "string" || reason.trim() === "") {
        return res.status(400).json({ message: "Partial reason is required" });
      }
    
      task.completedDiamonds = completed;
      task.remainingDiamonds = task.diamondNumber - completed;
      task.partialReason = reason;
      task.partiallyCompleted = true; // optional, for UI logic
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
      task.earnings = task.diamondNumber * task.rate;
    }

    task.status = status;
    await task.save();

    // Handle earnings for completed tasks
    if (status === "Completed") {
      const month = task.completedAt.getUTCMonth() + 1;
      const year = task.completedAt.getUTCFullYear();

      await Earning.updateOne(
        {
          employeeId: task.employeeId,
          month,
          year,
        },
        {
          $set: {
            date: task.completedAt,
            periodStart: task.startTime,
            periodEnd: task.endTime,
          },
          $inc: {
            totalEarnings: task.earnings || 0,
          },
        },
        { upsert: true }
      );
    }

    // Update batch status
    const batch = await Batch.findById(task.batchId);
    if (batch) {
      const allTasks = await Task.find({ batchId: batch._id });

      const allTasksCompleted = allTasks.every(
        (task) => task.status === "Completed"
      );

      const hasInProgressTask = allTasks.some(
        (task) => task.status === "In Progress"
      );

      if (allTasksCompleted) {
        batch.status = "Completed";
      } else if (hasInProgressTask) {
        batch.status = "In Progress";
      } else {
        const allTasksAssigned = allTasks.every(
          (task) => task.status === "Pending" || task.status === "Completed"
        );
        batch.status = allTasksAssigned ? "Assigned" : "Pending";
      }

      await batch.save();

      if (req.io) {
        req.io.emit("batchStatusUpdate", {
          batchId: batch.batchId,
          status: batch.status,
        });
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

    if (!taskId || !mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({ message: "Invalid task ID" });
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const deletedTask = await Task.findByIdAndDelete(taskId);
    await Earning.deleteMany({ taskId });

    const batch = await Batch.findById(task.batchId);
    if (batch) {
      batch.status = "Pending";
      await batch.save();

      req.io?.emit("batchStatusUpdate", {
        batchId: batch.batchId,
        status: "Pending",
      });
    }

    req.io?.emit("taskDeleted", { taskId, employeeId: task.employeeId });

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

// Get task summary for employee
export const getTaskSummaryForEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;

    const counts = await Task.aggregate([
      { $match: { employeeId: new mongoose.Types.ObjectId(employeeId) } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
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

// ✅ Reassign partially completed task to another employee
// ✅ Reassign partially completed task to another employee + update fields
export const reassignTaskToEmployee = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { newEmployeeId, dueDate, rate, priority } = req.body;

    if (
      !mongoose.Types.ObjectId.isValid(taskId) ||
      !mongoose.Types.ObjectId.isValid(newEmployeeId)
    ) {
      return res.status(400).json({ message: "Invalid task or employee ID" });
    }

    const task = await Task.findById(taskId);
    if (!task || task.status !== "Partially Completed") {
      return res.status(404).json({ message: "Only partially completed tasks can be reassigned" });
    }

    const employee = await Employee.findById(newEmployeeId);
    if (!employee) return res.status(404).json({ message: "New employee not found" });

    // 🧠 Update fields
    task.employeeId = newEmployeeId;
    task.employeeName = `${employee.firstName} ${employee.lastName}`;
    task.status = "Pending";
    task.startTime = null;
    task.endTime = null;
    task.durationInMinutes = null;
    task.partiallyCompleted = false;
    task.partialReason = "";
    task.earnings = 0;
    task.assignedDate = new Date();

    // 🆕 Updated fields from frontend
    if (dueDate) task.dueDate = new Date(dueDate);
    if (rate !== undefined) task.rate = rate;
    if (priority) task.priority = priority;

    await task.save();

    req.io?.emit("taskUpdated", {
      message: "Task reassigned successfully",
      task,
    });

    res.status(200).json({ message: "Task reassigned successfully", task });
  } catch (error) {
    console.error("Error reassigning task:", error);
    res.status(500).json({ message: "Error reassigning task", error: error.message });
  }
};

