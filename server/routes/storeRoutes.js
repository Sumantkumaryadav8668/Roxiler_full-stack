const express = require('express');
const router = express.Router();
const { getStores, getStoreById, getOwnerDashboard } = require('../controllers/storeController');
const { verifyToken } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');


const optionalAuth = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        return verifyToken(req, res, next);
    }
    next();
};

router.get('/owner/dashboard', verifyToken, requireRole('STORE_OWNER'), getOwnerDashboard);
router.get('/', optionalAuth, getStores);
router.get('/:id', optionalAuth, getStoreById);

module.exports = router;
