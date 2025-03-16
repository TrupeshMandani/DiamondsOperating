import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  batchId: { type: mongoose.Schema.Types.ObjectId, ref: "Batch", required: true }, 
  batchTitle: { type: String, required: true },
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
  employeeName: { type: String, required: true },
  currentProcess: { type: String, required: true },
  description: { type: String, required: true },
  dueDate: { type: Date, required: true },
  priority: { type: String, enum: ["High", "Medium", "Low"], required: true },
  status: { type: String, enum: ["Pending", "In Progress", "Completed"], required: true },
  assignedDate: { type: Date, default: Date.now },
});

export default mongoose.model("Task", taskSchema);
