const pool = require('./config/db');

async function runMigration() {
    console.log("Starting Migration: Converting role_id to role_name string...");
    try {
        await pool.query('BEGIN');
        
        // 1. Add role_name column
        console.log("Adding role_name column...");
        await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS role_name VARCHAR(100);');

        // 2. Populate role_name from roles table
        console.log("Populating role_name...");
        await pool.query(`
            UPDATE users u
            SET role_name = r.name
            FROM roles r
            WHERE u.role_id = r.id;
        `);

        // Handle cases where role_id was null but role is needed? All users should have roles, but just in case:
        // By default, do nothing for null.

        // 3. Drop role_id column
        console.log("Dropping role_id column...");
        await pool.query('ALTER TABLE users DROP COLUMN role_id;');

        // 4. Update the DB Schema SQL file - this is done via file tool, not this script.

        await pool.query('COMMIT');
        console.log("Migration completed successfully!");
    } catch (e) {
        await pool.query('ROLLBACK');
        console.error("Migration failed:", e);
    } finally {
        process.exit(0);
    }
}

runMigration();
