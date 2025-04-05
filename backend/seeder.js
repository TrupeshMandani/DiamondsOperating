import mongoose from "mongoose";
import { faker } from "@faker-js/faker";
import Batch from "./models/batchModel.js"; // Adjust the path to your Batch model
const MONGO_URI =
  "mongodb+srv://Daddy:1234567890@cluster0.4zqac.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; // Change to your DB URI

const processes = ["Sarin", "Stitching", "4P Cutting"];

async function seedBatches(count = 10) {
  await mongoose.connect(MONGO_URI);
  console.log("Connected to MongoDB");

  const batches = [];

  for (let i = 0; i < count; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const currentProcess = faker.helpers.arrayElements(
      processes,
      faker.number.int({ min: 1, max: 3 })
    );

    const batch = new Batch({
      batchId: faker.string.alphanumeric(8).toUpperCase(),
      materialType: faker.helpers.arrayElement([
        "Rough",
        "Polished",
        "Synthetic",
      ]),
      firstName,
      lastName,
      email: faker.internet.email({ firstName, lastName }),
      phone: faker.phone.number("##########"),
      address: faker.location.streetAddress(),
      diamondWeight: faker.number.float({ min: 0.2, max: 5, precision: 0.01 }),
      diamondNumber: faker.number.int({ min: 1, max: 100 }),
      expectedDate: faker.date.soon({ days: 30 }),
      currentDate: new Date(),
      currentProcess,
      completedProcesses: faker.helpers.arrayElements(
        processes.filter((p) => !currentProcess.includes(p)),
        faker.number.int({ min: 0, max: 2 })
      ),
      processStartDate: faker.date.recent({ days: 10 }),
      status: faker.helpers.arrayElement(["Pending"]),
      progress: {
        Sarin: faker.number.int({ min: 0, max: 100 }),
        Stitching: faker.number.int({ min: 0, max: 100 }),
        "4P Cutting": faker.number.int({ min: 0, max: 100 }),
      },
      assignedEmployees: [], // optionally fill in if you have Employee data
    });

    batches.push(batch.save());
  }

  await Promise.all(batches);
  console.log(`${count} batches inserted!`);

  await mongoose.disconnect();
}

seedBatches(5); // You can change the number
