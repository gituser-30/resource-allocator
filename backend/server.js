// // // server.js
// // const express = require("express");
// // const nodemailer = require("nodemailer");
// // const mongoose = require("mongoose");
// // const multer = require("multer");
// // const cors = require("cors");
// // const path = require("path");
// // const bcrypt = require("bcryptjs");
// // const jwt = require("jsonwebtoken");
// // const cloudinary = require("cloudinary").v2;
// // const { CloudinaryStorage } = require("multer-storage-cloudinary");

// // require("dotenv").config();

// // // ====== MODELS ======
// // const Note = require("./models/Note");
// // const User = require("./models/User");
// // const Assignment = require("./models/Assignment");
// // const PYQ = require("./models/PYQ");

// // const app = express();

// // // ===== MIDDLEWARE =====
// // app.use(express.json());

// // // ✅ CORS CONFIGURATION
// // const allowedOrigins = [
// //   "https://dbatu-scholor-hub.onrender.com", // frontend
// //   "http://localhost:5173" ,// local dev
// //   "https://resource-allocator-admin.onrender.com" // 
// // ];

// // app.use(cors({
// //   origin: (origin, callback) => {
// //     if (!origin || allowedOrigins.includes(origin)) {
// //       callback(null, true);
// //     } else {
// //       callback(new Error("Not allowed by CORS"));
// //     }
// //   },
// //   methods: ["GET", "POST", "PUT", "DELETE"],
// //   credentials: true
// // }));
// // app.use((req, res, next) => {
// //   const origin = req.headers.origin;
// //   if (allowedOrigins.includes(origin)) {
// //     res.setHeader("Access-Control-Allow-Origin", origin);
// //     res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
// //     res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
// //     res.setHeader("Access-Control-Allow-Credentials", "true");
// //   }
// //   next();
// // });


// // // ===== ROUTES =====
// // const userRoutes = require("./routes/user");
// // app.use("/api/users", userRoutes);

// // const adminAuthRoutes = require("./routes/adminAuth");
// // app.use("/api/admin", adminAuthRoutes);

// // const adminRoutes = require("./routes/admin");
// // app.use("/api/admin", adminRoutes);

// // // ===== UPLOADS STATIC FOLDER =====
// // app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// // // ================== MONGODB CONNECTION ==================
// // mongoose.connect(process.env.MONGO_URI) // just the URI, no deprecated options
// //   .then(() => console.log("✅ MongoDB Connected"))
// //   .catch(err => console.error("❌ MongoDB Error:", err));

// // // ================== CONTACT ROUTE ==================
// // app.post("/contact", async (req, res) => {
// //   const { name, email, subject, message } = req.body;

// //   try {
// //     const transporter = nodemailer.createTransport({
// //       host: "smtp.gmail.com",
// //       port: 465,
// //       secure: true,
// //       auth: {
// //         user: process.env.GMAIL_USER,
// //         pass: process.env.GMAIL_PASS,
// //       },
// //     });

// //     await transporter.sendMail({
// //       from: `"Dbatu Scholar Hub" <${process.env.GMAIL_USER}>`,
// //       to: process.env.GMAIL_USER,
// //       subject: `New message from ${name}: ${subject}`,
// //       text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
// //     });

// //     res.json({ success: true, message: "Message sent successfully!" });
// //   } catch (err) {
// //     console.error("❌ Email Error:", err);
// //     res.status(500).json({ success: false, message: "Something went wrong." });
// //   }
// // });

// // // ================== FILE UPLOAD (MULTER) ==================
// // const storage = multer.diskStorage({
// //   destination: (req, file, cb) => cb(null, "uploads/"),
// //   filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
// // });
// // const upload = multer({ storage });

// // app.post("/api/notes/upload", upload.single("file"), async (req, res) => {
// //   try {
// //     if (!req.file) return res.status(400).json({ message: "No file uploaded" });

// //     const { title, subject, description, department, semester } = req.body;
// //     const fileUrl = `/uploads/${req.file.filename}`;

// //     let newNote;
// //     if (title === "Assignment") {
// //       newNote = new Assignment({ title, subject, description, department, semester, fileUrl });
// //     } else {
// //       newNote = new Note({ title, subject, description, department, semester, fileUrl });
// //     }

// //     await newNote.save();
// //     res.json({ message: "✅ Note uploaded successfully!", note: newNote });
// //   } catch (err) {
// //     console.error("❌ Upload Error:", err);
// //     res.status(500).json({ message: "Error uploading note", error: err.message });
// //   }
// // });

// // app.get("/api/resources", async (req, res) => {
// //   try {
// //     const { department, semester } = req.query;
// //     const query = {};
// //     if (department) query.department = department;
// //     if (semester) query.semester = semester;

// //     const notes = await Note.find(query);
// //     const assignments = await Assignment.find(query);
// //     const pyqs = await PYQ.find(query);

// //     const all = [...notes, ...assignments, ...pyqs].sort(
// //       (a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt)
// //     );

// //     res.json(all);
// //   } catch (err) {
// //     console.error("❌ Fetch Resources Error:", err);
// //     res.status(500).json({ error: "Failed to fetch resources" });
// //   }
// // });

// // // ================== AUTH ROUTES ==================
// // const profileStorage = new CloudinaryStorage({
// //   cloudinary,
// //   params: {
// //     folder: "profiles",        // Cloudinary folder for profile photos
// //     allowed_formats: ["jpg", "jpeg", "png"], // only images
// //   },
// // });

// // const uploadProfile = multer({ storage: profileStorage });


// // // Register
// // app.post("/api/auth/register", uploadProfile.single("profilePhoto"), async (req, res) => {
// //   try {
// //     const { fullName, email, dob, password } = req.body;

// //     if (!fullName || !email || !dob || !password) {
// //       return res.status(400).json({ message: "All fields are required" });
// //     }

// //     let user = await User.findOne({ email });
// //     if (user) return res.status(400).json({ message: "User already exists" });

// //     const hashedPassword = await bcrypt.hash(password, 10);
// //     const profilePhoto = req.file ? req.file.path : null; // <-- Cloudinary URL

// //     user = new User({
// //       fullName,
// //       email,
// //       dob,
// //       password: hashedPassword,
// //       profilePhoto,
// //       verified: true,
// //     });

// //     await user.save();
// //     return res.status(201).json({ message: "✅ Registered successfully!", user });
// //   } catch (err) {
// //     console.error("❌ Register Error:", err);
// //     res.status(500).json({ message: "Error registering user" });
// //   }
// // });

// // // Login
// // app.post("/api/auth/login", async (req, res) => {
// //   try {
// //     const { email, password } = req.body;
// //     const user = await User.findOne({ email });
// //     if (!user) return res.status(400).json({ message: "Invalid credentials" });

// //     const isMatch = await bcrypt.compare(password, user.password);
// //     if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

// //     const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });

// //     res.json({
// //       success: true,
// //       message: "Login successful",
// //       token,
// //       user: {
// //         id: user._id,
// //         fullName: user.fullName,
// //         email: user.email,
// //         profilePhoto: user.profilePhoto
// //       }
// //     });
// //   } catch (err) {
// //     console.error("❌ Login Error:", err);
// //     res.status(500).json({ message: "Error logging in" });
// //   }
// // });

// // // ================== START SERVER ==================
// // const PORT = process.env.PORT || 5000;
// // app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));



// // server.js
// const express = require("express");
// const nodemailer = require("nodemailer");
// const mongoose = require("mongoose");
// const multer = require("multer");
// const cors = require("cors");
// const path = require("path");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const cloudinary = require("cloudinary").v2;
// const { CloudinaryStorage } = require("multer-storage-cloudinary");
// require("dotenv").config();

// // ====== MODELS ======
// const Note = require("./models/Note");
// const User = require("./models/User");
// const Assignment = require("./models/Assignment");
// const PYQ = require("./models/PYQ");

// const app = express();

// // ===== MIDDLEWARE =====
// // parse JSON bodies
// app.use(express.json());
// // parse urlencoded bodies (for form posts without files)
// app.use(express.urlencoded({ extended: true }));

// // ✅ Handle preflight requests globally
// app.options("/*", cors({
//   origin: (origin, callback) => {
//     if (!origin || allowedOrigins.has(origin)) {
//       return callback(null, true);
//     }
//     return callback(new Error("Not allowed by CORS"));
//   },
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   credentials: true,
// }));

// // ✅ Safeguard middleware to ensure all responses have CORS headers
// app.use((req, res, next) => {
//   const origin = req.headers.origin;
//   if (allowedOrigins.has(origin)) {
//     res.header("Access-Control-Allow-Origin", origin);
//   }
//   res.header("Access-Control-Allow-Credentials", "true");
//   next();
// });

// // ✅ CORS CONFIGURATION
// const allowedOrigins = new Set([
//   "https://dbatu-scholor-hub.onrender.com",
//   "http://localhost:5173",
//   "https://resource-allocator-admin.onrender.com",
// ]);

// app.use(cors({
//   origin: (origin, callback) => {
//     // allow requests with no origin (e.g. mobile apps, curl, Postman)
//     if (!origin || allowedOrigins.has(origin)) {
//       return callback(null, true);
//     }
//     return callback(new Error("Not allowed by CORS"));
//   },
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   credentials: true,
// }));

// // Add very small middleware to expose headers for preflight
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   next();
// });

// // ===== ROUTES =====
// const userRoutes = require("./routes/user");
// app.use("/api/users", userRoutes);

// const adminAuthRoutes = require("./routes/adminAuth");
// app.use("/api/admin", adminAuthRoutes);

// const adminRoutes = require("./routes/admin");
// app.use("/api/admin", adminRoutes);

// // ===== UPLOADS STATIC FOLDER =====
// // ensure uploads folder exists in runtime environment; on some hosts you may not persist files
// const uploadsPath = path.join(__dirname, "uploads");
// app.use("/uploads", express.static(uploadsPath));

// // ================== MONGODB CONNECTION ==================
// mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log("✅ MongoDB Connected:", mongoose.connection.name || "connected"))
//   .catch(err => console.error("❌ MongoDB Error:", err));

// // ================== CONTACT ROUTE ==================
// app.post("/contact", async (req, res) => {
//   const { name, email, subject, message } = req.body;
//   try {
//     const transporter = nodemailer.createTransport({
//       host: "smtp.gmail.com",
//       port: 465,
//       secure: true,
//       auth: {
//         user: process.env.GMAIL_USER,
//         pass: process.env.GMAIL_PASS,
//       },
//     });

//     await transporter.sendMail({
//       from: `"Dbatu Scholar Hub" <${process.env.GMAIL_USER}>`,
//       to: process.env.GMAIL_USER,
//       subject: `New message from ${name}: ${subject}`,
//       text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
//     });

//     res.json({ success: true, message: "Message sent successfully!" });
//   } catch (err) {
//     console.error("❌ Email Error:", err);
//     res.status(500).json({ success: false, message: "Something went wrong." });
//   }
// });

// // ================== FILE UPLOAD (MULTER) - LOCAL Fallback ==================
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, "uploads/"),
//   filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
// });
// const upload = multer({ storage });

// // A simple endpoint to accept file uploads directly to server (if you still want local uploads)
// app.post("/api/notes/upload", upload.single("file"), async (req, res) => {
//   try {
//     if (!req.file) return res.status(400).json({ message: "No file uploaded" });

//     const { title, subject, description, department, semester } = req.body;
//     const fileUrl = `/uploads/${req.file.filename}`;

//     let newNote;
//     if (title === "Assignment") {
//       newNote = new Assignment({ title, subject, description, department, semester, fileUrl });
//     } else {
//       newNote = new Note({ title, subject, description, department, semester, fileUrl });
//     }

//     await newNote.save();
//     res.json({ message: "✅ Note uploaded successfully!", note: newNote });
//   } catch (err) {
//     console.error("❌ Upload Error:", err);
//     res.status(500).json({ message: "Error uploading note", error: err.message });
//   }
// });

// // ================== RESOURCES API ==================
// app.get("/api/resources", async (req, res) => {
//   try {
//     const { department, semester } = req.query;
//     const query = {};
//     if (department) query.department = department;
//     if (semester) query.semester = semester;

//     const notes = await Note.find(query);
//     const assignments = await Assignment.find(query);
//     const pyqs = await PYQ.find(query);

//     const all = [...notes, ...assignments, ...pyqs].sort(
//       (a, b) => new Date(b.uploadedAt || b.createdAt) - new Date(a.uploadedAt || a.createdAt)
//     );

//     res.json(all);
//   } catch (err) {
//     console.error("❌ Fetch Resources Error:", err);
//     res.status(500).json({ error: "Failed to fetch resources" });
//   }
// });

// // ================== AUTH ROUTES (example: register/login with Cloudinary profile) ==================
// cloudinary.config({
//   cloud_name: process.env.CLOUD_NAME || "",
//   api_key: process.env.CLOUD_API_KEY || "",
//   api_secret: process.env.CLOUD_API_SECRET || "",
// });

// const profileStorage = new CloudinaryStorage({
//   cloudinary,
//   params: {
//     folder: "profiles",
//     allowed_formats: ["jpg", "jpeg", "png"],
//   },
// });
// const uploadProfile = multer({ storage: profileStorage });

// app.post("/api/auth/register", uploadProfile.single("profilePhoto"), async (req, res) => {
//   try {
//     const { fullName, email, dob, password } = req.body;
//     if (!fullName || !email || !dob || !password) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     let user = await User.findOne({ email });
//     if (user) return res.status(400).json({ message: "User already exists" });

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const profilePhoto = req.file ? req.file.path : null;

//     user = new User({
//       fullName,
//       email,
//       dob,
//       password: hashedPassword,
//       profilePhoto,
//       verified: true,
//     });

//     await user.save();
//     return res.status(201).json({ message: "✅ Registered successfully!", user });
//   } catch (err) {
//     console.error("❌ Register Error:", err);
//     res.status(500).json({ message: "Error registering user" });
//   }
// });

// // Login
// app.post("/api/auth/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ message: "Invalid credentials" });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

//     const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });

//     res.json({
//       success: true,
//       message: "Login successful",
//       token,
//       user: {
//         id: user._id,
//         fullName: user.fullName,
//         email: user.email,
//         profilePhoto: user.profilePhoto
//       }
//     });
//   } catch (err) {
//     console.error("❌ Login Error:", err);
//     res.status(500).json({ message: "Error logging in" });
//   }
// });

// // ================== GLOBAL ERROR HANDLER (nice to have) ==================
// app.use((err, req, res, next) => {
//   console.error("Unhandled error:", err);
//   res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
// });

// // ================== START SERVER ==================
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
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

// ================== CLOUDINARY CONFIG ==================
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// ================== MULTER STORAGE ==================
const cloudStorage = (folder, allowed_formats) =>
  new CloudinaryStorage({
    cloudinary,
    params: {
      folder,
      allowed_formats,
      public_id: (req, file) => `${Date.now()}-${file.originalname.split(".")[0]}`,
    },
  });

const uploadAssignment = multer({ storage: cloudStorage("assignments", ["pdf", "jpg", "jpeg", "png"]) });
const uploadNote = multer({ storage: cloudStorage("notes", ["pdf", "jpg", "jpeg", "png"]) });
const uploadPYQ = multer({ storage: cloudStorage("pyqs", ["pdf", "jpg", "jpeg", "png"]) });
const uploadProfile = multer({ storage: cloudStorage("profiles", ["jpg", "jpeg", "png"]) });

// Fallback local upload (only defined once)
const localStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const localUpload = multer({ storage: localStorage });

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

// ================== STATIC FILES (uploads) ==================
const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ================== FILE UPLOAD API (local fallback) ==================
app.post("/api/notes/upload", localUpload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const { title, subject, description, department, semester, type } = req.body;
    const fileUrl = `/uploads/${req.file.filename}`;

    const newDoc = type === "assignment"
      ? new Assignment({ title, subject, description, department, semester, fileUrl })
      : new Note({ title, subject, description, department, semester, fileUrl });

    await newDoc.save();
    res.json({ message: "✅ File uploaded successfully!", doc: newDoc });
  } catch (err) {
    console.error("❌ Upload Error:", err);
    res.status(500).json({ message: "Error uploading file", error: err.message });
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

