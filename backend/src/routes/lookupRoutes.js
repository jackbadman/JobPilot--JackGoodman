import express from "express";
import authMiddleware from "../middleware/auth.js";
import {
  getJobStatuses,
  getJobTypes,
  getWorkTypes,
  getLocations
} from "../controllers/lookupController.js";

const router = express.Router();
router.use(authMiddleware);

router.get("/job-statuses", getJobStatuses);
router.get("/job-types", getJobTypes);
router.get("/work-types", getWorkTypes);
router.get("/locations", getLocations);

export default router;
