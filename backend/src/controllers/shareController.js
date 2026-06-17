import Itinerary from '../models/Itinerary.js';
import { generateItineraryPDF } from '../services/pdf.js';
import logger from '../config/logger.js';

/**
 * @desc    Get public shared itinerary details
 * @route   GET /api/share/:shareId
 * @access  Public
 */
export const getSharedItinerary = async (req, res, next) => {
  try {
    const { shareId } = req.params;

    const itinerary = await Itinerary.findOne({ shareId });

    if (!itinerary) {
      res.status(404);
      throw new Error('Shared itinerary not found or invalid link');
    }

    // Return the itinerary, excluding sensitive user reference detail or internal fields if needed
    res.json({
      success: true,
      itinerary: {
        title: itinerary.title,
        destination: itinerary.destination,
        extractedData: itinerary.extractedData,
        generatedItinerary: itinerary.generatedItinerary,
        shareId: itinerary.shareId,
        createdAt: itinerary.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Download public shared itinerary as PDF
 * @route   GET /api/share/:shareId/pdf
 * @access  Public
 */
export const downloadSharedPDF = async (req, res, next) => {
  try {
    const { shareId } = req.params;

    const itinerary = await Itinerary.findOne({ shareId });

    if (!itinerary) {
      res.status(404);
      throw new Error('Shared itinerary not found or invalid link');
    }

    const safeTitle = itinerary.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="itinerary_${safeTitle}.pdf"`);

    logger.info(`Streaming public PDF for shared itinerary: ${shareId}`);
    generateItineraryPDF(itinerary, res);
  } catch (error) {
    next(error);
  }
};

export default { getSharedItinerary, downloadSharedPDF };
