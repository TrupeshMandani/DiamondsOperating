import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  batchId: { type: mongoose.Schema.Types.ObjectId, ref: "Batch", required: true },
  batchTitle: { type: String, required: true },
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
  employeeName: { type: String, required: true }, // Store full name
  currentProcess: { type: String, required: true },
  description: { type: String, required: true }, // Added description
  dueDate: { type: Date, required: true }, // Added due date
  priority: { type: String, enum: ["High", "Medium", "Low"], required: true }, // Added priority
  status: { type: String, enum: ["Pending", "In Progress", "Completed"], default: "Pending" },
  assignedDate: { type: Date, default: Date.now }, // Added assigned date
});

export default mongoose.model("Task", taskSchema);
