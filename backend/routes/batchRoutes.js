import express from "express";
import {
  assignBatchToEmployee,
  createBatch,
  generateQRCode,
  getBatchByID,
  getBatchProgress,
  getBatches,
  updateBatch,
  getTasksForBatch,
  getTasksForEmployee, // Add this function
} from "../controllers/batchController.js"; // Import function
import { getEmployeesWithAssignedBatches } from "../controllers/employeeController.js";
import { notifyEmployeeOfTask } from "../index.js";

const router = express.Router();

// Create a new batch
router.post("/create", createBatch);

// Generate a QR code for a batch by ID
router.get("/:id/generate-label", generateQRCode);

// Get all Batches
router.get("/", getBatches);

// Get batch By ID
router.get("/:id", getBatchByID);

// Get tasks for a batch (NEW FIX)
router.get("/:id/tasks", getTasksForBatch); // 👈 Add this

// Update the batch
router.put("/:id/progress", updateBatch);

// Assign the batch to employee
router.put("/assign", async (req, res) => {
  try {
    // Your existing task creation code
    const newTask = new Task({
      employeeId: req.body.employeeId,
      // other task fields...
    });

    await newTask.save();

    // Add this line to notify the employee
    notifyEmployeeOfTask(newTask);

    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Fetching employees with assigned batches
router.get("/employees/assigned", getEmployeesWithAssignedBatches);

export default router;
