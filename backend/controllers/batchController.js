import QRCode from "qrcode";
import Batch from "../models/batchModel.js";
import Task from "../models/taskModel.js";

// Generate QR code for batch details
export const generateQRCode = async (req, res) => {
  try {
    // Fetch the batch by ID from MongoDB
    const batch = await Batch.findOne({ batchId: req.params.id });

    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
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
    diamondNumber = req.body.numOfDiamonds, // Fixed field name
    expectedDate,
    currentDate,
    currentProcess,
  } = req.body;

  try {
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
      currentDate,
      currentProcess,
      processStartDate: new Date(),
      status: "Pending",
      progress: {
        Sarin: 0,
        Stitching: 0,
        "4P Cutting": 0,
      },
    });

    await newBatch.save();
    res
      .status(201)
      .json({ message: "Batch created successfully", batch: newBatch });
  } catch (error) {
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
      return res.status(404).json({ message: "Batch not found" });
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
