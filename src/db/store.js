import pg from 'pg';
import { randomUUID } from 'node:crypto';

const { Pool } = pg;
let pool;

export async function connectDB(uri) {
  if (!uri) {
    console.error('======================================================');
    console.error('FATAL ERROR: DATABASE_URL environment variable is missing.');
    console.error('Please add your connection string to your .env file.');
    console.error('======================================================');
    throw new Error('DATABASE_URL is required to run the server.');
  }

  pool = new Pool({
    connectionString: uri,
    ssl: { rejectUnauthorized: false } // Required by Neon and most cloud providers
  });

  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS farmers (
        id VARCHAR PRIMARY KEY,
        official_id VARCHAR UNIQUE NOT NULL,
        data JSONB NOT NULL
      );
    `);
    console.log('[store] Connected to PostgreSQL and verified schema.');
  } catch (err) {
    console.error('[store] Failed to initialize PostgreSQL:', err.message);
    throw err;
  }
}

export async function listFarmers() {
  const res = await pool.query('SELECT data FROM farmers');
  return res.rows.map(r => r.data);
}

export async function getFarmer(id) {
  const res = await pool.query('SELECT data FROM farmers WHERE id = $1', [id]);
  return res.rows[0]?.data || null;
}

export async function getFarmerByOfficialId(officialId) {
  const res = await pool.query('SELECT data FROM farmers WHERE official_id = $1', [officialId]);
  return res.rows[0]?.data || null;
}

export async function createFarmer(input) {
  const farmer = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    ...input,
  };
  
  await pool.query(
    'INSERT INTO farmers (id, official_id, data) VALUES ($1, $2, $3)',
    [farmer.id, farmer.officialId, farmer]
  );
  
  return farmer;
}

export async function updateFarmer(id, patch) {
  // Postgres JSONB concatenation elegantly merges the existing JSON object with the patch object
  const res = await pool.query(
    'UPDATE farmers SET data = data || $1::jsonb WHERE id = $2 RETURNING data',
    [JSON.stringify(patch), id]
  );
  
  if (res.rowCount === 0) return null;
  return res.rows[0].data;
}

export async function replaceAll(data) {
  if (data.farmers) {
    await pool.query('DELETE FROM farmers');
    for (const farmer of data.farmers) {
      await pool.query(
        'INSERT INTO farmers (id, official_id, data) VALUES ($1, $2, $3)',
        [farmer.id, farmer.officialId, farmer]
      );
    }
  }
}
