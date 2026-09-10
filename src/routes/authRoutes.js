import express from 'express';
import { registerUser, loginUser, getMe } from '../controllers/authController.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { requireUser } from '../middleware/requireUser.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/register', authLimiter, registerUser);
router.post('/login', authLimiter, loginUser);
router.get('/me', requireAuth, requireUser, getMe);

export default router;

