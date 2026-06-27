const pool = require('./config/db');

async function test() {
    try {
        console.log("Testing queries...");
        const schoolId = 1; // Assuming school 1
        
        await pool.query("SELECT COALESCE(SUM(amount_paid), 0) as total FROM fee_receipts WHERE school_id = $1 AND payment_date = CURRENT_DATE AND status = 'Paid'", [schoolId]);
        console.log("Q1 pass");
        
        await pool.query("SELECT COALESCE(SUM(amount_paid), 0) as total FROM fee_receipts WHERE school_id = $1 AND EXTRACT(MONTH FROM payment_date) = EXTRACT(MONTH FROM CURRENT_DATE) AND EXTRACT(YEAR FROM payment_date) = EXTRACT(YEAR FROM CURRENT_DATE) AND status = 'Paid'", [schoolId]);
        console.log("Q2 pass");
        
        await pool.query("SELECT COALESCE(SUM(amount), 0) as total FROM expenses WHERE school_id = $1 AND expense_date = CURRENT_DATE", [schoolId]);
        console.log("Q3 pass");
        
        await pool.query("SELECT COALESCE(SUM(amount), 0) as total FROM expenses WHERE school_id = $1", [schoolId]);
        console.log("Q4 pass");
        
        await pool.query("SELECT COALESCE(SUM(balance), 0) as total FROM fee_receipts WHERE school_id = $1", [schoolId]);
        console.log("Q5 pass");
        
        await pool.query("SELECT COALESCE(SUM(net_salary), 0) as total FROM payrolls WHERE school_id = $1 AND status = 'Paid'", [schoolId]);
        console.log("Q6 pass");
        
        await pool.query("SELECT COALESCE(SUM(net_salary), 0) as total FROM payrolls WHERE school_id = $1 AND status = 'Pending'", [schoolId]);
        console.log("Q7 pass");
        
        await pool.query("SELECT COUNT(DISTINCT student_id) as count FROM fee_receipts WHERE school_id = $1 AND balance > 0", [schoolId]);
        console.log("Q8 pass");
        
        await pool.query("SELECT receipt_number as id, 'Fee Collection' as type, amount_paid as amount, payment_date as date, payment_mode as mode FROM fee_receipts WHERE school_id = $1 AND status = 'Paid' ORDER BY payment_date DESC LIMIT 5", [schoolId]);
        console.log("Q9 pass");
        
        console.log("All passed");
    } catch(err) {
        console.error("Failed:", err.message);
    } finally {
        pool.end();
    }
}

test();
