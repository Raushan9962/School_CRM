const pool = require('../config/db');

class School {
    static async create(data, client = pool) {
        const { name, code, email, phone, address, city, state, country, pincode, logo, website } = data;
        const res = await client.query(
            `INSERT INTO schools (name, code, email, phone, address, city, state, country, pincode, logo, website) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
            [name, code, email, phone, address, city, state, country, pincode, logo, website]
        );
        return res.rows[0];
    }
}
module.exports = School;
