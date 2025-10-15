// middleware/upload.js
import multer from "multer";
import path from "path";

// Set storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // folder for local uploads
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// File filter (allow PDF, JPG, PNG)
const fileFilter = (req, file, cb) => {
  const allowedExt = [".pdf", ".jpg", ".jpeg", ".png"];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedExt.includes(ext)) cb(null, true);
  else cb(new Error("Only PDF, JPG, JPEG, PNG files are allowed"));
};

const upload = multer({ storage, fileFilter });

export default upload;
