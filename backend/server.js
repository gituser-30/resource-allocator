import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

import adminRoutes from "./routes/admin.js";
import userRoutes from "./routes/user.js";
import authRoutes from "./routes/auth.js";

dotenv.config();
const app = express();

// ---------------- Fix __dirname in ESM ----------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---------------- Ensure uploads folder exists ----------------
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// ---------------- CORS ----------------
app.use(cors({ origin: "*" }));

// ---------------- JSON PARSING ----------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---------------- MongoDB ----------------
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB error:", err));

// ---------------- Static uploads ----------------
app.use("/uploads", express.static(uploadDir));

// ---------------- Routes ----------------
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

// ---------------- Global error handler ----------------
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
});

// ---------------- Server start ----------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
