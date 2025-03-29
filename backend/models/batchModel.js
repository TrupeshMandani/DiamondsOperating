import mongoose from "mongoose";

const batchSchema = new mongoose.Schema({
  batchId: { type: String, required: true, unique: true },
  materialType: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  diamondWeight: { type: Number, required: true },
  diamondNumber: { type: Number, required: true },
  expectedDate: { type: Date, required: true },
  currentDate: { type: Date, default: Date.now },
  currentProcess: {
    type: [String],
    enum: ["Sarin", "Stitching", "4P Cutting"],
    required: true,
    index: true,
  },
  processStartDate: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["Pending", "In Progress", "Completed", "Assigned"],
    default: "Pending",
    index: true,
  },
  progress: {
    Sarin: { type: Number, default: 0 },
    Stitching: { type: Number, default: 0 },
    "4P Cutting": { type: Number, default: 0 },
  },
  assignedEmployee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    default: null,
  }, // New Field
});

export default mongoose.model("Batch", batchSchema);
