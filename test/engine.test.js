// Zero-dependency rigorous tests for the advisory engine, using Node's built-in
// test runner. Run:  node --test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildAdvisory, toSpeech } from '../src/engine/advisory.js';
import { getDiseaseGuidance } from '../src/engine/disease.js';
import { getSuitability } from '../src/engine/suitability.js';

// --- Test Helpers ---
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

// --- Weather Scenarios ---
const dry5 = forecast([
  day('d1', 12, 24, 0), day('d2', 12, 25, 0), day('d3', 13, 26, 0),
  day('d4', 12, 24, 0), day('d5', 11, 23, 0),
]);
const rainy = forecast([
  day('d1', 18, 28, 20, 80), day('d2', 19, 29, 15, 85), day('d3', 18, 27, 5, 60),
  day('d4', 18, 28, 0), day('d5', 17, 26, 0),
]);
const hot5 = forecast([
  day('d1', 25, 40, 0), day('d2', 26, 42, 0), day('d3', 27, 43, 0),
  day('d4', 25, 40, 0), day('d5', 24, 38, 0),
]);
const cold5 = forecast([
  day('d1', 2, 15, 0), day('d2', 1, 14, 0), day('d3', 3, 16, 0),
  day('d4', 4, 18, 0), day('d5', 5, 20, 0),
]);
const wetWarm5 = forecast([
  day('d1', 20, 28, 10), day('d2', 21, 29, 12), day('d3', 20, 30, 5),
  day('d4', 22, 27, 15), day('d5', 19, 26, 0),
]);

// --- Advisory Engine Tests ---

test('ADVISORY: wheat in tillering gets a stage advisory', async () => {
  const farmer = { id: 'f1', crop: 'wheat', sowingDate: isoDaysAgo(30), landAcres: 2, location: { lat: 28, lon: 77 } };
  const adv = await buildAdvisory(farmer, dry5);
  assert.equal(adv.stage.key, 'tillering');
  assert.ok(adv.items.some((i) => i.basis.startsWith('stage:')));
});

test('ADVISORY: heavy rain forecast produces an URGENT hold-irrigation item, ranked first', async () => {
  const farmer = { id: 'f1', crop: 'wheat', sowingDate: isoDaysAgo(30), landAcres: 2, location: { lat: 28, lon: 77 } };
  const adv = await buildAdvisory(farmer, rainy);
  const hold = adv.items.find((i) => i.title.includes('Hold irrigation'));
  assert.ok(hold, 'expected a hold-irrigation item');
  assert.equal(hold.severity, 'urgent');
  assert.equal(adv.items[0].severity, 'urgent', 'urgent item should sort to the top');
});

test('ADVISORY: dry forecast produces an irrigation schedule (not a hold)', async () => {
  const farmer = { id: 'f1', crop: 'wheat', sowingDate: isoDaysAgo(30), landAcres: 2, location: { lat: 28, lon: 77 } };
  const adv = await buildAdvisory(farmer, dry5);
  assert.ok(adv.items.some((i) => i.title === 'Irrigation schedule'));
  assert.ok(!adv.items.some((i) => i.title.includes('Hold irrigation')));
});

test('ADVISORY: heat stress is detected for crops in hot weather', async () => {
  // Wheat ideal max is ~25C. 40C is way above.
  const farmer = { id: 'f1', crop: 'wheat', sowingDate: isoDaysAgo(30), landAcres: 2, location: { lat: 28, lon: 77 } };
  const adv = await buildAdvisory(farmer, hot5);
  const heatStress = adv.items.find(i => i.title === 'Heat stress risk');
  assert.ok(heatStress, 'should warn about heat stress');
  assert.match(heatStress.message, /exceed/);
});

test('ADVISORY: cold stress is detected for crops in cold weather', async () => {
  // Rice ideal min is ~20C. 2C is way below.
  const farmer = { id: 'f2', crop: 'rice', sowingDate: isoDaysAgo(30), landAcres: 2, location: { lat: 28, lon: 77 } };
  const adv = await buildAdvisory(farmer, cold5);
  const coldStress = adv.items.find(i => i.title === 'Cold stress risk');
  assert.ok(coldStress, 'should warn about cold stress');
  assert.match(coldStress.message, /protect the crop from cold/);
});

test('ADVISORY: disease-favourable weather triggers scout warning', async () => {
  const farmer = { id: 'f1', crop: 'wheat', sowingDate: isoDaysAgo(30), landAcres: 2, location: { lat: 28, lon: 77 } };
  const adv = await buildAdvisory(farmer, wetWarm5);
  const diseaseRisk = adv.items.find(i => i.title.includes('Disease'));
  assert.ok(diseaseRisk, 'should warn about disease due to wet/warm days');
});

test('ADVISORY: fertilizer reminder scales with land size', async () => {
  const small = await buildAdvisory({ id: 'a', crop: 'wheat', sowingDate: isoDaysAgo(30), landAcres: 1, location: { lat: 28, lon: 77 } }, dry5);
  const big = await buildAdvisory({ id: 'b', crop: 'wheat', sowingDate: isoDaysAgo(30), landAcres: 3, location: { lat: 28, lon: 77 } }, dry5);
  const nOf = (adv) => adv.items.find((i) => i.title === 'Nutrient reminder')?.message || '';
  assert.match(nOf(small), /48 kg N/);
  assert.match(nOf(big), /144 kg N/);
});

test('ADVISORY: missing sowing date skips stage guidance but provides weather', async () => {
  const farmer = { id: 'f1', crop: 'wheat', landAcres: 2, location: { lat: 28, lon: 77 } }; // No sowingDate
  const adv = await buildAdvisory(farmer, dry5);
  assert.equal(adv.stage, null, 'Stage should be null if sowing date missing');
  // Should still have yield prognosis or satellite if available
  assert.ok(adv.items.length > 0, 'Should still generate some generic info items');
});

test('ADVISORY: past maturity date triggers harvest warning', async () => {
  // Wheat matures in 140 days. We use 150 days.
  const farmer = { id: 'f1', crop: 'wheat', sowingDate: isoDaysAgo(150), landAcres: 2, location: { lat: 28, lon: 77 } };
  const adv = await buildAdvisory(farmer, dry5);
  const pastMaturity = adv.items.find(i => i.title === 'Likely past harvest');
  assert.ok(pastMaturity, 'Should remind farmer to harvest');
});

test('ADVISORY: unknown crop degrades gracefully', async () => {
  const adv = await buildAdvisory({ id: 'x', crop: 'dragonfruit', location: { lat: 28, lon: 77 } }, dry5);
  assert.equal(adv.items.length, 1);
  assert.match(adv.items[0].message, /not in the knowledge base/);
});

test('ADVISORY: toSpeech renders a short spoken paragraph', async () => {
  const farmer = { id: 'f1', crop: 'wheat', sowingDate: isoDaysAgo(30), landAcres: 2, location: { lat: 28, lon: 77 } };
  const speech = toSpeech(await buildAdvisory(farmer, rainy), 'en');
  assert.match(speech, /Advisory for your Wheat/);
  assert.ok(speech.length < 700, 'spoken output kept short for weak-network use');
});

// --- Suitability Engine Tests ---

test('SUITABILITY: calculates highest score for ideal weather', () => {
  // Wheat ideal is 10-25C. Mid ideal is 17.5.
  // We craft a forecast averaging 17.5C.
  const idealWheat = forecast([day('d1', 15, 20, 0), day('d2', 15, 20, 0)]);
  const crops = getSuitability(idealWheat);
  
  const wheat = crops.find(c => c.id === 'wheat');
  assert.ok(wheat, 'Wheat should be in the recommended crops');
  assert.ok(wheat.score >= 90, 'Wheat should score very high for 17.5C average');
});

test('SUITABILITY: severely penalizes out of bounds crops', () => {
  // Rice needs hot weather (20-35).
  // Cold forecast (averaging 8.5C) should heavily penalize Rice.
  const crops = getSuitability(cold5);
  const rice = crops.find(c => c.id === 'rice');
  
  if (rice) {
    assert.ok(rice.score < 50, 'Rice should score very poorly in freezing weather');
  } else {
    assert.ok(true, 'Rice did not even make top 3, which is correct');
  }
});

test('SUITABILITY: handles missing or invalid forecast', () => {
  const empty1 = getSuitability(null);
  const empty2 = getSuitability({ daily: [] });
  assert.deepEqual(empty1, []);
  assert.deepEqual(empty2, []);
});

// --- Disease Engine Tests ---

test('DISEASE: triage alert triggered on highly conducive weather', () => {
  const guidance = getDiseaseGuidance('wheat', 4);
  assert.ok(guidance, 'Guidance should exist for 4 wet/warm days');
  assert.match(guidance.title, /Disease Triage Alert/);
  assert.match(guidance.basis, /cnn_triage/);
});

test('DISEASE: ignores normal weather', () => {
  const guidance = getDiseaseGuidance('wheat', 1);
  assert.equal(guidance, null, 'No disease alert should trigger for 1 wet/warm day');
});
