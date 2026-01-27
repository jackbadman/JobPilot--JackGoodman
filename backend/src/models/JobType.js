import mongoose from "mongoose";

const jobTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  }
});

export default mongoose.model("JobType", jobTypeSchema);
