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
    const { status, partialReason } = req.body; // 👈 Accept partial reason

    const validStatuses = ["Pending", "In Progress", "Completed", "Partially Completed"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Handle "Partially Completed"
    if (status === "Partially Completed") {
      task.partiallyCompleted = true;
      task.partialReason = partialReason || "No reason provided";
      task.endTime = new Date(); // Optional: log when it was marked
    }

    if (status === "In Progress" && !task.startTime) {
      task.startTime = new Date();
    }

    if (status === "Completed" && !task.endTime) {
      task.endTime = new Date();
      if (task.startTime) {
        const durationMs = task.endTime.getTime() - task.startTime.getTime();
        task.durationInMinutes = Math.round(durationMs / 60000);
      }
      task.completedAt = new Date();
      task.earnings = task.diamondNumber * task.rate;
    }

    task.status = status;
    await task.save();

    // Save earning only for completed tasks
    if (status === "Completed") {
      const earning = new Earning({
        employeeId: task.employeeId,
        taskId: task._id,
        totalEarnings: task.earnings,
        date: task.completedAt,
        month: task.completedAt.getUTCMonth() + 1,
        year: task.completedAt.getUTCFullYear(),
        periodStart: task.startTime,
        periodEnd: task.endTime,
      });
      await earning.save();
    }

    // Update related batch status
    const batch = await Batch.findById(task.batchId);
    if (batch) {
      if (status === "In Progress") {
        batch.status = "In Progress";
      }
      if (status === "Completed") {
        const remaining = await Task.find({ batchId: batch._id, status: { $ne: "Completed" } });
        if (remaining.length === 0) {
          batch.status = "Completed";
        }
      }
      await batch.save();
    }

    // Emit real-time update
    if (req.io) {
      req.io.emit("taskUpdated", {
        taskId: task._id,
        status: task.status,
        partialReason: task.partialReason || null,
        partiallyCompleted: task.partiallyCompleted || false,
        description: task.description,
        employeeName: task.employeeName,
        priority: task.priority,
        dueDate: task.dueDate,
        assignedDate: task.assignedDate,
      });
    }


    res.status(200).json({ message: "Task status updated successfully", task });
  } catch (error) {
    console.error("Error updating task status:", error);
    res.status(500).json({ message: "Error updating task status", error: error.message });
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

    // Delete task and related earnings
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
export const reassignTaskToEmployee = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { newEmployeeId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(taskId) || !mongoose.Types.ObjectId.isValid(newEmployeeId)) {
      return res.status(400).json({ message: "Invalid task or employee ID" });
    }

    const task = await Task.findById(taskId);
    if (!task || task.status !== "Partially Completed") {
      return res.status(404).json({ message: "Only partially completed tasks can be reassigned" });
    }

    const employee = await Employee.findById(newEmployeeId);
    if (!employee) return res.status(404).json({ message: "New employee not found" });

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


