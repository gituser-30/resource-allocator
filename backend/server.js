import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// Models
import User from "./models/User.js";
import Note from "./models/Note.js";
import Assignment from "./models/Assignment.js";
import PYQ from "./models/PYQ.js";
import Admin from "./models/Admin.js";

// Routes
import adminRoutes from "./routes/admin.js";
import userRoutes from "./routes/user.js";
import authRoutes from "./routes/auth.js";

// Local file upload middleware
import localUpload from "./middleware/upload.js";

dotenv.config();
const app = express();

// ================== __dirname fix for ES modules ==================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ================== Ensure uploads folder exists ==================
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// ================== CORS SETUP ==================
const allowedOrigins = [
  "https://dbatu-scholor-hub.onrender.com",
  "https://resource-allocator-admin.onrender.com",
  "http://localhost:5173",
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) res.header("Access-Control-Allow-Origin", origin);

  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

// ================== JSON PARSING ==================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================== MongoDB Connection ==================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// ================== Static Files ==================
app.use("/uploads", express.static(uploadDir));

// ================== Routes ==================
app.use("/api/admin", adminRoutes);   // Admin routes
app.use("/api/users", userRoutes);    // User routes
app.use("/api/auth", authRoutes);     // Auth routes (login/register)

// ================== Contact Form ==================
app.post("/contact", async (req, res) => {
  const { name, email, subject, message } = req.body;
  try {
    const nodemailer = await import("nodemailer");
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_PASS },
    });

    await transporter.sendMail({
      from: `"Dbatu Scholar Hub" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      subject: `New message from ${name}: ${subject}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    });

    res.json({ success: true, message: "✅ Message sent successfully!" });
  } catch (err) {
    console.error("❌ Email Error:", err);
    res.status(500).json({ success: false, message: "Something went wrong." });
  }
});

// ================== File Upload API ==================
app.post("/api/files/upload", localUpload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const { title, subject, description, department, semester, type } = req.body;
    const fileUrl = `/uploads/${req.file.filename}`;

    let newDoc;
    if (type === "assignment") {
      newDoc = new Assignment({ title, subject, description, department, semester, fileUrl });
    } else if (type === "note") {
      newDoc = new Note({ title, subject, description, department, semester, fileUrl });
    } else if (type === "pyq") {
      newDoc = new PYQ({ title, subject, description, department, semester, fileUrl });
    } else {
      return res.status(400).json({ message: "Invalid type" });
    }

    await newDoc.save();
    res.json({ success: true, message: "✅ File uploaded successfully!", doc: newDoc });
  } catch (err) {
    console.error("❌ Upload Error:", err);
    res.status(500).json({ success: false, message: "Error uploading file", error: err.message });
  }
});

// ================== Health Check ==================
app.get("/", (req, res) => {
  res.send("🚀 Backend running successfully");
});

// ================== Global Error Handler ==================
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
});

// ================== Server Start ==================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
