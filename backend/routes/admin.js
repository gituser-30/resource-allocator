// routes/admin.js
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import Admin from "../models/Admin.js";
import Assignment from "../models/Assignment.js";
import Note from "../models/Note.js";
import PYQ from "../models/PYQ.js";
import User from "../models/User.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// ---------------- Admin Auth ----------------
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).json({ success: false, message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ success: false, message: "Invalid email or password" });

    const token = jwt.sign({ id: admin._id, email: admin.email }, process.env.JWT_SECRET || "supersecretkey", { expiresIn: "1d" });
    res.json({ success: true, token });
  } catch (err) {
    console.error("Admin Login Error:", err);
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
    console.error("Admin Registration Error:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});

// ---------------- Dashboard Stats ----------------
router.get("/users/count", async (_, res) => {
  try {
    const count = await User.countDocuments();
    res.json({ success: true, count });
  } catch (err) {
    console.error("Users Count Error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch users count", error: err.message });
  }
});

router.get("/assignments/count", async (_, res) => {
  try {
    const count = await Assignment.countDocuments();
    res.json({ success: true, count });
  } catch (err) {
    console.error("Assignments Count Error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch assignments count", error: err.message });
  }
});

// ---------------- Assignments ----------------
router.get("/assignments", async (req, res) => {
  try {
    const assignments = await Assignment.find().sort({ createdAt: -1 });
    res.json({ success: true, assignments });
  } catch (err) {
    console.error("Fetch Assignments Error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch assignments", error: err.message });
  }
});

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
      fileUrl: `/uploads/${req.file.filename}`, // local path
    });

    await newAssignment.save();
    res.status(201).json({ success: true, assignment: newAssignment });
  } catch (err) {
    console.error("Add Assignment Error:", err);
    res.status(500).json({ success: false, message: "Failed to add assignment", error: err.message });
  }
});

// ---------------- Notes ----------------
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
      fileUrl: `/uploads/${req.file.filename}`,
    });

    await newNote.save();
    res.status(201).json({ success: true, note: newNote });
  } catch (err) {
    console.error("Add Note Error:", err);
    res.status(500).json({ success: false, message: "Failed to add note", error: err.message });
  }
});

// ---------------- PYQs ----------------
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
      semester,
      fileUrl: `/uploads/${req.file.filename}`,
    });

    await newPYQ.save();
    res.status(201).json({ success: true, pyq: newPYQ });
  } catch (err) {
    console.error("Add PYQ Error:", err);
    res.status(500).json({ success: false, message: "Failed to add PYQ", error: err.message });
  }
});

export default router;
