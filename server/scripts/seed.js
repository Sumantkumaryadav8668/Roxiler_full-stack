import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const getEnv = (key, fallback = '') => {
    const val = process.env[key];
    return val ? val.trim() : fallback;
};

const seedDatabase = async () => {
    let connection;
    try {
        console.log('🌱 Starting Non-Destructive Database Seeding Check...');

        const host = getEnv('DB_HOST') || getEnv('MYSQLHOST') || 'localhost';
        const port = parseInt(getEnv('DB_PORT') || getEnv('MYSQLPORT') || '3306', 10);
        const user = getEnv('DB_USER') || getEnv('MYSQLUSER') || 'root';
        const password = getEnv('DB_PASSWORD') || getEnv('MYSQLPASSWORD') || '';
        const database = getEnv('DB_NAME') || getEnv('MYSQLDATABASE') || 'roxiler_db';
        const isRemoteHost = host !== 'localhost' && host !== '127.0.0.1';
        const useSSL = getEnv('DB_SSL') === 'true' || isRemoteHost;

        connection = await mysql.createConnection({
            host,
            port,
            user,
            password,
            database,
            ssl: useSSL ? { rejectUnauthorized: false } : undefined
        });

        // Ensure tables exist safely without dropping or truncating
        await connection.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(60) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                address VARCHAR(400) NOT NULL,
                role ENUM('ADMIN', 'USER', 'STORE_OWNER') NOT NULL DEFAULT 'USER',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_user_email (email),
                INDEX idx_user_role (role)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS stores (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(60) NOT NULL,
                email VARCHAR(255) NOT NULL,
                address VARCHAR(400) NOT NULL,
                owner_id INT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
                INDEX idx_store_name (name),
                INDEX idx_store_owner (owner_id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS ratings (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                store_id INT NOT NULL,
                rating TINYINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
                FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE ON UPDATE CASCADE,
                UNIQUE KEY unique_user_store (user_id, store_id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `);

        console.log('✅ Tables verified safely without deleting any data.');

        // Helper: Ensure User exists without deleting existing users
        const ensureUser = async (name, email, passwordStr, address, role) => {
            const [existing] = await connection.query('SELECT id FROM users WHERE email = ?', [email]);
            if (existing.length > 0) {
                console.log(`ℹ️ User '${email}' already exists (ID: ${existing[0].id}). Preserved.`);
                return existing[0].id;
            }
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(passwordStr, salt);
            const [result] = await connection.query(
                `INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)`,
                [name, email, hashedPassword, address, role]
            );
            console.log(`➕ Inserted missing seed user '${email}' (ID: ${result.insertId}).`);
            return result.insertId;
        };

        const defaultPassword = 'Password@123';
        const adminId = await ensureUser('System Administrator Roxiler', 'admin@roxiler.com', defaultPassword, '100 Tech Corporate Boulevard, Suite 500, New York, NY', 'ADMIN');
        const ownerId = await ensureUser('Store Owner Master Account', 'owner@roxiler.com', defaultPassword, '456 Business Park Center, Building B, San Francisco, CA', 'STORE_OWNER');
        const user1Id = await ensureUser('Johnathan Alexander Developer', 'user1@roxiler.com', defaultPassword, '789 Residential Avenue, Apartment 12B, Austin, TX', 'USER');
        const user2Id = await ensureUser('Samantha Victoria Professional', 'user2@roxiler.com', defaultPassword, '321 Commercial Boulevard, Floor 3, Chicago, IL', 'USER');

        // Helper: Ensure Store exists without deleting existing stores
        const ensureStore = async (name, email, address, assignedOwnerId) => {
            const [existing] = await connection.query('SELECT id FROM stores WHERE name = ?', [name]);
            if (existing.length > 0) {
                console.log(`ℹ️ Store '${name}' already exists (ID: ${existing[0].id}). Preserved.`);
                return existing[0].id;
            }
            const [result] = await connection.query(
                `INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)`,
                [name, email, address, assignedOwnerId]
            );
            console.log(`➕ Inserted missing seed store '${name}' (ID: ${result.insertId}).`);
            return result.insertId;
        };

        const store1Id = await ensureStore('SuperTech Electronics Store Outlet', 'contact@supertech.com', '101 Silicon Highway, Tech City, CA 94016', ownerId);
        const store2Id = await ensureStore('Grand Gourmet Food & Grocery Market', 'info@grandgourmet.com', '202 Flavor Street, Culinary District, NY 10012', null);

        // Helper: Ensure Rating exists without deleting existing ratings
        const ensureRating = async (userId, storeId, ratingValue) => {
            const [existing] = await connection.query('SELECT id FROM ratings WHERE user_id = ? AND store_id = ?', [userId, storeId]);
            if (existing.length > 0) {
                return;
            }
            await connection.query(
                `INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?)`,
                [userId, storeId, ratingValue]
            );
        };

        await ensureRating(user1Id, store1Id, 5);
        await ensureRating(user2Id, store1Id, 4);
        await ensureRating(user1Id, store2Id, 3);

        console.log('✅ Non-Destructive Database Seeding Check Completed Successfully!');
    } catch (err) {
        console.error('❌ Seeding check failed:', err.message);
    } finally {
        if (connection) await connection.end();
    }
};

seedDatabase();
