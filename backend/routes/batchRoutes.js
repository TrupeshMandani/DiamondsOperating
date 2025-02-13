import express from "express";
import { createBatch, generateQRCode } from "../controllers/batchController.js"; // Import both functions
import Batch from "../models/batchModel.js";

const router = express.Router();

// Create a new batch
router.post("/create", createBatch);

// Generate a QR code for a batch by ID
router.get("/:id/generate-label", generateQRCode);

export default router;
