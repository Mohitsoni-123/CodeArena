import Submission from "../models/Submission.js";
import Problem from "../models/Problem.js";
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

        return res.status(201).json({
            message: "Submission evaluated successfully",
            status,
            passedTestCases,
            totalTestCases: problem.testCases.length,
            testCaseResults,
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

        // Check required fields
        if (!language || !code) {
            return res.status(400).json({
                message: "Language and code are required"
            });
        }

        // Execute code using JDoodle
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


export const getMySubmissions = async (req, res)=>{
    try {
        const submissions = await Submission.find({
            user: req.user.userId
        })
            .populate("problem", "title difficulty")
            .sort({ createdAt: -1 });
        
        return res.status(200).json({
            count: submissions.length,
            submissions
        })
    } catch (error) {
        console.error("Get Submission Error", error.message);

        return res.status(500).json({
            message: "Failed to fetch submission"
        });
    }
}

export const getProblemSubmissions = async (req, res)=>{
    try {
        const { problemId } = res.params;

        const submissions = await Submission.find({
            user: req.user.userId,
            problem: problemId
        })
            .sort({ createdAt: -1 });
        
        return res.status(200).json({
            count: submissions.length,
            submissions
        })
        
    } catch (error) {
        console.error("Get Problem Submission Error:", error.message);

        return res.status(500).json({
            message: "Failed to fetch problem submission"
        });
    }
}