import express from "express"
import { createSubmission, runCode, getMySubmissions  } from "../controllers/submissionController.js";
import authMiddleware from "../middleware/authMiddleware.js"

const router = express.Router();










router.post("/run", authMiddleware, runCode);

router.get("/my", authMiddleware, getMySubmissions);

router.post("/", authMiddleware, createSubmission);







export default router;