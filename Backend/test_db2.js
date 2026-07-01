const { Pool } = require('pg');
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'school_crm',
  password: 'admin',
  port: 5432,
});

async function check() {
  try {
    const res = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'fee_structures'");
    console.log(res.rows);
  } catch(e) {
    console.error(e);
  } finally {
    pool.end();
  }
}
check();
