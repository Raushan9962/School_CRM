const pool = require('../config/db');

/**
 * Migration: fix_students_and_invoices
 * - Adds missing columns to the `students` table (extended admission fields)
 * - Ensures `student_fee_invoices` table exists with correct schema
 *   (student_id → students.id, NOT users.id)
 */
async function migrate() {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // 1. Add missing columns to students table
        const studentCols = [
            `ADD COLUMN IF NOT EXISTS religion VARCHAR(100)`,
            `ADD COLUMN IF NOT EXISTS guardian_name VARCHAR(255)`,
            `ADD COLUMN IF NOT EXISTS parent_occupation VARCHAR(255)`,
            `ADD COLUMN IF NOT EXISTS parent_income VARCHAR(100)`,
            `ADD COLUMN IF NOT EXISTS board VARCHAR(100)`,
            `ADD COLUMN IF NOT EXISTS category VARCHAR(50)`,
            `ADD COLUMN IF NOT EXISTS medical_allergies TEXT`,
            `ADD COLUMN IF NOT EXISTS medical_disabilities TEXT`,
            `ADD COLUMN IF NOT EXISTS medical_doctor_name VARCHAR(255)`,
            `ADD COLUMN IF NOT EXISTS emergency_contact VARCHAR(50)`,
            `ADD COLUMN IF NOT EXISTS transport_route_id INTEGER`,
            `ADD COLUMN IF NOT EXISTS transport_stop VARCHAR(255)`,
            `ADD COLUMN IF NOT EXISTS transport_pass_number VARCHAR(100)`,
            `ADD COLUMN IF NOT EXISTS hostel_block VARCHAR(100)`,
            `ADD COLUMN IF NOT EXISTS hostel_room VARCHAR(100)`,
            `ADD COLUMN IF NOT EXISTS hostel_bed VARCHAR(100)`,
        ];

        for (const col of studentCols) {
            await client.query(`ALTER TABLE students ${col}`);
        }
        console.log('✅ students table columns updated');

        // 2. Ensure student_fee_invoices table exists
        //    student_id references students(id) — NOT users(id)
        await client.query(`
            CREATE TABLE IF NOT EXISTS student_fee_invoices (
                id SERIAL PRIMARY KEY,
                school_id INTEGER REFERENCES schools(id) ON DELETE CASCADE,
                student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
                fee_structure_id INTEGER REFERENCES fee_structures(id) ON DELETE CASCADE,
                due_amount NUMERIC(10, 2) NOT NULL,
                paid_amount NUMERIC(10, 2) DEFAULT 0,
                status VARCHAR(50) DEFAULT 'Pending',
                assigned_by INTEGER REFERENCES users(id),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ student_fee_invoices table ensured');

        await client.query('COMMIT');
        console.log('\n🎉 Migration completed successfully!');
    } catch (e) {
        await client.query('ROLLBACK');
        console.error('❌ Migration failed:', e.message);
        process.exit(1);
    } finally {
        client.release();
        process.exit(0);
    }
}

migrate();
