import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  name: String,
  url: String,
  publicId: String,
  size: Number,
  format: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("File", fileSchema);
