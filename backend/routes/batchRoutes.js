import express from "express";
import {
  generateAllQRCodes,  // <-- new
  generateQRCode,
  createBatch,
  getBatches,
  getBatchByID,
  getBatchProgress,
  updateBatch,
  assignBatchToEmployee,
} from "../controllers/batchController.js";

const router = express.Router();

// Create a new batch
router.post("/create", createBatch);

// Generate a QR code for a single batch
router.get("/:id/generate-label", generateQRCode);

// Generate QR code JSON for ALL existing batches
router.get("/generate-all-labels", generateAllQRCodes); // <-- new route

// get all Batches
router.get("/", getBatches);

// Get batch By ID
router.get("/:id", getBatchByID);

// Update the batch
router.put("/:id/progress", updateBatch);

// Assign batch to employee
router.put("/assign", assignBatchToEmployee);

export default router;
