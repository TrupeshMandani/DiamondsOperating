import Earnings from "../models/earnings.js";
import mongoose from "mongoose";

// Get employee's monthly earnings
export const getMonthlyEarnings = async (req, res) => {
  try {
    const { employeeId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(employeeId)) {
      return res.status(400).json({ message: "Invalid employee ID format" });
    }

    const now = new Date();
    const earningsRecord = await Earnings.findOne({
      employeeId: new mongoose.Types.ObjectId(employeeId),
      month: now.getMonth() + 1, // JavaScript months are 0-indexed, so add 1
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

// Get employee's total yearly earnings
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

// Get employee's earnings for a specific month and year
export const getSpecificMonthEarnings = async (req, res) => {
  try {
    const { employeeId, month, year } = req.params;

    if (!mongoose.Types.ObjectId.isValid(employeeId)) {
      return res.status(400).json({ message: "Invalid employee ID format" });
    }

    const earningsRecord = await Earnings.findOne({
      employeeId: new mongoose.Types.ObjectId(employeeId),
      month: parseInt(month),
      year: parseInt(year),
    });

    if (!earningsRecord) {
      return res.status(200).json({
        totalEarnings: 0, // Set totalEarnings to 0 if no record found
        message: `You have no record for ${months[month - 1]} ${year}.`, // Send message with month and year
      });
    }

    res.status(200).json({
      totalEarnings: earningsRecord.totalEarnings,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching specific month earnings",
      error: error.message,
    });
  }
};

// Post earnings for an employee (monthly earnings record)
export const postMonthlyEarnings = async (req, res) => {
  try {
    const { employeeId, totalEarnings, month, year } = req.body;

    if (!mongoose.Types.ObjectId.isValid(employeeId)) {
      return res.status(400).json({ message: "Invalid employee ID format" });
    }

    const earningsRecord = await Earnings.findOne({
      employeeId: new mongoose.Types.ObjectId(employeeId),
      month: parseInt(month),
      year: parseInt(year),
    });

    if (earningsRecord) {
      return res.status(400).json({
        message: `Earnings for ${month}/${year} already recorded`,
      });
    }

    const newEarnings = new Earnings({
      employeeId: new mongoose.Types.ObjectId(employeeId),
      totalEarnings,
      month: parseInt(month),
      year: parseInt(year),
    });

    await newEarnings.save();
    res.status(201).json({
      message: `Earnings for ${month}/${year} saved successfully`,
      earnings: newEarnings,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error saving monthly earnings",
      error: error.message,
    });
  }
};
