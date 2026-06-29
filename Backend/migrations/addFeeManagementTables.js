const pool = require('../config/db');

async function migrate() {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        
        // 1. Create fee_structures table
        await client.query(`
            CREATE TABLE IF NOT EXISTS fee_structures (
                id SERIAL PRIMARY KEY,
                school_id INTEGER REFERENCES schools(id) ON DELETE CASCADE,
                name VARCHAR(255) NOT NULL,
                class_name VARCHAR(100) NOT NULL,
                total_amount NUMERIC(10, 2) NOT NULL,
                created_by INTEGER REFERENCES users(id),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Created fee_structures table');

        // 2. Create student_fee_invoices table
        await client.query(`
            CREATE TABLE IF NOT EXISTS student_fee_invoices (
                id SERIAL PRIMARY KEY,
                school_id INTEGER REFERENCES schools(id) ON DELETE CASCADE,
                student_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                fee_structure_id INTEGER REFERENCES fee_structures(id) ON DELETE CASCADE,
                due_amount NUMERIC(10, 2) NOT NULL,
                paid_amount NUMERIC(10, 2) DEFAULT 0,
                status VARCHAR(50) DEFAULT 'Unpaid', -- Unpaid, Partial, Paid
                assigned_by INTEGER REFERENCES users(id),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Created student_fee_invoices table');

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
