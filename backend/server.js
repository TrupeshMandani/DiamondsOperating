import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connecDB from "./configurations/db.js";
import authRoutes from "./routes/authRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import batchRoutes from "./routes/batchRoutes.js"; // Import batch routes
import { authMiddleware } from "./middleware/authMiddleware.js";


dotenv.config();

const app = express();
connecDB();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/employees", authMiddleware, employeeRoutes);

// Define the route for generating QR code


// Protect batch-related routes
app.use("/api/batches",  batchRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Connected to the port ${PORT}`));

app.get("/", (req, res) => {
  res.send("Welcome to the Diamond Management System API!");
});
