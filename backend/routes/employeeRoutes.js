import express from "express";
import {
  createEmployee,
  getEmployees,
  updateEmployee,
  deleteEmployee,
} from "../controllers/employeeController.js";
import { roleMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Employee CRUD routes
router.post("/", roleMiddleware(["Admin", "Manager"]), createEmployee);
router.get("/", roleMiddleware(["Admin", "Manager", "Employee"]), getEmployees);
router.put("/:id", roleMiddleware(["Admin", "Manager"]), updateEmployee);
router.delete("/:id", roleMiddleware(["Admin"]), deleteEmployee);

export default router;
