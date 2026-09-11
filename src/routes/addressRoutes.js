import express from 'express';
import { getMyAddresses, createAddress, updateAddress, deleteAddress } from '../controllers/addressController.js';
import { requireUser } from '../middleware/requireUser.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = express.Router();
/**
 * @swagger
 * /api/adresses:
 *   get:
 *     summary: List the logged-in user's address
 *     tags: [Addresses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: An array of addresses
 *       401:
 *         description: No token or invalid token
 */
router.get('/', requireAuth, requireUser, getMyAddresses);
/**
 * @swagger
 * /api/addresses:
 *   post:
 *     summary: Add a new address
 *     tags: [Addresses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, address_text]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Ev
 *               address_text:
 *                 type: string
 *                 example: Bağdat Caddesi No 12, Kadıköy, İstanbul
 *     responses:
 *       201:
 *         description: Address created
 *       400:
 *         description: Missing fields
 *       401:
 *         description: No token or invalid token
 *       409:
 *         description: An address with this name already exists
 */
router.post('/', requireAuth, requireUser, createAddress);
/**
 * @swagger
 * /api/addresses/{id}:
 *   put:
 *     summary: Update an address
 *     tags: [Addresses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The address id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, address_text]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Ev
 *               address_text:
 *                 type: string
 *                 example: Bağdat Caddesi No 14, Kadıköy, İstanbul
 *     responses:
 *       200:
 *         description: Address updated
 *       400:
 *         description: Missing fields
 *       401:
 *         description: No token or invalid token
 *       404:
 *         description: Address not found
 *       409:
 *         description: An address with this name already exists
 */
router.put('/:id', requireAuth, requireUser, updateAddress);
/**
 * @swagger
 * /api/addresses/{id}:
 *   delete:
 *     summary: Delete an address
 *     tags: [Addresses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The address id
 *     responses:
 *       200:
 *         description: Address deleted
 *       401:
 *         description: No token or invalid token
 *       404:
 *         description: Address not found
 *       409:
 *         description: Address is used by an existing order
 */
router.delete('/:id', requireAuth, requireUser, deleteAddress);

export default router;

