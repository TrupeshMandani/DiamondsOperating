import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connecDB from "./configurations/db.js";
import authRoutes from "./routes/authRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import batchRoutes from "./routes/batchRoutes.js";
import { authMiddleware } from "./middleware/authMiddleware.js";
import taskRoutes from "./routes/tasks.js";
import Employee from "./models/Employee.js";
import Task from "./models/taskModel.js";
import WebSocket from "ws";
import http from "http"; // Add this import
import { WebSocketServer } from "ws";

dotenv.config();

const app = express();
connecDB();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/batches", batchRoutes);

// Create HTTP server explicitly
const server = http.createServer(app);

// WebSocket server setup with proper error handling
const wss = new WebSocketServer({ server, path: "/" });

// Update the WebSocket connection handler
wss.on("connection", (ws) => {
  console.log("New client connected");
  ws.subscriptions = [];

  // Handle messages from clients
  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message);
      console.log("Received message:", data);

      // Handle subscription requests
      if (data.type === "SUBSCRIBE") {
        console.log(`Client subscribed to ${data.entity} with ID ${data.id}`);
        ws.subscriptions.push({
          entity: data.entity,
          id: data.id,
        });
      } else if (data.type === "UNSUBSCRIBE") {
        ws.subscriptions = ws.subscriptions.filter(
          (sub) => !(sub.entity === data.entity && sub.id === data.id)
        );
      }
    } catch (err) {
      console.error("Error processing WebSocket message:", err);
    }
  });

  // Handle client disconnections
  ws.on("close", () => {
    console.log("Client disconnected");
  });

  // Handle errors
  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
  });
});

// Broadcast task updates to all connected clients
const broadcastTaskUpdate = (task) => {
  if (!wss) return;

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      try {
        client.send(
          JSON.stringify({
            type: "TASK_UPDATE",
            payload: {
              _id: task._id,
              taskId: task._id, // Include both formats for compatibility
              status: task.status,
              description: task.description,
              priority: task.priority,
              dueDate: task.dueDate,
              currentProcess: task.currentProcess,
            },
          })
        );
      } catch (err) {
        console.error("Error sending WebSocket message:", err);
      }
    }
  });
};

// Add function to notify employees of new tasks
const notifyEmployeeOfTask = (task) => {
  if (!wss) return;

  wss.clients.forEach((client) => {
    if (
      client.readyState === WebSocket.OPEN &&
      client.subscriptions &&
      client.subscriptions.some(
        (sub) =>
          sub.entity === "employee" && sub.id === task.employeeId.toString()
      )
    ) {
      try {
        client.send(
          JSON.stringify({
            type: "NEW_TASK_ASSIGNED",
            payload: task,
          })
        );
      } catch (err) {
        console.error("Error sending WebSocket message:", err);
      }
    }
  });
};

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

    // Update task status
    task.status = status;
    await task.save();

    // Broadcast the update via WebSocket
    broadcastTaskUpdate(task);

    res.status(200).json({ message: "Task updated successfully", task });
  } catch (err) {
    console.error("Error updating task:", err);
    res
      .status(500)
      .json({ message: "Error updating task", error: err.message });
  }
});

app.get("/", (req, res) => {
  res.send("Welcome to the Diamond Management System API!");
});

// Start the server
const PORT = process.env.PORT || 5023;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle server errors
server.on("error", (error) => {
  console.error("Server error:", error);
});

// Export the functions
export { broadcastTaskUpdate, notifyEmployeeOfTask };
