const pool = require('../config/db');

class User {
    static async findByEmailWithRole(email, client = pool) {
        const res = await client.query(
            `SELECT u.*, u.role_name as "roleName", s.name as "schoolName"
             FROM users u 
             LEFT JOIN schools s ON u.school_id = s.id
             WHERE u.email = $1`,
            [email]
        );
        return res.rows[0];
    }

    static async findById(id, client = pool) {
        const res = await client.query('SELECT * FROM users WHERE id = $1', [id]);
        return res.rows[0];
    }

    static async updatePassword(id, hashedPassword, client = pool) {
        const res = await client.query('UPDATE users SET password = $1 WHERE id = $2 RETURNING *', [hashedPassword, id]);
        return res.rows[0];
    }

    static async create(data, client = pool) {
        const { name, email, phone, password, roleName, schoolId, image, gender, dob, address } = data;
        const res = await client.query(
            `INSERT INTO users (name, email, phone, password, role_name, school_id, image, gender, dob, address)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
            [name, email, phone, password, roleName, schoolId, image, gender, dob, address]
        );
        return res.rows[0];
    }
}
module.exports = User;
