const pool = require('./config/db.js');

async function updateAdmissionTableMoreFields() {
    try {
        await pool.query(`
            ALTER TABLE admission_requests 
            ADD COLUMN IF NOT EXISTS blood_group VARCHAR(20),
            ADD COLUMN IF NOT EXISTS category VARCHAR(50),
            ADD COLUMN IF NOT EXISTS aadhaar_number VARCHAR(50),
            ADD COLUMN IF NOT EXISTS father_occupation VARCHAR(100),
            ADD COLUMN IF NOT EXISTS mother_occupation VARCHAR(100),
            ADD COLUMN IF NOT EXISTS alternate_phone VARCHAR(50),
            ADD COLUMN IF NOT EXISTS city VARCHAR(100),
            ADD COLUMN IF NOT EXISTS state VARCHAR(100),
            ADD COLUMN IF NOT EXISTS pincode VARCHAR(20),
            ADD COLUMN IF NOT EXISTS transport_required BOOLEAN DEFAULT FALSE,
            ADD COLUMN IF NOT EXISTS previous_school VARCHAR(255);
        `);
        console.log('Additional columns added successfully');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

updateAdmissionTableMoreFields();
