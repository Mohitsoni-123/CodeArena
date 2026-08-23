import express from "express"
import { createSubmission } from "../controllers/submissionController.js";
import authMiddleware from "../middleware/authMiddleware.js"

const router = express.Router();











router.post("/", authMiddleware, createSubmission);







export default router;