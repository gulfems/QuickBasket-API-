import express from 'express';
import { registerCourier, loginCourier, getMeC } from '../controllers/courierController.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { requireCourier } from '../middleware/requireCourier.js';

const router = express.Router();

router.post('/register', registerCourier);
router.post('/login', loginCourier);
router.get('/me', requireAuth, requireCourier, getMeC);

export default router;

