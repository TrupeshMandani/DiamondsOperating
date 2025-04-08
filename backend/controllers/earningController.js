import Earning from "../models/earningModel.js";
import Task from "../models/taskModel.js";
import mongoose from "mongoose";

// ✅ Generate Monthly Earnings for All Completed Tasks of an Employee
export const generateMonthlyEarningsForEmployee = async (employeeId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(employeeId)) {
      throw new Error("Invalid employee ID");
    }

    const completedTasks = await Task.find({
      employeeId,
      status: "Completed",
    });

    if (!completedTasks.length) {
      console.log("No completed tasks for this employee");
      return;
    }

    const earningsByMonth = {};

    for (const task of completedTasks) {
      const completedDate = new Date(task.completedAt);
      const year = completedDate.getUTCFullYear();
      const month = completedDate.getUTCMonth() + 1;

      const key = `${year}-${month}`;

      if (!earningsByMonth[key]) {
        earningsByMonth[key] = {
          employeeId: task.employeeId,
          year,
          month,
          tasks: [],
        };
      }

      earningsByMonth[key].tasks.push(task);
    }

    for (const key in earningsByMonth) {
      const { employeeId, year, month, tasks } = earningsByMonth[key];

      // Remove existing earnings for this month to avoid duplicates
      await Earning.deleteMany({ employeeId, year, month });

      for (const task of tasks) {
        const earning = new Earning({
          employeeId,
          taskId: task._id,
          totalEarnings: task.earnings,
          date: task.completedAt,
          month,
          year,
          periodStart: task.startTime,
          periodEnd: task.endTime,
        });

        await earning.save();
      }
    }

    console.log("Monthly earnings generated.");
  } catch (error) {
    console.error("Error generating earnings:", error.message);
  }
};

// ✅ Endpoint to trigger earnings generation + return earnings summary
export const getEmployeeEarnings = async (req, res) => {
  try {
    const { employeeId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(employeeId)) {
      return res.status(400).json({ message: "Invalid employee ID" });
    }

    // 🔄 Trigger the earnings generation logic (auto on page refresh)
    await generateMonthlyEarningsForEmployee(employeeId);

    // 🔍 Fetch aggregated earnings grouped by month
    const earnings = await Earning.aggregate([
      {
        $match: {
          employeeId: new mongoose.Types.ObjectId(employeeId),
        },
      },
      {
        $group: {
          _id: {
            year: "$year",
            month: "$month",
          },
          totalEarnings: { $sum: "$totalEarnings" },
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
      { $sort: { year: 1, month: 1 } },
    ]);

    if (!earnings.length) {
      return res.status(404).json({ message: "No earnings found" });
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
