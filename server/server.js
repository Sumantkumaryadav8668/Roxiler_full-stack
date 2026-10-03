const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { testConnection } = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');


const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const storeRoutes = require('./routes/storeRoutes');
const ratingRoutes = require('./routes/ratingRoutes');
const userRoutes = require('./routes/userRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


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


if (require.main === module) {
    const startServer = async () => {
        await testConnection();
        app.listen(PORT, () => {
            console.log(`🚀 Backend Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
        });
    };
    startServer();
}

module.exports = app;
