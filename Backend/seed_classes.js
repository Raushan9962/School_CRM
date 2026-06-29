const pool = require('./config/db');

async function seedClasses() {
    try {
        await pool.query(`
            INSERT INTO classes (name, section) VALUES 
            ('Class 1', 'A'),
            ('Class 2', 'B'),
            ('Class 3', 'A'),
            ('Class 10', 'A')
            ON CONFLICT DO NOTHING;
        `);
        console.log("Classes inserted!");
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

seedClasses();
