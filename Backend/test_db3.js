require('dotenv').config();
const pool = require('./config/db.js');

async function check() {
  try {
    const res = await pool.query(`
            SELECT concat('new_', sfi.id) as id, sfi.created_at, u.name as student_name, s.admission_no as admission_number, s.father_name, c.name as class_name, fs.fee_type as fee_type, sfi.due_amount, sfi.paid_amount, sfi.status
            FROM student_fee_invoices sfi
            JOIN users u ON sfi.student_id = u.id
            JOIN students s ON u.id = s.user_id
            LEFT JOIN classes c ON s.class_id = c.id
            JOIN fee_structures fs ON sfi.fee_structure_id = fs.id
            WHERE sfi.school_id = 1
            
            UNION ALL
            
            SELECT concat('old_', f.id) as id, f.created_at, u.name as student_name, s.admission_no as admission_number, s.father_name, c.name as class_name, 'General Fee' as fee_type, f.amount as due_amount, CASE WHEN f.status = 'Paid' THEN f.amount ELSE 0 END as paid_amount, f.status
            FROM fees f
            JOIN students s ON f.student_id = s.id
            JOIN users u ON s.user_id = u.id
            LEFT JOIN classes c ON s.class_id = c.id
            WHERE u.school_id = 1
            
            ORDER BY created_at DESC
    `);
    console.log("Query Success! Found", res.rows.length);

  } catch(e) {
    console.error("Error running query:", e);
  } finally {
    pool.end();
  }
}
check();
