const pool = require('../config/db');

class BaseModel {
    constructor(tableName) {
        this.tableName = tableName;
    }

    async create(data, client = pool) {
        const sanitizedData = {};
        for (const key in data) {
            sanitizedData[key] = data[key] === undefined ? null : data[key];
        }
        const keys = Object.keys(sanitizedData);
        const values = Object.values(sanitizedData);
        if (keys.length === 0) throw new Error('No data provided');
        
        const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
        const columns = keys.map(k => k.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)).join(', ');

        const query = `INSERT INTO ${this.tableName} (${columns}) VALUES (${placeholders}) RETURNING *`;
        const result = await client.query(query, values);
        return result.rows[0];
    }

    async findAll(client = pool) {
        const result = await client.query(`SELECT * FROM ${this.tableName}`);
        return result.rows;
    }

    async findById(id, client = pool) {
        const result = await client.query(`SELECT * FROM ${this.tableName} WHERE id = $1`, [id]);
        return result.rows[0];
    }

    async update(id, data, client = pool) {
        const sanitizedData = {};
        for (const key in data) {
            sanitizedData[key] = data[key] === undefined ? null : data[key];
        }
        const keys = Object.keys(sanitizedData);
        const values = Object.values(sanitizedData);
        if (keys.length === 0) throw new Error('No data provided');

        const setClause = keys.map((k, i) => `${k.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)} = $${i + 1}`).join(', ');
        const query = `UPDATE ${this.tableName} SET ${setClause} WHERE id = $${keys.length + 1} RETURNING *`;
        
        const result = await client.query(query, [...values, id]);
        return result.rows[0];
    }

    async delete(id, client = pool) {
        const result = await client.query(`DELETE FROM ${this.tableName} WHERE id = $1 RETURNING id`, [id]);
        return result.rows[0];
    }
}

module.exports = BaseModel;
