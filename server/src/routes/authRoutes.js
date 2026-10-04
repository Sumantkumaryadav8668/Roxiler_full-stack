import express from 'express';
import { signup, login, logout, changePassword } from '../controllers/authController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.put('/change-password', verifyToken, changePassword);

export default router;
