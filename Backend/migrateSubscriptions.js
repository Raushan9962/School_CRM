const pool = require('./config/db');
const fs = require('fs');
const path = require('path');

async function migrate() {
    try {
        console.log('Running subscription schema migration...');
        
        // 1. Create Subscription Plans table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS subscription_plans (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                max_students INTEGER, -- NULL means infinite
                monthly_price NUMERIC(10, 2) NOT NULL,
                yearly_price NUMERIC(10, 2) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // 2. Seed Subscription Plans (Only if table is empty)
        const check = await pool.query('SELECT COUNT(*) FROM subscription_plans');
        if (parseInt(check.rows[0].count) === 0) {
            await pool.query(`
                INSERT INTO subscription_plans (name, max_students, monthly_price, yearly_price) VALUES 
                ('Up to 50', 50, 500.00, 5000.00),
                ('Up to 100', 100, 900.00, 9000.00),
                ('Up to 200', 200, 1600.00, 16000.00),
                ('Up to 400', 400, 3000.00, 30000.00),
                ('Up to 500', 500, 3500.00, 35000.00),
                ('Up to 1000', 1000, 6000.00, 60000.00),
                ('Up to 1500', 1500, 8500.00, 85000.00),
                ('Up to 2000', 2000, 11000.00, 110000.00),
                ('2000+ (Unlimited)', NULL, 15000.00, 150000.00)
            `);
            console.log('Seeded subscription plans.');
        }

        // 3. Alter Schools table to add subscription info
        // We catch errors in case columns already exist
        try {
            await pool.query(`ALTER TABLE schools ADD COLUMN plan_id INTEGER REFERENCES subscription_plans(id) ON DELETE SET NULL`);
        } catch (e) { if (!e.message.includes('already exists')) throw e; }

        try {
            await pool.query(`ALTER TABLE schools ADD COLUMN billing_cycle VARCHAR(20) DEFAULT 'Monthly'`);
        } catch (e) { if (!e.message.includes('already exists')) throw e; }
        
        try {
            await pool.query(`ALTER TABLE schools ADD COLUMN subscription_status VARCHAR(50) DEFAULT 'Active'`);
        } catch (e) { if (!e.message.includes('already exists')) throw e; }

        console.log('Migration successful.');

        // 4. Append to database_schema.sql for future setups
        const schemaPath = path.join(__dirname, 'database_schema.sql');
        const appendCode = `

-- Subscriptions Table
CREATE TABLE IF NOT EXISTS subscription_plans (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    max_students INTEGER,
    monthly_price NUMERIC(10, 2) NOT NULL,
    yearly_price NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- (Note: Schools table needs plan_id, billing_cycle, and subscription_status columns)
-- ALTER TABLE schools ADD COLUMN plan_id INTEGER REFERENCES subscription_plans(id) ON DELETE SET NULL;
-- ALTER TABLE schools ADD COLUMN billing_cycle VARCHAR(20) DEFAULT 'Monthly';
-- ALTER TABLE schools ADD COLUMN subscription_status VARCHAR(50) DEFAULT 'Active';

INSERT INTO subscription_plans (name, max_students, monthly_price, yearly_price) 
VALUES 
('Up to 50', 50, 500.00, 5000.00),
('Up to 100', 100, 900.00, 9000.00),
('Up to 200', 200, 1600.00, 16000.00),
('Up to 400', 400, 3000.00, 30000.00),
('Up to 500', 500, 3500.00, 35000.00),
('Up to 1000', 1000, 6000.00, 60000.00),
('Up to 1500', 1500, 8500.00, 85000.00),
('Up to 2000', 2000, 11000.00, 110000.00),
('2000+ (Unlimited)', NULL, 15000.00, 150000.00)
ON CONFLICT DO NOTHING;
`;
        
        if (!fs.readFileSync(schemaPath, 'utf8').includes('subscription_plans')) {
            fs.appendFileSync(schemaPath, appendCode);
        }

        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrate();
