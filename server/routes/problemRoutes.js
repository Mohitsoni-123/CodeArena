import express from "express"
import { createProblem, getProblems, getProblemById, updateProblem, deleteProblem } from "../controllers/problemController.js";
import authMiddleware from "../middleware/authMiddleware.js"
import adminMiddleware from "../middleware/adminMiddleware.js"

const router = express.Router();


//public routes
router.get("/", getProblems);
router.get("/:id", getProblemById);


//admin routes -> they only access admin 
router.post("/", authMiddleware, adminMiddleware, createProblem);

router.put("/:id", authMiddleware, adminMiddleware, updateProblem);

router.delete("/:id", authMiddleware, adminMiddleware, deleteProblem);







export default router