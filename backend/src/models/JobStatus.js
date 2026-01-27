import mongoose from "mongoose";

const jobStatusSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  }
});

export default mongoose.model("JobStatus", jobStatusSchema);
