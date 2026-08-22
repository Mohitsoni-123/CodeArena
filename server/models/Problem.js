import mongoose from "mongoose";

const problemSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: true
        },
        difficulty: {
            type: String,
            enum: ["Easy", "Medium", "Hard"],
            required: true
        },
        topics: [
            {
                type: String
            }
        ],
        example: [
            {
                input: {
                    type: String,
                    required: true
                },
                output: {
                    type: String,
                    required: true
                },
                explanation: {
                    type: String
                }
            }
        ],
        constraints: [
            {
                type: String
            }
        ],
        starterCode: {
            type: String,
            default: ""
        },
        testCases: [
            {
                input: {
                    type: String,
                    required: true
                },
                expectedOutput: {
                    type: String,
                    required: true
                },
                isHidden: {
                    type: Boolean,
                    default: false
                }
            }
        ],
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    },
    {
        timestamps: true
    }
);

const Problem = mongoose.model("Problem", problemSchema);

export default Problem;