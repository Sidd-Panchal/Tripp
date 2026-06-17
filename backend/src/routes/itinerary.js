import express from 'express';
import {
  generate,
  getItineraries,
  getItineraryById,
  deleteItinerary,
  regenerate,
  downloadPDF,
} from '../controllers/itineraryController.js';
import { protect } from '../middleware/auth.js';
import { authAndGenerateLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Mounts at /api/itineraries (List, details, delete, regenerate, pdf download)
router.get('/', protect, getItineraries);
router.get('/:id', protect, getItineraryById);
router.delete('/:id', protect, deleteItinerary);
router.post('/:id/regenerate', protect, authAndGenerateLimiter, regenerate);
router.get('/:id/pdf', protect, downloadPDF);

// Handles generation (will be mapped at /api/itinerary/generate in index.js)
router.post('/generate', protect, authAndGenerateLimiter, generate);

export default router;
