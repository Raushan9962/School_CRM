const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
});

pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err);
});

pool
    .connect()
    .then((client) => {
        console.log("✅ PostgreSQL Connected Successfully");
        client.release();
    })
    .catch((err) => console.error("❌ Connection Failed:", err));

module.exports = pool;