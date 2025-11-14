import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: "JobApplication", required: true },
  contentType: String,
  description: String,
  filename: String,
  url: String
});

export default mongoose.model("File", fileSchema);