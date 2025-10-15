// middleware/upload.js
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "uploads", // you can change folder name here
    allowed_formats: ["pdf", "jpg", "jpeg", "png"],
    public_id: `${Date.now()}-${file.originalname.split(".")[0]}`,
  }),
});

const upload = multer({ storage });
module.exports = upload;
