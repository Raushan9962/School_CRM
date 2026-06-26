const db = require('./config/db');

async function run() {
    try {
        const schoolId = 1;
        const pool = db;
        
        console.log("1");
        const studentsRes = await pool.query(`SELECT COUNT(*) FROM users WHERE role_name = 'Student' AND school_id = $1`, [schoolId]);
        console.log('Students:', studentsRes.rows[0].count);
        
        console.log("2");
        const teachersRes = await pool.query(`SELECT COUNT(*) FROM users WHERE role_name = 'Teacher' AND school_id = $1`, [schoolId]);
        console.log('Teachers:', teachersRes.rows[0].count);
        
        console.log("3");
        const roles = ['Accountant', 'Librarian', 'Receptionist', 'Transport Staff', 'Hostel Warden', 'HR'];
        const staffRes = await pool.query(`SELECT role_name, COUNT(*) FROM users WHERE role_name = ANY($1) AND school_id = $2 GROUP BY role_name`, [roles, schoolId]);
        console.log("Staff fetched");
        
        console.log("4");
        const attendanceRes = await pool.query(`
            SELECT COUNT(*) 
            FROM attendance a
            JOIN students s ON a.student_id = s.id
            WHERE s.school_id = $1 AND a.date = CURRENT_DATE AND a.status = 'Present'
        `, [schoolId]);
        console.log('Attendance:', attendanceRes.rows[0].count);
        
        console.log("5");
        const feesRes = await pool.query(`
            SELECT SUM(f.amount) 
            FROM fees f
            JOIN students s ON f.student_id = s.id
            WHERE s.school_id = $1 AND f.status = 'Paid' 
            AND EXTRACT(MONTH FROM f.paid_date) = EXTRACT(MONTH FROM CURRENT_DATE)
            AND EXTRACT(YEAR FROM f.paid_date) = EXTRACT(YEAR FROM CURRENT_DATE)
        `, [schoolId]);
        console.log('Fees:', feesRes.rows[0]?.sum);
        
    } catch(e) {
        console.log('ERROR in SQL:', e.message);
    }
    process.exit(0);
}
run();
