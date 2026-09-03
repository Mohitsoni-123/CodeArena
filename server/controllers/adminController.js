import User from "../models/User.js";
import Problem from "../models/Problem.js";
import Submission from "../models/Submission.js";

export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    const totalProblems = await Problem.countDocuments();

    const totalSubmissions = await Submission.countDocuments();

    const acceptedSubmissions = await Submission.countDocuments({
      status: "Accepted",
    });

    return res.status(200).json({
      totalUsers,
      totalProblems,
      totalSubmissions,
      acceptedSubmissions,
    });
  } catch (error) {
    console.error("Admin Dashboard Error:", error.message);

    return res.status(500).json({
      message: "Failed to fetch dashboard statistics",
    });
  }
};