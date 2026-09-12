import express from "express";

import register, {
  login,
  getMe,
  forgotPassword,
  verifyResetOtp,
  resetPassword,
} from "../controllers/authController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Register
router.post("/register", register);

// Login
router.post("/login", login);

// Forgot Password
router.post("/forgot-password", forgotPassword);

// Verify OTP
router.post("/verify-reset-otp", verifyResetOtp);

// Reset Password
router.post("/reset-password", resetPassword);

// Get Current User
router.get("/me", authMiddleware, getMe);

export default router;