import Problem from "../models/Problem";

export const createProblem = async(req, res)=>{
    try{
        const {title, description, difficulty, topics, examples, constraints, starterCode, testCases} =req.body;

        if(!title || !description || !difficulty){
            return res.status(400).json({
                message: "Title, description and difficulty are required"
            });
        }
        const problem = await Problem.create({
            title, description, difficulty, topics, examples, constraints, starterCode, testCases, createdBy: req.user.userId
        });
        res.status(201).json({
            message: "Problem created successfully",
            problem
        })

    }catch(error){
        console.error("Create Problem Error:", error.message);
        res.status(500).json({
            message: "Server error"
        });
    }
}


export const getProblems = async (req, res)=>{
    try{
        const problems = (await Problem.find().select("-testCases")).toSorted({ createdAt: -1 });
        res.status(200).json({
            count: problems.length,
            problems
        })
    }catch(error){
        console.error("Get Problem Error:", error.message);
        res.status(500).json({
            message: "Server error"
        })
    }
}


export const getProblemById = async (req, res)=>{
    try{

        const problem = await Problem.findById(req.params.id).select("-testCases");

        if(!problem){
            return res.status(404).json({
                message: "Problem not found"
            });
        }
        res.status(200).json({
            problem
        })
    }catch(error){
        console.error("Get Problem Error:", error.message);
        res.status(500).json({
            message: "Server error"
        });
    }
}

export const updateProblem = async(req, res)=>{
    try {
        const problem = await Problem.findByIdAndUpdate(req.params.id, req.body,{
            new: true,
            runValidators: true
        });
        if(!problem){
            return res.status(404).json({
                message: "Problem not found"
            });
        }
        res.status(200).json({
            message: "Problem update successfully",
            problem
        })
    } catch (error) {
        console.error("Update Problem Error:", error.message);
        res.status(500).json({
            message: "Server error"
        })
    }
}

export const deleteProblem = async(req, res)=>{
    try{
        const problem = await Problem.findByIdAndDelete(req.params.id);
        if(!problem){
            return res.status(404).json({
                message: "Problem not found"
            });
        }
        res.status(200).json({
            message: "Problem deleted successfully"
        });
    }catch(error){
        console.error("Delete Problem error:", error.message);
        req.status(500).json({
            message: "Server error"
        })
    }
}