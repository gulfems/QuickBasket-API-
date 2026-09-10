import express from 'express';
import { createOrder, getMyOrders, getOrderById, cancelOrder, getAvailableOrders, claimOrder, deliverOrder, getCourierOrders } from '../controllers/orderController.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { requireUser } from '../middleware/requireUser.js';
import { requireCourier } from '../middleware/requireCourier.js';

const router = express.Router();

router.post('/', requireAuth, requireUser, createOrder);
router.get('/', requireAuth, requireUser, getMyOrders);
router.get('/available', requireAuth, requireCourier, getAvailableOrders);
router.get('/assigned', requireAuth, requireCourier, getCourierOrders);
router.get('/:id', requireAuth, getOrderById);
router.put('/:id/cancel', requireAuth, requireUser, cancelOrder);
router.put('/:id/claim', requireAuth, requireCourier, claimOrder);
router.put('/:id/deliver', requireAuth, requireCourier, deliverOrder);

export default router;