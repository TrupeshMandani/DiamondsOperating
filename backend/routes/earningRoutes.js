import express from "express";
import {
  getMonthlyEarnings,
  getSpecificMonthEarnings,
  getYearlyEarnings,
  postMonthlyEarnings,
} from "../controllers/earningController.js";

const router = express.Router();

router.get("/:employeeId/monthly", getMonthlyEarnings);
router.get("/:employeeId/yearly", getYearlyEarnings);
router.get("/:employeeId/:month/:year", getSpecificMonthEarnings);
router.post("/post", postMonthlyEarnings);
export default router;
