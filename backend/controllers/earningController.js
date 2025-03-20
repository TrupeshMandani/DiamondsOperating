import Earnings from "../models/earnings.js";
import mongoose from "mongoose";

// Get employee's monthly Earnings
export const getMonthlyEarnings = async (req, res) => {
  try {
    const { employeeId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(employeeId)) {
      return res.status(400).json({ message: "Invalid employee ID format" });
    }

    const now = new Date();
    const earningsRecord = await Earnings.findOne({
      employeeId: new mongoose.Types.ObjectId(employeeId),
      month: now.getMonth() + 1,
      year: now.getFullYear(),
    });

    if (!earningsRecord) {
      return res.status(404).json({
        message: "No earnings found for current month",
        month: now.getMonth() + 1,
        year: now.getFullYear(),
      });
    }

    res.status(200).json({
      totalEarnings: earningsRecord.totalEarnings,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching monthly earnings",
      error: error.message,
    });
  }
};

// Get employee's total yearly Earnings
export const getYearlyEarnings = async (req, res) => {
  try {
    const { employeeId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(employeeId)) {
      return res.status(400).json({ message: "Invalid employee ID format" });
    }

    const now = new Date();
    const result = await Earnings.aggregate([
      {
        $match: {
          employeeId: new mongoose.Types.ObjectId(employeeId),
          year: now.getFullYear(),
        },
      },
      {
        $group: {
          _id: null,
          totalEarnings: { $sum: "$totalEarnings" },
        },
      },
    ]);

    const yearlyEarnings = result.length > 0 ? result[0].totalEarnings : 0;

    res.status(200).json({ yearlyEarnings });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching yearly earnings",
      error: error.message,
    });
  }
};
