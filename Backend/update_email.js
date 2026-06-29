const pool = require('./config/db.js');

async function updateEmail() {
    try {
        await pool.query(
            "UPDATE users SET email = $1 WHERE username = 'admin'",
            ['Raushansuperadmin@gmail.com']
        );
        console.log('Email updated successfully');
        process.exit(0);
    } catch(e) {
        console.error(e);
        process.exit(1);
    }
}

updateEmail();
