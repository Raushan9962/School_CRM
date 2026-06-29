const pool = require('./config/db.js');

async function createAdmissionTables() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS admission_requests (
                id SERIAL PRIMARY KEY,
                student_name VARCHAR(255) NOT NULL,
                father_name VARCHAR(255) NOT NULL,
                mother_name VARCHAR(255) NOT NULL,
                phone VARCHAR(50) NOT NULL,
                email VARCHAR(255) NOT NULL,
                class_applied_for INTEGER REFERENCES classes(id) ON DELETE SET NULL,
                status VARCHAR(50) DEFAULT 'Pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('admission_requests table created.');

        await pool.query(`
            CREATE TABLE IF NOT EXISTS fee_structures (
                id SERIAL PRIMARY KEY,
                fee_type VARCHAR(255) NOT NULL,
                amount NUMERIC(10, 2) NOT NULL,
                class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE (fee_type, class_id)
            );
        `);
        console.log('fee_structures table created.');

        await pool.query(`
            CREATE TABLE IF NOT EXISTS invoices (
                id SERIAL PRIMARY KEY,
                admission_request_id INTEGER REFERENCES admission_requests(id) ON DELETE CASCADE,
                total_amount NUMERIC(10, 2) NOT NULL,
                breakdown JSONB NOT NULL,
                status VARCHAR(50) DEFAULT 'Unpaid',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('invoices table created.');

        process.exit(0);
    } catch (err) {
        console.error('Error creating tables:', err);
        process.exit(1);
    }
}

createAdmissionTables();
