import express from 'express';
import { createPaymentIntent } from '../controllers/paymentController.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { requireUser } from '../middleware/requireUser.js';

const router = express.Router();

router.post('/create-intent', requireAuth, requireUser, createPaymentIntent);

export default router;
