import express from "express";
import {
  getMonthlyEarnings,
  getYearlyEarnings,
} from "../controllers/earningController.js";

const router = express.Router();

router.get("/:employeeId/monthly", getMonthlyEarnings);
router.get("/:employeeId/yearly", getYearlyEarnings);

export default router;
