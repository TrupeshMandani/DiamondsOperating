import express from "express";
import {
  assignTask,
  getEmployeeTasks,
  updateTaskStatus,
  getBatchTasks,
} from "../controllers/taskController.js";
import { roleMiddleware, authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

// Assign a task (Only Manager/Admin can assign)
router.post("/assign", roleMiddleware(["Admin", "Manager"]), assignTask);

// Get tasks assigned to an employee
router.get("/employee/:id", roleMiddleware(["Employee"]), getEmployeeTasks);

// Get all tasks related to a batch
router.get("/batch/:id", roleMiddleware(["Admin", "Manager"]), getBatchTasks);

// Update task status (Only assigned employee can update)
router.put("/:id/status", roleMiddleware(["Employee"]), updateTaskStatus);

export default router;
