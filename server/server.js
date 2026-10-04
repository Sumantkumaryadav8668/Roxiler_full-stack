import dotenv from 'dotenv';
import app from './src/app.js';
import { testConnection } from './src/config/db.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    await testConnection();
    app.listen(PORT, () => {
        console.log(`🚀 Backend Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
};

startServer();

export default app;
