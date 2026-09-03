import express from "express";
import { getDashboardStats } from "../controllers/adminController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

// Admin Dashboard Stats
router.get(
  "/stats",
  authMiddleware,
  adminMiddleware,
  getDashboardStats
);

export default router;