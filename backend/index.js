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
import WebSocket from "ws"; // Import WebSocket

dotenv.config();

const app = express();
connecDB();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/tasks", taskRoutes); // Use the task routes
app.use("/api/batches", batchRoutes); // Protect batch-related routes

// WebSocket server setup
const server = app.listen(process.env.PORT || 5000, () => {
  console.log(`Connected to the port ${process.env.PORT || 5000}`);
});

const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  console.log("New client connected");

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

// PUT route to update task status
app.put("/api/tasks/update-status/:taskId", async (req, res) => {
  const { taskId } = req.params;
  const { status } = req.body;

  if (!taskId || !status) {
    return res.status(400).json({ message: "Task ID and status are required" });
  }

  try {
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.status = status;
    await task.save();

    // Emit a WebSocket message to all clients with proper format
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ 
          type: "TASK_UPDATE", 
          payload: {
            _id: taskId,
            status: status,
            // Include other relevant task fields
            description: task.description,
            priority: task.priority,
            dueDate: task.dueDate,
            currentProcess: task.currentProcess
          }
        }));
      }
    });

    res.status(200).json({ message: "Task updated successfully", task });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating task", error: err.message });
  }
});

app.get("/", (req, res) => {
  res.send("Welcome to the Diamond Management System API!");
});
