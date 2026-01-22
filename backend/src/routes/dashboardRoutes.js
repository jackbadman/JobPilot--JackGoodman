import express from "express";
import { getDashboardSummary } from "../controllers/dashboard.controller.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

router.get("/summary", authMiddleware, getDashboardSummary);

export default router;