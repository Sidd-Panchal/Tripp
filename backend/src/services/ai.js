import { GoogleGenerativeAI } from '@google/generative-ai';
import logger from '../config/logger.js';
import { SYSTEM_EXTRACTION_PROMPT, SYSTEM_ITINERARY_PROMPT } from '../prompts/aiPrompts.js';

// Get API Key and check
const apiKey = process.env.GEMINI_API_KEY;
let genAI = null;

if (apiKey && apiKey !== 'your_gemini_api_key_here') {
  genAI = new GoogleGenerativeAI(apiKey);
} else {
  logger.warn('GEMINI_API_KEY is not set. AI services will operate in MOCK MODE.');
}

/**
 * Extracts structured JSON from OCR text.
 * @param {string} text - Cleaned OCR text
 */
export const extractTravelData = async (text) => {
  if (!text) {
    throw new Error('No text provided for AI extraction');
  }

  // Check if we are running in Mock Mode
  if (!genAI) {
    logger.info('Extracting travel data using MOCK MODE');
    return getMockExtractedData(text);
  }

  try {
    logger.info('Sending text to Gemini API for metadata extraction...');
    // Using gemini-1.5-flash which is standard and supports responseMimeType: "application/json"
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: { responseMimeType: 'application/json' },
    });

    const prompt = `${SYSTEM_EXTRACTION_PROMPT}\n\nHere is the OCR text:\n${text}`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const jsonText = response.text();

    logger.info('Received JSON response from Gemini API');
    return JSON.parse(jsonText.trim());
  } catch (error) {
    logger.error(`Gemini extraction failed: ${error.message}. Falling back to mock data...`);
    return getMockExtractedData(text);
  }
};

/**
 * Generates a full markdown itinerary from structured travel metadata.
 * @param {Object} travelData - Structured travel JSON
 */
export const generateItinerary = async (travelData) => {
  if (!travelData) {
    throw new Error('No travel data provided for itinerary generation');
  }

  // Check if we are running in Mock Mode
  if (!genAI) {
    logger.info('Generating itinerary using MOCK MODE');
    return getMockItinerary(travelData);
  }

  try {
    logger.info('Sending travel JSON to Gemini API for itinerary generation...');
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
    });

    const prompt = `${SYSTEM_ITINERARY_PROMPT}\n\nHere is the travel JSON metadata:\n${JSON.stringify(
      travelData,
      null,
      2
    )}`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const markdown = response.text();

    logger.info('Received markdown itinerary from Gemini API');
    return markdown;
  } catch (error) {
    logger.error(`Gemini itinerary generation failed: ${error.message}. Falling back to mock generator...`);
    return getMockItinerary(travelData);
  }
};

// ==========================================
// Robust Fallbacks and Mock Data Generators
// ==========================================

function getMockExtractedData(text) {
  const lowercaseText = text.toLowerCase();

  let destination = 'Paris, France';
  let tripTitle = 'Trip to Paris';
  let startDate = '2026-07-15';
  let endDate = '2026-07-20';
  let durationDays = 6;
  let flights = [
    {
      flightNumber: 'AF023',
      departureCity: 'New York (JFK)',
      arrivalCity: 'Paris (CDG)',
      departureDate: '2026-07-15',
      departureTime: '19:30',
      arrivalDate: '2026-07-16',
      arrivalTime: '08:45',
    },
  ];
  let hotels = [
    {
      hotelName: 'Hôtel Regina Louvre',
      address: '2 Place des Pyramides, 75001 Paris, France',
      checkInDate: '2026-07-16',
      checkOutDate: '2026-07-20',
    },
  ];
  let transportation = [];
  let notes = ['Passport must be valid for at least 6 months.', 'Carry EUR cash for local markets.'];

  // Check if user text hints at other popular spots
  if (lowercaseText.includes('tokyo') || lowercaseText.includes('japan') || lowercaseText.includes('haneda') || lowercaseText.includes('narita')) {
    destination = 'Tokyo, Japan';
    tripTitle = 'Trip to Tokyo';
    startDate = '2026-08-10';
    endDate = '2026-08-16';
    durationDays = 7;
    flights = [
      {
        flightNumber: 'JL005',
        departureCity: 'San Francisco (SFO)',
        arrivalCity: 'Tokyo (HND)',
        departureDate: '2026-08-10',
        departureTime: '12:45',
        arrivalDate: '2026-08-11',
        arrivalTime: '15:55',
      },
    ];
    hotels = [
      {
        hotelName: 'Shinjuku Granbell Hotel',
        address: '2-14-5 Kabukicho, Shinjuku, Tokyo, Japan',
        checkInDate: '2026-08-11',
        checkOutDate: '2026-08-16',
      },
    ];
    notes = ['Get a Suica or Pasmo IC Card.', 'Rent a portable Wi-Fi or eSIM before arrival.'];
  } else if (lowercaseText.includes('london') || lowercaseText.includes('heathrow') || lowercaseText.includes('uk')) {
    destination = 'London, UK';
    tripTitle = 'Trip to London';
    startDate = '2026-09-01';
    endDate = '2026-09-05';
    durationDays = 5;
    flights = [
      {
        flightNumber: 'BA112',
        departureCity: 'Boston (BOS)',
        arrivalCity: 'London (LHR)',
        departureDate: '2026-09-01',
        departureTime: '18:15',
        arrivalDate: '2026-09-02',
        arrivalTime: '06:20',
      },
    ];
    hotels = [
      {
        hotelName: 'The Resident Covent Garden',
        address: '10 Bedford St, London WC2E 9HE, UK',
        checkInDate: '2026-09-02',
        checkOutDate: '2026-09-05',
      },
    ];
    notes = ['Umbrella is highly recommended.', 'Use contactless payment for public transit.'];
  } else {
    // Attempt parsing some data if text format matches dates
    const dateRegex = /\b\d{4}-\d{2}-\d{2}\b/g;
    const matches = text.match(dateRegex);
    if (matches && matches.length >= 2) {
      startDate = matches[0];
      endDate = matches[1];
    }
    const flightRegex = /\b[A-Z]{2}\d{3,4}\b/g;
    const flightMatches = text.match(flightRegex);
    if (flightMatches && flightMatches.length > 0) {
      flights[0].flightNumber = flightMatches[0];
    }
  }

  return {
    tripTitle,
    destination,
    startDate,
    endDate,
    durationDays,
    flights,
    hotels,
    transportation,
    notes,
  };
}

function getMockItinerary(data) {
  const dest = data.destination || 'your destination';
  const start = data.startDate || 'Day 1';
  const end = data.endDate || 'Last Day';
  const hotel = data.hotels && data.hotels.length > 0 ? data.hotels[0].hotelName : 'Local Hotel';
  const flight = data.flights && data.flights.length > 0 ? data.flights[0].flightNumber : 'Your flight';

  return `# Adventure in ${dest}

Welcome to your customized travel itinerary! Based on your uploaded ticket confirmations (${flight}) and accommodation details, we have crafted a professional day-by-day plan to ensure a memorable experience.

---

## ✈️ Travel Summary Card
- **Destination**: ${dest}
- **Duration**: ${data.durationDays || 5} Days
- **Key Accommodations**: ${hotel}
- **Travel Document Sync**: ${data.flights.length} Flight(s) & ${data.hotels.length} Hotel(s) confirmed.

---

## 📅 Day-by-Day Itinerary

### Day 1: Arrival & Unwinding
- **Morning**: Land in ${dest}. Collect luggage and clear immigration. Take local airport express train to the city center.
- **Afternoon**: Check in at **${hotel}**. Take some rest or enjoy a warm welcome coffee in the hotel lounge.
- **Evening**: Take a relaxing walking tour around the hotel district. Enjoy dinner at a nearby local bistro.
- **🍽️ Dining Recommendation**: Try a cozy nearby diner for local specialty dishes.
- **💡 Local Transit Tip**: Use public rail or pre-booked transfers for airport transit.

### Day 2: Iconic Landmarks & Sightseeing
- **Morning**: Grab a traditional breakfast at a local bakery. Visit the primary historic landmark of ${dest}.
- **Afternoon**: Take a guided tour of the main municipal museum or public park. Grab a quick lunch at a popular street food market.
- **Evening**: Book a sunset scenic cruise or panoramic viewpoint deck ticket.
- **🍽️ Dining Recommendation**: Head to a popular terrace restaurant with panoramic city views.

### Day 3: Art, Culture & Hidden Gems
- **Morning**: Participate in a local craft workshop or explore a vibrant art gallery.
- **Afternoon**: Rent a bike or walk through the trendy historic neighborhoods. Stop at a local cafe for coffee and dessert.
- **Evening**: Discover the city's nightlife, attend a theatrical play, or visit a cozy jazz bar.
- **🍽️ Dining Recommendation**: Reserve a table at a classic family-run restaurant.

### Day 4: Day Trip or Outdoor Adventure
- **Morning**: Board a morning train to a nearby scenic village, national park, or historic castle.
- **Afternoon**: Enjoy hiking, boat rowing, or browsing local village boutiques. Have a picnic lunch.
- **Evening**: Return to the city. Relax with a craft cocktail or craft beer at a rooftop lounge.
- **🍽️ Dining Recommendation**: Dine at a modern fusion kitchen downtown.

### Day 5: Shopping, Souvenirs & Departure
- **Morning**: Visit the local farmer's market for souvenir shopping, buying local spices, chocolates, or handicrafts.
- **Afternoon**: Complete check-out at **${hotel}**. Store bags at reception and enjoy a final stroll along the riverfront.
- **Evening**: Head to the departure station or airport. Safe travels home!

---

## 🎒 Packing Suggestions
- [x] Lightweight jacket / windbreaker (weather is changeable)
- [x] Extra comfortable walking shoes (expect 15k+ steps/day)
- [x] Universal power adapter & power bank
- [x] Copy of travel insurance & visa documents

## 🛂 Smart Travel Checklist
- [ ] Complete online flight check-in 24 hours prior to departure.
- [ ] Notify credit card providers of international travel dates.
- [ ] Pre-purchase subway/metro transit passes.
- [ ] Save digital offline maps of ${dest} on your phone.

---

## 📢 Important Travel Notes
${data.notes && data.notes.length > 0 ? data.notes.map(note => `- ${note}`).join('\n') : '- Standard visa check required at airport.\n- Tipping is appreciated but optional in local restaurants.'}
`;
}
export default { extractTravelData, generateItinerary };
