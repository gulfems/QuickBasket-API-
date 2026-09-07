import express from 'express';
import { getUserById, updateUser, deleteUser } from '../controllers/userController.js';
import { requireUser } from '../middleware/requireUser.js';
import { requireAuth } from '../middleware/requireAuth.js';


const router = express.Router();

router.get('/:id', requireAuth, requireUser, getUserById);
router.put('/:id', requireAuth, requireUser, updateUser);
router.delete('/:id', requireAuth, requireUser, deleteUser);

export default router;