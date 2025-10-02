const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const Assignment = require("../models/Assignment");
const Note = require("../models/Note");
const User = require("../models/User");
const PYQ = require("../models/PYQ");
const path = require("path");


const cors = require("cors");
const app = express();

// ===== CORS CONFIG =====
const allowedOrigins = [
  "http://localhost:5173",
  "https://dbatu-scholor-hub.onrender.com",
  "https://resource-allocator-admin.onrender.com"
];

// Allow all origins temporarily if needed
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) callback(null, true);
    else callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"]
}));

app.use(express.json());

// const adminRoutes = require("./routes/adminRoutes");
// app.use("/api/admin", adminRoutes);

const router = express.Router();

// ---------------- Multer + Cloudinary Setup ----------------
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "resources", // common folder for assignments, notes, pyqs
    allowed_formats: ["pdf", "jpg", "jpeg", "png"],
  },
});

const upload = multer({ storage });

// ===== STATIC FOLDER =====
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ===== TEST ROUTE =====
app.get("/", (req, res) => res.send("Backend is running!"));

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
rapp.get("/api/admin/assignments", async (req, res) => {
  try {
    const assignments = await Assignment.find().sort({ createdAt: -1 });
    res.json({ success: true, assignments });
  } catch (err) {
    console.error("Fetch Assignments Error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch assignments" });
  }
});

app.post("/api/admin/assignments", uploadCloud.single("file"), async (req, res) => {
  try {
    const { title, department, semester, subject } = req.body;
    if (!title || !department || !semester || !subject || !req.file) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const newAssignment = new Assignment({
      title,
      department,
      semester,
      subject,
      fileUrl: req.file.path
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
      fileUrl: req.file.path, // Cloudinary URL
    });

    await newNote.save();
    res.status(201).json({ success: true, note: newNote });
  } catch (err) {
    console.error("Add Note Error:", err);
    res.status(500).json({ success: false, message: "Failed to add note" });
  }
});

// ---------------- PYQs ----------------
router.get("/pyqs", async (req, res) => {
  try {
    const { department, semester } = req.query;
    const filter = {};
    if (department) filter.department = department;
    if (semester) filter.semester = Number(semester);

    const pyqs = await PYQ.find(filter).sort({ uploadedAt: -1 });
    res.json(pyqs);
  } catch (err) {
    console.error("Fetch PYQs Error:", err);
    res.status(500).json({ error: "Failed to fetch PYQs" });
  }
});

router.post("/pyqs", upload.single("file"), async (req, res) => {
  try {
    const { title, subject, description, department, semester } = req.body;
    if (!title || !subject || !department || !semester || !req.file)
      return res.status(400).json({ error: "All fields are required" });

    const newPYQ = new PYQ({
      title,
      subject,
      description,
      department,
      semester: Number(semester),
      fileUrl: req.file.path, // Cloudinary URL
    });

    await newPYQ.save();
    res.status(201).json(newPYQ);
  } catch (err) {
    console.error("Add PYQ Error:", err);
    res.status(500).json({ error: "Failed to add PYQ" });
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

module.exports = router;
