import fs from 'fs';
import pdfParse from 'pdf-parse';
import Tesseract from 'tesseract.js';
import logger from '../config/logger.js';

/**
 * Clean extracted text by removing extra spaces, control characters,
 * and normalizing newlines.
 */
export const cleanText = (text) => {
  if (!text) return '';
  return text
    .replace(/[\r\n]+/g, '\n') // Normalize newlines
    .replace(/[ \t]+/g, ' ')   // Collapse spaces and tabs
    .replace(/\n\s+\n/g, '\n')  // Collapse multiple empty lines
    .trim();
};

/**
 * Extract text from a file (PDF or Image) based on its mimeType.
 * @param {Object} file - Multer file object
 */
export const extractText = async (file) => {
  const { path: filePath, mimetype } = file;
  logger.info(`Starting text extraction for: ${file.originalname} (${mimetype})`);

  try {
    let rawText = '';

    if (mimetype === 'application/pdf') {
      const fileBuffer = await fs.promises.readFile(filePath);
      const data = await pdfParse(fileBuffer);
      rawText = data.text;
      logger.info(`Successfully parsed PDF text using pdf-parse`);
    } else if (mimetype.startsWith('image/')) {
      logger.info(`Running Tesseract OCR on image: ${filePath}`);
      const result = await Tesseract.recognize(filePath, 'eng');
      rawText = result.data.text;
      logger.info(`Successfully parsed image text using Tesseract.js`);
    } else {
      throw new Error(`Unsupported MIME type: ${mimetype}`);
    }

    const cleaned = cleanText(rawText);
    logger.info(`Extraction complete. Length: ${cleaned.length} characters.`);
    return cleaned;
  } catch (error) {
    logger.error(`OCR processing failed for ${file.originalname}: ${error.message}`);
    throw new Error(`Failed to extract text from document: ${error.message}`);
  }
};

export default { extractText, cleanText };
