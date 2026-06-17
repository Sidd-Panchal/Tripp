import rateLimit from 'express-rate-limit';

// Standard rate limiter: max 500 requests per 15 minutes
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter limiter for Auth & Generation endpoints
export const authAndGenerateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // max 30 attempts/generations per 15 mins
  message: {
    success: false,
    message: 'Too many authentication or generation attempts, please try again after 15 minutes',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
