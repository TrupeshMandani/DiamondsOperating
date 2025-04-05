import express from "express";
import { updateManagerProfile } from "../controllers/managerController.js";

const router = express.Router();

router.put("/update-profile", updateManagerProfile);

export default router;
