const WorkTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  }
});

module.exports = mongoose.model("WorkType", WorkTypeSchema);