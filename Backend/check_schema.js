const pool = require('./config/db');
pool.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'student_fee_invoices'").then(res => {
    console.log("student_fee_invoices:", res.rows);
    return pool.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'fees'");
}).then(res => {
    console.log("fees:", res.rows);
    process.exit(0);
});
