import express from "express";
import {
  createEmployee,
  getEmployees,
  updateEmployee,
  deleteEmployee,
  getEmployeeBatches,
  getEmployeeById,
} from "../controllers/employeeController.js";

const router = express.Router();

// Employee CRUD routes

router.post("/", createEmployee);

router.get("/", getEmployees);

router.put("/:id", updateEmployee);

router.delete("/:id", deleteEmployee);
router.get(
  "/:id",

  getEmployeeBatches
);
router.get("/id/:id", getEmployeeById);
export default router;
