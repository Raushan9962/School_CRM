const pool = require('../config/db');

const up = async () => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        console.log("Creating book_categories table...");
        await client.query(`
            CREATE TABLE IF NOT EXISTS book_categories (
                id SERIAL PRIMARY KEY,
                school_id INTEGER REFERENCES schools(id) ON DELETE CASCADE,
                name VARCHAR(255) NOT NULL,
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        console.log("Creating library_settings table...");
        await client.query(`
            CREATE TABLE IF NOT EXISTS library_settings (
                id SERIAL PRIMARY KEY,
                school_id INTEGER REFERENCES schools(id) ON DELETE CASCADE UNIQUE,
                max_books_student INTEGER DEFAULT 2,
                max_books_teacher INTEGER DEFAULT 5,
                issue_duration_student INTEGER DEFAULT 7,
                issue_duration_teacher INTEGER DEFAULT 30,
                fine_per_day NUMERIC(10,2) DEFAULT 5.00,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        console.log("Creating book_reservations table...");
        await client.query(`
            CREATE TABLE IF NOT EXISTS book_reservations (
                id SERIAL PRIMARY KEY,
                book_id INTEGER REFERENCES books(id) ON DELETE CASCADE,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                status VARCHAR(50) DEFAULT 'Waiting',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        console.log("Altering books table...");
        await client.query(`
            DO $$ 
            BEGIN 
                BEGIN
                    ALTER TABLE books ADD COLUMN school_id INTEGER REFERENCES schools(id) ON DELETE CASCADE;
                EXCEPTION
                    WHEN duplicate_column THEN null;
                END;
                BEGIN
                    ALTER TABLE books ADD COLUMN category_id INTEGER REFERENCES book_categories(id) ON DELETE SET NULL;
                EXCEPTION
                    WHEN duplicate_column THEN null;
                END;
                BEGIN
                    ALTER TABLE books ADD COLUMN barcode VARCHAR(100) UNIQUE;
                EXCEPTION
                    WHEN duplicate_column THEN null;
                END;
                BEGIN
                    ALTER TABLE books ADD COLUMN rack_location VARCHAR(100);
                EXCEPTION
                    WHEN duplicate_column THEN null;
                END;
                BEGIN
                    ALTER TABLE books ADD COLUMN publisher VARCHAR(255);
                EXCEPTION
                    WHEN duplicate_column THEN null;
                END;
                BEGIN
                    ALTER TABLE books ADD COLUMN language VARCHAR(100);
                EXCEPTION
                    WHEN duplicate_column THEN null;
                END;
                BEGIN
                    ALTER TABLE books ADD COLUMN edition VARCHAR(100);
                EXCEPTION
                    WHEN duplicate_column THEN null;
                END;
                BEGIN
                    ALTER TABLE books ADD COLUMN price NUMERIC(10,2);
                EXCEPTION
                    WHEN duplicate_column THEN null;
                END;
                BEGIN
                    ALTER TABLE books ADD COLUMN purchase_date DATE;
                EXCEPTION
                    WHEN duplicate_column THEN null;
                END;
                BEGIN
                    ALTER TABLE books ADD COLUMN vendor_details VARCHAR(255);
                EXCEPTION
                    WHEN duplicate_column THEN null;
                END;
                BEGIN
                    ALTER TABLE books ADD COLUMN cover_image TEXT;
                EXCEPTION
                    WHEN duplicate_column THEN null;
                END;
                BEGIN
                    ALTER TABLE books ADD COLUMN status VARCHAR(50) DEFAULT 'Available';
                EXCEPTION
                    WHEN duplicate_column THEN null;
                END;
            END $$;
        `);

        console.log("Altering library_transactions table...");
        await client.query(`
            DO $$ 
            BEGIN 
                BEGIN
                    ALTER TABLE library_transactions ADD COLUMN remarks TEXT;
                EXCEPTION
                    WHEN duplicate_column THEN null;
                END;
                BEGIN
                    ALTER TABLE library_transactions ADD COLUMN condition_on_return VARCHAR(100);
                EXCEPTION
                    WHEN duplicate_column THEN null;
                END;
            END $$;
        `);

        await client.query('COMMIT');
        console.log('✅ Library module migration completed successfully!');
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('❌ Migration failed:', err);
    } finally {
        client.release();
    }
};

if (require.main === module) {
    up().then(() => process.exit(0));
}

module.exports = { up };
