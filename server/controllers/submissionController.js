import Submission from "../models/Submission.js";
import Problem from "../models/Problem.js";
import User from "../models/User.js";
import { executeCode } from "../services/jdoodleService.js";

export const createSubmission = async (req, res) => {
    try {
        const { problemId, language, code } = req.body;

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

        let passedTestCases = 0;
        const testCaseResults = [];

        // Run code for every test case
        for (const testCase of problem.testCases) {

            const result = await executeCode({
                language,
                code,
                stdin: testCase.input
            });

            const actualOutput = (result.output || "").trim();
            const expectedOutput = testCase.expectedOutput.trim();

            const passed =
                result.statusCode === 200 &&
                actualOutput === expectedOutput;

            if (passed) {
                passedTestCases++;
            }

            testCaseResults.push({
                input: testCase.isHidden
                    ? "Hidden Test Case"
                    : testCase.input,

                expectedOutput: testCase.isHidden
                    ? "Hidden"
                    : expectedOutput,

                actualOutput: testCase.isHidden
                    ? "Hidden"
                    : actualOutput,

                passed
            });
        }

        // Final status
        const status =
            passedTestCases === problem.testCases.length
                ? "Accepted"
                : "Wrong Answer";

        // Save submission
        const submission = await Submission.create({
            user: req.user.userId,
            problem: problemId,
            language,
            code,
            status,
            totalTestCases: problem.testCases.length,
            testCasesPassed: passedTestCases,
        });

        // =========================================
        // 🔥 UPDATE STREAK ONLY FOR ACCEPTED CODE
        // =========================================

        let updatedStreak = null;

        if (status === "Accepted") {
            const user = await User.findById(req.user.userId);

            if (user) {
                const today = new Date();

                // Time remove karke sirf date compare karenge
                today.setHours(0, 0, 0, 0);

                if (!user.lastSubmissionDate) {
                    // First accepted submission
                    user.streak = 1;
                } else {
                    const lastDate = new Date(user.lastSubmissionDate);

                    lastDate.setHours(0, 0, 0, 0);

                    const differenceInDays =
                        Math.floor(
                            (today - lastDate) /
                            (1000 * 60 * 60 * 24)
                        );

                    if (differenceInDays === 0) {
                        // Same day accepted again
                        // Streak remains same
                    } else if (differenceInDays === 1) {
                        // Consecutive day
                        user.streak += 1;
                    } else {
                        // User missed one or more days
                        user.streak = 1;
                    }
                }

                user.lastSubmissionDate = new Date();

                // Store solved problem only once
                if (
                    !user.solvedProblems.some(
                        (problemId) =>
                            problemId.toString() ===
                            problem._id.toString()
                    )
                ) {
                    user.solvedProblems.push(problem._id);
                }

                await user.save();

                updatedStreak = user.streak;
            }
        }

        return res.status(201).json({
            message: "Submission evaluated successfully",
            status,
            passedTestCases,
            totalTestCases: problem.testCases.length,
            testCaseResults,
            streak: updatedStreak,
            submission
        });

    } catch (error) {
        console.error(
            "Submission Error:",
            error.response?.data || error.message
        );

        return res.status(500).json({
            message: "Code execution failed",
            error: error.response?.data || error.message
        });
    }
};


export const runCode = async (req, res) => {
    try {
        const { language, code, stdin = "" } = req.body;

        if (!language || !code) {
            return res.status(400).json({
                message: "Language and code are required"
            });
        }

        const result = await executeCode({
            language,
            code,
            stdin
        });

        return res.status(200).json({
            message: "Code executed successfully",
            output: result.output || "",
            statusCode: result.statusCode,
            cpuTime: result.cpuTime,
            memory: result.memory,
            error: result.error || ""
        });

    } catch (error) {
        console.error(
            "Run Code Error:",
            error.response?.data || error.message
        );

        return res.status(500).json({
            message: "Code execution failed",
            error: error.response?.data || error.message
        });
    }
};


export const getMySubmissions = async (req, res) => {
    try {
        const submissions = await Submission.find({
            user: req.user.userId
        })
            .populate("problem", "title difficulty")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            count: submissions.length,
            submissions
        });

    } catch (error) {
        console.error(
            "Get Submission Error",
            error.message
        );

        return res.status(500).json({
            message: "Failed to fetch submission"
        });
    }
};


export const getProblemSubmissions = async (req, res) => {
    try {
        const { problemId } = req.params;

        const submissions = await Submission.find({
            user: req.user.userId,
            problem: problemId
        })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            count: submissions.length,
            submissions
        });

    } catch (error) {
        console.error(
            "Get Problem Submission Error:",
            error.message
        );

        return res.status(500).json({
            message: "Failed to fetch problem submission"
        });
    }
};


export const getSubmissionById = async (req, res) => {
    try {
        const { submissionId } = req.params;

        const submission = await Submission.findOne({
            _id: submissionId,
            user: req.user.userId
        })
            .populate("problem", "title difficulty");

        if (!submission) {
            return res.status(404).json({
                message: "Submission not found"
            });
        }

        return res.status(200).json({
            submission
        });

    } catch (error) {
        console.error(
            "Get Submission error:",
            error.message
        );

        return res.status(500).json({
            message: "Failed to fetch submission"
        });
    }
};


export const getProblemStats = async (req, res) => {
    try {
        const { problemId } = req.params;

        const totalSubmissions = await Submission.countDocuments({
            user: req.user.userId,
            problem: problemId
        });

        const acceptedSubmissions = await Submission.countDocuments({
            user: req.user.userId,
            problem: problemId,
            status: "Accepted"
        });

        const wrongAnswerSubmissions = await Submission.countDocuments({
            user: req.user.userId,
            problem: problemId,
            status: "Wrong Answer"
        });

        const acceptanceRate =
            totalSubmissions === 0
                ? 0
                : Number(
                    (
                        (acceptedSubmissions / totalSubmissions) * 100
                    ).toFixed(2)
                );

        return res.status(200).json({
            problemId,
            totalSubmissions,
            acceptedSubmissions,
            wrongAnswerSubmissions,
            acceptanceRate
        });

    } catch (error) {
        console.error(
            "Get Problem Stats Error:",
            error.message
        );

        return res.status(500).json({
            message: "Failed to fetch problem statistics"
        });
    }
};