const pool = require('../config/db');

class Receptionist {
    static async create(data, client = pool) {
        const { userId, schoolId, employeeId, joiningDate, salary } = data;
        const res = await client.query(
            `INSERT INTO receptionists (user_id, school_id, employee_id, joining_date, salary)
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [userId, schoolId, employeeId, joiningDate, salary]
        );
        return res.rows[0];
    }
}
module.exports = Receptionist;
