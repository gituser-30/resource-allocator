const express = require("express");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

require("dotenv").config();

// ====== MODELS ======
const Note = require("./models/Note");
const User = require("./models/User");
const Assignment = require("./models/Assignment");
const PYQ = require("./models/PYQ");

const app = express();

// ====== CORS ======
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173"
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) callback(null, true);
    else callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// ====== MIDDLEWARE ======
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ====== ROUTES ======
const userRoutes = require("./routes/user");
app.use("/api/users", userRoutes);

const adminAuthRoutes = require("./routes/adminAuth");
app.use("/api/admin", adminAuthRoutes);

const adminRoutes = require("./routes/admin");
app.use("/api/admin", adminRoutes);

// ====== MONGODB ======
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.error("❌ MongoDB Error:", err));

// ====== CONTACT ======
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
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
    });

    res.json({ success: true, message: "Message sent successfully!" });
  } catch (err) {
    console.error("❌ Email Error:", err);
    res.status(500).json({ success: false, message: "Something went wrong." });
  }
});

// ====== AUTH (Register/Login) ======

// Profile photo storage
const storageProfile = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/profiles/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const uploadProfile = multer({ storage: storageProfile });

// Register
app.post("/api/auth/register", uploadProfile.single("profilePhoto"), async (req, res) => {
  try {
    const { fullName, email, dob, password } = req.body;

    if (!fullName || !email || !dob || !password)
      return res.status(400).json({ message: "All fields are required" });

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const profilePhoto = req.file ? req.file.filename : null;

    user = new User({ fullName, email, dob, password: hashedPassword, profilePhoto, verified: true });
    await user.save();

    res.status(201).json({ message: "✅ Registered successfully!", user });
  } catch (err) {
    console.error("❌ Register Error:", err);
    res.status(500).json({ message: "Error registering user" });
  }
});

// Login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ success: true, message: "Login successful", token, user });
  } catch (err) {
    console.error("❌ Login Error:", err);
    res.status(500).json({ message: "Error logging in" });
  }
});

// ====== START SERVER ======
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
