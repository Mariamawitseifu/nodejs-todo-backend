require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function runMigration(filePath) {
  const sql = fs.readFileSync(filePath, 'utf8');
  console.log(`Running migration: ${path.basename(filePath)}`);
  await pool.query(sql);
  console.log('✓ Completed');
}

(async () => {
  try {
    const migrations = [
      path.join(__dirname, 'migrations', '001_create_tasks.sql'),
      path.join(__dirname, 'migrations', '002_create_categories.sql'),
    ];
    for (const mig of migrations) {
      await runMigration(mig);
    }
    await pool.end();
    console.log('All migrations applied successfully.');
  } catch (err) {
    console.error('Migration error:', err);
    process.exit(1);
  }
})();
