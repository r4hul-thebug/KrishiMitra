// Farmer profile CRUD + the advisory endpoint (the money route).
import { Router } from 'express';
import { listCrops, getCrop } from '../knowledge/crops.js';
import * as store from '../db/store.js';
import { getForecast } from '../services/weather.js';
import { getPrices } from '../services/market.js';
import { buildAdvisory, toSpeech } from '../engine/advisory.js';
import { getSuitability } from '../engine/suitability.js';

export const farmers = Router();

// Minimal validation kept inline — swap for zod/joi when the schema settles.
function validateFarmer(body) {
  const errors = [];
  if (!body.name || typeof body.name !== 'string') errors.push('name is required');
  if (!body.crop || !getCrop(body.crop)) errors.push('crop must be one of: ' + listCrops().map((c) => c.id).join(', '));
  if (body.location) {
    const { lat, lon } = body.location;
    if (typeof lat !== 'number' || typeof lon !== 'number') errors.push('location must be { lat:number, lon:number }');
  } else {
    errors.push('location { lat, lon } is required (used for weather)');
  }
  if (body.sowingDate && isNaN(Date.parse(body.sowingDate))) errors.push('sowingDate must be YYYY-MM-DD');
  return errors;
}

farmers.get('/', async (_req, res) => {
  const allFarmers = await store.listFarmers();
  res.json(allFarmers.map(({ password, ...rest }) => rest));
});

farmers.post('/', async (req, res) => {
  const errors = validateFarmer(req.body);
  if (errors.length) return res.status(400).json({ errors });
  const farmer = await store.createFarmer({
    name: req.body.name,
    phone: req.body.phone || null,
    language: req.body.language || 'hi',
    crop: req.body.crop,
    sowingDate: req.body.sowingDate || null,
    landAcres: req.body.landAcres || 1,
    location: req.body.location,
    village: req.body.village || null,
    state: req.body.state || null,
  });
  res.status(201).json(farmer);
});

farmers.get('/:id', async (req, res) => {
  const farmer = await store.getFarmer(req.params.id);
  if (!farmer) return res.status(404).json({ error: 'farmer not found' });
  const { password, ...safeFarmer } = farmer;
  res.json(safeFarmer);
});

farmers.patch('/:id', async (req, res) => {
  // Prevent updating sensitive or immutable fields directly
  const { id, officialId, password, ...safePatch } = req.body;
  
  const updated = await store.updateFarmer(req.params.id, safePatch);
  if (!updated) return res.status(404).json({ error: 'farmer not found' });
  
  const { password: _, ...safeFarmer } = updated;
  res.json(safeFarmer);
});

// THE core endpoint: personalized, weather-aware advisory for one farmer.
// ?speech=1 also returns a spoken paragraph (seam for Phase 2 TTS).
farmers.get('/:id/advisory', async (req, res) => {
  const farmer = await store.getFarmer(req.params.id);
  if (!farmer) return res.status(404).json({ error: 'farmer not found' });

  const forecast = await getForecast(farmer.location.lat, farmer.location.lon);
  const advisory = await buildAdvisory(farmer, forecast);

  if (req.query.speech === '1') {
    advisory.speech = toSpeech(advisory, farmer.language);
  }
  res.json(advisory);
});

// Convenience: current mandi prices for this farmer's crop.
farmers.get('/:id/prices', async (req, res) => {
  const farmer = await store.getFarmer(req.params.id);
  if (!farmer) return res.status(404).json({ error: 'farmer not found' });
  res.json(await getPrices(farmer.crop));
});

// Suitability endpoint: suggest best crops based on live weather forecast
farmers.get('/:id/suitability', async (req, res) => {
  const farmer = await store.getFarmer(req.params.id);
  if (!farmer || !farmer.location) return res.status(404).json({ error: 'farmer or location not found' });
  
  const forecast = await getForecast(farmer.location.lat, farmer.location.lon);
  const suggestions = getSuitability(forecast);
  res.json({ suggestions });
});

// Threats endpoint: Extract URGENT and IMPORTANT weather threats from Advisory
farmers.get('/:id/threats', async (req, res) => {
  const farmer = await store.getFarmer(req.params.id);
  if (!farmer || !farmer.location) return res.status(404).json({ error: 'farmer or location not found' });
  
  const forecast = await getForecast(farmer.location.lat, farmer.location.lon);
  const fullAdvisory = await buildAdvisory(farmer, forecast);
  
  // Extract triage and prescription items related to weather (rain, heat, cold)
  const threats = fullAdvisory.items.filter(item => 
    (item.severity === 'urgent' || item.severity === 'important') &&
    (item.title.toLowerCase().includes('rain') || 
     item.title.toLowerCase().includes('stress') || 
     item.title.toLowerCase().includes('irrigation') ||
     item.title.toLowerCase().includes('disease'))
  );

  res.json({ threats });
});

// Add a new yield history record
farmers.post('/:id/yield', async (req, res) => {
  const { year, crop, yield: yieldAmount, unit } = req.body;
  
  if (!year || !crop || !yieldAmount || !unit) {
    return res.status(400).json({ error: 'year, crop, yield, and unit are required' });
  }

  const farmer = await store.getFarmer(req.params.id);
  if (!farmer) return res.status(404).json({ error: 'farmer not found' });

  const history = farmer.yieldHistory || [];
  
  // Create new record
  const newRecord = {
    year: parseInt(year),
    crop: crop.toString(),
    yield: parseFloat(yieldAmount),
    unit: unit.toString()
  };

  history.push(newRecord);
  
  // Sort descending by year
  history.sort((a, b) => b.year - a.year);

  const updated = await store.updateFarmer(req.params.id, { yieldHistory: history });
  res.status(201).json(updated.yieldHistory);
});
