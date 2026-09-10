import express from 'express';
import { createOrder, getMyOrders, getOrderById, cancelOrder } from '../controllers/orderController.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { requireUser } from '../middleware/requireUser.js';

const router = express.Router();

router.post('/', requireAuth, requireUser, createOrder);
router.get('/', requireAuth, requireUser, getMyOrders);
router.get('/', requireAuth, requireUser, getMyOrders);
router.get('/:id', requireAuth, getOrderById);
router.put('/:id/cancel', requireAuth, requireUser, cancelOrder);

export default router;