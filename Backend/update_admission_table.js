const pool = require('./config/db.js');

async function updateAdmissionTable() {
    try {
        await pool.query(`
            ALTER TABLE admission_requests 
            ADD COLUMN IF NOT EXISTS dob DATE,
            ADD COLUMN IF NOT EXISTS gender VARCHAR(20),
            ADD COLUMN IF NOT EXISTS address TEXT;
        `);
        console.log('Columns added successfully');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

updateAdmissionTable();
