const fs = require('fs');
const path = require('path');
const pool = require('./db');

const syncDatabase = async () => {
    try {
        console.log('Synchronizing database...');
        
        // Read the SQL schema file
        const sqlPath = path.join(__dirname, '../database_schema.sql');
        const sqlString = fs.readFileSync(sqlPath, 'utf8');

        // Execute the entire SQL script
        await pool.query(sqlString);
        
        console.log('Database synchronization completed successfully. Tables are ready.');
    } catch (error) {
        console.error('Error synchronizing database:', error.message);
        // We don't throw error to crash the app, but log it so dev knows
    }
};

module.exports = syncDatabase;
