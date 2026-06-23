const pool = require('./config/db');

async function createLibraryTables() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS library_transactions (
                id SERIAL PRIMARY KEY,
                book_id INTEGER REFERENCES books(id) ON DELETE CASCADE,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                issued_on DATE NOT NULL,
                due_on DATE NOT NULL,
                returned_on DATE,
                fine NUMERIC(10,2) DEFAULT 0,
                status VARCHAR(50) DEFAULT 'Issued',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("Library transactions table created.");
    } catch (err) {
        console.error("Error creating library table:", err);
    } finally {
        pool.end();
    }
}

createLibraryTables();
