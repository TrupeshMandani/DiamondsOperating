import mongoose from "mongoose";

const connecDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connection successful");
  } catch (error) {
    console.log("Error: ", error.message);
    process.exit(1);
  }
};

export default connecDB;
