import JobStatus from "../models/JobStatus.js";
import JobType from "../models/JobType.js";
import WorkType from "../models/WorkType.js";
import Location from "../models/Location.js";

/**
 * Build a handler that returns items sorted by name.
 */
const listByName = model => async (req, res) => {
  try {
    const items = await model.find().sort({ name: 1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getJobStatuses = listByName(JobStatus);
export const getJobTypes = listByName(JobType);
export const getWorkTypes = listByName(WorkType);
export const getLocations = listByName(Location);
