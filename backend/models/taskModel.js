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
    min: [1, "At least 1 diamond required"],
  },
  rate: {
    type: Number,
    required: true,
    min: [0, "Rate cannot be negative"],
  },
  earnings: {
    type: Number,
    required: true,
    default: function () {
      return this.diamondNumber * this.rate;
    },
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
    required: true,
  },
  assignedDate: { type: Date, default: Date.now },
  startTime: { type: Date, default: null },
  endTime: { type: Date, default: null },
  durationInMinutes: { type: Number, default: null },
  completedAt: { type: Date },
});

export default mongoose.model("Task", taskSchema);
