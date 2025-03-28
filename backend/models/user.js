import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId, // Match Employee's _id
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["Admin", "Manager", "Employee"],
    default: "Employee",
  },
});

// Prevent password from being rehashed on every save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();  // Skip hashing if password was not changed
  }

  if (this.password.startsWith("$2b$") || this.password.startsWith("$2a$")) {
    return next();  // Skip hashing if already hashed
  }

  this.password = await bcrypt.hash(this.password, 12);
  next();
});

export default mongoose.model("user", userSchema);
