import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const getEnv = (key, fallback = '') => {
    const val = process.env[key];
    return val ? val.trim() : fallback;
};

const host = getEnv('DB_HOST') || getEnv('MYSQLHOST') || 'localhost';
const port = parseInt(getEnv('DB_PORT') || getEnv('MYSQLPORT') || '3306', 10);
const user = getEnv('DB_USER') || getEnv('MYSQLUSER') || 'root';
const password = getEnv('DB_PASSWORD') || getEnv('MYSQLPASSWORD') || '';
const database = getEnv('DB_NAME') || getEnv('MYSQLDATABASE') || 'roxiler_db';

const isRemoteHost = host !== 'localhost' && host !== '127.0.0.1';
const useSSL = getEnv('DB_SSL') === 'true' || isRemoteHost;

export const pool = mysql.createPool({
    host,
    port,
    user,
    password,
    database,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    dateStrings: true,
    ssl: useSSL ? { rejectUnauthorized: false } : undefined
});

export const testConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log(`✅ Connected to MySQL Database [${host}:${port}/${database}] successfully.`);
        connection.release();
        return true;
    } catch (err) {
        console.error('❌ Database connection failed:', err.message);
        return false;
    }
};

export default {
    pool,
    testConnection
};
