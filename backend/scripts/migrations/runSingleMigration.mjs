import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });
import pg from 'pg';
import fs from 'fs';
import path from 'path';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error('❌ Missing DATABASE_URL in .env');
  process.exit(1);
}

const client = new pg.Client({ connectionString: databaseUrl, ssl: { rejectUnauthorized: false } });

async function runSingleMigration(fileName) {
  const sqlPath = path.resolve('../SQL', fileName);

  if (!fs.existsSync(sqlPath)) {
    console.error(`❌ File not found: ${sqlPath}`);
    process.exit(1);
  }

  await client.connect();
  console.log(`🔄 Executing ${fileName}...`);

  const sql = fs.readFileSync(sqlPath, 'utf-8');
  try {
    await client.query(sql);
    console.log(`✅ Successfully executed ${fileName}`);
  } catch (err) {
    console.error(`❌ Error executing ${fileName}:`, err.message);
  }

  await client.end();
  console.log('Database connection closed.');
}

// Get filename from command line args or default to 04_banners.sql
const fileName = process.argv[2] || '04_banners.sql';
runSingleMigration(fileName);
