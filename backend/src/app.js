import express from "express";
import cors from "cors";

import "./models/index.js";
import userRoutes from "./routes/userRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import fileRoutes from "./routes/fileRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import lookupRoutes from "./routes/lookupRoutes.js";
import uploadRoutes from "./routes/upload.js";

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use("/api/users", userRoutes);
  app.use("/api/jobs", jobRoutes);
  app.use("/api/files", fileRoutes);
  app.use("/api/dashboard", dashboardRoutes);
  app.use("/api/lookup", lookupRoutes);
  app.use("/api/upload", uploadRoutes);

  return app;
}

export default createApp();
