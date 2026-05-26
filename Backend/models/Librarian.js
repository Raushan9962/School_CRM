const pool = require('../config/db');

class Librarian {
    static async create(data, client = pool) {
        const { userId, schoolId, employeeId, qualification, experience, joiningDate } = data;
        const res = await client.query(
            `INSERT INTO librarians (user_id, school_id, employee_id, qualification, experience, joining_date)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [userId, schoolId, employeeId, qualification, experience, joiningDate]
        );
        return res.rows[0];
    }
}
module.exports = Librarian;
