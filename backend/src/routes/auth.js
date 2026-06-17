import express from 'express';
import { register, login, getMe } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { authAndGenerateLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/register', authAndGenerateLimiter, register);
router.post('/login', authAndGenerateLimiter, login);
router.get('/me', protect, getMe);

export default router;
