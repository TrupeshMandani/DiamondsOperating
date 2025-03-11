import express from "express";
import {
  getAllTasks,
  getTasksByBatchId,
} from "../controllers/taskController.js";

const router = express.Router();

router.get("/", getAllTasks);

// Route For Fetching Task By BatchID
router.get("/:batchId", getTasksByBatchId);

export default router;
