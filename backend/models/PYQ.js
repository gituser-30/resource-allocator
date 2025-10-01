const mongoose = require("mongoose");

const PYQSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  subject: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  department: {
    type: String,
    required: true,
    trim: true,
    enum: ["Computer", "Computer Engineering", "Mechanical Engineering", "Civil Engineering", "Electrical Engineering", "IT", "Information-Technology"], 
  },
  semester: {
    type: Number,
    required: true,
    min: 1,
    max: 8,
  },
  fileUrl: {
    type: String,
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
}, { versionKey: false });

// Export the model
module.exports = mongoose.models.PYQ ? mongoose.model("PYQ") : mongoose.model("PYQ", PYQSchema);
