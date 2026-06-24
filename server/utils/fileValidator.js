/**
 * File Validator Utility
 * Validates uploaded files for type, size, and other constraints
 */

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_IMAGES_PER_COMPLAINT = 3;

/**
 * Validate a single file
 * @param {Object} file - Multer file object
 * @returns {Object} - { isValid: boolean, error: string|null }
 */
const validateFile = (file) => {
  if (!file) {
    return { isValid: false, error: 'No file provided' };
  }

  // Check MIME type
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    return {
      isValid: false,
      error: `Invalid file type: ${file.mimetype}. Allowed types: jpg, jpeg, png, webp`
    };
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: `File size exceeds maximum limit of 5MB. Your file: ${(file.size / (1024 * 1024)).toFixed(2)}MB`
    };
  }

  // Check file extension
  const fileExtension = file.originalname.split('.').pop().toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(fileExtension)) {
    return {
      isValid: false,
      error: `Invalid file extension: .${fileExtension}. Allowed: jpg, jpeg, png, webp`
    };
  }

  return { isValid: true, error: null };
};

/**
 * Validate multiple files
 * @param {Array} files - Array of Multer file objects
 * @returns {Object} - { isValid: boolean, error: string|null }
 */
const validateFiles = (files) => {
  if (!files || files.length === 0) {
    return { isValid: true, error: null };
  }

  // Check maximum number of images
  if (files.length > MAX_IMAGES_PER_COMPLAINT) {
    return {
      isValid: false,
      error: `Maximum ${MAX_IMAGES_PER_COMPLAINT} images allowed per complaint. You provided ${files.length}`
    };
  }

  // Validate each file
  for (const file of files) {
    const validation = validateFile(file);
    if (!validation.isValid) {
      return validation;
    }
  }

  return { isValid: true, error: null };
};

/**
 * Generate a unique, sanitized filename
 * @param {Object} file - Multer file object
 * @returns {string} - Sanitized filename
 */
const generateSafeFilename = (file) => {
  // Get file extension
  const extension = file.originalname.split('.').pop().toLowerCase();
  
  // Generate unique filename: timestamp_randomstring_originalname
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const sanitized = file.originalname
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .substring(0, 20);
  
  return `complaint_${timestamp}_${randomString}_${sanitized}.${extension}`;
};

/**
 * Create image metadata object
 * @param {Object} file - Multer file object
 * @param {string} filename - Generated filename
 * @param {string} baseUrl - Base URL for image access
 * @returns {Object} - Image metadata
 */
const createImageMetadata = (file, filename, baseUrl) => {
  return {
    url: `${baseUrl}/${filename}`,
    filename: filename,
    originalName: file.originalname,
    uploadedAt: new Date()
  };
};

module.exports = {
  ALLOWED_MIME_TYPES,
  ALLOWED_EXTENSIONS,
  MAX_FILE_SIZE,
  MAX_IMAGES_PER_COMPLAINT,
  validateFile,
  validateFiles,
  generateSafeFilename,
  createImageMetadata
};
