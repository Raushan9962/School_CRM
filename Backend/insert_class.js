const pool = require('./config/db');

async function createDummyClass() {
    try {
        const res = await pool.query(`INSERT INTO classes (school_id, name, section) VALUES (1, 'Class 10', 'A') ON CONFLICT DO NOTHING RETURNING id`);
        if (res.rows.length > 0) {
            console.log('Successfully created Dummy Class with ID:', res.rows[0].id);
        } else {
            console.log('Dummy Class already exists or school ID 1 does not exist.');
        }
    } catch (err) {
        console.error('Error creating class:', err);
    } finally {
        process.exit();
    }
}

createDummyClass();
