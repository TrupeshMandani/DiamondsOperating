import mongoose from "mongoose";

const batchSchema = new mongoose.Schema({
  batchId: { type: String, required: true, unique: true },
  materialType: { type: String, required: true },
  customerName: { type: String, required: true },
  customerContact: { type: String, required: true },
  currentProcess: { type: String, enum: ["Sarin", "Stitching", "4P Cutting"], required: true },
  processStartDate: { type: Date, default: Date.now },
  status: { type: String, enum: ["Pending", "In Progress", "Completed"], default: "Pending" }
});

export default mongoose.model("Batch", batchSchema);
