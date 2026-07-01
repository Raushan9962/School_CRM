const pool = require('./config/db');

async function migrate() {
    try {
        console.log("Adding columns to student_fee_invoices...");
        await pool.query("ALTER TABLE student_fee_invoices ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50)");
        await pool.query("ALTER TABLE student_fee_invoices ADD COLUMN IF NOT EXISTS transaction_ref VARCHAR(100)");
        
        console.log("Adding columns to fees...");
        await pool.query("ALTER TABLE fees ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50)");
        await pool.query("ALTER TABLE fees ADD COLUMN IF NOT EXISTS transaction_ref VARCHAR(100)");
        
        console.log("Migration successful!");
    } catch (e) {
        console.error("Migration failed:", e);
    } finally {
        process.exit(0);
    }
}

migrate();
