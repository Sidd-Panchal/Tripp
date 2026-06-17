import express from 'express';
import { protect } from '../middleware/auth.js';
import { upload } from '../services/storage.js';
import logger from '../config/logger.js';

const router = express.Router();

/**
 * @desc    Upload documents
 * @route   POST /api/upload
 * @access  Private
 */
router.post('/', protect, (req, res, next) => {
  // Support upload of up to 5 travel files at a time
  upload.array('files', 5)(req, res, (err) => {
    if (err) {
      logger.error(`Multer upload error: ${err.message}`);
      return res.status(400).json({ success: false, message: err.message });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'Please upload at least one file' });
    }

    try {
      const fileMetadata = req.files.map((file) => ({
        originalName: file.originalname,
        filename: file.filename,
        path: file.path,
        mimeType: file.mimetype,
        size: file.size,
      }));

      logger.info(`Successfully uploaded ${req.files.length} file(s) for user ${req.user._id}`);
      return res.status(200).json({
        success: true,
        files: fileMetadata,
      });
    } catch (error) {
      logger.error(`Upload controller post-processing failed: ${error.message}`);
      next(error);
    }
  });
});

export default router;
