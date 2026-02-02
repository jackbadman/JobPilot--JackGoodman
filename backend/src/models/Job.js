import mongoose from "mongoose";

/**
 * Job application schema owned by a user and linked to lookup data.
 */
const jobSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  company: {
    type: String,
    required: true,
    trim: true
  },

  jobTitle: {
    type: String,
    required: true,
    trim: true
  },

  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Location",
    required: true
  },

  jobStatus: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "JobStatus",
    required: true
  },

  jobType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "JobType",
    required: true
  },

  workType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "WorkType",
    required: true
  },

  salary: {
    type: Number
  },

  appliedDate: {
    type: Date
  },

  closingDate: {
    type: Date
  },

  favourited: {
    type: Boolean,
    default: false
  },

  files: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "File"
  }]
}, {
  timestamps: true
});

export default mongoose.model("Job", jobSchema);
