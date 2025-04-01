import express from "express";
import {
  deleteTask,
  getAllTasks,
  getTasksByBatchId,
  updateTaskStatus,
  getTaskSummaryForEmployee,
} from "../controllers/taskController.js";

const router = express.Router();

// Route to fetch all tasks
router.get("/", getAllTasks);

// Route to fetch tasks by Batch ID
router.get("/:batchId", getTasksByBatchId);

// Route to update task status by Task ID
router.put("/:taskId/update-status", updateTaskStatus);

// Route to delete task by Task ID
router.delete("/:taskId", deleteTask);

// Route to get task summary for an employee
router.get("/employee/:employeeId/summary", getTaskSummaryForEmployee);

export default router;
