import express from "express";
import {
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

export default router;
