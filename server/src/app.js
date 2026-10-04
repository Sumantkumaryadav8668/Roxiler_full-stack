import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';

import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import storeRoutes from './routes/storeRoutes.js';
import ratingRoutes from './routes/ratingRoutes.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();

const app = express();

app.use(cors({
    origin: (origin, callback) => {
        const allowed = [process.env.CLIENT_URL, 'http://localhost:5173'].filter(Boolean);
        if (!origin || allowed.includes(origin) || allowed.some(a => origin.startsWith(a))) {
            callback(null, true);
        } else {
            callback(null, true);
        }
    },
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Roxiler Systems Full Stack API is running smoothly.'
    });
});

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/users', userRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
