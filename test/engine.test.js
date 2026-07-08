// Zero-dependency smoke tests for the advisory engine, using Node's built-in
// test runner. Run:  node --test
//
// These assert the *reasoning*, not just that it doesn't crash — this is what
// gives you confidence to refactor the engine as the KB grows.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildAdvisory, toSpeech } from '../src/engine/advisory.js';

function forecast(daily, source = 'mock') {
  return { source, location: { lat: 28, lon: 77 }, daily };
}
function day(date, tMinC, tMaxC, rainMm, rainChance = 20) {
  return { date, tMinC, tMaxC, rainMm, rainChance };
}
function isoDaysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

const dry5 = forecast([
  day('d1', 12, 24, 0), day('d2', 12, 25, 0), day('d3', 13, 26, 0),
  day('d4', 12, 24, 0), day('d5', 11, 23, 0),
]);
const rainy = forecast([
  day('d1', 18, 28, 20, 80), day('d2', 19, 29, 15, 85), day('d3', 18, 27, 5, 60),
  day('d4', 18, 28, 0), day('d5', 17, 26, 0),
]);

test('wheat in tillering gets a stage advisory', async () => {
  const farmer = { id: 'f1', crop: 'wheat', sowingDate: isoDaysAgo(30), landAcres: 2, location: { lat: 28, lon: 77 } };
  const adv = await buildAdvisory(farmer, dry5);
  assert.equal(adv.stage.key, 'tillering');
  assert.ok(adv.items.some((i) => i.basis.startsWith('stage:')));
});

test('heavy rain forecast produces an URGENT hold-irrigation item, ranked first', async () => {
  const farmer = { id: 'f1', crop: 'wheat', sowingDate: isoDaysAgo(30), landAcres: 2, location: { lat: 28, lon: 77 } };
  const adv = await buildAdvisory(farmer, rainy);
  const hold = adv.items.find((i) => i.title.includes('Hold irrigation'));
  assert.ok(hold, 'expected a hold-irrigation item');
  assert.equal(hold.severity, 'urgent');
  assert.equal(adv.items[0].severity, 'urgent', 'urgent item should sort to the top');
});

test('dry forecast produces an irrigation schedule (not a hold)', async () => {
  const farmer = { id: 'f1', crop: 'wheat', sowingDate: isoDaysAgo(30), landAcres: 2, location: { lat: 28, lon: 77 } };
  const adv = await buildAdvisory(farmer, dry5);
  assert.ok(adv.items.some((i) => i.title === 'Irrigation schedule'));
  assert.ok(!adv.items.some((i) => i.title.includes('Hold irrigation')));
});

test('fertilizer reminder scales with land size', async () => {
  const small = await buildAdvisory({ id: 'a', crop: 'wheat', sowingDate: isoDaysAgo(30), landAcres: 1, location: { lat: 28, lon: 77 } }, dry5);
  const big = await buildAdvisory({ id: 'b', crop: 'wheat', sowingDate: isoDaysAgo(30), landAcres: 3, location: { lat: 28, lon: 77 } }, dry5);
  const nOf = (adv) => adv.items.find((i) => i.title === 'Nutrient reminder')?.message || '';
  assert.match(nOf(small), /48 kg N/);
  assert.match(nOf(big), /144 kg N/);
});

test('unknown crop degrades gracefully', async () => {
  const adv = await buildAdvisory({ id: 'x', crop: 'banana', location: { lat: 28, lon: 77 } }, dry5);
  assert.equal(adv.items.length, 1);
  assert.match(adv.items[0].message, /not in the knowledge base/);
});

test('toSpeech renders a short spoken paragraph', async () => {
  const farmer = { id: 'f1', crop: 'wheat', sowingDate: isoDaysAgo(30), landAcres: 2, location: { lat: 28, lon: 77 } };
  const speech = toSpeech(await buildAdvisory(farmer, rainy), 'en');
  assert.match(speech, /Advisory for your Wheat/);
  assert.ok(speech.length < 700, 'spoken output kept short for weak-network use');
});
