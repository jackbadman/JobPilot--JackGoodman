/**
 * File metadata routes.
 */
import express from "express";
import authMiddleware from "../middleware/auth.js";
import {
  uploadFile,
  getFilesByJob,
  deleteFile
} from "../controllers/fileController.js";

const router = express.Router();
router.use(authMiddleware);

router.post("/", uploadFile);                   
router.get("/job/:jobId", getFilesByJob);       
router.delete("/:id", deleteFile);              

export default router;
