const bcrypt = require('bcryptjs'); // try bcryptjs in case bcrypt is not compiling natively, but we will try both
const pool = require('./config/db.js');

async function createAdmin() {
    try {
        let hash;
        try {
            const bcryptNative = require('bcrypt');
            hash = await bcryptNative.hash('DRCC@1234', 10);
        } catch (err) {
            hash = await bcrypt.hash('DRCC@1234', 10);
        }

        await pool.query(
            "INSERT INTO users (name, username, email, password, role_name) VALUES ('Super Admin', 'admin', 'admin@example.com', $1, 'Super Admin') ON CONFLICT (email) DO UPDATE SET password = $1", 
            [hash]
        );
        console.log('Super admin created');
        process.exit(0);
    } catch(e) {
        console.error(e);
        process.exit(1);
    }
}

createAdmin();
