import express from 'express';
import { createOrder, getMyOrders, getOrderById, cancelOrder, getAvailableOrders, claimOrder, deliverOrder, getCourierOrders } from '../controllers/orderController.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { requireUser } from '../middleware/requireUser.js';
import { requireCourier } from '../middleware/requireCourier.js';

const router = express.Router();
/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Place an order from the cart. Runs in a transaction.
 *     description: >
 *       Validates the address, re-checks stock, enforces the 200 TL minimum,
 *       freezes prices into order_items, reduces stock, and empties the cart.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [address_id]
 *             properties:
 *               address_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Order placed, status preparing
 *       400:
 *         description: Empty cart, out of stock, or below the minimum basket
 *       401:
 *         description: No token or invalid token
 *       404:
 *         description: Address not found or not yours
 */
router.post('/', requireAuth, requireUser, createOrder);
/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: List your own orders, newest first
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: An array of orders
 *       401:
 *         description: No token or invalid token
 */
router.get('/', requireAuth, requireUser, getMyOrders);
/**
 * @swagger
 * /api/orders/available:
 *   get:
 *     summary: List unclaimed orders, oldest first (couriers only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: An array of orders with status preparing and no courier
 *       401:
 *         description: No token or invalid token
 *       403:
 *         description: Not a courier
 */
router.get('/available', requireAuth, requireCourier, getAvailableOrders);
/**
 * @swagger
 * /api/orders/assigned:
 *   get:
 *     summary: List the orders assigned to you (couriers only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: An array of orders
 *       401:
 *         description: No token or invalid token
 *       403:
 *         description: Not a courier
 */
router.get('/assigned', requireAuth, requireCourier, getCourierOrders);
/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get a single order. Owner, assigned courier, or admin.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The order id
 *     responses:
 *       200:
 *         description: The order
 *       401:
 *         description: No token or invalid token
 *       403:
 *         description: Not your order
 *       404:
 *         description: Order not found
 */
router.get('/:id', requireAuth, getOrderById);
/**
 * @swagger
 * /api/orders/{id}/cancel:
 *   put:
 *     summary: Cancel your own order, only while it is still preparing
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The order id
 *     responses:
 *       200:
 *         description: Order cancelled
 *       400:
 *         description: Order is no longer cancellable
 *       401:
 *         description: No token or invalid token
 *       403:
 *         description: Not your order
 *       404:
 *         description: Order not found
 */
router.put('/:id/cancel', requireAuth, requireUser, cancelOrder);
/**
 * @swagger
 * /api/orders/{id}/claim:
 *   put:
 *     summary: Claim an unassigned order (couriers only). Sets status to on_the_way.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The order id
 *     responses:
 *       200:
 *         description: Order claimed
 *       400:
 *         description: Order is not in preparing status
 *       401:
 *         description: No token or invalid token
 *       403:
 *         description: Not a courier
 *       404:
 *         description: Order not found
 *       409:
 *         description: Order already claimed by another courier
 */
router.put('/:id/claim', requireAuth, requireCourier, claimOrder);
/**
 * @swagger
 * /api/orders/{id}/deliver:
 *   put:
 *     summary: Mark an order delivered. Only the assigned courier can do this.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The order id
 *     responses:
 *       200:
 *         description: Order delivered
 *       400:
 *         description: Order is not on the way
 *       401:
 *         description: No token or invalid token
 *       403:
 *         description: Not the assigned courier
 *       404:
 *         description: Order not found
 */
router.put('/:id/deliver', requireAuth, requireCourier, deliverOrder);

export default router;