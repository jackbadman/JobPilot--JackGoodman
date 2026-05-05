import express from "express";
import authMiddleware from "../middleware/auth.js";
import upload from "../middleware/upload.js";
import File from "../models/File.js";
import Job from "../models/Job.js";

const router = express.Router();
router.use(authMiddleware);

router.post("/", (req, res) => {
  upload.single("file")(req, res, async err => {
    try {
      if (err) {
        const errorMessage = err.message || err.error?.message || "File upload failed.";
        return res.status(400).json({ error: errorMessage });
      }

      const { jobId, description } = req.body;
      let job = null;
      if (jobId) {
        job = await Job.findOne({ _id: jobId, userId: req.user.id });
        if (!job) {
          return res.status(404).json({ error: "Job not found." });
        }
      }

      if (!req.file) {
        return res.status(400).json({ error: "A file is required." });
      }
      // Cloudinary storage has already uploaded the binary at this point.
      // The File document below is only our metadata/ownership record.
      const fileUrl = req.file.secure_url || req.file.url || req.file.path;

      const file = await File.create({
        userId: req.user.id,
        jobId: job?._id,
        filename: req.file.originalname,
        url: fileUrl,
        publicId: req.file.filename,
        size: req.file.size,
        contentType: req.file.mimetype,
        format: req.file.format,
        description: description || ""
      });

      if (job) {
        // Store the relationship in both directions because job fetches populate
        // Job.files, while file routes query by File.jobId.
        await Job.findByIdAndUpdate(job._id, {
          $addToSet: { files: file._id }
        });
      }

      return res.json(file);
    } catch (caughtErr) {
      return res.status(500).json({ error: caughtErr.message });
    }
  });
});

export default router;
