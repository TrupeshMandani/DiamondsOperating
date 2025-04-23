import QRCode from "qrcode";
import Batch from "../models/batchModel.js";
import Task from "../models/taskModel.js";
import Employee from "../models/Employee.js";
import sendEmail from "../configurations/sendEmail.js";
import mongoose from "mongoose";

// Generate QR code for batch details
export const generateQRCode = async (req, res) => {
  try {
    // Fetch the batch by ID from MongoDB
    const batch = await Batch.findOne({ batchId: req.params.id });

    if (!batch) {
      return res.status(404).json({ message: "Batch not found1" });
    }

    // Prepare the data you want to encode into the QR code (for example, the batch information)
    const batchData = {
      batchNumber: batch.batchId,
      customer: batch.firstName,
      currentProcess: batch.currentProcess,
      selectedProcesses: batch.selectedProcesses || [batch.currentProcess],
    };

    // Convert the batch data to a string and generate the QR code
    QRCode.toDataURL(JSON.stringify(batchData), (err, url) => {
      if (err) {
        return res.status(500).json({ message: "Error generating QR code" });
      }

      // Send the generated QR code as a response
      res.json({ qrCode: url });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while generating QR code" });
  }
};

// Create a new batch
export const createBatch = async (req, res) => {
  const {
    batchId,
    materialType,
    firstName,
    lastName,
    email,
    phone,
    address,
    diamondWeight,
    diamondNumber,
    expectedDate,
    currentProcess, // This will now be an array
    assignedEmployee, // Optional
  } = req.body;

  try {
    let employee = null;

    if (assignedEmployee) {
      if (!mongoose.Types.ObjectId.isValid(assignedEmployee)) {
        return res.status(400).json({ message: "Invalid employee ID format" });
      }

      employee = await Employee.findById(assignedEmployee);
      if (!employee) {
        return res.status(404).json({ message: "Assigned employee not found" });
      }
    }

    // Create batch with multiple processes
    const newBatch = new Batch({
      batchId,
      materialType,
      firstName,
      lastName,
      email,
      phone,
      address,
      diamondWeight,
      diamondNumber,
      expectedDate,
      currentProcess, // Store multiple selected processes
      processStartDate: new Date(),
      status: "Pending",
      assignedEmployee: assignedEmployee || null,
      progress: currentProcess.reduce((acc, process) => {
        acc[process] = 0;
        return acc;
      }, {}),
    });

    await newBatch.save();
    res.status(201).json({
      message: "Batch created successfully",
      batch: newBatch,
    });
  } catch (error) {
    console.error("Error creating batch:", error.message);
    res
      .status(500)
      .json({ message: "Failed to create batch", error: error.message });
  }
};

// Get all batches
export const getBatches = async (req, res) => {
  try {
    const batches = await Batch.find();
    res.json(batches);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching batches", error: error.message });
  }
};

// Get Batch By Id
export const getBatchByID = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch batch details by batchId
    const batch = await Batch.findOne({ batchId: id });

    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }

    res.json({
      batchId: batch.batchId,
      materialType: batch.materialType,
      customer: `${batch.firstName} ${batch.lastName}`,
      email: batch.email,
      phone: batch.phone,
      address: batch.address,
      diamondWeight: batch.diamondWeight,
      diamondNumber: batch.diamondNumber,
      expectedDate: batch.expectedDate,
      currentDate: batch.currentDate,
      currentProcess: batch.currentProcess,
      selectedProcesses: batch.selectedProcesses || [batch.currentProcess], // Include selected processes
      status: batch.status,
      progress: batch.progress,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching batch", error: error.message });
  }
};

// Get batch progress dynamically
export const getBatchProgress = async (req, res) => {
  try {
    const { id } = req.params;
    const batch = await Batch.findOne({ batchId: id });

    if (!batch) {
      return res.status(404).json({ message: "Batch not found 3" });
    }

    // Fetch tasks related to the batch
    const tasks = await Task.find({ batch_id: batch._id });

    // Count completed tasks
    const completedTasks = tasks.filter(
      (task) => task.status === "Completed"
    ).length;
    const totalTasks = tasks.length;

    // Calculate progress percentage
    const progress =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    res.json({
      batchId: batch.batchId,
      materialType: batch.materialType,
      currentProcess: batch.currentProcess,
      selectedProcesses: batch.selectedProcesses || [batch.currentProcess],
      status: batch.status,
      totalTasks,
      completedTasks,
      progress: `${progress}%`,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching batch progress", error: error.message });
  }
};

// Update batch details
export const updateBatch = async (req, res) => {
  try {
    const { id } = req.params; // Batch ID from URL
    const { stage, progress } = req.body; // Stage and progress value from body

    // Fetch the batch by batchId
    const batch = await Batch.findOne({ batchId: id });
    if (!batch) {
      return res.status(404).json({ message: "Batch not found 11" });
    }

    const validStages = batch.selectedProcesses || [
      "Sarin",
      "Stitching",
      "4P Cutting",
    ];

    // Validate if the stage is valid for this batch
    if (!validStages.includes(stage)) {
      return res.status(400).json({
        message: "Invalid stage for this batch",
        validStages: validStages,
      });
    }

    // Update the batch progress for the specific stage
    batch.progress[stage] = progress;

    // If progress for the current stage is 100%, move to the next stage
    if (progress === 100) {
      // Determine the next stage
      const currentIndex = validStages.indexOf(stage);
      if (currentIndex < validStages.length - 1) {
        batch.currentProcess = validStages[currentIndex + 1]; // Set the next process
      } else {
        batch.status = "Completed"; // Mark the batch as completed if all stages are finished
      }
    }

    // Save the batch with updated progress and status
    await batch.save();

    // Send response with the updated batch
    res.json({
      message: `Batch progress updated for stage ${stage}`,
      batch,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error updating the batch progress",
      error: error.message,
    });
  }
};

//get batch for employee
export const getTasksForBatch = async (req, res) => {
  try {
    const { id } = req.params;

    console.log(`Fetching tasks for batch: ${id}`); // Debugging

    // Find the batch using its batchId (which is a string)
    const batch = await Batch.findOne({ batchId: id });

    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }

    // Fetch tasks using the found batch's ObjectId

    const tasks = await Task.find({ batchId: batch._id }).select(
      "+status +partialReason"
    );

    if (!tasks || tasks.length === 0) {
      return res.status(404).json({ message: "No tasks found for this batch" });
    }

    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error.message);
    res
      .status(500)
      .json({ message: "Error fetching tasks", error: error.message });
  }
};

export const assignBatchToEmployee = async (req, res) => {
  try {
    const {
      batchId,
      employeeId,
      description,
      dueDate,
      priority,
      status,
      process,
      rate,
      diamondNumber,
    } = req.body;

    console.log("Received Task Data:", req.body);

    if (
      !batchId ||
      !employeeId ||
      !description ||
      !dueDate ||
      !priority ||
      !process ||
      rate === undefined
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Find the batch
    const batch = await Batch.findOne({ batchId });
    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }

    // Check if the process is valid for the batch
    if (!batch.currentProcess.includes(process)) {
      return res.status(400).json({
        message: `Process "${process}" is not available for this batch`,
        availableProcesses: batch.currentProcess,
      });
    }

    // Find the employee
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Check for existing tasks for this batch + process
    const existingTasks = await Task.find({
      batchId: batch._id,
      process: process,
    });

    // If completed task exists, block
    const completedTask = existingTasks.find((t) => t.status === "Completed");
    if (completedTask) {
      return res.status(400).json({
        message: `Task for process "${process}" is already completed for this batch.`,
      });
    }

    // If partially completed, calculate remaining diamonds
    const partialTask = existingTasks.find(
      (t) => t.status === "Partially Completed"
    );
    let remainingDiamonds = batch.diamondNumber;

    if (partialTask) {
      remainingDiamonds =
        batch.diamondNumber - partialTask.partialDiamondNumber;
    }

    // Calculate task earnings
    const taskEarnings = remainingDiamonds * rate;

    // Create new task with all required fields
    const newTask = new Task({
      batchId: batch._id,
      batchTitle: batch.batchId,
      employeeId,
      employeeName: `${employee.firstName} ${employee.lastName}`,
      description,
      dueDate,
      priority,
      status: status || "Pending",
      process,
      currentProcess: process,
      rate,
      diamondNumber: remainingDiamonds,
      taskEarnings,
      assignedDate: new Date(),
    });

    await newTask.save();

    // Update batch status
    batch.status = "Assigned";
    batch.assignedEmployees.push({ employeeId, process });
    await batch.save();

    // Send email notification
    await sendEmail({
      to: employee.email,
      subject: "New Task Assigned",
      text: `Hello ${employee.firstName},

You have been assigned a new task for batch ${batch.batchId}.

Process: ${process}
Description: ${description}
Due Date: ${new Date(dueDate).toLocaleDateString()}

Please log in to the system to view and start your task.

Thanks,
Diamond Management System`,
    });

    // Send real-time update
    if (req.io) {
      req.io.emit("taskAssigned", newTask);
    }

    res.status(201).json({
      message: "Task assigned successfully",
      task: newTask,
    });
  } catch (error) {
    console.error("Error assigning task:", error);
    res.status(500).json({
      message: "Error assigning task",
      error: error.message,
    });
  }
};

export const getTasksForEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;
    console.log(`Fetching tasks for employee: ${employeeId}`);

    const tasks = await Task.find({ employeeId }).populate(
      "batchId",
      "batchTitle currentProcess selectedProcesses"
    );

    if (!tasks || tasks.length === 0) {
      return res
        .status(404)
        .json({ message: "No tasks found for this employee" });
    }

    // Emit WebSocket event to notify that tasks have been fetched
    req.io.emit(`tasksFetched-${employeeId}`, {
      message: "Your tasks have been updated!",
      tasks,
    });

    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching employee tasks:", error.message);
    res
      .status(500)
      .json({ message: "Error fetching employee tasks", error: error.message });
  }
};

// Update task status
