import mongoose from "mongoose";

/**
 * File metadata schema owned by a user and optionally associated with a job.
 */
const fileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },
  contentType: String,
  description: String,
  filename: String,
  url: String
});

export default mongoose.model("File", fileSchema);
