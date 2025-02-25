import express from "express";
import {
  createBatch,
  generateQRCode,
  getBatchByID,
  getBatchProgress,
  getBatches,
  updateBatch,
} from "../controllers/batchController.js"; // Import both functions
import {
  authMiddleware,
  roleMiddleware,
} from "../middleware/authMiddleware.js";
const router = express.Router();

router.use(authMiddleware);
// Create a new batch
router.post("/create", roleMiddleware(["Admin", "Manager"]), createBatch);

// Generate a QR code for a batch by ID
router.get(
  "/:id/generate-label",
  roleMiddleware(["Admin", "Manager"]),
  generateQRCode
);

// get all Batches
router.get("/", roleMiddleware(["Admin", "Manager", "Employee"]), getBatches);

// Get batch By ID
router.get("/:id", getBatchByID);

// Update the batch
router.put("/:id/progress", updateBatch);

export default router;
