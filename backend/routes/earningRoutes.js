import express from "express";
import { getEmployeeEarnings } from "../controllers/earningController.js";

const router = express.Router();

router.get("/:employeeId", getEmployeeEarnings);

export default router;
