import express from "express";
import {
  createBatch,
  generateQRCode,
  getBatchByID,
  getBatchProgress,
  getBatches,
  updateBatch,
} from "../controllers/batchController.js"; // Import both functions

const router = express.Router();


// Create a new batch
router.post("/create",  createBatch);

// Generate a QR code for a batch by ID
router.get(
  "/:id/generate-label",

  generateQRCode
);

// get all Batches
router.get("/",  getBatches);

// Get batch By ID
router.get("/:id", getBatchByID);

// Update the batch
router.put("/:id/progress", updateBatch);

export default router;
