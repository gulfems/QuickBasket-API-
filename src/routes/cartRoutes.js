import express from 'express';
import { getCart, addToCart, updateCartItem } from '../controllers/cartController.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { requireUser } from '../middleware/requireUser.js';

const router = express.Router();

router.get('/', requireAuth, requireUser, getCart);
router.post('/items', requireAuth, requireUser, addToCart);
router.put('/items/:id', requireAuth, requireUser, updateCartItem);
export default router;
