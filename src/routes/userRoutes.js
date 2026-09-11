import express from 'express';
import { getUserById, updateUser, deleteUser } from '../controllers/userController.js';
import { requireUser } from '../middleware/requireUser.js';
import { requireAuth } from '../middleware/requireAuth.js';


const router = express.Router();
/**
 * @swagger
 * /api/user/{id}:
 *   get:
 *     summary: Get a user's details. Self or admin only.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The user id
 *     responses:
 *       200:
 *         description: The user
 *       401:
 *         description: No token or invalid token
 *       403:
 *         description: Not your account, and not an admin
 *       404:
 *         description: User not found
 */
router.get('/:id', requireAuth, requireUser, getUserById);
/**
 * @swagger
 * /api/user/{id}:
 *   put:
 *     summary: Update your own email and phone. Self only.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The user id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, phone]
 *             properties:
 *               email:
 *                 type: string
 *                 example: new@example.com
 *               phone:
 *                 type: string
 *                 example: "5551112233"
 *     responses:
 *       200:
 *         description: User updated
 *       400:
 *         description: Email and phone are required
 *       401:
 *         description: No token or invalid token
 *       403:
 *         description: Not your account
 *       404:
 *         description: User not found
 *       409:
 *         description: Email already in use
 */
router.put('/:id', requireAuth, requireUser, updateUser);
/**
 * @swagger
 * /api/user/{id}:
 *   delete:
 *     summary: Delete a user account. Self or admin only.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The user id
 *     responses:
 *       200:
 *         description: User deleted
 *       401:
 *         description: No token or invalid token
 *       403:
 *         description: Not your account, and not an admin
 *       404:
 *         description: User not found
 *       409:
 *         description: User has existing orders
 */
router.delete('/:id', requireAuth, requireUser, deleteUser);

export default router;