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
  getTasksForEmployee // Add this function
} from "../controllers/batchController.js"; // Import function
import { getEmployeesWithAssignedBatches } from "../controllers/employeeController.js";

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
router.get("/:id/tasks", getTasksForBatch);  // 👈 Add this

// Update the batch
router.put("/:id/progress", updateBatch);

// Assign the batch to employee
router.put("/assign", assignBatchToEmployee);

// Fetching employees with assigned batches
router.get("/employees/assigned", getEmployeesWithAssignedBatches);




export default router;
