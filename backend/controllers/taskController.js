import Task from "../models/taskModel.js";
import mongoose from "mongoose";
// Function to fetch the all tasks from Database
export const getAllTasks = async (req, res) => {
  try {
    // Fetch all tasks and populate batch & employee details
    const tasks = await Task.find()
      .populate("batchId", "batchId currentProcess") // Fetch batch details
      .populate("employeeId", "firstName lastName"); // Fetch employee details

    res.status(200).json(tasks);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching tasks", error: error.message });
  }
};

// Function to fetch tasks based on BatchID

export const getTasksByBatchId = async (req, res) => {
  try {
    const { batchId } = req.params;
    const tasks = await Task.find({
      batchId: new mongoose.Types.ObjectId(batchId),
    })
      .populate("employeeId", "firstName lastName")
      .populate("batchId", "batchId currentProcess");

    // IF NO TASK FOUND
    if (!tasks.length) {
      return res.status(404).json({ message: "No tasks found for this batch" });
    }
    res.status(200).json(tasks);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching tasks", error: error.message });
  }
};
