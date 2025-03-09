"Employeemodal.js";
import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true },
  address: { type: String, required: true },
  joiningDate: { type: Date, default: Date.now },
});

const Employee = mongoose.model("Employee", employeeSchema);

// Use export default for ES Modules
export default Employee;
