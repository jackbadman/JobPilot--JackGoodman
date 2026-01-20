import dotenv from "dotenv";
dotenv.config();               

import express from "express";
import connectDB from "./config/connectDB.js"; 
import userRoutes from "./routes/userRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import fileRoutes from "./routes/fileRoutes.js";

const app = express();
app.use(express.json());

connectDB();                 

// Routes
app.use("/api/users", userRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/files", fileRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));