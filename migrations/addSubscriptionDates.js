/**
 * Migration: Add subscription management columns to schools table
 * Run: node migrations/addSubscriptionDates.js
 */

const pool = require('../config/db');

async function migrate() {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // 1. Add subscription_start_date to schools
        await client.query(`
            ALTER TABLE schools
            ADD COLUMN IF NOT EXISTS subscription_start_date DATE DEFAULT CURRENT_DATE
        `);

        // 2. Add subscription_end_date
        await client.query(`
            ALTER TABLE schools
            ADD COLUMN IF NOT EXISTS subscription_end_date DATE
        `);

        // 3. Add subscription_status: Active | Expired | Suspended | Trial
        await client.query(`
            ALTER TABLE schools
            ADD COLUMN IF NOT EXISTS subscription_status VARCHAR(50) DEFAULT 'Active'
        `);

        // 4. Add is_active flag on school (for hard enable/disable)
        await client.query(`
            ALTER TABLE schools
            ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE
        `);

        // 5. Seed end_date for existing schools from created_at + billing_cycle
        await client.query(`
            UPDATE schools s
            SET
                subscription_start_date = s.created_at::DATE,
                subscription_end_date = CASE
                    WHEN s.billing_cycle = 'Yearly'
                        THEN (s.created_at + INTERVAL '1 year')::DATE
                    ELSE
                        (s.created_at + INTERVAL '1 month')::DATE
                    END,
                subscription_status = 'Active',
                is_active = TRUE
            WHERE subscription_end_date IS NULL
        `);

        console.log('✅ subscription_start_date, subscription_end_date, subscription_status, is_active added to schools');

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
