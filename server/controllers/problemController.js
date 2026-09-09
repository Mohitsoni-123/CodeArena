import Problem from "../models/Problem.js";
import Submission from "../models/Submission.js";
import User from "../models/User.js";

export const createProblem = async (req, res) => {
  try {
    const {
      title,
      description,
      difficulty,
      topics,
      example,
      constraints,
      starterCode,
      testCases,
    } = req.body;

    if (!title || !description || !difficulty) {
      return res.status(400).json({
        message: "Title, description and difficulty are required",
      });
    }
    const problem = await Problem.create({
      title,
      description,
      difficulty,
      topics,
      example,
      constraints,
      starterCode,
      testCases,
      createdBy: req.user.userId,
    });
    res.status(201).json({
      message: "Problem created successfully",
      problem,
    });
  } catch (error) {
    console.error("Create Problem Error:", error.message);
    res.status(500).json({
      message: "Server error",
    });
  }
};

export const getProblems = async (req, res) => {
  try {
    const problems = await Problem.find()
      .select("-testCases")
      .sort({ createdAt: -1 });
    res.status(200).json({
      count: problems.length,
      problems,
    });
  } catch (error) {
    console.error("Get Problem Error:", error.message);
    res.status(500).json({
      message: "Server error",
    });
  }
};

export const getProblemById = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id).select("-testCases");

    if (!problem) {
      return res.status(404).json({
        message: "Problem not found",
      });
    }

    res.status(200).json({
      problem,
    });
  } catch (error) {
    console.error("Get Problem Error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

export const updateProblem = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);

    if (!problem) {
      return res.status(404).json({
        message: "Problem not found",
      });
    }

    // Update problem fields
    Object.assign(problem, req.body);

    // Increase version whenever problem is edited
    problem.version = (problem.version || 1) + 1;

    await problem.save();

    return res.status(200).json({
      message: "Problem updated successfully",
      problem,
    });
  } catch (error) {
    console.error("Update Problem Error:", error.message);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const deleteProblem = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);

    if (!problem) {
      return res.status(404).json({
        message: "Problem not found",
      });
    }

    // Remove this problem from every user's solvedProblems
    await User.updateMany(
      { solvedProblems: problem._id },
      {
        $pull: {
          solvedProblems: problem._id,
        },
      },
    );

    // Remove submissions related to this problem
    await Submission.deleteMany({
      problem: problem._id,
    });

    await Problem.findByIdAndDelete(problem._id);

    return res.status(200).json({
      message: "Problem deleted successfully",
    });
  } catch (error) {
    console.error("Delete Problem Error:", error.message);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const getAdminProblemById = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);

    if (!problem) {
      return res.status(404).json({
        message: "Problem not found",
      });
    }

    res.status(200).json({
      problem,
    });
  } catch (error) {
    console.error("Get Admin Problem Error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};
