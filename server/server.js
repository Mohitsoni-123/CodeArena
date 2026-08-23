import express from 'express';
import cors from "cors"
import "dotenv/config"

import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import authMiddleware from './middleware/authMiddleware.js';
import adminMiddleware from './middleware/adminMiddleware.js';
import problemRoutes from "./routes/problemRoutes.js";
import submissionRoutes from "./routes/submissionRoutes.js";



const app = express();


app.use(cors());
app.use(express.json());
connectDB();






app.use("/api/auth",authRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/submissions", submissionRoutes)
app.get("/api/auth/me", authMiddleware, (req, res)=>{
    res.json({
        message: "You are authenticated",
        user: req.user
    });
})

app.get(
    "/api/admin/test",
    authMiddleware,
    adminMiddleware,
    (req, res) => {
        res.json({
            message: "Welcome Admin 👑"
        });
    }
);


































app.get("/", (req, res)=>{
    res.json({
        message: "CodeArena API is running..."
    })
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
})