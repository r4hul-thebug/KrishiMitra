import pg from 'pg';
import { randomUUID } from 'node:crypto';
import bcrypt from 'bcryptjs';

const { Pool } = pg;
let pool = null;

// In-memory fallback store when PostgreSQL is not configured or unavailable
const inMemoryFarmers = new Map();

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

// Pre-seed demo farmers into in-memory store
const defaultHashedPassword = bcrypt.hashSync('password123', 10);
const altHashedPassword = bcrypt.hashSync('pass123', 10);

const initialDemoFarmers = [
  {
    id: 'demo-farmer-001',
    officialId: 'FARMER-001',
    password: defaultHashedPassword,
    createdAt: new Date().toISOString(),
    name: 'Ramlal',
    phone: '+91900000001',
    language: 'hi',
    crop: 'wheat',
    sowingDate: daysAgo(30),
    landAcres: 2.5,
    village: 'Kheri',
    state: 'Uttar Pradesh',
    location: { lat: 28.61, lon: 77.20 },
    yieldHistory: [
      { year: 2023, crop: 'wheat', yield: 18, unit: 'Quintals' },
      { year: 2024, crop: 'wheat', yield: 20, unit: 'Quintals' }
    ]
  },
  {
    id: 'demo-farmer-003',
    officialId: 'PM-KISAN-UP-001',
    password: altHashedPassword,
    createdAt: new Date().toISOString(),
    name: 'Ramlal',
    phone: '+91900000001',
    language: 'hi',
    crop: 'wheat',
    sowingDate: daysAgo(30),
    landAcres: 2.5,
    village: 'Kheri',
    state: 'Uttar Pradesh',
    location: { lat: 28.61, lon: 77.20 },
    yieldHistory: [
      { year: 2023, crop: 'wheat', yield: 18, unit: 'Quintals' },
      { year: 2024, crop: 'wheat', yield: 20, unit: 'Quintals' }
    ]
  },
  {
    id: 'demo-farmer-002',
    officialId: 'FARMER-002',
    password: defaultHashedPassword,
    createdAt: new Date().toISOString(),
    name: 'Sita Devi',
    phone: '+91900000002',
    language: 'hi',
    crop: 'rice',
    sowingDate: daysAgo(60),
    landAcres: 1,
    village: 'Barabanki',
    state: 'Uttar Pradesh',
    location: { lat: 26.85, lon: 81.00 },
    yieldHistory: [
      { year: 2023, crop: 'rice', yield: 22, unit: 'Quintals' },
      { year: 2024, crop: 'rice', yield: 25, unit: 'Quintals' }
    ]
  }
];

for (const farmer of initialDemoFarmers) {
  inMemoryFarmers.set(farmer.id, { ...farmer });
}

export async function connectDB(uri) {
  if (!uri) {
    console.warn('[store] DATABASE_URL not set — activating in-memory fallback store with demo farmers (FARMER-001 / password123).');
    pool = null;
    return;
  }

  try {
    pool = new Pool({
      connectionString: uri,
      ssl: { rejectUnauthorized: false }
    });

    await pool.query(`
      CREATE TABLE IF NOT EXISTS farmers (
        id VARCHAR PRIMARY KEY,
        official_id VARCHAR UNIQUE NOT NULL,
        data JSONB NOT NULL
      );
    `);

    // Ensure demo farmers exist in PostgreSQL
    for (const farmer of initialDemoFarmers) {
      await pool.query(`
        INSERT INTO farmers (id, official_id, data)
        VALUES ($1, $2, $3)
        ON CONFLICT (id) DO NOTHING
      `, [farmer.id, farmer.officialId, JSON.stringify(farmer)]).catch(() => {});
    }

    console.log('[store] Connected to PostgreSQL and verified schema with demo farmers seeded.');
  } catch (err) {
    console.warn('[store] Failed to connect to PostgreSQL (' + err.message + ') — using in-memory store fallback.');
    pool = null;
  }
}

export async function listFarmers() {
  if (pool) {
    try {
      const res = await pool.query('SELECT data FROM farmers');
      if (res.rows.length > 0) return res.rows.map(r => r.data);
    } catch (err) {
      console.warn('[store] PostgreSQL query failed, falling back to memory:', err.message);
    }
  }
  return Array.from(inMemoryFarmers.values());
}

export async function getFarmer(id) {
  if (pool) {
    try {
      const res = await pool.query('SELECT data FROM farmers WHERE id = $1 OR official_id = $1', [id]);
      if (res.rows[0]?.data) return res.rows[0].data;
    } catch (err) {
      console.warn('[store] PostgreSQL query failed, falling back to memory:', err.message);
    }
  }
  return inMemoryFarmers.get(id) || Array.from(inMemoryFarmers.values()).find(f => f.officialId === id) || inMemoryFarmers.get('demo-farmer-001') || null;
}

export async function getFarmerByOfficialId(officialId) {
  if (pool) {
    try {
      const res = await pool.query('SELECT data FROM farmers WHERE official_id = $1', [officialId]);
      if (res.rows[0]?.data) return res.rows[0].data;
    } catch (err) {
      console.warn('[store] PostgreSQL query failed, falling back to memory:', err.message);
    }
  }
  for (const farmer of inMemoryFarmers.values()) {
    if (farmer.officialId === officialId) {
      return farmer;
    }
  }
  return null;
}

export async function createFarmer(input) {
  const farmer = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    ...input,
  };
  
  if (pool) {
    try {
      await pool.query(
        'INSERT INTO farmers (id, official_id, data) VALUES ($1, $2, $3)',
        [farmer.id, farmer.officialId, farmer]
      );
      return farmer;
    } catch (err) {
      console.warn('[store] PostgreSQL insert failed, saving to memory:', err.message);
    }
  }

  inMemoryFarmers.set(farmer.id, farmer);
  return farmer;
}

export async function updateFarmer(id, patch) {
  if (pool) {
    try {
      const res = await pool.query(
        'UPDATE farmers SET data = data || $1::jsonb WHERE id = $2 RETURNING data',
        [JSON.stringify(patch), id]
      );
      if (res.rowCount > 0) return res.rows[0].data;
    } catch (err) {
      console.warn('[store] PostgreSQL update failed, updating memory:', err.message);
    }
  }

  const existing = inMemoryFarmers.get(id);
  if (!existing) return null;
  const updated = { ...existing, ...patch };
  inMemoryFarmers.set(id, updated);
  return updated;
}

export function getPool() {
  return pool;
}

export async function replaceAll(data) {
  if (data.farmers) {
    if (pool) {
      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        await client.query('DELETE FROM farmers');
        for (const farmer of data.farmers) {
          await client.query(
            'INSERT INTO farmers (id, official_id, data) VALUES ($1, $2, $3)',
            [farmer.id, farmer.officialId, farmer]
          );
        }
        await client.query('COMMIT');
        return;
      } catch (e) {
        await client.query('ROLLBACK');
        console.warn('[store] replaceAll in PostgreSQL failed, updating in-memory store:', e.message);
      } finally {
        client.release();
      }
    }

    inMemoryFarmers.clear();
    for (const farmer of data.farmers) {
      inMemoryFarmers.set(farmer.id, { ...farmer });
    }
  }
}

