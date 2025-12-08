import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  //userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  jobTitle: String,
  company: String,
  location: { type: mongoose.Schema.Types.ObjectId, ref: "Location" }, 
  salary: Number,
  jobType1: { type: String, enum: ["Full-time", "Part-Time", "Contract", "Internship", "Temporary", "Volunteer", "Other"]}, 
  jobType2: { type: String, enum: ["Office", "Remote", "Hybrid"] }, 
  appliedDate: Date,
  closingDate: Date,
  createdDate: { type: Date, default: Date.now },
  updatedDate: Date,
  jobStatus: String, 
  favourited: Boolean,
  files: [{ type: mongoose.Schema.Types.ObjectId, ref: "File" }]
});

export default mongoose.model("Job", jobSchema);