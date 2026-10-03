const { pool } = require('../config/db');

class RatingModel {
    
    static async upsert({ user_id, store_id, rating }) {
        const sql = `
            INSERT INTO ratings (user_id, store_id, rating)
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE
                rating = VALUES(rating),
                updated_at = CURRENT_TIMESTAMP
        `;
        const [result] = await pool.execute(sql, [user_id, store_id, rating]);
        return result;
    }

    
    static async findById(id) {
        const sql = `SELECT * FROM ratings WHERE id = ?`;
        const [rows] = await pool.execute(sql, [id]);
        return rows[0] || null;
    }

    
    static async findByUserAndStore(userId, storeId) {
        const sql = `SELECT * FROM ratings WHERE user_id = ? AND store_id = ?`;
        const [rows] = await pool.execute(sql, [userId, storeId]);
        return rows[0] || null;
    }

    
    static async update(id, rating) {
        const sql = `UPDATE ratings SET rating = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
        const [result] = await pool.execute(sql, [rating, id]);
        return result.affectedRows > 0;
    }

    
    static async count() {
        const [rows] = await pool.execute(`SELECT COUNT(*) as total FROM ratings`);
        return rows[0].total;
    }

    
    static async getStoreRatings(storeId) {
        const sql = `
            SELECT r.id, r.user_id, r.store_id, r.rating, r.created_at, r.updated_at,
                   u.name as user_name
            FROM ratings r
            JOIN users u ON r.user_id = u.id
            WHERE r.store_id = ?
            ORDER BY r.updated_at DESC
        `;
        const [rows] = await pool.execute(sql, [storeId]);
        return rows;
    }

    
    static async getStoreOwnerRatings(ownerId) {
        const sql = `
            SELECT r.id, r.rating, r.created_at, r.updated_at,
                   u.name as user_name, u.email as user_email, u.address as user_address,
                   s.name as store_name
            FROM ratings r
            JOIN stores s ON r.store_id = s.id
            JOIN users u ON r.user_id = u.id
            WHERE s.owner_id = ?
            ORDER BY r.updated_at DESC
        `;
        const [rows] = await pool.execute(sql, [ownerId]);
        return rows;
    }
}

module.exports = RatingModel;
