const mongoose = require("mongoose");

const JobStatusSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  }
});

module.exports = mongoose.model("JobStatus", JobStatusSchema);