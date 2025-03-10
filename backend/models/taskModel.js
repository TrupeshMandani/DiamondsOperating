import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    batchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Batch",
      required: true,
    },

    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    batchTitle: { type: String, required: true }, // Ensure this exists

    firstName: { type: String, required: true }, // Ensure this exists
    lastName: { type: String, required: true }, // Ensure this exists
    currentProcess: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);

export default Task;
