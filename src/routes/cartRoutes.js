import express from 'express';
import { getCart, addToCart, updateCartItem, emptyCart, removeCartItem } from '../controllers/cartController.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { requireUser } from '../middleware/requireUser.js';

const router = express.Router();

router.get('/', requireAuth, requireUser, getCart);
router.post('/items', requireAuth, requireUser, addToCart);
router.put('/items/:id', requireAuth, requireUser, updateCartItem);
router.delete('/items/:id', requireAuth, requireUser, removeCartItem);
router.delete('/', requireAuth, requireUser, emptyCart);
export default router;
