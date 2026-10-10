const pool = require('./config/db.js');

async function createTables() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS teacher_planners (
                id SERIAL PRIMARY KEY,
                school_id INTEGER NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
                teacher_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                class_name VARCHAR(50) NOT NULL,
                section VARCHAR(50) NOT NULL,
                subject VARCHAR(100) NOT NULL,
                date DATE NOT NULL,
                topic VARCHAR(255) NOT NULL,
                home_assignment TEXT,
                plan TEXT NOT NULL,
                attachment_url TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("Created teacher_planners table");

        await pool.query(`
            CREATE TABLE IF NOT EXISTS periods (
                id SERIAL PRIMARY KEY,
                school_id INTEGER NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
                start_time TIME NOT NULL,
                end_time TIME NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("Created periods table");

        process.exit(0);
    } catch (e) {
        console.error("Error creating tables:", e);
        process.exit(1);
    }
}

createTables();
