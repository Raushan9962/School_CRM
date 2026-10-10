const pool = require('./config/db.js');
async function run() {
    try {
        const res = await pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
        console.log("TABLES:", res.rows.map(r => r.table_name).join(', '));
    } catch(e) {
        console.log(e);
    }
    process.exit(0);
}
run();
