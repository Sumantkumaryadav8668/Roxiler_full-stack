const { pool } = require('../config/db');

class UserModel {
    
    static async create({ name, email, password, address, role = 'USER' }) {
        const sql = `
            INSERT INTO users (name, email, password, address, role)
            VALUES (?, ?, ?, ?, ?)
        `;
        const [result] = await pool.execute(sql, [name, email, password, address, role]);
        return result.insertId;
    }

    
    static async findByEmail(email) {
        const sql = `SELECT * FROM users WHERE email = ?`;
        const [rows] = await pool.execute(sql, [email]);
        return rows[0] || null;
    }

    
    static async findById(id) {
        const sql = `
            SELECT id, name, email, address, role, created_at, updated_at
            FROM users
            WHERE id = ?
        `;
        const [rows] = await pool.execute(sql, [id]);
        return rows[0] || null;
    }

    
    static async findByIdWithPassword(id) {
        const sql = `SELECT * FROM users WHERE id = ?`;
        const [rows] = await pool.execute(sql, [id]);
        return rows[0] || null;
    }

    
    static async updatePassword(id, hashedPassword) {
        const sql = `UPDATE users SET password = ? WHERE id = ?`;
        const [result] = await pool.execute(sql, [hashedPassword, id]);
        return result.affectedRows > 0;
    }

    
    static async count() {
        const [rows] = await pool.execute(`SELECT COUNT(*) as total FROM users`);
        return rows[0].total;
    }

    
    static async getAll({ search = '', role = '', sortBy = 'name', sortOrder = 'ASC' }) {
        let sql = `
            SELECT u.id, u.name, u.email, u.address, u.role, u.created_at,
                   s.id as store_id, s.name as store_name,
                   ROUND(AVG(r.rating), 2) as store_rating
            FROM users u
            LEFT JOIN stores s ON s.owner_id = u.id
            LEFT JOIN ratings r ON r.store_id = s.id
            WHERE 1=1
        `;
        const params = [];

        if (search && search.trim() !== '') {
            const searchTerm = `%${search.trim()}%`;
            sql += ` AND (u.name LIKE ? OR u.email LIKE ? OR u.address LIKE ?)`;
            params.push(searchTerm, searchTerm, searchTerm);
        }

        if (role && role.trim() !== '') {
            sql += ` AND u.role = ?`;
            params.push(role.trim());
        }

        sql += ` GROUP BY u.id, s.id, s.name`;

        
        const allowedSortFields = {
            id: 'u.id',
            name: 'u.name',
            email: 'u.email',
            address: 'u.address',
            role: 'u.role',
            created_at: 'u.created_at'
        };

        const sortColumn = allowedSortFields[sortBy.toLowerCase()] || 'u.name';
        const order = sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

        sql += ` ORDER BY ${sortColumn} ${order}`;

        const [rows] = await pool.execute(sql, params);
        return rows;
    }
}

module.exports = UserModel;
