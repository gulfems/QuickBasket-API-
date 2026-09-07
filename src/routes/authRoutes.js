import express from 'express';
import { registerUser, loginUser, getMe } from '../controllers/authController.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { requireUser } from '../middleware/requireUser.js';
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', requireAuth, requireUser, getMe);

export default router;

