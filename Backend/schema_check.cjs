const pool = require('./config/db.js');
async function run() {
    try {
        const classes = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'classes'");
        console.log("CLASSES SCHEMA:", classes.rows.map(r => r.column_name));
        const students = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'students'");
        console.log("STUDENTS SCHEMA:", students.rows.map(r => r.column_name));
    } catch(e) {
        console.log(e);
    }
    process.exit(0);
}
run();
