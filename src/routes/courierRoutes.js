import express from 'express';
import { registerCourier, loginCourier, getMeC } from '../controllers/courierController.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { requireCourier } from '../middleware/requireCourier.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();
/**
 * @swagger
 * /api/courier/register:
 *   post:
 *     summary: Register a new courier
 *     tags: [Courier]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password, phone]
 *             properties:
 *               email:
 *                 type: string
 *                 example: courier@example.com
 *               password:
 *                 type: string
 *                 example: test1234
 *               phone:
 *                 type: string
 *                 example: "5559998877"
 *     responses:
 *       201:
 *         description: Courier created
 *       400:
 *         description: Missing fields or invalid email
 *       409:
 *         description: Email already registered
 */
router.post('/register', authLimiter, registerCourier);
/**
 * @swagger
 * /api/courier/login:
 *   post:
 *     summary: Log in as a courier
 *     tags: [Courier]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: courier@example.com
 *               password:
 *                 type: string
 *                 example: test1234
 *     responses:
 *       200:
 *         description: Login successful, returns a JWT
 *       400:
 *         description: Email and password are required
 *       401:
 *         description: Invalid email or password
 */
router.post('/login', authLimiter, loginCourier);
/**
 * @swagger
 * /api/courier/me:
 *   get:
 *     summary: Get the logged-in courier's details
 *     tags: [Courier]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Courier details returned
 *       401:
 *         description: No token or invalid token
 *       403:
 *         description: Not a courier account
 *       404:
 *         description: Courier not found
 */
router.get('/me', requireAuth, requireCourier, getMeC);

export default router;

