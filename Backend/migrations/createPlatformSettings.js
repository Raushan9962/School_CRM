const pool = require('../config/db');

async function up() {
    try {
        console.log('Running migration: create_platform_settings_table...');
        
        await pool.query(`
            CREATE TABLE IF NOT EXISTS platform_settings (
                id SERIAL PRIMARY KEY,
                setting_key VARCHAR(100) UNIQUE NOT NULL,
                setting_value TEXT NOT NULL,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Insert default settings
        await pool.query(`
            INSERT INTO platform_settings (setting_key, setting_value)
            VALUES 
                ('maintenance_mode', 'false'),
                ('default_currency', 'USD'),
                ('email_notifications', 'true')
            ON CONFLICT (setting_key) DO NOTHING;
        `);

        console.log('✅ platform_settings table created successfully');
    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        process.exit();
    }
}

up();
