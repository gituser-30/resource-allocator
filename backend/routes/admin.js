const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");
const multer = require("multer");

const Admin = require("../models/Admin");
const Assignment = require("../models/Assignment");
const Note = require("../models/Note");
const User = require("../models/User");
const PYQ = require("../models/PYQ");

const router = express.Router();

// ---------------- Multer Setup ----------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
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
    console.error("Admin Login Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
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
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ---------------- Dashboard Stats ----------------
router.get("/users/count", async (_, res) => {
  try {
    const count = await User.countDocuments();
    res.json({ success: true, count });
  } catch {
    res.status(500).json({ success: false, message: "Failed to fetch users count" });
  }
});

router.get("/assignments/count", async (_, res) => {
  try {
    const count = await Assignment.countDocuments();
    res.json({ success: true, count });
  } catch {
    res.status(500).json({ success: false, message: "Failed to fetch assignments count" });
  }
});

router.get("/notes/count", async (_, res) => {
  try {
    const count = await Note.countDocuments();
    res.json({ success: true, count });
  } catch {
    res.status(500).json({ success: false, message: "Failed to fetch notes count" });
  }
});

router.get("/pyqs/count", async (_, res) => {
  try {
    const count = await PYQ.countDocuments();
    res.json({ success: true, count });
  } catch {
    res.status(500).json({ success: false, message: "Failed to fetch pyqs count" });
  }
});

// ---------------- Assignments ----------------
router.get("/assignments", async (req, res) => {
  try {
    const { department, semester } = req.query;
    const filter = {};
    if (department) filter.department = department;
    if (semester) filter.semester = semester;

    const assignments = await Assignment.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, assignments });
  } catch (err) {
    console.error("Fetch Assignments Error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch assignments" });
  }
});

router.post("/assignments", upload.single("file"), async (req, res) => {
  try {
    const { department, semester, subject, title } = req.body;
    if (!department || !semester || !subject || !req.file)
      return res.status(400).json({ success: false, message: "All fields are required" });

    const newAssignment = new Assignment({
      title,
      department,
      semester,
      subject,
      fileUrl: `/uploads/${req.file.filename}`,
    });

    await newAssignment.save();
    res.status(201).json({ success: true, assignment: newAssignment });
  } catch (err) {
    console.error("Add Assignment Error:", err);
    res.status(500).json({ success: false, message: "Failed to add assignment" });
  }
});

// ---------------- Notes ----------------
router.get("/notes", async (req, res) => {
  try {
    const { department, semester } = req.query;
    const filter = {};
    if (department) filter.department = department;
    if (semester) filter.semester = semester;

    const notes = await Note.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, notes });
  } catch (err) {
    console.error("Fetch Notes Error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch notes" });
  }
});

router.post("/notes", upload.single("file"), async (req, res) => {
  try {
    const { department, semester, subject, title } = req.body;
    if (!department || !semester || !subject || !req.file)
      return res.status(400).json({ success: false, message: "All fields are required" });

    const newNote = new Note({
      title: title || subject,
      subject,
      department,
      semester,
      fileUrl: `/uploads/${req.file.filename}`,
    });

    await newNote.save();
    res.status(201).json({ success: true, note: newNote });
  } catch (err) {
    console.error("Add Note Error:", err);
    res.status(500).json({ success: false, message: "Failed to add note" });
  }
});

router.delete("/notes/:id", async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Note deleted successfully" });
  } catch (err) {
    console.error("Delete Note Error:", err);
    res.status(500).json({ success: false, message: "Failed to delete note" });
  }
});

// ---------------- Users ----------------
router.get("/users", async (_, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (err) {
    console.error("Fetch Users Error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch users" });
  }
});

// pyqs

// -------- GET all PYQs --------
router.get("/pyqs", async (req, res) => {
  try {
    const { department, semester } = req.query;
    const filter = {};
    if (department) filter.department = department;
    if (semester) filter.semester = Number(semester); // convert to number

    const pyqs = await PYQ.find(filter).sort({ uploadedAt: -1 }); // newest first
    res.json(pyqs); // directly return array
  } catch (err) {
    console.error("Fetch PYQs Error:", err);
    res.status(500).json({ error: "Failed to fetch PYQs" });
  }
});

// -------- POST new PYQ --------
router.post("/pyqs", upload.single("file"), async (req, res) => {
  try {
    const { title, subject, description, department, semester } = req.body;

    if (!title || !subject || !department || !semester || !req.file) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newPYQ = new PYQ({
      title,
      subject,
      description,
      department,
      semester: Number(semester), // ensure number type
      fileUrl: `/uploads/${req.file.filename}`,
    });

    await newPYQ.save();
    res.status(201).json(newPYQ); // return the saved document
  } catch (err) {
    console.error("Add PYQ Error:", err);
    res.status(500).json({ error: "Failed to add PYQ" });
  }
});


module.exports = router;
