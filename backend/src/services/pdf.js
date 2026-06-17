import PDFDocument from 'pdfkit';
import logger from '../config/logger.js';

/**
 * Generate a PDF document from itinerary details.
 * @param {Object} itinerary - Itinerary document from database
 * @param {res} stream - Express response stream or write stream
 */
export const generateItineraryPDF = (itinerary, stream) => {
  logger.info(`Starting PDF generation for itinerary: ${itinerary.title}`);

  const doc = new PDFDocument({
    margin: 50,
    size: 'A4',
    bufferPages: true,
  });

  // Pipe to output stream
  doc.pipe(stream);

  // Setup Styles & Colors
  const primaryColor = '#4F46E5'; // Indigo-600
  const secondaryColor = '#0EA5E9'; // Sky-500
  const darkColor = '#1F2937'; // Gray-800
  const lightGray = '#F3F4F6'; // Gray-100
  const textMuted = '#4B5563'; // Gray-600

  // 1. BRANDING HEADER
  doc
    .rect(0, 0, 595.28, 120) // Full width header banner (A4 width is 595.28)
    .fill(primaryColor);

  doc
    .fillColor('#FFFFFF')
    .fontSize(28)
    .font('Helvetica-Bold')
    .text('TRRIP AI', 50, 40);

  doc
    .fontSize(12)
    .font('Helvetica')
    .text('Your Personal Smart Travel Planner', 50, 75);

  doc.moveDown(4); // Move cursor down past header

  // 2. TRAVEL SUMMARY CARD
  doc
    .fillColor(darkColor)
    .fontSize(20)
    .font('Helvetica-Bold')
    .text(itinerary.title, 50, 140);

  if (itinerary.destination) {
    doc
      .fontSize(12)
      .fillColor(textMuted)
      .font('Helvetica-Oblique')
      .text(`Destination: ${itinerary.destination}`, 50, 165);
  }

  // Draw a clean separator line
  doc
    .moveTo(50, 185)
    .lineTo(545, 185)
    .strokeColor(lightGray)
    .lineWidth(2)
    .stroke();

  // 3. FLIGHT & HOTEL CONFIRMATION SNAPSHOTS
  doc.moveDown(4.5);
  let currentY = doc.y;

  // Add Flights summary if any
  const flights = itinerary.extractedData?.flights || [];
  const hotels = itinerary.extractedData?.hotels || [];

  if (flights.length > 0 || hotels.length > 0) {
    doc
      .fillColor(primaryColor)
      .fontSize(14)
      .font('Helvetica-Bold')
      .text('Travel Sync Details', 50, currentY);

    doc.moveDown(0.5);

    if (flights.length > 0) {
      doc
        .fillColor(darkColor)
        .fontSize(10)
        .font('Helvetica-Bold')
        .text('Confirmed Flights:');
      
      flights.forEach((f) => {
        doc
          .font('Helvetica')
          .fillColor(textMuted)
          .text(`  • ${f.flightNumber}: ${f.departureCity} ➔ ${f.arrivalCity} (${f.departureDate} ${f.departureTime || ''})`, { lineGap: 3 });
      });
    }

    if (hotels.length > 0) {
      doc.moveDown(0.5);
      doc
        .fillColor(darkColor)
        .fontSize(10)
        .font('Helvetica-Bold')
        .text('Confirmed Accommodations:');
      
      hotels.forEach((h) => {
        doc
          .font('Helvetica')
          .fillColor(textMuted)
          .text(`  • ${h.hotelName} (Check-in: ${h.checkInDate} | Check-out: ${h.checkOutDate})`, { lineGap: 3 });
      });
    }

    doc.moveDown(1.5);
    // Draw another separator line
    doc
      .moveTo(50, doc.y)
      .lineTo(545, doc.y)
      .strokeColor(lightGray)
      .lineWidth(1)
      .stroke();
    
    doc.moveDown(1);
  }

  // 4. DAY-WISE ITINERARY DETAILS (PARSE MARKDOWN)
  const itineraryText = itinerary.generatedItinerary;
  const lines = itineraryText.split('\n');

  doc.fillColor(darkColor);

  lines.forEach((line) => {
    // Strip trailing/leading space
    const trimmed = line.trim();
    if (!trimmed) {
      doc.moveDown(0.5);
      return;
    }

    // Process headers and markdown tags
    if (trimmed.startsWith('# ')) {
      // Main Document Title
      const text = trimmed.substring(2).replace(/\*\*/g, '');
      doc.moveDown(1);
      doc
        .font('Helvetica-Bold')
        .fontSize(22)
        .fillColor(primaryColor)
        .text(text, { paragraphGap: 10 });
    } else if (trimmed.startsWith('## ')) {
      // Subtitle
      const text = trimmed.substring(3).replace(/\*\*/g, '');
      doc.moveDown(0.8);
      doc
        .font('Helvetica-Bold')
        .fontSize(16)
        .fillColor(secondaryColor)
        .text(text, { paragraphGap: 8 });
    } else if (trimmed.startsWith('### ')) {
      // Day title
      const text = trimmed.substring(4).replace(/\*\*/g, '');
      doc.moveDown(0.6);
      doc
        .font('Helvetica-Bold')
        .fontSize(12)
        .fillColor(darkColor)
        .text(text, { paragraphGap: 6 });
    } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      // Bullet list item
      const text = trimmed.substring(2).replace(/\*\*/g, '');
      doc
        .font('Helvetica')
        .fontSize(10)
        .fillColor(textMuted)
        .text(`• ${text}`, {
          indent: 15,
          paragraphGap: 4,
          lineGap: 2,
        });
    } else if (trimmed.startsWith('- [ ]') || trimmed.startsWith('- [x]')) {
      // Checklist item
      const text = trimmed.substring(5).replace(/\*\*/g, '');
      const box = trimmed.includes('[x]') ? '☒ ' : '☐ ';
      doc
        .font('Helvetica')
        .fontSize(10)
        .fillColor(textMuted)
        .text(`${box} ${text}`, {
          indent: 15,
          paragraphGap: 4,
          lineGap: 2,
        });
    } else {
      // Standard paragraph
      const text = trimmed.replace(/\*\*/g, '');
      doc
        .font('Helvetica')
        .fontSize(10)
        .fillColor(textMuted)
        .text(text, {
          paragraphGap: 6,
          lineGap: 3,
        });
    }
  });

  // 5. FOOTER & PAGINATION PAGE NUMBERS
  const range = doc.bufferedPageRange();
  for (let i = range.start; i < range.start + range.count; i++) {
    doc.switchToPage(i);

    // Draw bottom border / line on each page
    doc
      .moveTo(50, 790)
      .lineTo(545, 790)
      .strokeColor(lightGray)
      .lineWidth(1)
      .stroke();

    // Footer Text
    doc
      .fontSize(8)
      .fillColor(textMuted)
      .text(
        `Generated by Trrip AI Travel Planner | Platform Page: ${i + 1} of ${range.count}`,
        50,
        800,
        { align: 'center', width: 495 }
      );
  }

  // End Document
  doc.end();
  logger.info(`Successfully finished PDF generation.`);
};

export default { generateItineraryPDF };
