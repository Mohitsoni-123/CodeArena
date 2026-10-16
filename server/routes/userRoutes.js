import express from "express";
import {
  getProfile,
  updateProfile,
  changePassword,
} from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/me/profile", getProfile);
router.put("/me", updateProfile);
router.put("/me/password", changePassword);

export default router;
