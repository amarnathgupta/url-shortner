import { Router } from "express";
import { loginUser, logoutUser, registerUser } from "../controllers/user.controllers.js";

const router = Router();

// Register a new user
router.post("/register", registerUser);

// User login
router.post("/login", loginUser);

// User logout
router.post("/logout", logoutUser);

export default router;
