import Job from "../models/Job.js";

// Create a new job application
export const createJob = async (req, res) => {
  try {
    const job = await Job.create({
      ...req.body,
      userId: req.user.id
    });

    res.status(201).json(job);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


 //Get jobs with optional filters (dashboard table)
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

// Get single job by ID (ownership enforced)
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


 // Update job application
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


 // Delete job application
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
