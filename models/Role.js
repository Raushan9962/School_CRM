const pool = require('../config/db');

class Role {
    static async findByName(name, client = pool) {
        const res = await client.query('SELECT * FROM roles WHERE name = $1', [name]);
        return res.rows[0];
    }
    static async create(name, client = pool) {
        const res = await client.query('INSERT INTO roles (name) VALUES ($1) RETURNING *', [name]);
        return res.rows[0];
    }
}
module.exports = Role;
