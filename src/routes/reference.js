// Reference / lookup routes: crops list, and standalone weather & price lookups
// (useful for the app's browse screens and for testing without a farmer record).
import { Router } from 'express';
import { listCrops, getCrop } from '../knowledge/crops.js';
import { getForecast } from '../services/weather.js';
import { getPrices } from '../services/market.js';

export const reference = Router();

reference.get('/crops', (_req, res) => {
  res.json(listCrops());
});

reference.get('/crops/:id', (req, res) => {
  const crop = getCrop(req.params.id);
  if (!crop) return res.status(404).json({ error: 'crop not found' });
  res.json(crop);
});

// GET /api/weather?lat=..&lon=..
reference.get('/weather', async (req, res) => {
  const lat = Number(req.query.lat);
  const lon = Number(req.query.lon);
  if (Number.isNaN(lat) || Number.isNaN(lon)) {
    return res.status(400).json({ error: 'lat and lon query params are required' });
  }
  res.json(await getForecast(lat, lon));
});

// GET /api/prices?commodity=wheat
reference.get('/prices', async (req, res) => {
  const commodity = (req.query.commodity || 'wheat').toString().toLowerCase();
  res.json(await getPrices(commodity));
});
