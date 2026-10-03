const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const seedDatabase = async () => {
    let connection;
    try {
        console.log('🌱 Starting Database Seeding Process...');

        
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 3306,
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || ''
        });

        const dbName = process.env.DB_NAME || 'roxiler_db';
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
        await connection.query(`USE \`${dbName}\``);

        
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

        
        await connection.query('SET FOREIGN_KEY_CHECKS = 0');
        await connection.query('TRUNCATE TABLE ratings');
        await connection.query('TRUNCATE TABLE stores');
        await connection.query('TRUNCATE TABLE users');
        await connection.query('SET FOREIGN_KEY_CHECKS = 1');

        console.log('🧹 Cleaned existing database tables.');

        
        const defaultPassword = 'Password@123';
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(defaultPassword, salt);

        
        const [adminResult] = await connection.query(`
            INSERT INTO users (name, email, password, address, role)
            VALUES ('System Administrator Roxiler', 'admin@roxiler.com', ?, '100 Tech Corporate Boulevard, Suite 500, New York, NY', 'ADMIN')
        `, [hashedPassword]);

        const [ownerResult] = await connection.query(`
            INSERT INTO users (name, email, password, address, role)
            VALUES ('Store Owner Master Account', 'owner@roxiler.com', ?, '456 Business Park Center, Building B, San Francisco, CA', 'STORE_OWNER')
        `, [hashedPassword]);

        const [user1Result] = await connection.query(`
            INSERT INTO users (name, email, password, address, role)
            VALUES ('Johnathan Alexander Developer', 'user1@roxiler.com', ?, '789 Residential Avenue, Apartment 12B, Austin, TX', 'USER')
        `, [hashedPassword]);

        const [user2Result] = await connection.query(`
            INSERT INTO users (name, email, password, address, role)
            VALUES ('Samantha Victoria Professional', 'user2@roxiler.com', ?, '321 Commercial Boulevard, Floor 3, Chicago, IL', 'USER')
        `, [hashedPassword]);

        console.log('👥 Seeded Users (1 Admin, 1 Owner, 2 Normal Users).');

        
        const [store1Result] = await connection.query(`
            INSERT INTO stores (name, email, address, owner_id)
            VALUES ('SuperTech Electronics Store Outlet', 'contact@supertech.com', '101 Silicon Highway, Tech City, CA 94016', ?)
        `, [ownerResult.insertId]);

        const [store2Result] = await connection.query(`
            INSERT INTO stores (name, email, address, owner_id)
            VALUES ('Grand Gourmet Food & Grocery Market', 'info@grandgourmet.com', '202 Flavor Street, Culinary District, NY 10012', NULL)
        `, []);

        console.log('🏪 Seeded Stores (2 Stores).');

        
        await connection.query(`
            INSERT INTO ratings (user_id, store_id, rating)
            VALUES 
                (?, ?, 5),
                (?, ?, 4),
                (?, ?, 3)
        `, [
            user1Result.insertId, store1Result.insertId,
            user2Result.insertId, store1Result.insertId,
            user1Result.insertId, store2Result.insertId
        ]);

        console.log('⭐ Seeded Ratings.');
        console.log('✅ Database Seeding Completed Successfully!');
        console.log(`
        -----------------------------------------------------
        TEST LOGIN CREDENTIALS (All passwords: Password@123):
        -----------------------------------------------------
        Admin:       admin@roxiler.com
        Store Owner: owner@roxiler.com
        User 1:      user1@roxiler.com
        User 2:      user2@roxiler.com
        -----------------------------------------------------
        `);
    } catch (err) {
        console.error('❌ Seeding failed:', err.message);
    } finally {
        if (connection) await connection.end();
    }
};

seedDatabase();
