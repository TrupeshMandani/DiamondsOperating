"routes.js";
import express from "express";
import {
  assignBatchToEmployee,
  createBatch,
  generateQRCode,
  getBatchByID,
  getBatchProgress,
  getBatches,
  updateBatch,
} from "../controllers/batchController.js"; // Import both functions
import { getEmployeesWithAssignedBatches } from "../controllers/employeeController.js";

const router = express.Router();

// Create a new batch
router.post("/create", createBatch);

// Generate a QR code for a batch by ID
router.get("/:id/generate-label", generateQRCode);

// get all Batches
router.get("/", getBatches);

// Get batch By ID
router.get("/:id", getBatchByID);

// Update the batch
router.put("/:id/progress", updateBatch);

// Assign the batch to emp Route
router.put("/assign", assignBatchToEmployee);
// Get the assigned batches ROUTE

// Fetching emp with assigned batched
router.get("/employees/assigned", getEmployeesWithAssignedBatches);

export default router;
