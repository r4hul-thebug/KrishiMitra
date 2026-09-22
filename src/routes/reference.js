// Reference / lookup routes: crops list, standalone weather, mandi prices, satellite NDVI, rotation, diseases, schemes
import { Router } from 'express';
import { listCrops, getCrop } from '../knowledge/crops.js';
import { getForecast, geocodeLocation } from '../services/weather.js';
import { getPrices } from '../services/market.js';
import { fetchSatelliteData } from '../services/satellite.js';
import { getRotationAdvice } from '../engine/rotation.js';
import { diagnoseSymptoms, calculateFertilizerDose, analyzeSoilHealthCard, DISEASE_DATABASE } from '../engine/disease.js';
import { listSchemes, getSchemeById } from '../knowledge/schemes.js';

export const reference = Router();

reference.get('/crops', (_req, res) => {
  res.json(listCrops());
});

reference.get('/crops/:id', (req, res) => {
  const crop = getCrop(req.params.id);
  if (!crop) return res.status(404).json({ error: 'crop not found' });
  res.json(crop);
});

// GET /api/weather?lat=..&lon=.. or ?q=city
reference.get('/weather', async (req, res) => {
  let lat = Number(req.query.lat);
  let lon = Number(req.query.lon);
  if (Number.isNaN(lat) || Number.isNaN(lon)) {
    const q = req.query.q || req.query.city || req.query.location;
    if (q) {
      const geo = await geocodeLocation(q);
      if (geo) {
        lat = geo.lat;
        lon = geo.lon;
      }
    }
  }
  if (Number.isNaN(lat) || Number.isNaN(lon)) {
    return res.status(400).json({ error: 'lat and lon query params are required' });
  }
  res.json(await getForecast(lat, lon));
});

// GET /api/geocode?q=query or /api/location/search?q=query
reference.get('/geocode', async (req, res) => {
  const q = req.query.q || req.query.name;
  if (!q) return res.status(400).json({ error: 'q query parameter is required' });
  const result = await geocodeLocation(q);
  if (!result) return res.status(404).json({ error: 'Location not found' });
  res.json(result);
});

reference.get('/location/search', async (req, res) => {
  const q = req.query.q || req.query.name;
  if (!q) return res.status(400).json({ error: 'q query parameter is required' });
  const result = await geocodeLocation(q);
  if (!result) return res.status(404).json({ error: 'Location not found' });
  res.json(result);
});

// GET /api/location/reverse?lat=..&lon=.. (Server-side reverse geocoding with safe caching & no client CORS issues)
reference.get('/location/reverse', async (req, res) => {
  const lat = parseFloat(req.query.lat);
  const lon = parseFloat(req.query.lon);
  if (isNaN(lat) || isNaN(lon)) {
    return res.json({ 
      lat: 26.85, 
      lon: 80.95, 
      village: 'Barabanki', 
      state: 'Uttar Pradesh', 
      locationStr: 'Barabanki, Uttar Pradesh' 
    });
  }

  try {
    const osmUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
    const resp = await fetch(osmUrl, {
      headers: { 'User-Agent': 'KrishiMitraaz-Crop-Advisory/2.0 (contact@krishimitraaz.in)' },
      signal: AbortSignal.timeout(4000)
    });
    if (resp.ok) {
      const data = await resp.json();
      const addr = data.address || {};
      const village = addr.village || addr.neighbourhood || addr.suburb || addr.town || addr.city || '';
      const state = addr.state || '';
      const locationStr = [village, state].filter(Boolean).join(', ') || `${lat.toFixed(2)}° N, ${lon.toFixed(2)}° E`;
      return res.json({ 
        lat, 
        lon, 
        village, 
        state, 
        country: addr.country || 'India', 
        locationStr 
      });
    }
  } catch (e) {
    console.warn('[location] Server reverse-geocoding fallback:', e.message);
  }

  res.json({
    lat,
    lon,
    village: '',
    state: '',
    country: 'India',
    locationStr: `${lat.toFixed(2)}° N, ${lon.toFixed(2)}° E`
  });
});

// GET /api/location/auto (Network / IP auto-location fallback for when browser GPS is denied/blocked)
reference.get('/location/auto', async (req, res) => {
  try {
    const clientIp = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket.remoteAddress;
    const isLocal = !clientIp || clientIp === '127.0.0.1' || clientIp === '::1' || clientIp.startsWith('10.') || clientIp.startsWith('192.168.');
    
    if (!isLocal) {
      const ipRes = await fetch(`https://ipwho.is/${encodeURIComponent(clientIp)}`, {
        signal: AbortSignal.timeout(3500)
      });
      if (ipRes.ok) {
        const data = await ipRes.json();
        if (data.success && typeof data.latitude === 'number' && typeof data.longitude === 'number') {
          return res.json({
            ok: true,
            source: 'network_ip',
            lat: Number(data.latitude.toFixed(4)),
            lon: Number(data.longitude.toFixed(4)),
            village: data.city || '',
            state: data.region || 'Uttar Pradesh',
            country: data.country || 'India',
            locationStr: `${data.city ? data.city + ', ' : ''}${data.region || 'India'}`
          });
        }
      }
    }
  } catch (e) {
    console.warn('[location] IP geolocation fallback warning:', e.message);
  }

  // High-reliability agricultural hub fallback (Barabanki / Lucknow, Uttar Pradesh)
  res.json({
    ok: true,
    source: 'default',
    lat: 26.85,
    lon: 80.95,
    village: 'Barabanki',
    state: 'Uttar Pradesh',
    country: 'India',
    locationStr: 'Barabanki, Uttar Pradesh'
  });
});

// GET /api/prices?commodity=wheat&state=Punjab
reference.get('/prices', async (req, res) => {
  const commodity = (req.query.commodity || 'wheat').toString().toLowerCase();
  const state = req.query.state ? req.query.state.toString() : null;
  res.json(await getPrices(commodity, state));
});

// GET /api/market/mandi?commodity=wheat&state=Punjab
reference.get('/market/mandi', async (req, res) => {
  const commodity = (req.query.commodity || 'wheat').toString().toLowerCase();
  const state = req.query.state ? req.query.state.toString() : null;
  res.json(await getPrices(commodity, state));
});

// GET /api/satellite/ndvi?lat=..&lon=..&crop=wheat&sowingDate=2026-06-01
reference.get('/satellite/ndvi', async (req, res) => {
  const lat = Number(req.query.lat) || 28.61;
  const lon = Number(req.query.lon) || 77.20;
  const crop = req.query.crop || 'wheat';
  const sowingDate = req.query.sowingDate || null;
  const data = await fetchSatelliteData(lat, lon, crop, sowingDate);
  res.json(data);
});

// GET /api/rotation/:crop
reference.get('/rotation/:crop', (req, res) => {
  const crop = req.params.crop || 'wheat';
  res.json(getRotationAdvice(crop));
});

// GET /api/disease/diagnose?crop=wheat&symptoms=yellow,stripes
reference.get('/disease/diagnose', (req, res) => {
  const crop = req.query.crop || 'wheat';
  const rawSymptoms = req.query.symptoms ? req.query.symptoms.toString().split(',') : [];
  res.json(diagnoseSymptoms(crop, rawSymptoms));
});

// GET /api/disease/all
reference.get('/disease/all', (_req, res) => {
  res.json(DISEASE_DATABASE);
});

// GET /api/fertilizer/dose?crop=wheat&acres=2
reference.get('/fertilizer/dose', (req, res) => {
  const crop = req.query.crop || 'wheat';
  const acres = Number(req.query.acres) || 1;
  res.json(calculateFertilizerDose(crop, acres));
});

// POST or GET /api/soil/analyze
reference.post('/soil/analyze', (req, res) => {
  const result = analyzeSoilHealthCard(req.body);
  res.json(result);
});

reference.get('/soil/analyze', (req, res) => {
  const result = analyzeSoilHealthCard(req.query);
  res.json(result);
});

// GET /api/schemes?category=all&state=all
reference.get('/schemes', (req, res) => {
  const category = req.query.category || 'all';
  const state = req.query.state || 'all';
  res.json(listSchemes(category, state));
});

// GET /api/schemes/:id
reference.get('/schemes/:id', (req, res) => {
  const scheme = getSchemeById(req.params.id);
  if (!scheme) return res.status(404).json({ error: 'Scheme not found' });
  res.json(scheme);
});
