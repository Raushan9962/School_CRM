const pool = require('../config/db');

class Parent {
    static async create(data, client = pool) {
        const { userId, occupation, relation, studentId } = data;
        const res = await client.query(
            `INSERT INTO parents (user_id, occupation, relation, student_id) VALUES ($1, $2, $3, $4) RETURNING *`,
            [userId, occupation, relation, studentId]
        );
        return res.rows[0];
    }
}
module.exports = Parent;
