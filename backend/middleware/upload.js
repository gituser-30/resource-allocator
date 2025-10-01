const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 1. Define storage destination and filename logic
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Create the 'uploads' directory if it doesn't exist
        const uploadDir = path.join(__dirname, '../uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir); 
    },
    filename: function (req, file, cb) {
        // Create a unique filename: timestamp-originalfilename.pdf
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileExtension = path.extname(file.originalname);
        // We use req.body.subject to try and make the name more readable, but rely on timestamp for uniqueness
        const subjectName = req.body.subject ? req.body.subject.replace(/\s+/g, '_') : 'file';
        cb(null, `${uniqueSuffix}-${subjectName}${fileExtension}`);
    }
});

// 2. Define file filter logic (only allow PDFs)
const fileFilter = (req, file, cb) => {
    // Check if the file is a PDF
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        // Reject the file and provide a custom error message
        cb(new Error('Only PDF files are allowed!'), false);
    }
};

// 3. Initialize multer with storage and filter configurations
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 10 // 10 MB limit per file
    }
});

module.exports = upload;