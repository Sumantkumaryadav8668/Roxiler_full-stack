import express from 'express';
import { submitRating, updateRating, getStoreRatings } from '../controllers/ratingController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/', verifyToken, requireRole('USER', 'ADMIN'), submitRating);
router.put('/:id', verifyToken, requireRole('USER', 'ADMIN'), updateRating);
router.get('/store/:storeId', getStoreRatings);

export default router;
