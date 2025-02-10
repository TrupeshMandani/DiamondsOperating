import QRCode from "qrcode";
import Batch from "../models/batchModel.js";

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
      customer: batch.customerName,
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
  const { batchId, materialType, customerName, customerContact, currentProcess } = req.body;

  try {
    const newBatch = new Batch({
      batchId,
      materialType,
      customerName,
      customerContact,
      currentProcess,
    });

    await newBatch.save();
    res.status(201).json({ message: "Batch created successfully", batch: newBatch });
  } catch (error) {
    res.status(500).json({ message: "Failed to create batch", error: error.message });
  }
};
