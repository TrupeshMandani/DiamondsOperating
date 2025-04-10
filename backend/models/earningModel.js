// earningModel.js
import mongoose from "mongoose";

const earningSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task",
    required: false,
  },
  totalEarnings: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  month: {
    type: Number,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  periodStart: {
    type: Date,
    required: false,
  },
  periodEnd: {
    type: Date,
    required: false,
  },
});

const Earning = mongoose.model("Earning", earningSchema);
export default Earning;
