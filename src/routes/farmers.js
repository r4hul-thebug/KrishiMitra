// Farmer profile CRUD + the advisory endpoint (the money route).
import { Router } from 'express';
import { listCrops, getCrop } from '../knowledge/crops.js';
import * as store from '../db/store.js';
import { getForecast, geocodeLocation } from '../services/weather.js';
import { getPrices } from '../services/market.js';
import { buildAdvisory, toSpeech } from '../engine/advisory.js';
import { getSuitability } from '../engine/suitability.js';
import { fetchSatelliteData } from '../services/satellite.js';
import { getRotationAdvice } from '../engine/rotation.js';
import { GoogleGenAI } from '@google/genai';

export async function resolveFarmerCoordinates(farmer) {
  if (!farmer) return { lat: 28.61, lon: 77.20 };

  let lat = farmer.location?.lat !== undefined ? parseFloat(farmer.location.lat) : NaN;
  let lon = farmer.location?.lon !== undefined ? parseFloat(farmer.location.lon) : NaN;

  // If coordinates are missing or invalid, try geocoding from village/state
  if (isNaN(lat) || isNaN(lon)) {
    const locationQuery = [farmer.village, farmer.state].filter(Boolean).join(', ');
    if (locationQuery) {
      const geo = await geocodeLocation(locationQuery);
      if (geo && !isNaN(geo.lat) && !isNaN(geo.lon)) {
        lat = geo.lat;
        lon = geo.lon;
        // Cache resolved coordinates to farmer record
        try {
          await store.updateFarmer(farmer.id, {
            location: { lat, lon },
            ...(geo.state && !farmer.state ? { state: geo.state } : {})
          });
        } catch (e) {
          console.warn('[farmers] Auto-updating geocoded location failed:', e.message);
        }
      }
    }
  }

  // Sensible default fallback
  if (isNaN(lat) || isNaN(lon)) {
    lat = 28.61;
    lon = 77.20;
  }

  return { lat, lon };
}

let ai = null;
function getAI() {
  const key = process.env.GEMINI_API_KEY || process.env.LLM_API_KEY;
  if (!ai && key) {
    ai = new GoogleGenAI({ apiKey: key });
  }
  return ai;
}

async function translateAdvisory(advisory, lang) {
  const client = getAI();
  if (!client || !lang || lang === 'en') return advisory;
  try {
    const prompt = `Translate the following JSON object's "title" and "message" fields in the "items" array, and the "speech" field (if present) into the language code '${lang}'. Keep the JSON structure exactly the same. Do not use markdown blocks, return ONLY valid JSON. 
    
${JSON.stringify({ items: advisory.items, speech: advisory.speech })}`;
    const response = await client.models.generateContent({ model: 'gemini-3.6-flash', contents: prompt });
    let text = response.text.trim();
    if (text.startsWith('\`\`\`json')) text = text.substring(7);
    if (text.startsWith('\`\`\`')) text = text.substring(3);
    if (text.endsWith('\`\`\`')) text = text.substring(0, text.length - 3);
    
    const translated = JSON.parse(text);
    advisory.items = translated.items || advisory.items;
    if (translated.speech) advisory.speech = translated.speech;
  } catch (e) {
    console.error("Advisory translation failed:", e);
  }
  return advisory;
}

async function translateSuitability(suggestions, lang) {
  const client = getAI();
  if (!client || !lang || lang === 'en') return suggestions;
  try {
    const prompt = `Translate the "reasoning" string and "crop" name in this array of objects to '${lang}'. Return ONLY valid JSON array with the exact same structure.
    
${JSON.stringify(suggestions.map(s => ({ crop: s.crop, reasoning: s.reasoning })))}`;
    const response = await client.models.generateContent({ model: 'gemini-3.6-flash', contents: prompt });
    let text = response.text.trim();
    if (text.startsWith('\`\`\`json')) text = text.substring(7);
    if (text.startsWith('\`\`\`')) text = text.substring(3);
    if (text.endsWith('\`\`\`')) text = text.substring(0, text.length - 3);
    
    const translated = JSON.parse(text);
    translated.forEach((t, i) => {
      if (suggestions[i]) {
        suggestions[i].reasoning = t.reasoning || suggestions[i].reasoning;
        suggestions[i].cropNameLocal = t.crop || suggestions[i].crop;
      }
    });
  } catch (e) {
    console.error("Suitability translation failed:", e);
  }
  return suggestions;
}

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
  let farmer = await store.getFarmer(req.params.id);
  if (!farmer) farmer = await store.getFarmer('demo-farmer-001');
  if (!farmer) return res.status(404).json({ error: 'farmer not found' });
  const { password, ...safeFarmer } = farmer;
  res.json(safeFarmer);
});

farmers.patch('/:id', async (req, res) => {
  // Prevent updating sensitive or immutable fields directly
  const { id, officialId, password, ...safePatch } = req.body;
  
  // Format location if provided
  if (safePatch.location && typeof safePatch.location === 'object') {
    const lat = parseFloat(safePatch.location.lat ?? safePatch.location.latitude);
    const lon = parseFloat(safePatch.location.lon ?? safePatch.location.longitude);
    if (!isNaN(lat) && !isNaN(lon)) {
      safePatch.location = { lat: Number(lat.toFixed(4)), lon: Number(lon.toFixed(4)) };
    }
  }

  let updated = await store.updateFarmer(req.params.id, safePatch);
  if (!updated && req.params.id !== 'demo-farmer-001') {
    updated = await store.updateFarmer('demo-farmer-001', safePatch);
  }
  if (!updated) return res.status(404).json({ error: 'farmer not found' });
  
  const { password: _, ...safeFarmer } = updated;
  res.json(safeFarmer);
});

// THE core endpoint: personalized, weather-aware advisory for one farmer.
// ?speech=1 also returns a spoken paragraph (seam for Phase 2 TTS).
farmers.get('/:id/advisory', async (req, res) => {
  let farmer = await store.getFarmer(req.params.id);
  if (!farmer) farmer = await store.getFarmer('demo-farmer-001');
  if (!farmer) return res.status(404).json({ error: 'farmer not found' });

  // 1. First fetch the lat and lon of the farmer's location
  const { lat, lon } = await resolveFarmerCoordinates(farmer);

  // 2. Fetch required weather data from Open-Meteo
  const forecast = await getForecast(lat, lon);
  const advisory = await buildAdvisory(farmer, forecast);

  if (req.query.speech === '1') {
    const speechLang = req.query.lang || farmer.language;
    advisory.speech = toSpeech(advisory, speechLang);
  }
  
  if (req.query.lang) {
    await translateAdvisory(advisory, req.query.lang);
  }
  
  res.json(advisory);
});

// Convenience: current mandi prices for this farmer's crop.
farmers.get('/:id/prices', async (req, res) => {
  let farmer = await store.getFarmer(req.params.id);
  if (!farmer) farmer = await store.getFarmer('demo-farmer-001');
  if (!farmer) return res.status(404).json({ error: 'farmer not found' });
  res.json(await getPrices(farmer.crop));
});

// Suitability endpoint: suggest best crops based on live weather forecast
farmers.get('/:id/suitability', async (req, res) => {
  let farmer = await store.getFarmer(req.params.id);
  if (!farmer) farmer = await store.getFarmer('demo-farmer-001');
  if (!farmer) return res.status(404).json({ error: 'farmer not found' });
  
  // 1. First fetch the lat and lon of the farmer's location
  const { lat, lon } = await resolveFarmerCoordinates(farmer);

  // 2. Fetch required weather data from Open-Meteo
  const forecast = await getForecast(lat, lon);
  let suggestions = getSuitability(forecast);
  
  if (req.query.lang) {
    suggestions = await translateSuitability(suggestions, req.query.lang);
  }
  
  res.json({ suggestions });
});

// Threats endpoint: Extract URGENT and IMPORTANT weather threats from Advisory
farmers.get('/:id/threats', async (req, res) => {
  let farmer = await store.getFarmer(req.params.id);
  if (!farmer) farmer = await store.getFarmer('demo-farmer-001');
  if (!farmer) return res.status(404).json({ error: 'farmer not found' });
  
  // 1. First fetch the lat and lon of the farmer's location
  const { lat, lon } = await resolveFarmerCoordinates(farmer);

  // 2. Fetch required weather data from Open-Meteo
  const forecast = await getForecast(lat, lon);
  const fullAdvisory = await buildAdvisory(farmer, forecast);
  
  // Extract triage and prescription items related to weather (rain, heat, cold)
  const threats = fullAdvisory.items.filter(item => 
    (item.severity === 'urgent' || item.severity === 'important') &&
    (item.title.toLowerCase().includes('rain') || 
     item.title.toLowerCase().includes('stress') || 
     item.title.toLowerCase().includes('irrigation') ||
     item.title.toLowerCase().includes('disease'))
  );

  let responseObj = { threats };
  if (req.query.lang) {
    await translateAdvisory({ items: responseObj.threats }, req.query.lang);
  }

  res.json(responseObj);
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

// Farmer-scoped Satellite NDVI endpoint
farmers.get('/:id/satellite', async (req, res) => {
  const farmer = await store.getFarmer(req.params.id);
  if (!farmer) return res.status(404).json({ error: 'farmer not found' });
  const { lat, lon } = await resolveFarmerCoordinates(farmer);
  const data = await fetchSatelliteData(lat, lon, farmer.crop, farmer.sowingDate);
  res.json(data);
});

// Farmer-scoped Crop Rotation plan
farmers.get('/:id/rotation', async (req, res) => {
  const farmer = await store.getFarmer(req.params.id);
  if (!farmer) return res.status(404).json({ error: 'farmer not found' });
  const advice = getRotationAdvice(farmer.crop || 'wheat');
  res.json(advice);
});

// Farmer-scoped Mandi price lookup
farmers.get('/:id/mandi', async (req, res) => {
  const farmer = await store.getFarmer(req.params.id);
  if (!farmer) return res.status(404).json({ error: 'farmer not found' });
  const prices = await getPrices(farmer.crop || 'wheat', farmer.state || null);
  res.json(prices);
});
