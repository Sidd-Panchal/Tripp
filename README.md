# Trrip AI - Travel Itinerary Planner ✈️

Trrip AI is a production-ready, MERN stack SaaS application that automates travel itinerary planning. Users upload booking confirmations (flights, hotels, trains, etc.), and the system processes them using OCR, structures the metadata via Gemini AI, and generates a day-wise Markdown travel plan.

---

## Key Features

- **Receipt OCR Pipeline**: Instantly processes PDF files (using `pdf-parse`) and image files (PNG/JPG/JPEG using `Tesseract.js`).
- **AI Structured Extraction**: Classifies data into flights, hotel stays, local transportation, and travel notes using Google's Gemini API (`gemini-1.5-flash` with JSON output mode).
- **Day-Wise Planner**: Generates full day-by-day itineraries, including local sights, dining recommendations, and transit tips.
- **Export to PDF**: Generate clean, branded PDFs from your trip plan using `pdfkit`.
- **Public Share Links**: Share itineraries with other users using unique UUID-based share tokens.
- **Bonus Utilities**:
  - 🌓 Dark/Light Mode toggle.
  - 🌦️ Destination Weather Widget (supports Tokyo, Paris, London, and global defaults).
  - 📋 Smart Travel checklist with progress tracking.
  - 🛡️ Centralized error handling and Express rate limiting.

---

## Tech Stack

- **Frontend**: React.js (Vite), React Router, Axios, Tailwind CSS, Framer Motion, React Hook Form, React Dropzone.
- **Backend**: Node.js, Express.js, JWT Authentication, Multer, MongoDB + Mongoose.
- **AI & OCR**: Gemini API SDK (`@google/generative-ai`), `pdf-parse`, `tesseract.js`.
- **PDF Generation**: `pdfkit`.

---

## Directory Structure

```text
├── backend/
│   ├── src/
│   │   ├── config/       # Winston Logger, Database connection
│   │   ├── controllers/  # Auth, Itinerary, Share controller actions
│   │   ├── middleware/   # JWT verification, global error handler, rate limits
│   │   ├── models/       # Mongoose User and Itinerary schemas
│   │   ├── prompts/      # AI extraction system instructions
│   │   ├── routes/       # API endpoints (Auth, Upload, Itinerary, Share)
│   │   ├── services/     # AI, OCR, PDF generation, Local/S3 storage layers
│   │   └── utils/        # Zod request validators
│   └── index.js          # Express entrypoint
│
├── frontend/
│   ├── src/
│   │   ├── components/   # Navbar, Sidebar, WeatherWidget, Checklist, Skeletons
│   │   ├── context/      # Auth, Theme, and Toast Providers
│   │   ├── layouts/      # Main and Dashboard frame wrappers
│   │   ├── pages/        # Landing, Login, Signup, Dashboard, Upload, Details
│   │   ├── routes/       # Protected routing layers
│   │   ├── services/     # Axios client configuration
│   │   └── index.css     # Tailwind imports and premium CSS variables
│   └── index.html        # Main template
│
└── package.json          # Root scripts runner
```

---

## Quick Start Setup

### 1. Prerequisites
- **Node.js** (v18 or higher recommended)
- **MongoDB** (running locally or a MongoDB Atlas URI string)

### 2. Configuration Setup
Create a `.env` file inside the `backend/` directory (you can copy `backend/.env.example` as a template):
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/trrip
JWT_SECRET=supersecretjwtkeyforlocaldevelopmentonlychangeinprod
GEMINI_API_KEY=your_gemini_api_key_here
NODE_ENV=development
```
*Note: If `GEMINI_API_KEY` is omitted, the application will automatically enter **Mock Mode**, allowing developers to test features with simulated tickets for Tokyo, Paris, or London without needing a key.*

### 3. Installation
To install dependencies for all services (root, backend, and frontend) in one command, run:
```bash
npm run setup
```

### 4. Running the Application
Start both the backend server and the frontend client concurrently by running:
```bash
npm run dev
```
- Frontend runs at: [http://localhost:3000](http://localhost:3000)
- Backend runs at: [http://localhost:5000](http://localhost:5000)

---

## API Documentation

### Auth Module
- `POST /api/auth/register` - Register a new user.
- `POST /api/auth/login` - Authenticate credentials and receive a JWT.
- `GET /api/auth/me` - Retrieve current user details (Private).

### Upload Module
- `POST /api/upload` - Upload up to 5 booking receipts (Private).

### Itinerary Module
- `POST /api/itinerary/generate` - Perform OCR and AI compilation on uploaded documents (Private).
- `GET /api/itineraries` - Retrieve user itineraries with search & filters (Private).
- `GET /api/itineraries/:id` - Fetch itinerary detail card (Private).
- `DELETE /api/itineraries/:id` - Delete itinerary and associated files (Private).
- `POST /api/itineraries/:id/regenerate` - Freshly regenerate the itinerary layout (Private).
- `GET /api/itineraries/:id/pdf` - Export branded PDF stream (Private).

### Public Sharing
- `GET /api/share/:shareId` - Publicly fetch shared itinerary cards (Public).
- `GET /api/share/:shareId/pdf` - Publicly download shared itinerary PDFs (Public).
