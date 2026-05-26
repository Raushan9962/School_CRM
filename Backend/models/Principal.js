const pool = require('../config/db');

class Principal {
    static async create(data, client = pool) {
        const { userId, schoolId, employeeId, qualification, experience, joiningDate, department } = data;
        const res = await client.query(
            `INSERT INTO principals (user_id, school_id, employee_id, qualification, experience, joining_date, department)
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [userId, schoolId, employeeId, qualification, experience, joiningDate, department]
        );
        return res.rows[0];
    }
}
module.exports = Principal;
