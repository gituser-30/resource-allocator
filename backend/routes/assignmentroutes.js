// routes/assignmentroutes.js
import express from "express";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import auth from "../middleware/auth.js";
import {
  getAssignments,
  addAssignment,
  deleteAssignment,
  getAssignmentCount,
} from "../Controllers/assignmentcontroller.js";

dotenv.config(); // ensure env vars are loaded

const router = express.Router();

// ---------------- Cloudinary Config ----------------
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// ---------------- Multer Cloudinary Storage ----------------
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "assignments",
    allowed_formats: ["pdf", "jpg", "jpeg", "png"], // ✅ safe format list
    public_id: `${Date.now()}-${file.originalname.split(".")[0]}`,
  }),
});

const upload = multer({ storage });

// ---------------- Routes ----------------
// ✅ Count route first to prevent conflict with "/:id"
router.get("/count", auth, getAssignmentCount);

// ✅ Get all assignments
router.get("/", auth, getAssignments);

// ✅ Add a new assignment (with file upload)
router.post("/", auth, upload.single("file"), addAssignment);

// ✅ Delete assignment by ID
router.delete("/:id", auth, deleteAssignment);

export default router;
