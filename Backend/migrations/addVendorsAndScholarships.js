const pool = require('../config/db');

async function migrate() {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        
        // 1. Create vendors table
        await client.query(`
            CREATE TABLE IF NOT EXISTS vendors (
                id SERIAL PRIMARY KEY,
                school_id INTEGER REFERENCES schools(id) ON DELETE CASCADE,
                name VARCHAR(255) NOT NULL,
                type VARCHAR(100) NOT NULL,
                contact VARCHAR(50),
                email VARCHAR(100),
                pending_due NUMERIC(10, 2) DEFAULT 0,
                status VARCHAR(50) DEFAULT 'Active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Created vendors table');

        // 2. Create vendor_payments table
        await client.query(`
            CREATE TABLE IF NOT EXISTS vendor_payments (
                id SERIAL PRIMARY KEY,
                school_id INTEGER REFERENCES schools(id) ON DELETE CASCADE,
                vendor_id INTEGER REFERENCES vendors(id) ON DELETE CASCADE,
                amount NUMERIC(10, 2) NOT NULL,
                payment_date DATE NOT NULL,
                payment_method VARCHAR(50) DEFAULT 'Bank Transfer',
                receipt_url VARCHAR(255),
                created_by INTEGER REFERENCES users(id),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Created vendor_payments table');

        // 3. Create scholarships_discounts table
        await client.query(`
            CREATE TABLE IF NOT EXISTS scholarships_discounts (
                id SERIAL PRIMARY KEY,
                school_id INTEGER REFERENCES schools(id) ON DELETE CASCADE,
                student_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                grant_type VARCHAR(100) NOT NULL,
                value_type VARCHAR(50) NOT NULL DEFAULT 'fixed', -- fixed or percent
                value NUMERIC(10, 2) NOT NULL,
                valid_till VARCHAR(100) NOT NULL,
                remarks TEXT,
                status VARCHAR(50) DEFAULT 'Pending Approval',
                created_by INTEGER REFERENCES users(id),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Created scholarships_discounts table');

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
