import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connecDB from "./configurations/db.js";
import authRoutes from "./routes/authRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import batchRoutes from "./routes/batchRoutes.js"; // Import batch routes
import { authMiddleware } from "./middleware/authMiddleware.js";
import taskRoutes from "./routes/tasks.js";
import Employee from "./models/Employee.js";
import Task from "./models/taskModel.js";

dotenv.config();

const app = express();
connecDB();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/tasks", taskRoutes); // Use the task routes
// Define the route for generating QR code

// Protect batch-related routes
app.use("/api/batches", batchRoutes);

app.delete("/api/employees/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedEmployee = await Employee.findByIdAndDelete(id);
    a;

    if (!deletedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json({ message: "Employee deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting employee", error: err.message });
  }
});

app.get("/api/employees", async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json(employees);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching employees", error: err.message });
  }
});

// PUT route to update task status
import { updateTaskStatus } from "./controllers/taskController.js";

app.put("/api/tasks/update-status/:taskId", updateTaskStatus);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Connected to the port ${PORT}`));

app.get("/", (req, res) => {
  res.send("Welcome to the Diamond Management System API!");
});
