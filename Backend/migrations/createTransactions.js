const pool = require('../config/db');

async function up() {
    try {
        console.log('Running migration: create_transactions_table...');
        
        await pool.query(`
            CREATE TABLE IF NOT EXISTS transactions (
                id SERIAL PRIMARY KEY,
                school_id INTEGER REFERENCES schools(id) ON DELETE CASCADE,
                amount NUMERIC(10, 2) NOT NULL,
                transaction_date DATE DEFAULT CURRENT_DATE,
                reference_no VARCHAR(100),
                status VARCHAR(50) DEFAULT 'Completed',
                payment_method VARCHAR(50) DEFAULT 'Bank Transfer',
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        console.log('✅ Transactions table created successfully');
    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        process.exit();
    }
}

up();
