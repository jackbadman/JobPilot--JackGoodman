import File from "../models/File.js";

export const uploadFile = async (req, res) => {
  try {
    const file = await File.create(req.body);
    res.status(201).json(file);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getFilesByJob = async (req, res) => {
  try {
    const files = await File.find({ jobId: req.params.jobId });
    res.json(files);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteFile = async (req, res) => {
  try {
    const file = await File.findByIdAndDelete(req.params.id);
    if (!file) return res.status(404).json({ error: "File not found" });
    res.json({ message: "File deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};