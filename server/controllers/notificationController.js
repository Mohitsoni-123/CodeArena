import mongoose from "mongoose";
import Notification from "../models/Notification.js";

// GET /api/notifications?unread=true&limit=30
export const getMyNotifications = async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 30, 100);

    const filter = { user: req.user.id };

    if (req.query.unread === "true") {
      filter.isRead = false;
    }

    const [notifications, unreadCount] = await Promise.all([
      Notification.find(filter).sort({ createdAt: -1 }).limit(limit),
      Notification.countDocuments({ user: req.user.id, isRead: false }),
    ]);

    return res.status(200).json({
      count: notifications.length,
      unreadCount,
      notifications,
    });
  } catch (error) {
    console.error("Get Notifications Error:", error.message);

    return res.status(500).json({
      message: "Failed to fetch notifications",
    });
  }
};

// GET /api/notifications/unread-count
export const getUnreadCount = async (req, res) => {
  try {
    const unreadCount = await Notification.countDocuments({
      user: req.user.id,
      isRead: false,
    });

    return res.status(200).json({ unreadCount });
  } catch (error) {
    console.error("Unread Count Error:", error.message);

    return res.status(500).json({
      message: "Failed to fetch unread count",
    });
  }
};

// PATCH /api/notifications/:id/read
export const markAsRead = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid notification id" });
    }

    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { isRead: true },
      { new: true },
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    return res.status(200).json({ notification });
  } catch (error) {
    console.error("Mark Read Error:", error.message);

    return res.status(500).json({
      message: "Failed to update notification",
    });
  }
};

// PATCH /api/notifications/read-all
export const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user.id, isRead: false },
      { isRead: true },
    );

    return res.status(200).json({ message: "All notifications marked as read" });
  } catch (error) {
    console.error("Mark All Read Error:", error.message);

    return res.status(500).json({
      message: "Failed to update notifications",
    });
  }
};

// DELETE /api/notifications/:id
export const deleteNotification = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid notification id" });
    }

    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    return res.status(200).json({ message: "Notification deleted" });
  } catch (error) {
    console.error("Delete Notification Error:", error.message);

    return res.status(500).json({
      message: "Failed to delete notification",
    });
  }
};

// DELETE /api/notifications
export const clearNotifications = async (req, res) => {
  try {
    await Notification.deleteMany({ user: req.user.id });

    return res.status(200).json({ message: "All notifications cleared" });
  } catch (error) {
    console.error("Clear Notifications Error:", error.message);

    return res.status(500).json({
      message: "Failed to clear notifications",
    });
  }
};
