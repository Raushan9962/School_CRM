const pool = require('./config/db');

async function createAccountantTables() {
    try {
        await pool.query('BEGIN');

        // 1. fee_structures
        await pool.query(`
            CREATE TABLE IF NOT EXISTS fee_structures (
                id SERIAL PRIMARY KEY,
                school_id INTEGER REFERENCES schools(id) ON DELETE CASCADE,
                class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,
                fee_type VARCHAR(100) NOT NULL, -- Tuition, Transport, Hostel, Activity, etc.
                amount NUMERIC(10, 2) NOT NULL,
                frequency VARCHAR(50) DEFAULT 'Monthly', -- Monthly, Quarterly, Annually, One-time
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // 2. fee_receipts
        await pool.query(`
            CREATE TABLE IF NOT EXISTS fee_receipts (
                id SERIAL PRIMARY KEY,
                school_id INTEGER REFERENCES schools(id) ON DELETE CASCADE,
                receipt_number VARCHAR(50) UNIQUE NOT NULL,
                student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
                payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
                payment_mode VARCHAR(50) NOT NULL, -- Cash, Cheque, Online, DD
                transaction_id VARCHAR(100),
                total_amount NUMERIC(10, 2) NOT NULL,
                amount_paid NUMERIC(10, 2) NOT NULL,
                balance NUMERIC(10, 2) DEFAULT 0,
                status VARCHAR(50) DEFAULT 'Paid', -- Paid, Partial, Pending
                created_by INTEGER REFERENCES users(id),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // 3. payrolls
        await pool.query(`
            CREATE TABLE IF NOT EXISTS payrolls (
                id SERIAL PRIMARY KEY,
                school_id INTEGER REFERENCES schools(id) ON DELETE CASCADE,
                staff_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                month VARCHAR(20) NOT NULL,
                year INTEGER NOT NULL,
                basic_salary NUMERIC(10, 2) NOT NULL,
                allowances NUMERIC(10, 2) DEFAULT 0,
                deductions NUMERIC(10, 2) DEFAULT 0,
                net_salary NUMERIC(10, 2) NOT NULL,
                payment_date DATE,
                status VARCHAR(50) DEFAULT 'Pending', -- Pending, Paid
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // 4. expenses
        await pool.query(`
            CREATE TABLE IF NOT EXISTS expenses (
                id SERIAL PRIMARY KEY,
                school_id INTEGER REFERENCES schools(id) ON DELETE CASCADE,
                category VARCHAR(100) NOT NULL, -- Electricity, Water, Maintenance, etc.
                amount NUMERIC(10, 2) NOT NULL,
                expense_date DATE NOT NULL,
                vendor_id INTEGER,
                description TEXT,
                bill_url VARCHAR(255),
                status VARCHAR(50) DEFAULT 'Paid',
                created_by INTEGER REFERENCES users(id),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // 5. vendors
        await pool.query(`
            CREATE TABLE IF NOT EXISTS vendors (
                id SERIAL PRIMARY KEY,
                school_id INTEGER REFERENCES schools(id) ON DELETE CASCADE,
                name VARCHAR(150) NOT NULL,
                contact_person VARCHAR(100),
                phone VARCHAR(20),
                email VARCHAR(100),
                address TEXT,
                gst_number VARCHAR(50),
                pan_number VARCHAR(50),
                bank_name VARCHAR(255),
                account_name VARCHAR(255),
                account_number VARCHAR(100),
                ifsc_code VARCHAR(50),
                upi_id VARCHAR(100),
                bank_details TEXT,
                status VARCHAR(50) DEFAULT 'Active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // 6. crm_subscription_payments (For Super Admin payments)
        await pool.query(`
            CREATE TABLE IF NOT EXISTS crm_subscription_payments (
                id SERIAL PRIMARY KEY,
                school_id INTEGER REFERENCES schools(id) ON DELETE CASCADE,
                plan_id INTEGER REFERENCES subscription_plans(id),
                amount NUMERIC(10, 2) NOT NULL,
                payment_date DATE NOT NULL,
                payment_mode VARCHAR(50),
                transaction_id VARCHAR(100),
                invoice_url VARCHAR(255),
                status VARCHAR(50) DEFAULT 'Completed',
                created_by INTEGER REFERENCES users(id),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // 7. refund_requests
        await pool.query(`
            CREATE TABLE IF NOT EXISTS refund_requests (
                id SERIAL PRIMARY KEY,
                school_id INTEGER REFERENCES schools(id) ON DELETE CASCADE,
                student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
                amount NUMERIC(10, 2) NOT NULL,
                reason TEXT,
                status VARCHAR(50) DEFAULT 'Pending', -- Pending, Approved, Rejected, Refunded
                requested_date DATE DEFAULT CURRENT_DATE,
                processed_date DATE,
                processed_by INTEGER REFERENCES users(id),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await pool.query('COMMIT');
        console.log("Accountant tables created successfully.");
    } catch (err) {
        await pool.query('ROLLBACK');
        console.error("Error creating accountant tables:", err);
    } finally {
        pool.end();
    }
}

createAccountantTables();
