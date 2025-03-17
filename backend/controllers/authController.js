import user from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Employee from "../models/Employee.js";

export const register = async (req, res) => {
  const { _id, email, password, role } = req.body;

  try {
    const employee = await Employee.findById(_id);
    if (!employee) {
      return res.status(400).json({ message: "No corresponding employee found. Register employee first." });
    }

    const checkUser = await user.findOne({ email });
    if (checkUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Ensure password is NOT already hashed
    if (password.startsWith("$2b$") || password.startsWith("$2a$")) {
      return res.status(400).json({ message: "Invalid password format" });
    }

    // Hash password only once before saving
    const hashedPassword = await bcrypt.hash(password, 12);
    console.log("🔹 Hashed Password Before Saving:", hashedPassword);

    const newUser = new user({
      _id,
      name: `${employee.firstName} ${employee.lastName}`,
      email,
      password: hashedPassword,  // Store hashed password
      role,
    });

    await newUser.save();

    // Verify stored password
    const savedUser = await user.findOne({ email });
    console.log("🔹 Stored Hashed Password in DB:", savedUser.password);

    res.status(200).json({ message: "User registered successfully", userId: newUser._id });
  } catch (error) {
    console.error("Error in register API:", error);
    res.status(500).json({ message: error.message });
  }
};




export const updatePassword = async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;

  try {
    const userRecord = await user.findOne({ email });

    if (!userRecord) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("🔹 Old Stored Hashed Password:", userRecord.password);

    // Validate old password
    const isPasswordValid = await bcrypt.compare(oldPassword, userRecord.password);
    console.log("🔹 Old Password Match Result:", isPasswordValid);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Old password is incorrect" });
    }

    // Ensure the new password is NOT already hashed
    if (newPassword.startsWith("$2b$") || newPassword.startsWith("$2a$")) {
      return res.status(400).json({ message: "Invalid password format" });
    }

    // Hash new password before saving
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    console.log("🔹 New Hashed Password Before Saving:", hashedPassword);

    // Update password in DB
    userRecord.password = hashedPassword;
    await userRecord.save();

    // Verify updated password
    const updatedUser = await user.findOne({ email });
    console.log("🔹 Updated Hashed Password in DB:", updatedUser.password);

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ message: "Server error, please try again later" });
  }
};


export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const checkuser = await user.findOne({ email });

    if (!checkuser) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("🔹 Stored Hashed Password in DB:", checkuser.password);
    console.log("🔹 Entered Password Before Hashing:", password);

    // Compare entered password with hashed password in DB
    const isPasswordValid = await bcrypt.compare(password, checkuser.password);
    console.log("🔹 Password Comparison Result:", isPasswordValid);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        email: checkuser.email,
        id: checkuser._id,
        role: checkuser.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "25m" }
    );

    res.status(200).json({
      message: "Login successful",
      result: checkuser,
      token,
    });
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({ message: "Server error, please try again later" });
  }
};
