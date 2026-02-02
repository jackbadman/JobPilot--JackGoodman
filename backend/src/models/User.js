import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  emailAddress: { type: String, required: true, unique: true, lowercase: true, trim: true },
  name: { type: String, required: true, trim: true },
  passwordHash: { type: String, required: true, select: false }
});

export default mongoose.model("User", userSchema);
