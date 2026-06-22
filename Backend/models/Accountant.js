const pool = require('../config/db');

class Accountant {
    static async create(data, client = pool) {
        const { userId, schoolId, employeeId, qualification, experience, joiningDate, salary } = data;
        const res = await client.query(
            `INSERT INTO accountants (user_id, school_id, employee_id, qualification, experience, joining_date, salary)
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [userId, schoolId, employeeId, qualification, experience, joiningDate, salary]
        );                   
        return res.rows[0];
    }
}
module.exports = Accountant;
