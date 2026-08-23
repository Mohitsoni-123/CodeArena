import mongoose from "mongoose";
const submissionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        problem: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Problem",
            required: true
        },
        language: {
            type: String,
            required: true,
            enum: ["cpp", "c", "python", "javascript"]
        },
        code: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: [
                "Pending",
                "Accepted",
                "Wrong Answer",
                "Compilation Error",
                "Runtime Error",
                "Time Limit Exceeded"
            ],
            default: "Pending"
        },
        runtime: {
            type: Number,
            default: 0
        },
        memory: {
            type: Number,
            default: 0
        },
        testCasesPassed: {
            type: Number,
            default: 0
        },
        error: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

const Submission = mongoose.model("Submission", submissionSchema);

export default Submission;