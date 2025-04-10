import Earning from "../models/earningModel.js";
import Task from "../models/taskModel.js";
import mongoose from "mongoose";

//  Generate Monthly Summarized Earnings for an Employee
export const generateMonthlyEarningsForEmployee = async (employeeId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(employeeId)) {
      throw new Error("Invalid employee ID");
    }

    const employeeObjectId = new mongoose.Types.ObjectId(employeeId);

    //  Delete all previous earnings for the employee
    await Earning.deleteMany({ employeeId: employeeObjectId });
    console.log(` Cleared old earnings for employee ${employeeId}`);

    //  Fetch eligible tasks
    const completedTasks = await Task.find({
      employeeId: employeeObjectId,
      status: { $in: ["Completed", "Partially Completed"] },
      completedAt: { $ne: null },
      taskEarnings: { $type: "number" },
    });

    if (!completedTasks.length) {
      console.log("No eligible completed/partially completed tasks found.");
      return;
    }

    const earningsByMonth = {};
    console.log(
      ` Found ${completedTasks.length} tasks for employee ${employeeId}`
    );

    for (const task of completedTasks) {
      console.log(` Checking task ${task._id} | Status: ${task.status}`);

      const completedDate = new Date(task.completedAt);
      if (isNaN(completedDate)) {
        console.log(` Skipping task ${task._id} - invalid completedAt`);
        continue;
      }

      if (typeof task.taskEarnings !== "number" || isNaN(task.taskEarnings)) {
        console.log(` Skipping task ${task._id} - invalid taskEarnings`);
        continue;
      }

      const year = completedDate.getUTCFullYear();
      const month = completedDate.getUTCMonth() + 1;
      const key = `${year}-${month}`;

      if (!earningsByMonth[key]) {
        earningsByMonth[key] = {
          employeeId: task.employeeId,
          year,
          month,
          totalEarnings: 0,
          periodStart: task.startTime,
          periodEnd: task.endTime,
        };
      }

      earningsByMonth[key].totalEarnings += task.taskEarnings;

      console.log(
        ` Task ${task._id} counted | ₹${
          task.taskEarnings
        } added for ${month}/${year} | Running total: ₹${earningsByMonth[
          key
        ].totalEarnings.toFixed(2)}`
      );
    }

    //  Save one document per month
    for (const key in earningsByMonth) {
      const { employeeId, year, month, totalEarnings, periodStart, periodEnd } =
        earningsByMonth[key];

      const earning = new Earning({
        employeeId,
        year,
        month,
        totalEarnings,
        date: new Date(`${year}-${month}-01`),
        periodStart,
        periodEnd,
      });

      await earning.save();
      console.log(
        ` Saved monthly earning for ${month}/${year} — ₹${totalEarnings.toFixed(
          2
        )}`
      );
    }

    console.log(" Monthly summarized earnings regenerated successfully.");
  } catch (error) {
    console.error("Error generating summarized earnings:", error.message);
  }
};

// ✅ Get Earnings Summary for Employee
export const getEmployeeEarnings = async (req, res) => {
  try {
    const { employeeId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(employeeId)) {
      return res.status(400).json({ message: "Invalid employee ID" });
    }

    //  Generate earnings summary
    await generateMonthlyEarningsForEmployee(employeeId);

    const monthlyEarnings = await Earning.find({ employeeId }).sort({
      year: 1,
      month: 1,
    });

    if (!monthlyEarnings.length) {
      return res.status(404).json({ message: "No earnings found" });
    }

    res.status(200).json({
      success: true,
      monthlyEarnings,
    });
  } catch (error) {
    console.error(" Error fetching earnings:", error);
    res.status(500).json({
      message: "Error fetching earnings",
      error: error.message,
    });
  }
};
