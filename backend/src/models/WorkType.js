import mongoose from "mongoose";

const workTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  }
});

export default mongoose.model("WorkType", workTypeSchema);
