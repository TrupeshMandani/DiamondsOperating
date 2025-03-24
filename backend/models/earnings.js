import mongoose from "mongoose";

const EarningsSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  month: { type: Number, required: true },
  year: { type: Number, required: true },
  totalEarnings: { type: Number, default: 0 },
});

const Earnings = mongoose.model("Earnings", EarningsSchema);
export default Earnings;
