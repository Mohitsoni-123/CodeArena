import Submission from "../models/Submission.js";
import Problem from "../models/Problem.js";
import { executeCode } from "../services/jdoodleService.js";

export const createSubmission = async (req, res) => {
    try {
        const { problemId, language, code, stdin = "" } = req.body;

        // Check required fields
        if (!problemId || !language || !code) {
            return res.status(400).json({
                message: "Problem ID, language and code are required"
            });
        }

        // Check problem
        const problem = await Problem.findById(problemId);

        if (!problem) {
            return res.status(404).json({
                message: "Problem not found"
            });
        }

        // Execute code using JDoodle
        const result = await executeCode({
            language,
            code,
            stdin
        });

        // Decide status
        const status =
            result.statusCode === 200 ? "Accepted" : "Error";

        // Create submission
        const submission = await Submission.create({
            user: req.user.userId,
            problem: problemId,
            language,
            code,
            status,
            totalTestCases: problem.testCases.length
        });

        res.status(201).json({
            message: "Code executed successfully",
            submission,
            result
        });

    } catch (error) {
        console.error(
            "Create Submission Error:",
            error.response?.data || error.message
        );

        res.status(500).json({
            message: "Code execution failed",
            error: error.response?.data || error.message
        });
    }
};