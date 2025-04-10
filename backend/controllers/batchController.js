import QRCode from "qrcode";
import Batch from "../models/batchModel.js";
import Task from "../models/taskModel.js";
import Employee from "../models/Employee.js";
import sendEmail from "../configurations/sendEmail.js";
import mongoose from "mongoose";

// Generate QR code for batch details
export const generateQRCode = async (req, res) => {
  try {
    const batch = await Batch.findOne({ batchId: req.params.id });

    if (!batch) {
      return res.status(404).json({ message: "Batch not found1" });
    }

    const batchData = {
      batchNumber: batch.batchId,
      customer: batch.firstName,
      currentProcess: batch.currentProcess,
      selectedProcesses: batch.selectedProcesses || [batch.currentProcess],
    };

    QRCode.toDataURL(JSON.stringify(batchData), (err, url) => {
      if (err) {
        return res.status(500).json({ message: "Error generating QR code" });
      }
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
    currentProcess,
    assignedEmployee,
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
      currentProcess,
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
      selectedProcesses: batch.selectedProcesses || [batch.currentProcess],
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

    const tasks = await Task.find({ batch_id: batch._id });
    const completedTasks = tasks.filter(
      (task) => task.status === "Completed"
    ).length;
    const totalTasks = tasks.length;
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
    const { id } = req.params;
    const { stage, progress } = req.body;

    const batch = await Batch.findOne({ batchId: id });
    if (!batch) {
      return res.status(404).json({ message: "Batch not found 11" });
    }

    const validStages = batch.selectedProcesses || [
      "Sarin",
      "Stitching",
      "4P Cutting",
    ];
    if (!validStages.includes(stage)) {
      return res.status(400).json({
        message: "Invalid stage for this batch",
        validStages: validStages,
      });
    }

    batch.progress[stage] = progress;

    if (progress === 100) {
      const currentIndex = validStages.indexOf(stage);
      if (currentIndex < validStages.length - 1) {
        batch.currentProcess = validStages[currentIndex + 1];
      } else {
        batch.status = "Completed";
      }
    }

    await batch.save();

    res.json({
      message: `Batch progress updated for stage ${stage}`,
      batch,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        message: "Error updating the batch progress",
        error: error.message,
      });
  }
};

// Get tasks for a batch
export const getTasksForBatch = async (req, res) => {
  try {
    const { id } = req.params;
    const batch = await Batch.findOne({ batchId: id });

    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }

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

// Assign batch and create task
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

    if (
      !batchId ||
      !employeeId ||
      !description ||
      !dueDate ||
      !priority ||
      !process ||
      rate === undefined ||
      diamondNumber === undefined
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const batch = await Batch.findOne({ batchId });
    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }

    if (!batch.currentProcess.includes(process)) {
      return res.status(400).json({
        message: `Process "${process}" is not available for this batch`,
        availableProcesses: batch.currentProcess,
      });
    }

    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    batch.assignedEmployees.push({ employeeId, process });

    const existingTasks = await Task.find({
      batchId: batch._id,
      currentProcess: process,
    });
    const completedTask = existingTasks.find((t) => t.status === "Completed");

    if (completedTask) {
      return res.status(400).json({
        message: `Task for process "${process}" is already completed for this batch.`,
      });
    }

    const partialTask = existingTasks.find(
      (t) => t.status === "Partially Completed"
    );
    if (partialTask) {
      const remaining =
        partialTask.diamondNumber - (partialTask.partialDiamondNumber || 0);
      if (diamondNumber > remaining) {
        return res.status(400).json({
          message: `Only ${remaining} diamonds remaining for this process.`,
        });
      }
    }

    const numericRate = Number(rate);
    const numericDiamondNumber = Number(diamondNumber);
    const taskearnings = numericRate * numericDiamondNumber;

    const task = new Task({
      batchId: batch._id,
      batchTitle: batch.batchId,
      employeeId: employee._id,
      employeeName: `${employee.firstName} ${employee.lastName}`,
      currentProcess: process,
      description,
      dueDate,
      priority,
      diamondNumber: numericDiamondNumber,
      status: status || "Pending",
      assignedDate: new Date(),
      rate: numericRate,
      taskEarnings: taskearnings,
    });

    const savedTask = await task.save();

    // ✅ Update batch status
    await updateBatchAssignmentStatus(batch);

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

    req.io.emit("taskAssigned", {
      message: "A new task has been assigned!",
      task: savedTask,
    });

    res.status(200).json({
      message: "Batch assigned & task created successfully",
      task: savedTask,
    });
  } catch (error) {
    console.error("Error assigning batch:", error.message);
    res
      .status(500)
      .json({ message: "Error assigning batch", error: error.message });
  }
};

// Fetch tasks by employee
export const getTasksForEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const tasks = await Task.find({ employeeId }).populate(
      "batchId",
      "batchTitle currentProcess selectedProcesses"
    );

    if (!tasks || tasks.length === 0) {
      return res
        .status(404)
        .json({ message: "No tasks found for this employee" });
    }

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

// ✅ Helper to update batch status based on assigned processes
const updateBatchAssignmentStatus = async (batch) => {
  const allTasks = await Task.find({ batchId: batch._id });
  const allProcessesAssigned = batch.currentProcess.every((proc) =>
    allTasks.some((task) => task.currentProcess === proc)
  );
  batch.status = allProcessesAssigned ? "Assigned" : "Pending";
  await batch.save();
};
