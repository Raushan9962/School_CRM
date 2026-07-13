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
        const safe = (val) => val === undefined ? null : val;
        const res = await client.query(
            `INSERT INTO users (name, email, username, phone, password, role_name, school_id, image, gender, dob, address, blood_group, aadhaar_number, city, state, pincode, emergency_contact)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) RETURNING *`,
            [
                safe(name), safe(email), safe(username), safe(phone), safe(password), safe(roleName), 
                safe(schoolId), safe(image), safe(gender), safe(dob), safe(address), safe(bloodGroup), 
                safe(aadhaarNumber), safe(city), safe(state), safe(pincode), safe(emergencyContact)
            ]
        );
        return res.rows[0];
    }
}
module.exports = User;
