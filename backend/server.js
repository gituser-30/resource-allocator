import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

import User from "./models/User.js";
import Note from "./models/Note.js";
import Assignment from "./models/Assignment.js";
import PYQ from "./models/PYQ.js";
import Admin from "./models/Admin.js";

import adminRoutes from "./routes/admin.js";
import userRoutes from "./routes/user.js";
import authRoutes from "./routes/auth.js";

import localUpload from "./middleware/upload.js"; // local multer
import fs from "fs";

import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

// Fix __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}


const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
dotenv.config();
const app = express();

// ================== CORS ==================
const allowedOrigins = new Set([
  "https://dbatu-scholor-hub.onrender.com",
  "http://localhost:5173",
  "https://resource-allocator-admin.onrender.com",
]);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.has(origin)) return callback(null, true);
    return callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
}));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// ================== JSON PARSING ==================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================== MONGODB ==================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB error:", err));

// ================== STATIC FILES (uploads) ==================
const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ================== ROUTES ==================
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

// ================== CONTACT FORM ==================
app.post("/contact", async (req, res) => {
  const { name, email, subject, message } = req.body;
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Dbatu Scholar Hub" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      subject: `New message from ${name}: ${subject}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    });

    res.json({ success: true, message: "Message sent successfully!" });
  } catch (err) {
    console.error("❌ Email Error:", err);
    res.status(500).json({ success: false, message: "Something went wrong." });
  }
});

// ================== FILE UPLOAD API (local) ==================
app.post("/api/files/upload", localUpload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const { title, subject, description, department, semester, type } = req.body;
    const fileUrl = `/uploads/${req.file.filename}`;

    const newDoc = type === "assignment"
      ? new Assignment({ title, subject, description, department, semester, fileUrl })
      : type === "note"
      ? new Note({ title, subject, description, department, semester, fileUrl })
      : type === "pyq"
      ? new PYQ({ title, subject, description, department, semester, fileUrl })
      : null;

    if (!newDoc) return res.status(400).json({ message: "Invalid type" });

    await newDoc.save();
    res.json({ success: true, message: "✅ File uploaded successfully!", doc: newDoc });
  } catch (err) {
    console.error("❌ Upload Error:", err);
    res.status(500).json({ success: false, message: "Error uploading file", error: err.message });
  }
});

// ================== GLOBAL ERROR HANDLER ==================
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    error: err.message,
  });
});

// ================== SERVER START ==================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
