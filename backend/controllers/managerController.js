import User from "../models/user.js";

export const updateManagerProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const oldEmail = req.headers["x-user-email"]; // ✅ Fetch old email from header

    if (!oldEmail || !name || !email) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const user = await User.findOne({ email: oldEmail });

    if (!user) {
      return res.status(404).json({ message: "Manager not found." });
    }

    user.name = name;
    user.email = email;

    await user.save();

    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error) {
    console.error("Error updating profile:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
