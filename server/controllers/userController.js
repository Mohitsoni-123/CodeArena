import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Problem from "../models/Problem.js";
import Submission from "../models/Submission.js";

// GET /api/users/me/profile
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select(
      "name email role streak createdAt solvedProblems",
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const [
      totalByDifficulty,
      solvedProblems,
      totalSubmissions,
      acceptedSubmissions,
      recentSubmissions,
    ] = await Promise.all([
      Problem.aggregate([{ $group: { _id: "$difficulty", count: { $sum: 1 } } }]),

      Problem.find({ _id: { $in: user.solvedProblems } }).select("difficulty"),

      Submission.countDocuments({ user: userId }),

      Submission.countDocuments({ user: userId, status: "Accepted" }),

      Submission.find({ user: userId })
        .select("-code")
        .sort({ createdAt: -1 })
        .limit(8)
        .populate("problem", "title difficulty"),
    ]);

    const total = { Easy: 0, Medium: 0, Hard: 0 };

    totalByDifficulty.forEach((item) => {
      if (total[item._id] !== undefined) total[item._id] = item.count;
    });

    const solved = { Easy: 0, Medium: 0, Hard: 0 };

    solvedProblems.forEach((problem) => {
      if (solved[problem.difficulty] !== undefined) {
        solved[problem.difficulty] += 1;
      }
    });

    const acceptanceRate =
      totalSubmissions === 0
        ? 0
        : Math.round((acceptedSubmissions / totalSubmissions) * 100);

    return res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        streak: user.streak,
        createdAt: user.createdAt,
      },
      stats: {
        solved,
        total,
        solvedCount: solvedProblems.length,
        totalProblems: total.Easy + total.Medium + total.Hard,
        totalSubmissions,
        acceptedSubmissions,
        acceptanceRate,
      },
      recentSubmissions,
    });
  } catch (error) {
    console.error("Get Profile Error:", error.message);

    return res.status(500).json({ message: "Failed to fetch profile" });
  }
};

// PUT /api/users/me   { name }
export const updateProfile = async (req, res) => {
  try {
    const name = (req.body.name || "").trim();

    if (name.length < 2 || name.length > 50) {
      return res.status(400).json({
        message: "Name must be between 2 and 50 characters",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name },
      { new: true },
    ).select("name email role streak createdAt");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.error("Update Profile Error:", error.message);

    return res.status(500).json({ message: "Failed to update profile" });
  }
};

// PUT /api/users/me/password   { currentPassword, newPassword }
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Current password and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "New password must be at least 6 characters",
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const match = await bcrypt.compare(currentPassword, user.password);

    if (!match) {
      return res.status(400).json({
        message: "Current password is incorrect",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);

    await user.save();

    return res.status(200).json({
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change Password Error:", error.message);

    return res.status(500).json({ message: "Failed to change password" });
  }
};
