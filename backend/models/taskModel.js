import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  batchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Batch",
    required: true,
  },
  batchTitle: { type: String, required: true },
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  employeeName: { type: String, required: true },
  diamondNumber: {
    type: Number,
    required: true,
    min: 1,
  },
  currentProcess: { type: String, required: true },
  description: { type: String, required: true },
  dueDate: { type: Date, required: true },
priority: {
  type: String,
  enum: ["High", "Medium", "Low"],
  required: true,
},
status: {
  type: String,
  enum: ["Pending", "In Progress", "Completed"],
  default: "Pending",
},

  assignedDate: { type: Date, default: Date.now },
  rate: { type: Number, required: true },
  taskEarnings: { type: Number, required: true },
  partialReason: { type: String },
});

export default mongoose.model("Task", taskSchema);
