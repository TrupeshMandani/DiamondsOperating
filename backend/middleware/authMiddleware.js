import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization");
  console.log("Token:", token); // Add this to debug

  if (!token) return res.status(400).json({ message: "Unauthorized" });

  try {
    // Extract the token without the "Bearer " part
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (error) {
    console.log("Error decoding token:", error); // Log any error
    res.status(401).json({ message: "Invalid token" });
  }
};

export const roleMiddleware = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "You Can't perform this action" });
    }
    next();
  };
};
