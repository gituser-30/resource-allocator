const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  title: { type: String },
  subject: { type: String, required: true },
  description: { type: String },
  department: { type: String, required: true },
  semester: { type: Number, required: true },
  fileUrl: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Note", noteSchema);
