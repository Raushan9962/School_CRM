const pool = require('../config/db');

class User {
    static async findByEmailWithRole(email, client = pool) {
        const res = await client.query(
            `SELECT u.*, u.role_name as "roleName", s.name as "schoolName"
             FROM users u 
             LEFT JOIN schools s ON u.school_id = s.id
             WHERE u.email = $1 OR u.username = $1`,
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
        const { name, email, username, phone, password, roleName, schoolId, image, gender, dob, address, bloodGroup, aadhaarNumber, city, state, pincode, emergencyContact } = data;
        const res = await client.query(
            `INSERT INTO users (name, email, username, phone, password, role_name, school_id, image, gender, dob, address, blood_group, aadhaar_number, city, state, pincode, emergency_contact)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) RETURNING *`,
            [name, email, username || null, phone, password, roleName, schoolId, image, gender, dob, address, bloodGroup || null, aadhaarNumber || null, city || null, state || null, pincode || null, emergencyContact || null]
        );
        return res.rows[0];
    }
}
module.exports = User;
