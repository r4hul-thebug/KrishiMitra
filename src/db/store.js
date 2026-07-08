// Tiny JSON-file "database" with a repository-style API.
//
// WHY: a solo builder should not have to install PostgreSQL to run Phase 1.
// This module is the ONLY place that knows how data is persisted. When you
// move to Postgres + PostGIS + pgvector (recommended for Phase 2), you
// reimplement these same functions and nothing else in the app changes.
import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { randomUUID } from 'node:crypto';

const __dirname = dirname(fileURLToPath(import.meta.url));
const STORE_PATH = join(__dirname, 'store.json');

const empty = () => ({ farmers: [] });

let memCache = null;

async function read() {
  if (memCache) return memCache;
  if (!existsSync(STORE_PATH)) {
    memCache = empty();
    return memCache;
  }
  try {
    memCache = JSON.parse(await readFile(STORE_PATH, 'utf8'));
    return memCache;
  } catch {
    memCache = empty();
    return memCache;
  }
}

async function write(data) {
  memCache = data;
  try {
    // Write to /tmp/ in production (e.g. Vercel serverless)
    const writePath = process.env.NODE_ENV === 'production' ? '/tmp/store.json' : STORE_PATH;
    await writeFile(writePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.warn('[store] Could not write to disk, using in-memory only.', err.message);
  }
}

// --- Farmer repository -----------------------------------------------------

export async function listFarmers() {
  const db = await read();
  return db.farmers;
}

export async function getFarmer(id) {
  const db = await read();
  return db.farmers.find((f) => f.id === id) || null;
}

export async function getFarmerByOfficialId(officialId) {
  const db = await read();
  return db.farmers.find((f) => f.officialId === officialId) || null;
}

export async function createFarmer(input) {
  const db = await read();
  const farmer = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    ...input,
  };
  db.farmers.push(farmer);
  await write(db);
  return farmer;
}

export async function updateFarmer(id, patch) {
  const db = await read();
  const idx = db.farmers.findIndex((f) => f.id === id);
  if (idx === -1) return null;
  db.farmers[idx] = { ...db.farmers[idx], ...patch, id };
  await write(db);
  return db.farmers[idx];
}

export async function replaceAll(data) {
  await write({ ...empty(), ...data });
}
