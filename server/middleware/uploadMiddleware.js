/**
 * Multer Upload Middleware
 * Configures file upload handling for complaint images
 */

const multer = require('multer');
const path = require('path');
const { MAX_FILE_SIZE, ALLOWED_MIME_TYPES } = require('../utils/fileValidator');

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Store files in uploads/complaints directory
    cb(null, path.join(__dirname, '../uploads/complaints'));
  },
  filename: function (req, file, cb) {
    // Generate filename: timestamp_random_originalname
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9]/g, '_')
      .substring(0, 20);
    
    const filename = `${timestamp}_${randomString}_${baseName}${ext}`;
    cb(null, filename);
  }
});

// Configure file filter
const fileFilter = (req, file, cb) => {
  // Accept images only
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type: ${file.mimetype}. Allowed types: jpg, jpeg, png, webp`), false);
  }
};

// Create multer instance
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE, // 5MB
    files: 3 // Maximum 3 files per request
  }
});

module.exports = upload;
