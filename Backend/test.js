const pool = require('./config/db');
async function test() {
    try {
        const res = await pool.query(`SELECT s.id AS school_id, s.name AS school_name, s.email AS school_email, s.phone AS school_phone, s.city, s.is_active, s.subscription_status, s.subscription_start_date, s.subscription_end_date, sp.name AS plan_name, u.name AS admin_name, u.email AS admin_email FROM schools s LEFT JOIN subscription_plans sp ON s.plan_id = sp.id LEFT JOIN users u ON u.school_id = s.id AND u.role_id = (SELECT id FROM roles WHERE name = 'School Admin' LIMIT 1) ORDER BY s.created_at DESC`);
        console.log("Success:", res.rows);
    } catch (e) {
        console.error('Error:', e);
    }
    process.exit(0);
}
test();
