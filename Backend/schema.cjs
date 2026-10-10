const pool = require('./config/db.js');
async function run() {
    try {
        const parents = await pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'parents'");
        console.log("PARENTS SCHEMA:", parents.rows);
        const comms = await pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'communications'");
        console.log("COMMS SCHEMA:", comms.rows);
    } catch(e) {
        console.log(e);
    }
    process.exit(0);
}
run();
