/**
 * Migration: Add transactions table for proper payment tracking
 * Run: node migrations/addTransactionsTable.js
 */

const pool = require('../config/db');

async function migrate() {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // 1. Create transactions table
        await client.query(`
            CREATE TABLE IF NOT EXISTS transactions (
                id               SERIAL PRIMARY KEY,
                school_id        INTEGER REFERENCES schools(id) ON DELETE CASCADE,
                plan_id          INTEGER REFERENCES subscription_plans(id) ON DELETE SET NULL,
                amount           NUMERIC(10, 2) NOT NULL,
                billing_cycle    VARCHAR(20)    NOT NULL DEFAULT 'Monthly',
                status           VARCHAR(50)    NOT NULL DEFAULT 'Pending',
                payment_method   VARCHAR(100)   DEFAULT 'Online Transfer',
                payment_date     DATE,
                due_date         DATE,
                notes            TEXT,
                invoice_no       VARCHAR(100) UNIQUE,
                created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ transactions table created');

        // 2. Seed initial transactions from existing schools
        const schools = await client.query(`
            SELECT s.id AS school_id, s.plan_id, s.billing_cycle, s.created_at,
                   sp.monthly_price, sp.yearly_price
            FROM schools s
            JOIN subscription_plans sp ON s.plan_id = sp.id
        `);

        for (const s of schools.rows) {
            const amount = s.billing_cycle === 'Yearly' ? s.yearly_price : s.monthly_price;
            const invoiceNo = `INV-${s.school_id}-${Date.now()}`;
            const dueDate   = new Date(s.created_at);
            dueDate.setDate(dueDate.getDate() + 7);

            // Check if already seeded
            const exists = await client.query(
                'SELECT 1 FROM transactions WHERE school_id=$1 AND invoice_no LIKE $2',
                [s.school_id, `INV-${s.school_id}-%`]
            );
            if (exists.rows.length === 0) {
                await client.query(`
                    INSERT INTO transactions (school_id, plan_id, amount, billing_cycle, status, payment_method, payment_date, due_date, invoice_no)
                    VALUES ($1, $2, $3, $4, 'Paid', 'Online Transfer', $5::date, $6::date, $7)
                `, [s.school_id, s.plan_id, amount, s.billing_cycle, s.created_at, dueDate, invoiceNo]);
            }
        }
        console.log(`✅ Seeded ${schools.rows.length} initial transactions`);

        await client.query('COMMIT');
        console.log('🎉 Migration complete!');
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('❌ Migration failed:', err.message);
    } finally {
        client.release();
        process.exit(0);
    }
}

migrate();
