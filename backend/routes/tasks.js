import express from "express";
import {
  deleteTask,
  getAllTasks,
  getTasksByBatchId,
  getTasksByBatchTitle,
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

router.get("/title/:batchTitle", getTasksByBatchTitle); // Use the controller function here

export default router;
