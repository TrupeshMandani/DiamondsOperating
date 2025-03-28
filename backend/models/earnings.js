import mongoose from "mongoose";

const earningsSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  totalEarnings: {
    type: Number,
    required: true,
  },
  month: {
    type: Number,
    required: true, // Month number (1 for January, 2 for February, etc.)
  },
  year: {
    type: Number,
    required: true, // The year in YYYY format
  },
});

const Earnings = mongoose.model("Earnings", earningsSchema);
export default Earnings;
