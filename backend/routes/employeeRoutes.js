import express from "express";
import {
  createEmployee,
  getEmployees,
  updateEmployee,
  deleteEmployee,
} from "../controllers/employeeController.js";
import {
  roleMiddleware,
  authMiddleware,
} from "../middleware/authMiddleware.js";
import { register } from "../controllers/authController.js";

const router = express.Router();

router.use(authMiddleware);

// Employee CRUD routes

router.post("/", roleMiddleware(["Admin", "Manager"]), createEmployee);

router.get("/", roleMiddleware(["Admin", "Manager", "Employee"]), getEmployees);

router.put("/:id", roleMiddleware(["Admin", "Manager"]), updateEmployee);

router.delete("/:id", roleMiddleware(["Admin"]), deleteEmployee);

export default router;
