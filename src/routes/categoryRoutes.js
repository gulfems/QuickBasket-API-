import express from 'express';
import { getAllCategories, getCategoryProducts, createCategory, updateCategory, deleteCategory } from '../controllers/categoryController.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { requireAdmin } from '../middleware/requireAdmin.js';

const router = express.Router();

router.get('/', getAllCategories);
router.get('/:id/products', getCategoryProducts);
router.post('/', requireAuth, requireAdmin, createCategory);
router.put('/:id', requireAuth, requireAdmin, updateCategory);
router.delete('/:id', requireAuth, requireAdmin, deleteCategory);
export default router;

