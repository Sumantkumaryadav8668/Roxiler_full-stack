import express from 'express';
import { getStores, getStoreById, getOwnerDashboard } from '../controllers/storeController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';

const router = express.Router();

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

export default router;
