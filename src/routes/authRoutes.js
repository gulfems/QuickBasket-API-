import express from 'express';
import { registerUser, loginUser, getMe } from '../controllers/authController.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { requireUser } from '../middleware/requireUser.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();
/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
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
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: test1234
 *               phone:
 *                 type: string
 *                 example: "5551112233"
 *     responses:
 *       201:
 *         description: User created
 *       400:
 *         description: Missing fields or invalid email
 *       409:
 *         description: Email already registered
 */
router.post('/register', authLimiter, registerUser);
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login 
 *     tags: [Auth]
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
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: test1234
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid email or password
 *       400:
 *         description: Email and passwords are required
 */
router.post('/login', authLimiter, loginUser);
/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get the logged-in user's details
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User details returned
 *       401:
 *         description: No token or invalid token
 *       403:
 *         description: Not a user account
 */
router.get('/me', requireAuth, requireUser, getMe);

export default router;

