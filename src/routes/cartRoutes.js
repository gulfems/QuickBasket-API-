import express from 'express';
import { getCart, addToCart, updateCartItem, emptyCart, removeCartItem } from '../controllers/cartController.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { requireUser } from '../middleware/requireUser.js';

const router = express.Router();
/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Get the logged-in user's cart with product details
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: An array of cart items, each with product name and price
 *       401:
 *         description: No token or invalid token
 */
router.get('/', requireAuth, requireUser, getCart);
/**
 * @swagger
 * /api/cart/items:
 *   post:
 *     summary: Add a product to the cart, or increase its quantity if already there
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [product_id, quantity]
 *             properties:
 *               product_id:
 *                 type: integer
 *                 example: 1
 *               quantity:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       201:
 *         description: Product added to the cart
 *       200:
 *         description: Quantity increased on an existing cart item
 *       400:
 *         description: Missing fields, quantity below 1, or not enough stock
 *       401:
 *         description: No token or invalid token
 *       404:
 *         description: Product not found
 */
router.post('/items', requireAuth, requireUser, addToCart);
/**
 * @swagger
 * /api/cart/items/{id}:
 *   put:
 *     summary: Set the quantity of a cart item
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The cart item id, not the product id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [quantity]
 *             properties:
 *               quantity:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       200:
 *         description: Cart item updated
 *       400:
 *         description: Missing quantity, quantity below 1, or not enough stock
 *       401:
 *         description: No token or invalid token
 *       404:
 *         description: Cart or cart item not found
 */
router.put('/items/:id', requireAuth, requireUser, updateCartItem);
/**
 * @swagger
 * /api/cart/items/{id}:
 *   delete:
 *     summary: Remove a single item from the cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The cart item id
 *     responses:
 *       200:
 *         description: Item removed
 *       401:
 *         description: No token or invalid token
 *       404:
 *         description: Cart or cart item not found
 */
router.delete('/items/:id', requireAuth, requireUser, removeCartItem);
/**
 * @swagger
 * /api/cart:
 *   delete:
 *     summary: Empty the cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart emptied
 *       401:
 *         description: No token or invalid token
 *       404:
 *         description: Cart not found
 */
router.delete('/', requireAuth, requireUser, emptyCart);
export default router;
