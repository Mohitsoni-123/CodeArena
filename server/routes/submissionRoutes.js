import express from "express";
import {
  createSubmission,
  runCode,
  getMySubmissions,
  getProblemSubmissions,
  getSubmissionById,
  getProblemStats,
} from "../controllers/submissionController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/run", authMiddleware, runCode);

router.get("/my", authMiddleware, getMySubmissions);

router.get("/problem/:problemId/stats", authMiddleware, getProblemStats);


router.get("/problem/:problemId", authMiddleware, getProblemSubmissions);

router.post("/", authMiddleware, createSubmission);

router.get("/:submissionId", authMiddleware, getSubmissionById);

export default router;

