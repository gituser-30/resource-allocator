// routes/admin.js
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import Admin from "../models/Admin.js";
import Assignment from "../models/Assignment.js";
import Note from "../models/Note.js";
import PYQ from "../models/PYQ.js";
import User from "../models/User.js";

import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const router = express.Router();

// ---------------- CLOUDINARY CONFIG ----------------
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "uploads",
    allowed_formats: ["pdf", "jpg", "jpeg", "png"],
    resource_type: "auto",
    public_id: (req, file) => `${Date.now()}-${file.originalname.split(".")[0]}`
  },
});

const upload = multer({ storage });

// ---------------- Admin Auth ----------------
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).json({ success: false, message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ success: false, message: "Invalid email or password" });

    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET || "supersecretkey",
      { expiresIn: "1d" }
    );

    res.json({ success: true, token });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});

router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) return res.status(400).json({ success: false, message: "Admin already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({ email, password: hashedPassword });
    await newAdmin.save();

    res.status(201).json({ success: true, message: "Admin registered successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});

// ---------------- DASHBOARD STATS ----------------
router.get("/users/count", async (_, res) => {
  try {
    const count = await User.countDocuments();
    res.json({ success: true, count });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch users count", error: err.message });
  }
});

router.get("/users", async (_, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch users", error: err.message });
  }
});

router.get("/assignments/count", async (_, res) => {
  try {
    const count = await Assignment.countDocuments();
    res.json({ success: true, count });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch assignments count", error: err.message });
  }
});

router.get("/notes/count", async (_, res) => {
  try {
    const count = await Note.countDocuments();
    res.json({ success: true, count });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch notes count", error: err.message });
  }
});

router.get("/pyqs/count", async (_, res) => {
  try {
    const count = await PYQ.countDocuments();
    res.json({ success: true, count });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch PYQs count", error: err.message });
  }
});

// ---------------- FILE UPLOAD ----------------
router.post("/assignments", upload.single("file"), async (req, res) => {
  try {
    const { title, department, semester, subject } = req.body;
    if (!title || !department || !semester || !subject || !req.file)
      return res.status(400).json({ success: false, message: "All fields and file are required" });

    const newAssignment = new Assignment({
      title,
      department,
      semester,
      subject,
      fileUrl: req.file.path,
    });

    await newAssignment.save();
    res.status(201).json({ success: true, assignment: newAssignment });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to add assignment", error: err.message });
  }
});

router.post("/notes", upload.single("file"), async (req, res) => {
  try {
    const { title, department, semester, subject } = req.body;
    if (!title || !department || !semester || !subject || !req.file)
      return res.status(400).json({ success: false, message: "All fields and file are required" });

    const newNote = new Note({
      title,
      department,
      semester,
      subject,
      fileUrl: req.file.path,
    });

    await newNote.save();
    res.status(201).json({ success: true, note: newNote });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to add note", error: err.message });
  }
});

router.post("/pyqs", upload.single("file"), async (req, res) => {
  try {
    const { title, subject, description, department, semester } = req.body;
    if (!title || !subject || !description || !department || !semester || !req.file)
      return res.status(400).json({ success: false, message: "All fields and file are required" });

    const newPYQ = new PYQ({
      title,
      subject,
      description,
      department,
      semester: Number(semester),
      fileUrl: req.file.path,
    });

    await newPYQ.save();
    res.status(201).json({ success: true, pyq: newPYQ });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to add PYQ", error: err.message });
  }
});

export default router;
