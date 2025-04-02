import User from "../models/user.js";

export const updateManagerProfile = async (req, res) => {
  const { email, name } = req.body;

  if (!email || !name) {
    return res.status(400).json({ message: "Email and name are required" });
  }

  try {
    const user = await User.findOneAndUpdate(
      { email },
      { name },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Profile updated successfully", updatedUser: user });
  } catch (error) {
    console.error("Error updating manager profile:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
