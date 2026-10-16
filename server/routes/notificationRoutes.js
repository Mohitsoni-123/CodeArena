import express from "express";
import {
  getMyNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearNotifications,
} from "../controllers/notificationController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Sab routes login wale user ke liye hain
router.use(authMiddleware);

// Fixed paths pehle, /:id wale baad me
router.get("/unread-count", getUnreadCount);
router.patch("/read-all", markAllAsRead);

router.get("/", getMyNotifications);
router.delete("/", clearNotifications);

router.patch("/:id/read", markAsRead);
router.delete("/:id", deleteNotification);

export default router;
