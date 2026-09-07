import express from 'express';
import { registerCourier, loginCourier } from '../controllers/courierController.js';

const router = express.Router();

router.post('/register', registerCourier);
router.post('/login', loginCourier);

export default router;