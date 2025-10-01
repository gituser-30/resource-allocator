import express from "express";
import multer from "multer";
import { getNotes, addNote, deleteNote, getNoteCount } from "../Controllers/notecontroller.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Multer storage config
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// Routes
router.get("/", auth, getNotes);
router.post("/", auth, upload.single("file"), addNote);
router.delete("/:id", auth, deleteNote);
router.get("/count", auth, getNoteCount);

export default router;   // ✅ important
