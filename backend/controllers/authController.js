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
    const newUser = new user({ name, email, password, role });
    newUser.save();
    res.status(200).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const checkuser = await user.findOne({ email });
    if (!checkuser) {
      return res.status(400).json({ message: "User not found" });
    }

    if (!(await bcrypt.compare(password, checkuser.password))) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const token = jwt.sign(
      { email: checkuser.email, id: checkuser._id, role: checkuser.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ result: checkuser, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
