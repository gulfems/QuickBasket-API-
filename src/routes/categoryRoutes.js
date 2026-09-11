import express from 'express';
import { getAllCategories, getCategoryProducts, createCategory, updateCategory, deleteCategory } from '../controllers/categoryController.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { requireAdmin } from '../middleware/requireAdmin.js';

const router = express.Router();
/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: List all categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: An array of categories
 */
router.get('/', getAllCategories);
/**
 * @swagger
 * /api/categories/{id}/products:
 *   get:
 *     summary: List the products in a category
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The category id
 *     responses:
 *       200:
 *         description: An array of products in that category
 */
router.get('/:id/products', getCategoryProducts);
/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Create a category (admin only)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Atıştırmalık
 *     responses:
 *       201:
 *         description: Category created
 *       400:
 *         description: Name is required
 *       401:
 *         description: No token or invalid token
 *       403:
 *         description: Not an admin
 *       409:
 *         description: A category with this name already exists
 */
router.post('/', requireAuth, requireAdmin, createCategory);
/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: Rename a category (admin only)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The category id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Atıştırmalık
 *     responses:
 *       200:
 *         description: Category updated
 *       400:
 *         description: Name is required
 *       401:
 *         description: No token or invalid token
 *       403:
 *         description: Not an admin
 *       404:
 *         description: Category not found
 *       409:
 *         description: A category with this name already exists
 */
router.put('/:id', requireAuth, requireAdmin, updateCategory);
/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Delete a category (admin only)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The category id
 *     responses:
 *       200:
 *         description: Category deleted
 *       401:
 *         description: No token or invalid token
 *       403:
 *         description: Not an admin
 *       404:
 *         description: Category not found
 *       409:
 *         description: Category still has products
 */
router.delete('/:id', requireAuth, requireAdmin, deleteCategory);
export default router;

