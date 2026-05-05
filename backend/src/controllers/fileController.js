import File from "../models/File.js";
import Job from "../models/Job.js";

/**
 * Create a new file metadata record.
 * Note: binary uploads are not handled here.
 */
export const uploadFile = async (req, res) => {
  try {
    const { jobId } = req.body;
    let job = null;
    if (jobId) {
      job = await Job.findOne({ _id: jobId, userId: req.user.id });
      if (!job) {
        return res.status(404).json({ error: "Job not found." });
      }
    }

    const file = await File.create({
      ...req.body,
      userId: req.user.id,
      jobId: job?._id
    });
    res.status(201).json(file);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * List file metadata for a job id.
 */
export const getFilesByJob = async (req, res) => {
  try {
    const job = await Job.findOne({ _id: req.params.jobId, userId: req.user.id });
    if (!job) {
      return res.status(404).json({ error: "Job not found." });
    }

    const files = await File.find({ jobId: job._id, userId: req.user.id });
    res.json(files);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Delete a file metadata record by id.
 */
export const deleteFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ error: "File not found" });
    if (String(file.userId) !== String(req.user.id)) {
      return res.status(403).json({ error: "Not authorized to delete this file." });
    }

    if (file.jobId) {
      // Detach metadata from the job before deleting the File record so future
      // job fetches do not populate stale file references.
      await Job.findByIdAndUpdate(file.jobId, {
        $pull: { files: file._id }
      });
    }

    // This deletes MongoDB metadata only; Cloudinary cleanup needs the stored
    // publicId and must be handled separately if remote deletion is required.
    await file.deleteOne();
    res.json({ message: "File deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
