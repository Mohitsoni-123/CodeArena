import Submission from "../models/Submission.js";
import Problem from "../models/Problem.js";

export const createSubmission = async (req, res)=>{
    try {
        const { problemId, language, code } = req.body;

        //check required fields
        if(!problemId || !language || !code){
            return res.status(400).json({
                message: "Problem ID, language and code are required"
            });
        }

        //check Problem
        const problem = await Problem.findById(problemId);
        if(!problem){
            return res.status(404).json({
                message: "Problem not found"
            });
        }

        //create submission
        const submission = await Submission.create({
            user: req.user.userId,
            problem: problemId,
            language,
            code,
            status: "Pending",
            totalTestCases: problem.testCases.length
        });
        res.status(201).json({
            message: "Submission create successfully",
            submission
        });
    } catch (error) {
        console.error(
            "Create Submission Error:", error.message
        );
        res.status(500).json({
            message: "Server error"
        });
    }
}