import QRCode from "qrcode";
import fs from "fs";
import path from "path";
import Batch from "../models/batchModel.js";
import Task from "../models/taskModel.js";
import Employee from "../models/Employee.js";
import mongoose from "mongoose";

/**
 * NEW FUNCTION: generateAllQRCodes
 * Creates a .json file for every batch in the DB, storing each batch's QR code (base64) in ../frontend/public/qr-codes/{batchId}.json
 */
export const generateAllQRCodes = async (req, res) => {
  try {
    // 1) Get ALL batches from MongoDB
    const allBatches = await Batch.find();

    if (!allBatches.length) {
      return res.status(404).json({ message: "No batches found" });
    }

    // 2) For each batch, generate a QR code and write a .json file
    allBatches.forEach((batch) => {
      const batchData = {
        batchId: batch.batchId,
        customer: batch.firstName,
        currentProcess: batch.currentProcess,
        // You can add more fields if needed: diamondWeight, materialType, etc.
      };

      // Generate the QR code as a base64 data URL
      QRCode.toDataURL(JSON.stringify(batchData), (err, url) => {
        if (err) {
          console.error(`Error generating QR code for batchId: ${batch.batchId}`, err);
          return; // Continue with next batch
        }

        try {
          const qrCodesDir = path.join(process.cwd(), "../frontend/public/qr-codes");
          if (!fs.existsSync(qrCodesDir)) {
            fs.mkdirSync(qrCodesDir, { recursive: true });
          }
          const filePath = path.join(qrCodesDir, `${batch.batchId}.json`);

          const qrJson = {
            batchId: batch.batchId,
            qrCode: url,
          };

          fs.writeFileSync(filePath, JSON.stringify(qrJson, null, 2));
          console.log(`QR code JSON created for batch: ${batch.batchId}`);
        } catch (fileErr) {
          console.error(`Error writing JSON file for batchId: ${batch.batchId}`, fileErr);
        }
      });
    });

    // 3) Return success message
    res.json({ message: "QR code JSON files created for all existing batches." });
  } catch (error) {
    console.error("Error in generateAllQRCodes:", error);
    res.status(500).json({ message: "Server error while generating all QR codes" });
  }
};

// Generate QR code for a single batch
export const generateQRCode = async (req, res) => {
  try {
    // Fetch the batch by ID from MongoDB
    const batch = await Batch.findOne({ batchId: req.params.id });

    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }

    // Prepare the data you want to encode into the QR code
    const batchData = {
      batchId: batch.batchId,
      customer: batch.firstName,
      currentProcess: batch.currentProcess,
      // Optionally include more fields if you want them in the QR code:
      // materialType: batch.materialType,
      // diamondWeight: batch.diamondWeight,
      // diamondNumber: batch.diamondNumber,
      // status: batch.status,
    };

    // Convert the batch data to a string and generate the QR code (base64 data URL)
    QRCode.toDataURL(JSON.stringify(batchData), (err, url) => {
      if (err) {
        return res.status(500).json({ message: "Error generating QR code" });
      }

      // Save the generated QR code as a JSON file in ../frontend/public/qr-codes
      try {
        const qrCodesDir = path.join(process.cwd(), "../frontend/public/qr-codes");
        if (!fs.existsSync(qrCodesDir)) {
          fs.mkdirSync(qrCodesDir, { recursive: true });
        }
        const filePath = path.join(qrCodesDir, `${batch.batchId}.json`);

        const qrJson = {
          batchId: batch.batchId,
          qrCode: url, // e.g. data:image/png;base64,...
        };

        fs.writeFileSync(filePath, JSON.stringify(qrJson, null, 2));
      } catch (fileErr) {
        console.error("Error saving QR code JSON file:", fileErr);
        // If you want the request to fail if saving fails, you can:
        // return res.status(500).json({ message: "Error writing JSON file" });
      }

      // Return the QR code in the response
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

    // Create batch
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
    res.status(500).json({ message: "Failed to create batch", error: error.message });
  }
};

// Get all batches
export const getBatches = async (req, res) => {
  try {
    const batches = await Batch.find();
    res.json(batches);
  } catch (error) {
    res.status(500).json({ message: "Error fetching batches", error: error.message });
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
    res.status(500).json({ message: "Error fetching batch", error: error.message });
  }
};

// Get batch progress dynamically
export const getBatchProgress = async (req, res) => {
  try {
    const { id } = req.params;
    const batch = await Batch.findOne({ batchId: id });

    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }

    // Fetch tasks related to the batch
    const tasks = await Task.find({ batch_id: batch._id });

    // Count completed tasks
    const completedTasks = tasks.filter((task) => task.status === "Completed").length;
    const totalTasks = tasks.length;

    // Calculate progress percentage
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

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
    res.status(500).json({ message: "Error fetching batch progress", error: error.message });
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
      return res.status(404).json({ message: "Batch not found" });
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
      const currentIndex = validStages.indexOf(stage);
      if (currentIndex < validStages.length - 1) {
        batch.currentProcess = validStages[currentIndex + 1];
      } else {
        batch.status = "Completed";
      }
    }

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

// Assign batch to employee
export const assignBatchToEmployee = async (req, res) => {
  const { batchId, employeeId } = req.body;

  try {
    const batch = await Batch.findOne({ batchId });
    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }

    // Use the `new` keyword to instantiate the ObjectId
    const employee = await Employee.findById(new mongoose.Types.ObjectId(employeeId));
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    batch.assignedEmployee = employeeId;
    await batch.save();

    res.status(200).json({ message: "Batch assigned to employee successfully", batch });
  } catch (error) {
    res.status(500).json({ message: "Error assigning batch", error: error.message });
  }
};
