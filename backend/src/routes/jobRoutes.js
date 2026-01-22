import express from "express";
import {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob
} from "../controllers/jobController.js";

const router = express.Router();
router.use(authMiddleware);

router.get("/", getJobs);
router.post("/", createJob);
router.get("/:id", getJobById);
router.put("/:id", updateJob);
router.delete("/:id", deleteJob);

export default router;