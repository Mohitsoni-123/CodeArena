import Notification from "../models/Notification.js";

// Kahi se bhi notification banane ke liye. Kabhi error throw nahi karta,
// taaki notification fail hone se submission / register na ruke.
export const createNotification = async ({
  user,
  type = "info",
  title,
  message = "",
  link = "",
}) => {
  try {
    if (!user || !title) return null;

    return await Notification.create({ user, type, title, message, link });
  } catch (error) {
    console.error("Create Notification Error:", error.message);
    return null;
  }
};

