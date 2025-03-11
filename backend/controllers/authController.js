import user from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const register = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const checkUser = await user.findOne({ email });
    if (checkUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const newUser = new user({  name, email, password, role });
    newUser.save();
    res.status(200).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const checkuser = await user.findOne({ email });

    if (!checkuser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare the password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, checkuser.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Create the JWT token
    const token = jwt.sign(
      {
        email: checkuser.email,
        id: checkuser._id,
        role: checkuser.role, // Include the user role in the token
      },
      process.env.JWT_SECRET,
      { expiresIn: "25m" } // Token expires in 5 Minutes
    );

    // Return user info and token in response
    res.status(200).json({
      message: "Login successful",
      result: checkuser,
      token,
    });
  } catch (error) {
    // Handle any errors during the authentication process
    res.status(500).json({ message: "Server error, please try again later" });
  }
};
