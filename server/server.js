import express from 'express';
import cors from "cors"
import "dotenv/config"

import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';


const app = express();


app.use(cors());
app.use(express.json());
connectDB();






app.use("/api/auth",authRoutes);














app.get("/", (req, res)=>{
    res.json({
        message: "CodeArena API is running..."
    })
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
})