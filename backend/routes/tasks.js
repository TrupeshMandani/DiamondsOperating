import express from "express";
import {
  deleteTask,
  getAllTasks,
  getTasksByBatchId,
  updateTaskStatus,
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
export default router;
