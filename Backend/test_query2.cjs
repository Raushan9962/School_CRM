const pool = require('./config/db.js');
async function run() {
    try {
        const query = `
            SELECT 
                p.id as parent_id, 
                u.name as parent_name, 
                u.email, 
                u.phone,
                su.name as student_name,
                c.name as class_name,
                c.section
            FROM parents p
            JOIN users u ON p.user_id = u.id
            JOIN students s ON p.student_id = s.id
            JOIN users su ON s.user_id = su.id
            LEFT JOIN classes c ON s.class_id = c.id
            WHERE u.school_id = $1
        `;
        await pool.query(query, [1]);
        console.log("Success");
    } catch(e) {
        console.log("Error:", e.message);
    }
    process.exit(0);
}
run();
