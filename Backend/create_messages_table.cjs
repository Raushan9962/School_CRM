const pool = require('./config/db.js');
async function run() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS parent_teacher_messages (
                id SERIAL PRIMARY KEY,
                school_id INTEGER REFERENCES schools(id) ON DELETE CASCADE,
                teacher_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                parent_id INTEGER REFERENCES parents(id) ON DELETE CASCADE,
                sender_type VARCHAR(50) NOT NULL,
                message TEXT NOT NULL,
                sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log("Table created successfully");
    } catch(e) {
        console.log(e);
    }
    process.exit(0);
}
run();
