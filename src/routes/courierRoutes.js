import express from 'express';
import { registerCourier, loginCourier, getMeC } from '../controllers/courierController.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { requireCourier } from '../middleware/requireCourier.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/register', authLimiter, registerCourier);
router.post('/login', authLimiter, loginCourier);
router.get('/me', requireAuth, requireCourier, getMeC);

export default router;

