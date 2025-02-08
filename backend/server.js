import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connecDB from "./configurations/db";

dotenv.config();
const app = express();
connecDB();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Connected to the port ${PORT})`));
