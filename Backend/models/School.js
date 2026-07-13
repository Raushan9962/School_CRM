const pool = require('../config/db');

class School {
    static async create(data, client = pool) {
        const { name, code, email, phone, address, city, state, country, pincode, logo, website, planId, billingCycle } = data;
        const safe = (val) => val === undefined ? null : val;
        const res = await client.query(
            `INSERT INTO schools (name, code, email, phone, address, city, state, country, pincode, logo, website, plan_id, billing_cycle) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`,
            [
                safe(name), safe(code), safe(email), safe(phone), safe(address), 
                safe(city), safe(state), safe(country), safe(pincode), safe(logo), 
                safe(website), safe(planId), safe(billingCycle) || 'Monthly'
            ]
        );
        return res.rows[0];
    }
}
module.exports = School;
