import express from "express"
import { createSubmission, runCode  } from "../controllers/submissionController.js";
import authMiddleware from "../middleware/authMiddleware.js"

const router = express.Router();










router.post("/run", authMiddleware, runCode);

router.post("/", authMiddleware, createSubmission);







export default router;