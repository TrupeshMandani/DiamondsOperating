import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./configurations/db.js";
import authRoutes from "./routes/authRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import batchRoutes from "./routes/batchRoutes.js";
import taskRoutes from "./routes/tasks.js";
import earningRoutes from "./routes/earningRoutes.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/batches", batchRoutes);
app.use("/api/earnings", earningRoutes);

app.get("/", (req, res) =>
  res.send("Welcome to the Diamond Management System API!")
);

const PORT = process.env.PORT || 5023;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
