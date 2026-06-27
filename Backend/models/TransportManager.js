const pool = require('../config/db');

class TransportManager {
    static async create(data, client = pool) {
        const { userId, schoolId, employeeId, vehicleAssigned, routeAssigned, licenseNumber, joiningDate } = data;
        const res = await client.query(
            `INSERT INTO transport_managers (user_id, school_id, employee_id, vehicle_assigned, route_assigned, license_number, joining_date)
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [userId, schoolId, employeeId, vehicleAssigned, routeAssigned, licenseNumber, joiningDate]
        );
        return res.rows[0];
    }
}
module.exports = TransportManager;
