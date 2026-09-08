import Submission from "../models/Submission.js";
import Problem from "../models/Problem.js";
import User from "../models/User.js";
import { executeCode } from "../services/jdoodleService.js";

export const createSubmission = async (req, res) => {
  try {
    const { problemId, language, code } = req.body;

    if (!problemId || !language || !code) {
      return res.status(400).json({
        message: "Problem ID, language and code are required",
      });
    }

    const problem = await Problem.findById(problemId);

    if (!problem) {
      return res.status(404).json({
        message: "Problem not found",
      });
    }

    const examples = Array.isArray(problem.example) ? problem.example : [];

    const testCases = Array.isArray(problem.testCases) ? problem.testCases : [];

    if (examples.length === 0 && testCases.length === 0) {
      return res.status(400).json({
        message: "This problem has no test cases",
      });
    }

    // =========================================
    // COMBINE EXAMPLES + TEST CASES
    // =========================================

    const allTestCases = [
      ...examples.map((example, index) => ({
        type: "Example",
        number: index + 1,
        input: example.input,
        expectedOutput: example.output,
        isHidden: false,
      })),

      ...testCases.map((testCase, index) => ({
        type: "Test Case",
        number: index + 1,
        input: testCase.input,
        expectedOutput: testCase.expectedOutput,
        isHidden: testCase.isHidden,
      })),
    ];

    let passedTestCases = 0;
    let finalStatus = "Accepted";

    let totalRuntime = 0;
    let totalMemory = 0;
    let submissionError = "";

    const testCaseResults = [];

    // =========================================
    // RUN ALL EXAMPLES + TEST CASES
    // =========================================

    for (const testCase of allTestCases) {
      const result = await executeCode({
        language,
        code,
        stdin: testCase.input,
      });

      const actualOutput = (result.output || "").trim();
      const expectedOutput = (testCase.expectedOutput || "").trim();

      totalRuntime += Number(result.cpuTime || 0);

      totalMemory = Math.max(totalMemory, Number(result.memory || 0));

      let passed = false;
      let status = "Wrong Answer";
      let error = "";

      // =========================================
      // COMPILATION ERROR
      // =========================================

      if (result.statusCode !== 200) {
        finalStatus = "Compilation Error";

        submissionError = result.error || "Compilation error";

        status = "Compilation Error";
        error = result.error || "Compilation error";
      }

      // =========================================
      // RUNTIME ERROR
      // =========================================
      else if (result.error) {
        finalStatus = "Runtime Error";

        submissionError = result.error;

        status = "Runtime Error";
        error = result.error;
      }

      // =========================================
      // OUTPUT CHECK
      // =========================================
      else {
        passed = actualOutput === expectedOutput;

        if (passed) {
          passedTestCases++;
          status = "Accepted";
        } else {
          if (finalStatus === "Accepted") {
            finalStatus = "Wrong Answer";
          }

          status = "Wrong Answer";
        }
      }

      // =========================================
      // HIDDEN TEST CASE SECURITY
      // =========================================

      testCaseResults.push({
        type: testCase.type,
        number: testCase.number,

        input: testCase.isHidden ? "Hidden Test Case" : testCase.input,

        expectedOutput: testCase.isHidden ? "Hidden" : expectedOutput,

        actualOutput: testCase.isHidden ? "Hidden" : actualOutput,

        passed,
        status,
        error,
        isHidden: testCase.isHidden,
      });

      // =========================================
      // STOP ON COMPILATION / RUNTIME ERROR
      // =========================================

      if (
        finalStatus === "Compilation Error" ||
        finalStatus === "Runtime Error"
      ) {
        break;
      }
    }

    // =========================================
    // TOTAL TEST CASES
    // =========================================

    const totalTestCases = allTestCases.length;

    // =========================================
    // ACCEPTED ONLY IF EVERYTHING PASSED
    // =========================================

    if (passedTestCases === totalTestCases && totalTestCases > 0) {
      finalStatus = "Accepted";
    }

    // =========================================
    // SAVE SUBMISSION
    // =========================================

    const submission = await Submission.create({
      user: req.user.userId,
      problem: problemId,
      language,
      code,
      status: finalStatus,
      runtime: totalRuntime,
      memory: totalMemory,
      testCasesPassed: passedTestCases,
      totalTestCases,
      error: submissionError,
    });

    // =========================================
    // UPDATE STREAK ONLY FOR ACCEPTED CODE
    // =========================================

    let updatedStreak = null;

    if (finalStatus === "Accepted") {
      const user = await User.findById(req.user.userId);

      if (user) {
        const today = new Date();

        today.setHours(0, 0, 0, 0);

        if (!user.lastSubmissionDate) {
          user.streak = 1;
        } else {
          const lastDate = new Date(user.lastSubmissionDate);

          lastDate.setHours(0, 0, 0, 0);

          const differenceInDays = Math.floor(
            (today - lastDate) / (1000 * 60 * 60 * 24),
          );

          if (differenceInDays === 1) {
            user.streak += 1;
          } else if (differenceInDays > 1) {
            user.streak = 1;
          }
        }

        user.lastSubmissionDate = new Date();

        // Add problem only once
        const alreadySolved = user.solvedProblems.some(
          (solvedProblemId) =>
            solvedProblemId.toString() === problem._id.toString(),
        );

        if (!alreadySolved) {
          user.solvedProblems.push(problem._id);
        }

        await user.save();

        updatedStreak = user.streak;
      }
    }

    // =========================================
    // RESPONSE
    // =========================================

    return res.status(201).json({
      message: "Submission evaluated successfully",

      status: finalStatus,

      passedTestCases,

      totalTestCases,

      testCaseResults,

      runtime: totalRuntime,

      memory: totalMemory,

      error: submissionError,

      streak: updatedStreak,

      submission,
    });
  } catch (error) {
    console.error("========== SUBMISSION ERROR ==========");

    console.error("Message:", error.message);

    console.error("Response:", error.response?.data);

    console.error("Stack:", error.stack);

    console.error("======================================");

    return res.status(500).json({
      message: "Code execution failed",

      error:
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message,
    });
  }
};

export const runCode = async (req, res) => {
  try {
    const { language, code, stdin = "" } = req.body;

    if (!language || !code?.trim()) {
      return res.status(400).json({
        message: "Language and code are required",
      });
    }

    const result = await executeCode({
      language,
      code,
      stdin,
    });

    let status = "Accepted";

    if (result.error) {
      status = "Runtime Error";
    } else if (result.statusCode !== 200) {
      status = "Compilation Error";
    }

    return res.status(200).json({
      message: "Code executed successfully",
      status,
      output: result.output || "",
      statusCode: result.statusCode,
      cpuTime: result.cpuTime || 0,
      memory: result.memory || 0,
      error: result.error || "",
    });
  } catch (error) {
    console.error("Run Code Error:", error.response?.data || error.message);

    return res.status(500).json({
      message: "Code execution failed",
      error: error.response?.data || error.message,
    });
  }
};

export const getMySubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({
      user: req.user.userId,
    })
      .populate("problem", "title difficulty")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      count: submissions.length,
      submissions,
    });
  } catch (error) {
    console.error("Get Submission Error", error.message);

    return res.status(500).json({
      message: "Failed to fetch submission",
    });
  }
};

export const getProblemSubmissions = async (req, res) => {
  try {
    const { problemId } = req.params;

    const submissions = await Submission.find({
      user: req.user.userId,
      problem: problemId,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      count: submissions.length,
      submissions,
    });
  } catch (error) {
    console.error("Get Problem Submission Error:", error.message);

    return res.status(500).json({
      message: "Failed to fetch problem submission",
    });
  }
};

export const getSubmissionById = async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.submissionId)
      .populate("user", "name email")
      .populate("problem", "title difficulty");

    if (!submission) {
      return res.status(404).json({
        message: "Submission not found",
      });
    }

    const isOwner =
      submission.user?._id?.toString() === req.user.userId.toString();

    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        message: "You are not authorized to view this submission",
      });
    }

    res.status(200).json({
      submission,
    });
  } catch (error) {
    console.error("Get Submission Error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

export const getProblemStats = async (req, res) => {
  try {
    const { problemId } = req.params;

    const totalSubmissions = await Submission.countDocuments({
      user: req.user.userId,
      problem: problemId,
    });

    const acceptedSubmissions = await Submission.countDocuments({
      user: req.user.userId,
      problem: problemId,
      status: "Accepted",
    });

    const wrongAnswerSubmissions = await Submission.countDocuments({
      user: req.user.userId,
      problem: problemId,
      status: "Wrong Answer",
    });

    const acceptanceRate =
      totalSubmissions === 0
        ? 0
        : Number(((acceptedSubmissions / totalSubmissions) * 100).toFixed(2));

    return res.status(200).json({
      problemId,
      totalSubmissions,
      acceptedSubmissions,
      wrongAnswerSubmissions,
      acceptanceRate,
    });
  } catch (error) {
    console.error("Get Problem Stats Error:", error.message);

    return res.status(500).json({
      message: "Failed to fetch problem statistics",
    });
  }
};
