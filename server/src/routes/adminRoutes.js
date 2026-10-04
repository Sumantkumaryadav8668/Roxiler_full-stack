import express from 'express';
import {
    getDashboardStats,
    addUser,
    addStore,
    getUsers,
    getStores,
    getUserById
} from '../controllers/adminController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(verifyToken, requireRole('ADMIN'));

router.get('/dashboard', getDashboardStats);
router.post('/users', addUser);
router.post('/stores', addStore);
router.get('/users', getUsers);
router.get('/stores', getStores);
router.get('/users/:id', getUserById);

export default router;
