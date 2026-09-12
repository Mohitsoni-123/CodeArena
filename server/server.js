import dns from "node:dns";

dns.setDefaultResultOrder("ipv4first");
import express from 'express';
import cors from "cors"
import "dotenv/config"

import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import authMiddleware from './middleware/authMiddleware.js';
import adminMiddleware from './middleware/adminMiddleware.js';
import problemRoutes from "./routes/problemRoutes.js";
import submissionRoutes from "./routes/submissionRoutes.js";

import adminRoutes from "./routes/adminRoutes.js";



const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://code-arena-7b8i.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);


app.use(express.json());
connectDB();






app.use("/api/auth",authRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/submissions", submissionRoutes)
app.use("/api/admin", adminRoutes);

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