import multer from 'multer';
import path from 'path';
import fs from 'fs';
import logger from '../config/logger.js';

// Setup upload directory (can be overridden in production for persistent storage volumes)
const UPLOAD_DIR = process.env.UPLOAD_DIR || './uploads';
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

// File Filter (Accept only PDFs and Images)
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'application/pdf',
    'image/png',
    'image/jpeg',
    'image/jpg',
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, PNG, JPG, and JPEG are allowed.'), false);
  }
};

// Multer Upload Instance
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// Storage service helper to delete files
export const deleteFile = async (filePath) => {
  try {
    if (!filePath) return;
    
    // Resolve full path
    const resolvedPath = path.resolve(filePath);
    
    // Check if file exists before trying to delete it
    if (fs.existsSync(resolvedPath)) {
      await fs.promises.unlink(resolvedPath);
      logger.info(`Successfully deleted file from storage: ${filePath}`);
    } else {
      logger.warn(`File to delete not found: ${filePath}`);
    }
  } catch (error) {
    logger.error(`Error deleting file ${filePath}: ${error.message}`);
  }
};
export default { upload, deleteFile };
