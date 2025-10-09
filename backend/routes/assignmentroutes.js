// routes/assignmentroutes.js
import express from "express";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
import auth from "../middleware/auth.js";
import {
  getAssignments,
  addAssignment,
  deleteAssignment,
  getAssignmentCount,
} from "../Controllers/assignmentcontroller.js";

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
    allowed_formats: ["pdf", "jpg", "jpeg", "png"],
    public_id: `${Date.now()}-${file.originalname.split(".")[0]}`,
  }),
});

const upload = multer({ storage });

// ---------------- Routes ----------------
router.get("/", auth, getAssignments);
router.post("/", auth, upload.single("file"), addAssignment);
router.delete("/:id", auth, deleteAssignment);
router.get("/count", auth, getAssignmentCount);

export default router;
