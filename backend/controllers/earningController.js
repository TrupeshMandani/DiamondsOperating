import Earning from "../models/earningModel.js";
import Task from "../models/taskModel.js"; // We will use Task model to get earnings
import mongoose from "mongoose";

// Get earnings grouped by month/year for an employee
export const getEmployeeEarnings = async (req, res) => {
  try {
    const { employeeId } = req.params;

    // Validate Employee ID
    if (!mongoose.Types.ObjectId.isValid(employeeId)) {
      return res.status(400).json({ message: "Invalid employee ID" });
    }

    // Aggregation query to fetch monthly earnings from completed tasks
    const earnings = await Earning.aggregate([
      {
        $match: {
          employeeId: new mongoose.Types.ObjectId(employeeId),
        },
      },
      {
        $group: {
          _id: {
            year: "$year", // Use year and month from earnings
            month: "$month",
          },
          totalEarnings: { $sum: "$totalEarnings" }, // Sum of earnings for that month
        },
      },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          totalEarnings: 1,
        },
      },
      { $sort: { year: 1, month: 1 } }, // Sort by year & month
    ]);

    // Check if earnings were found
    if (!earnings.length) {
      return res
        .status(404)
        .json({ message: "No earnings found for this employee" });
    }

    res.status(200).json({ success: true, data: earnings });
  } catch (error) {
    console.error("Error fetching earnings:", error);
    res.status(500).json({
      message: "Error fetching earnings",
      error: error.message,
    });
  }
};

// Create a new earning entry when task is completed
export const createEarningsForCompletedTask = async (taskId) => {
  try {
    const task = await Task.findById(taskId).populate("employeeId");
    if (!task || task.status !== "Completed") {
      throw new Error("Task is not completed or not found");
    }

    // Create a new earning entry based on the completed task
    const earning = new Earning({
      employeeId: task.employeeId._id,
      taskId: task._id,
      totalEarnings: task.earnings,
      date: task.completedAt,
      month: task.completedAt.getUTCMonth() + 1, // Adjusted for 1-based month
      year: task.completedAt.getUTCFullYear(),
      periodStart: task.startTime,
      periodEnd: task.endTime,
    });

    await earning.save();
    console.log("Earning saved for task:", taskId);
  } catch (error) {
    console.error("Error creating earning for completed task:", error);
  }
};
