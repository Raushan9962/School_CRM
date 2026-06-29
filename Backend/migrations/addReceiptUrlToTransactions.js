const pool = require('../config/db');

async function migrate() {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        
        await client.query(`
            ALTER TABLE transactions 
            ADD COLUMN IF NOT EXISTS receipt_url VARCHAR(255)
        `);
        console.log('✅ Added receipt_url to transactions table');

        await client.query('COMMIT');
    } catch (e) {
        await client.query('ROLLBACK');
        console.error('❌ Migration failed:', e);
    } finally {
        client.release();
        process.exit();
    }
}

migrate();
