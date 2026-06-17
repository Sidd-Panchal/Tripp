import express from 'express';
import { getSharedItinerary, downloadSharedPDF } from '../controllers/shareController.js';

const router = express.Router();

// Publicly accessible endpoints
router.get('/:shareId', getSharedItinerary);
router.get('/:shareId/pdf', downloadSharedPDF);

export default router;
