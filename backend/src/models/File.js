import mongoose from "mongoose";

/**
 * File metadata schema associated with a job.
 */
const fileSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: "JobApplication", required: true },
  contentType: String,
  description: String,
  filename: String,
  url: String
});

export default mongoose.model("File", fileSchema);
