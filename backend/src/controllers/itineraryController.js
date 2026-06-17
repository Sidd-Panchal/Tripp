import Itinerary from '../models/Itinerary.js';
import { extractText } from '../services/ocr.js';
import { extractTravelData, generateItinerary } from '../services/ai.js';
import { generateItineraryPDF } from '../services/pdf.js';
import { deleteFile } from '../services/storage.js';
import { generateItinerarySchema } from '../utils/validation.js';
import logger from '../config/logger.js';

/**
 * @desc    Generate a new itinerary from uploaded travel documents
 * @route   POST /api/itinerary/generate
 * @access  Private
 */
export const generate = async (req, res, next) => {
  try {
    // Validate uploaded files payload
    const parsed = generateItinerarySchema.parse(req.body);
    const { files } = parsed;

    logger.info(`Processing ${files.length} document(s) for user ${req.user._id}`);

    // Step 1 & 2: Extract text from files
    let aggregatedText = '';
    for (let index = 0; index < files.length; index++) {
      const file = files[index];
      try {
        const text = await extractText(file);
        aggregatedText += `\n--- Document ${index + 1}: ${file.originalName} ---\n${text}\n`;
      } catch (err) {
        logger.warn(`OCR failed for file: ${file.originalName}. Skipping text...`);
      }
    }

    if (!aggregatedText.trim()) {
      res.status(400);
      throw new Error('Failed to extract readable text from any of the uploaded documents. Please check file legibility.');
    }

    // Step 3 & 4: Run AI data extraction
    const extractedData = await extractTravelData(aggregatedText);

    // Step 5: Run AI itinerary generation
    const generatedMarkdown = await generateItinerary(extractedData);

    // Prepare itinerary attributes
    const destination = extractedData.destination || 'Unknown Destination';
    const title = extractedData.tripTitle || `Trip to ${destination}`;
    
    // Create new itinerary in DB
    const itinerary = await Itinerary.create({
      userId: req.user._id,
      title,
      destination,
      extractedData,
      generatedItinerary: generatedMarkdown,
      uploadedFiles: files,
    });

    logger.info(`Successfully generated itinerary ${itinerary._id} for user ${req.user._id}`);
    res.status(201).json({
      success: true,
      itinerary,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all user itineraries (with search, filter, and pagination)
 * @route   GET /api/itineraries
 * @access  Private
 */
export const getItineraries = async (req, res, next) => {
  try {
    const { search, destination, page = 1, limit = 10 } = req.query;

    const query = { userId: req.user._id };

    // Search query
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { destination: { $regex: search, $options: 'i' } },
      ];
    }

    // Filter by destination
    if (destination) {
      query.destination = { $regex: destination, $options: 'i' };
    }

    // Pagination setup
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const count = await Itinerary.countDocuments(query);
    const itineraries = await Itinerary.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.json({
      success: true,
      count,
      totalPages: Math.ceil(count / limitNum),
      currentPage: pageNum,
      itineraries,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get detailed itinerary by ID
 * @route   GET /api/itineraries/:id
 * @access  Private
 */
export const getItineraryById = async (req, res, next) => {
  try {
    const itinerary = await Itinerary.findById(req.params.id);

    if (!itinerary) {
      res.status(404);
      throw new Error('Itinerary not found');
    }

    // Authorization check
    if (itinerary.userId.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to access this itinerary');
    }

    res.json({
      success: true,
      itinerary,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete itinerary and clean up associated files
 * @route   DELETE /api/itineraries/:id
 * @access  Private
 */
export const deleteItinerary = async (req, res, next) => {
  try {
    const itinerary = await Itinerary.findById(req.params.id);

    if (!itinerary) {
      res.status(404);
      throw new Error('Itinerary not found');
    }

    // Authorization check
    if (itinerary.userId.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to delete this itinerary');
    }

    // Clean up local files
    if (itinerary.uploadedFiles && itinerary.uploadedFiles.length > 0) {
      for (const file of itinerary.uploadedFiles) {
        if (file.path) {
          await deleteFile(file.path);
        }
      }
    }

    await itinerary.deleteOne();

    logger.info(`Successfully deleted itinerary ${req.params.id}`);
    res.json({
      success: true,
      message: 'Itinerary and associated files deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Regenerate itinerary with custom instructions or fresh content
 * @route   POST /api/itineraries/:id/regenerate
 * @access  Private
 */
export const regenerate = async (req, res, next) => {
  try {
    const itinerary = await Itinerary.findById(req.params.id);

    if (!itinerary) {
      res.status(404);
      throw new Error('Itinerary not found');
    }

    // Authorization check
    if (itinerary.userId.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to regenerate this itinerary');
    }

    logger.info(`Regenerating itinerary ${itinerary._id}`);

    // Call generator again with the saved extracted metadata
    const freshMarkdown = await generateItinerary(itinerary.extractedData);

    // Update in DB
    itinerary.generatedItinerary = freshMarkdown;
    await itinerary.save();

    res.json({
      success: true,
      itinerary,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Download itinerary as PDF
 * @route   GET /api/itineraries/:id/pdf
 * @access  Private
 */
export const downloadPDF = async (req, res, next) => {
  try {
    const itinerary = await Itinerary.findById(req.params.id);

    if (!itinerary) {
      res.status(404);
      throw new Error('Itinerary not found');
    }

    // Authorization check
    if (itinerary.userId.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to download this itinerary');
    }

    // Configure Headers for PDF download
    const safeTitle = itinerary.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="itinerary_${safeTitle}.pdf"`);

    // Stream PDF directly to client response
    generateItineraryPDF(itinerary, res);
  } catch (error) {
    next(error);
  }
};

export default { generate, getItineraries, getItineraryById, deleteItinerary, regenerate, downloadPDF };
