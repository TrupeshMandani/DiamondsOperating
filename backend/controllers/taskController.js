import Task from "../models/taskModel.js";

// Assign a task to an employee
export const assignTask = async (req, res) => {
  try {
    const { batch_id, assigned_by, assigned_to, stage, description } = req.body;

    const newTask = new Task({
      batch_id,
      assigned_by,
      assigned_to,
      stage,
      description,
      status: "Pending",
    });

    await newTask.save();
    res
      .status(201)
      .json({ message: "Task assigned successfully", task: newTask });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all tasks assigned to a specific employee
export const getEmployeeTasks = async (req, res) => {
  try {
    const { id } = req.params;
    const tasks = await Task.find({ assigned_to: id });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all tasks related to a specific batch
export const getBatchTasks = async (req, res) => {
  try {
    const { id } = req.params;
    const tasks = await Task.find({ batch_id: id });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update task status (Only assigned employee can update)
export const updateTaskStatus = async (req, res) => {
  try {
    const { batchId } = req.params;
    const { taskId } = req.body; // Get task ID
    const batch = await Batch.findOne({ batchId });
    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // If the batch has moved to the next stage, update the task status
    if (batch.currentProcess === "Sarin") {
      task.status = "In Progress"; // Mark task as in progress when it's at Sarin
    } else if (batch.currentProcess === "Stitching") {
      task.status = "In Progress"; // Mark task as in progress when it's at Stitching
    } else if (batch.currentProcess === "4P Cutting") {
      task.status = "Completed"; // Mark task as complete when it's finished
    }

    await task.save();
    res.json({
      message: `Task status updated for batch ${batchId}`,
      task,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error updating task status", error: error.message });
  }
};
