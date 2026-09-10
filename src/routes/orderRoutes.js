import express from 'express';
import { createOrder } from '../controllers/orderController.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { requireUser } from '../middleware/requireUser.js';

const router = express.Router();

router.post('/', requireAuth, requireUser, createOrder);

export default router;