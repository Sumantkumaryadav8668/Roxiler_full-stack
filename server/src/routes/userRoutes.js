import express from 'express';
import UserModel from '../models/userModel.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/profile', verifyToken, async (req, res, next) => {
    try {
        const user = await UserModel.findById(req.user.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User profile not found.'
            });
        }
        return res.status(200).json({
            success: true,
            message: 'User profile fetched successfully.',
            data: user
        });
    } catch (err) {
        next(err);
    }
});

export default router;
