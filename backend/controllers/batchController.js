import QRCode from "qrcode";
import Batch from "../models/batchModel.js";
import Task from "../models/taskModel.js";
import Employee from "../models/Employee.js";
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
    currentProcess,
    assignedEmployee, // Optional
  } = req.body;

  try {
    let employee = null;

    // Check if assignedEmployee is provided
    if (assignedEmployee) {
      console.log("Received assignedEmployee ID:", assignedEmployee);

      // Validate if assignedEmployee is a valid MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(assignedEmployee)) {
        return res.status(400).json({ message: "Invalid employee ID format" });
      }

      // Find employee in the database
      employee = await Employee.findById(assignedEmployee);
      if (!employee) {
        return res.status(404).json({ message: "Assigned employee not found" });
      }
    }

    // Create batch without assignedEmployee if not provided
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
      assignedEmployee: assignedEmployee || null, // Allow null initially
      progress: {
        Sarin: 0,
        Stitching: 0,
        "4P Cutting": 0,
      },
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

    const validStages = ["Sarin", "Stitching", "4P Cutting"];

    // Validate if the stage is valid
    if (!validStages.includes(stage)) {
      return res.status(400).json({
        message: "Invalid stage",
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
    const tasks = await Task.find({ batchId: batch._id });

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
      diamondNumber, // ✅ Getting it from req.body
    } = req.body;

    console.log("Received Task Data:", req.body); // ✅ Debugging

    if (
      !batchId ||
      !employeeId ||
      !description ||
      !dueDate ||
      !priority ||
      !process ||
      rate === undefined ||
      diamondNumber === undefined // ✅ Ensure it's not missing
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const batch = await Batch.findOne({ batchId }).select(
      "batchId currentProcess"
    );
    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }

    const employee = await Employee.findById(employeeId).select(
      "firstName lastName"
    );
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    batch.currentProcess = process;
    await batch.save();

    // Assign the batch to the employee
    batch.assignedEmployee = employeeId;
    await batch.save();

    // Convert `rate` to a number (Fixes validation issue)
    const numericRate = Number(rate);
    if (isNaN(numericRate)) {
      return res.status(400).json({ message: "Invalid rate value" });
    }

    // Ensure `diamondNumber` is a number
    const numericDiamondNumber = Number(diamondNumber);
    if (isNaN(numericDiamondNumber)) {
      return res.status(400).json({ message: "Invalid diamondNumber value" });
    }

    // Ensure `process` is correctly passed and stored
    const task = new Task({
      batchId: batch._id,
      batchTitle: batch.batchId,
      employeeId: employee._id,
      employeeName: `${employee.firstName} ${employee.lastName}`,
      currentProcess: process,
      description,
      dueDate,
      priority,
      diamondNumber: numericDiamondNumber, // ✅ Now it's correctly assigned
      status: status || "Pending",
      assignedDate: new Date(),
      rate: numericRate, // ✅ Ensure rate is included
    });

    await task.save();

    res.status(200).json({
      message: "Batch assigned & task created successfully",
      task,
    });
  } catch (error) {
    console.error("Error assigning batch:", error.message);
    res
      .status(500)
      .json({ message: "Error assigning batch", error: error.message });
  }
};

export const getTasksForEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;

    console.log(`Fetching tasks for employee: ${employeeId}`);

    // Fetch tasks and include batch details
    const tasks = await Task.find({ employeeId }).populate(
      "batchId",
      "batchTitle currentProcess"
    );

    if (!tasks || tasks.length === 0) {
      return res
        .status(404)
        .json({ message: "No tasks found for this employee" });
    }

    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching employee tasks:", error.message);
    res
      .status(500)
      .json({ message: "Error fetching employee tasks", error: error.message });
  }
};
