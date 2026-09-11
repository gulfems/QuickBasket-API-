import express from 'express';
import { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../controllers/productController.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { requireAdmin } from '../middleware/requireAdmin.js';

const router = express.Router();
/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: List products, with optional filtering and pagination
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: integer
 *         description: Filter by category id
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Case-insensitive match on the product name
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: How many products to return
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: How many products to skip
 *     responses:
 *       200:
 *         description: An array of products
 */
router.get('/', getAllProducts);
/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get a single product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The product id
 *     responses:
 *       200:
 *         description: The product
 *       404:
 *         description: Product not found or no longer active
 */
router.get('/:id', getProductById);
/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a product (admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [category_id, name, price]
 *             properties:
 *               category_id:
 *                 type: integer
 *                 example: 1
 *               name:
 *                 type: string
 *                 example: Tam Yağlı Süt 1L
 *               price:
 *                 type: number
 *                 example: 49.90
 *               quantity:
 *                 type: integer
 *                 example: 20
 *               description:
 *                 type: string
 *                 example: Günlük taze süt
 *               image_url:
 *                 type: string
 *                 example: https://example.com/sut.jpg
 *     responses:
 *       201:
 *         description: Product created
 *       400:
 *         description: category_id, name and price are required
 *       401:
 *         description: No token or invalid token
 *       403:
 *         description: Not an admin
 */
router.post('/', requireAuth, requireAdmin, createProduct);
/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update a product (admin only). All fields are replaced.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The product id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [category_id, name, price]
 *             properties:
 *               category_id:
 *                 type: integer
 *                 example: 1
 *               name:
 *                 type: string
 *                 example: Tam Yağlı Süt 1L
 *               price:
 *                 type: number
 *                 example: 59.90
 *               quantity:
 *                 type: integer
 *                 example: 15
 *               description:
 *                 type: string
 *                 example: Günlük taze süt
 *               image_url:
 *                 type: string
 *                 example: https://example.com/sut.jpg
 *     responses:
 *       200:
 *         description: Product updated
 *       400:
 *         description: category_id, name and price are required
 *       401:
 *         description: No token or invalid token
 *       403:
 *         description: Not an admin
 *       404:
 *         description: Product not found
 */
router.put('/:id', requireAuth, requireAdmin, updateProduct);
/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Soft-delete a product (admin only). Sets is_active to false.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The product id
 *     responses:
 *       200:
 *         description: Product deleted
 *       401:
 *         description: No token or invalid token
 *       403:
 *         description: Not an admin
 *       404:
 *         description: Product not found
 */
router.delete('/:id', requireAuth, requireAdmin, deleteProduct);
export default router;

