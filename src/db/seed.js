// Seed a couple of demo farmers so you have something to hit immediately.
// Run: npm run seed
import { replaceAll, connectDB } from './store.js';
import { randomUUID } from 'node:crypto';

// Sowing dates are set relative to "today" so demo farmers are always mid-season.
function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

const farmers = [
  {
    id: randomUUID(),
    officialId: 'FARMER-001',
    password: 'hashed_password_placeholder',
    createdAt: new Date().toISOString(),
    name: 'Ramlal',
    phone: '+91900000001',
    language: 'hi',
    crop: 'wheat',
    sowingDate: daysAgo(30), // tillering stage → tests irrigation + N top-dress
    landAcres: 2,
    village: 'Kheri',
    state: 'Uttar Pradesh',
    location: { lat: 28.61, lon: 77.20 },
  },
  {
    id: randomUUID(),
    officialId: 'FARMER-002',
    password: 'hashed_password_placeholder',
    createdAt: new Date().toISOString(),
    name: 'Sita Devi',
    phone: '+91900000002',
    language: 'hi',
    crop: 'rice',
    sowingDate: daysAgo(60), // panicle initiation
    landAcres: 1,
    village: 'Barabanki',
    state: 'Uttar Pradesh',
    location: { lat: 26.85, lon: 81.00 },
  },
];

await connectDB(process.env.DATABASE_URL);
await replaceAll({ farmers });
console.log(`Seeded ${farmers.length} farmers:`);
for (const f of farmers) console.log(`  ${f.id}  ${f.name} (${f.crop})`);
console.log('\nTry:  curl http://localhost:3000/api/farmers/' + farmers[0].id + '/advisory?speech=1');
process.exit(0);
