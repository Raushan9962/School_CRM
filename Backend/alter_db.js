const pool = require('./config/db');

async function alterDb() {
    const client = await pool.connect();
    try {
        console.log('Altering database tables...');
        
        // Arrays of tables
        const staffTables = ['teachers', 'accountants', 'librarians', 'transport_managers', 'receptionists', 'hostel_wardens', 'hr_managers'];
        
        for (const table of staffTables) {
            console.log(`Adding common columns to ${table}...`);
            try {
                await client.query(`ALTER TABLE ${table} ADD COLUMN IF NOT EXISTS employment_type VARCHAR(100)`);
                await client.query(`ALTER TABLE ${table} ADD COLUMN IF NOT EXISTS bank_account VARCHAR(100)`);
                await client.query(`ALTER TABLE ${table} ADD COLUMN IF NOT EXISTS ifsc_code VARCHAR(50)`);
                await client.query(`ALTER TABLE ${table} ADD COLUMN IF NOT EXISTS basic_salary NUMERIC`);
            } catch (e) {
                console.log(`Skipped ${table}: ${e.message}`);
            }
        }

        console.log(`Adding specific columns to teachers...`);
        try {
            await client.query(`ALTER TABLE teachers ADD COLUMN IF NOT EXISTS hra NUMERIC`);
            await client.query(`ALTER TABLE teachers ADD COLUMN IF NOT EXISTS da NUMERIC`);
            await client.query(`ALTER TABLE teachers ADD COLUMN IF NOT EXISTS ta NUMERIC`);
            await client.query(`ALTER TABLE teachers ADD COLUMN IF NOT EXISTS other_allowances NUMERIC`);
            await client.query(`ALTER TABLE teachers ADD COLUMN IF NOT EXISTS probation_period VARCHAR(100)`);
            await client.query(`ALTER TABLE teachers ADD COLUMN IF NOT EXISTS confirmation_date DATE`);
        } catch (e) {
            console.log(`Skipped teachers specific: ${e.message}`);
        }

        console.log('Database altered successfully.');
    } catch (err) {
        console.error('Error:', err);
    } finally {
        client.release();
        process.exit();
    }
}

alterDb();
