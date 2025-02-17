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
    res.status(201).json({ message: "Task assigned successfully", task: newTask });
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
    const { id } = req.params;
    const { status } = req.body;

    const task = await Task.findByIdAndUpdate(id, { status }, { new: true });

    if (!task) return res.status(404).json({ message: "Task not found" });

    res.json({ message: "Task status updated", task });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
