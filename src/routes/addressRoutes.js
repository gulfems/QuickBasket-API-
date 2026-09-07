import express from 'express';
import { getMyAddresses, createAddress, updateAddress, deleteAddress } from '../controllers/addressController.js';
import { requireUser } from '../middleware/requireUser.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = express.Router();

router.get('/', requireAuth, requireUser, getMyAddresses);
router.post('/', requireAuth, requireUser, createAddress);
router.put('/:id', requireAuth, requireUser, updateAddress);
router.delete('/:id', requireAuth, requireUser, deleteAddress);

export default router;

