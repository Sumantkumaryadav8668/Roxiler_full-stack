const express = require('express');
const router = express.Router();
const { submitRating, updateRating, getStoreRatings } = require('../controllers/ratingController');
const { verifyToken } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');

router.post('/', verifyToken, requireRole('USER', 'ADMIN'), submitRating);
router.put('/:id', verifyToken, requireRole('USER', 'ADMIN'), updateRating);
router.get('/store/:storeId', getStoreRatings);

module.exports = router;
