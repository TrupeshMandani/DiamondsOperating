import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
  batch_id: { type: mongoose.Schema.Types.ObjectId, ref: "Batch", required: true },
  assigned_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  assigned_to: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  stage: { type: String, enum: ["Sarin", "Stitching", "4P Cutting"], required: true },
  status: { type: String, enum: ["Pending", "In Progress", "Completed"], default: "Pending" },
  description: { type: String },
  assigned_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

export default mongoose.model("Task", TaskSchema); // Ensure this is default
