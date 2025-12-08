import express from "express";
const app = express();
app.use(express.json());

import dotenv from "dotenv";
import connectDB from "./config/connectDB.js";

import userRoutes from "./routes/userRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import fileRoutes from "./routes/fileRoutes.js";

dotenv.config();

connectDB();

app.get("/", (req, res) => {
  res.send("Job Pilot API running");
});

app.use("/api/users", userRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/files", fileRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});