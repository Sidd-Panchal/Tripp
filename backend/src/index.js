import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup ES Module Directory Paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load Config
dotenv.config({ path: path.join(__dirname, '../.env') });

import connectDB from './config/db.js';
import logger from './config/logger.js';

// Validate crucial environment variables at startup
if (!process.env.JWT_SECRET) {
  logger.error('CRITICAL CONFIGURATION ERROR: JWT_SECRET environment variable is not defined.');
  process.exit(1);
}

if (process.env.NODE_ENV === 'production') {
  if (!process.env.MONGO_URI) {
    logger.error('CRITICAL CONFIGURATION ERROR: MONGO_URI environment variable is required in production mode.');
    process.exit(1);
  }
  if (process.env.JWT_SECRET === 'supersecretjwtkeyforlocaldevelopmentonlychangeinprod') {
    logger.warn('SECURITY WARNING: Using the default development JWT_SECRET in production is highly insecure! Please set a unique, strong key.');
  }
}

import errorHandler from './middleware/errorHandler.js';
import { apiLimiter } from './middleware/rateLimiter.js';

import authRoutes from './routes/auth.js';
import uploadRoutes from './routes/upload.js';
import itineraryRoutes from './routes/itinerary.js';
import shareRoutes from './routes/share.js';

// Initialize DB
connectDB();

const app = express();

// Security Headers
app.use(
  helmet({
    crossOriginResourcePolicy: false, // Allows cross-origin image sharing
  })
);

// CORS Policy Setup
const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS
  ? process.env.CORS_ALLOWED_ORIGINS.split(',').map((origin) => origin.trim())
  : '*';

if (process.env.NODE_ENV === 'production' && allowedOrigins === '*') {
  logger.warn('SECURITY WARNING: CORS is configured to allow all origins (*) in production. It is recommended to restrict this to trusted domains via CORS_ALLOWED_ORIGINS.');
}

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, server-to-server, curl, or postman)
    if (!origin || allowedOrigins === '*' || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS policy'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

// Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request Logger Middleware
app.use((req, res, next) => {
  logger.info(`HTTP ${req.method} ${req.url}`);
  next();
});

// Apply General Rate Limiter to API
app.use('/api', apiLimiter);



// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes Hookups
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/itinerary', itineraryRouterProxy); // Handled by mounting
app.use('/api/itineraries', itineraryRoutes);
app.use('/api/share', shareRoutes);

// Helper mapping to support both paths from the same router
function itineraryRouterProxy(req, res, next) {
  // Pass to itinerary routes directly
  return itineraryRoutes(req, res, next);
}

// Base Route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Trrip AI API is running successfully',
  });
});

// Centralized Error Handling
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
