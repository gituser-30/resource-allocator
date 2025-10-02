// server.js
const express = require("express");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");



require("dotenv").config();


// ====== MODELS ======
const Note = require("./models/Note");
const User = require("./models/User");
const Assignment = require("./models/Assignment")
const PYQ = require("./models/PYQ");


const app = express();

// Middleware
app.use(express.json());
// app.use(cors({
//   origin: "https://dbatu-scholor-hub.onrender.com", // your frontend URL
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   credentials: true
// }));

const allowedOrigins = [
  "https://dbatu-scholor-hub.onrender.com",
  "http://localhost:5173" // local dev
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); // allow request
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));



const userRoutes = require("./routes/user");
app.use("/api/users", userRoutes);
const adminAuthRoutes = require("./routes/adminAuth");
app.use("/api/admin", adminAuthRoutes);
const adminRoutes = require("./routes/admin");
app.use("/api/admin", adminRoutes);


// ✅ Serve static files (uploaded notes + profiles)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// ================== MongoDB Connection ==================
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Error:", err));


// ================== CONTACT ROUTE ==================
app.post("/contact", async (req, res) => {
  const { name, email, subject, message } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.GMAIL_USER || "dbatuscholorhub@gmail.com",
        pass: process.env.GMAIL_PASS || "bibb ijnv yluk qcpz", // replace with env var in production
      },
    });

    const mailOptions = {
      from: `"Dbatu Scholar Hub" <${process.env.GMAIL_USER || "dbatuscholorhub@gmail.com"}>`,
      to: "dbatuscholorhub@gmail.com",
      subject: `New message from ${name}: ${subject}`,
      text: `
        Name: ${name}
        Email: ${email}
        Message: ${message}
      `,
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: "Message sent successfully!" });
  } catch (err) {
    console.error("❌ Email Error:", err);
    res.status(500).json({ success: false, message: "Something went wrong." });
  }
});

// ================== FILE UPLOAD (Multer) ==================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});
const upload = multer({ storage });

app.post("/api/notes/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const { title, subject, description, department, semester } = req.body;
    const fileUrl = `/uploads/${req.file.filename}`;

    let newNote;
if (title === "Assignment") {
  newNote = new Assignment({
    title,
    subject,
    description,
    department,
    semester,
    fileUrl,
  });
} else {
  newNote = new Note({
    title,
    subject,
    description,
    department,
    semester,
    fileUrl,
  });
}

    await newNote.save();
    res.json({ message: "✅ Note uploaded successfully!", note: newNote });
  } catch (err) {
    console.error("❌ Upload Error:", err);
    res.status(500).json({ message: "Error uploading note", error: err.message });
  }
});



app.get("/api/resources", async (req, res) => {
  try {
    const { department, semester } = req.query;
    const query = {};
    if (department) query.department = department;
    if (semester) query.semester = semester;

    const notes = await Note.find(query);
    const assignments = await Assignment.find(query);
    const Pyqs = await PYQ .find(query);

    const all = [...notes, ...assignments,...Pyqs].sort(
      (a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt)
    );

    res.json(all);
  } catch (err) {
    console.error("❌ Fetch Resources Error:", err);
    res.status(500).json({ error: "Failed to fetch resources" });
  }
});




// ================== AUTH (Register + Login) ==================

// Profile photo storage
const storageProfile = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/profiles/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const uploadProfile = multer({ storage: storageProfile });

// 📌 Register
app.post("/api/auth/register", uploadProfile.single("profilePhoto"), async (req, res) => {
  try {
    const { fullName, email, dob, password } = req.body;

    if (!fullName || !email || !dob || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const profilePhoto = null;

    user = new User({
      fullName,
      email,
      dob,
      password: hashedPassword,
      profilePhoto,
      verified: true // ✅ Directly verified (no email verification needed)
    });

    await user.save();
    return res.status(201).json({ message: "✅ Registered successfully!", user });
  } catch (err) {
    console.error("❌ Register Error:", err);
    res.status(500).json({ message: "Error registering user" });
  }
});

// 📌 Login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // ✅ Create JWT token (for protected routes)
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || "supersecretkey",
      { expiresIn: "1h" }
    );

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        profilePhoto: user.profilePhoto
      }
    });
  } catch (err) {
    console.error("❌ Login Error:", err);
    res.status(500).json({ message: "Error logging in" });
  }
});





// ================== START SERVER ==================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});  