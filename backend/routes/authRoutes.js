import express from "express";
import { login, register ,updatePassword} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.post("/update-password", updatePassword);


export default router;
