import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connecDB from "./configurations/db.js";
import authRoutes from "./routes/authRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import batchRoutes from "./routes/batchRoutes.js"; // Import batch routes

import taskRoutes from "./routes/tasks.js";

import { getEmployeeBatches } from "./controllers/employeeController.js";
import { assignBatchToEmployee } from "./controllers/batchController.js";
import Batch from "./models/batchModel.js";

dotenv.config();

const app = express();
const router = express.Router();

connecDB();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/tasks", taskRoutes);
router.get("/api/employee/:employeeId", getEmployeeBatches);

// Protect batch-related routes
app.use("/api/batches", batchRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Connected to the port ${PORT}`));

app.get("/", (req, res) => {
  res.send("Welcome to the Diamond Management System API!");
});
export const getAllAssignedBatches = async (req, res) => {
  try {
    // Find all batches where assignedEmployee is not null
    const batches = await Batch.find({ assignedEmployee: { $ne: null } });

    if (!batches.length) {
      return res
        .status(404)
        .json({ message: "No batches assigned to employees found" });
    }

    res.status(200).json(batches);
  } catch (error) {
    console.error("Error fetching assigned batches:", error);
    res.status(500).json({
      message: "Error fetching assigned batches",
      error: error.message,
    });
  }
};
router.get("/assigned", getAllAssignedBatches);
