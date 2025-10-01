const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  dob: { type: Date, required: true },
  password: { type: String, required: true },
  profilePhoto: { type: String, default: null },
  role: { type: String, enum: ["user", "admin"], default: "user" } // ✅ keep for admin panel later
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
