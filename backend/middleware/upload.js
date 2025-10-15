// middleware/upload.js
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();

// Ensure env variables are present
if (!process.env.CLOUD_NAME || !process.env.CLOUD_API_KEY || !process.env.CLOUD_API_SECRET) {
  console.error("❌ Cloudinary environment variables missing! Check your .env file.");
}

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
    folder: "uploads", // You can change folder name here
    allowed_formats: ["pdf", "jpg", "jpeg", "png"],
    public_id: `${Date.now()}-${file.originalname.split(".")[0]}`,
    resource_type: "auto", // Handles pdf, image, etc.
  }),
});

// ---------------- Multer Instance ----------------
const upload = multer({ storage });

module.exports = upload;
