import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import connectDB from "./configurations/db.js";
import authRoutes from "./routes/authRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import batchRoutes from "./routes/batchRoutes.js";
import taskRoutes from "./routes/tasks.js";
import earningRoutes from "./routes/earningRoutes.js";

dotenv.config();
connectDB();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

// Pass io to routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/batches", batchRoutes);
app.use("/api/earnings", earningRoutes);

app.get("/", (req, res) =>
  res.send("Welcome to the Diamond Management System API!")
);

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("taskAssigned", (task) => {
    console.log("Broadcasting new task:", task);
    io.emit("taskAssigned", task);
  });

  socket.on("taskDeleted", ({ taskId }) => {
    console.log(`Broadcasting task deletion: ${taskId}`);
    io.emit("taskDeleted", { taskId });
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5023;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
