import Job from "../models/Job.js";
import File from "../models/File.js";

/**
 * Create a new job application for the authenticated user.
 * Expects job fields in req.body.
 */
export const createJob = async (req, res) => {
  try {
    const { fileIds, ...jobPayload } = req.body;
    const job = await Job.create({
      ...jobPayload,
      userId: req.user.id
    });

    if (Array.isArray(fileIds) && fileIds.length) {
      const attachableFiles = await File.find({
        _id: { $in: fileIds },
        userId: req.user.id,
        $or: [{ jobId: null }, { jobId: { $exists: false } }]
      }).select("_id");

      if (attachableFiles.length) {
        const attachableIds = attachableFiles.map(file => file._id);
        await File.updateMany(
          { _id: { $in: attachableIds } },
          { $set: { jobId: job._id } }
        );
        await Job.findByIdAndUpdate(job._id, {
          $addToSet: { files: { $each: attachableIds } }
        });
      }
    }

    res.status(201).json(job);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
/**
 * List jobs for the authenticated user with optional filters.
 * Supports status/type/workType/location and sort query params.
 */
export const getJobs = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      status,
      type,
      workType,
      location,
      sort = "createdAt"
    } = req.query;

    const filter = { userId };

    if (status) filter.jobStatus = status;
    if (type) filter.jobType = type;
    if (workType) filter.workType = workType;
    if (location) filter.location = location;

    const jobs = await Job.find(filter)
      .populate("jobStatus", "name")
      .populate("jobType", "name")
      .populate("workType", "name")
      .populate("location", "name")
      .populate("files")
      .sort({ [sort]: -1 });

    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Get a single job by id for the authenticated user.
 * Enforces ownership by matching userId.
 */
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findOne({
      _id: req.params.id,
      userId: req.user.id
    })
      .populate("jobStatus", "name")
      .populate("jobType", "name")
      .populate("workType", "name")
      .populate("location", "name")
      .populate("files");

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    res.json(job);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
/**
 * Update a job application by id for the authenticated user.
 */
export const updateJob = async (req, res) => {
  try {
    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    res.json(job);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
/**
 * Delete a job application by id for the authenticated user.
 */
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    res.json({ message: "Job deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
