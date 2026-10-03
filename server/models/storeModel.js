const { pool } = require('../config/db');

class StoreModel {
    
    static async create({ name, email, address, owner_id = null }) {
        const sql = `
            INSERT INTO stores (name, email, address, owner_id)
            VALUES (?, ?, ?, ?)
        `;
        const [result] = await pool.execute(sql, [name, email, address, owner_id || null]);
        return result.insertId;
    }

    
    static async findById(id) {
        const sql = `
            SELECT s.id, s.name, s.email, s.address, s.owner_id, s.created_at,
                   u.name as owner_name, u.email as owner_email,
                   COALESCE(ROUND(AVG(r.rating), 2), 0) as overall_rating,
                   COUNT(r.id) as total_ratings
            FROM stores s
            LEFT JOIN users u ON s.owner_id = u.id
            LEFT JOIN ratings r ON s.id = r.store_id
            WHERE s.id = ?
            GROUP BY s.id
        `;
        const [rows] = await pool.execute(sql, [id]);
        return rows[0] || null;
    }

    
    static async findByOwnerId(ownerId) {
        const sql = `
            SELECT s.id, s.name, s.email, s.address, s.owner_id, s.created_at,
                   COALESCE(ROUND(AVG(r.rating), 2), 0) as overall_rating,
                   COUNT(r.id) as total_ratings
            FROM stores s
            LEFT JOIN ratings r ON s.id = r.store_id
            WHERE s.owner_id = ?
            GROUP BY s.id
        `;
        const [rows] = await pool.execute(sql, [ownerId]);
        return rows[0] || null;
    }

    
    static async count() {
        const [rows] = await pool.execute(`SELECT COUNT(*) as total FROM stores`);
        return rows[0].total;
    }

    
    static async getAll({ search = '', userId = null, sortBy = 'name', sortOrder = 'ASC' }) {
        let sql = `
            SELECT s.id, s.name, s.email, s.address, s.owner_id, s.created_at,
                   COALESCE(ROUND(AVG(r.rating), 2), 0) as overall_rating,
                   COUNT(DISTINCT r.id) as total_ratings,
                   ur.rating as user_submitted_rating,
                   ur.id as user_rating_id
            FROM stores s
            LEFT JOIN ratings r ON s.id = r.store_id
            LEFT JOIN ratings ur ON s.id = ur.store_id AND ur.user_id = ?
            WHERE 1=1
        `;
        const params = [userId || 0];

        if (search && search.trim() !== '') {
            const searchTerm = `%${search.trim()}%`;
            sql += ` AND (s.name LIKE ? OR s.address LIKE ?)`;
            params.push(searchTerm, searchTerm);
        }

        sql += ` GROUP BY s.id, ur.id, ur.rating`;

        
        const allowedSortFields = {
            id: 's.id',
            name: 's.name',
            email: 's.email',
            address: 's.address',
            rating: 'overall_rating',
            overall_rating: 'overall_rating',
            created_at: 's.created_at'
        };

        const sortColumn = allowedSortFields[sortBy.toLowerCase()] || 's.name';
        const order = sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

        sql += ` ORDER BY ${sortColumn} ${order}`;

        const [rows] = await pool.execute(sql, params);
        return rows;
    }
}

module.exports = StoreModel;
