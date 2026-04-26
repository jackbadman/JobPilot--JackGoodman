import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    default: null
  },

  filename: {
    type: String,
    required: true,
    trim: true
  },

  url: {
    type: String,
    required: true
  },

  publicId: {
    type: String
  },

  size: {
    type: Number
  },

  contentType: {
    type: String
  },

  format: {
    type: String
  },

  description: {
    type: String,
    default: "",
    trim: true
  }
}, {
  timestamps: true
});

export default mongoose.model("File", fileSchema);
