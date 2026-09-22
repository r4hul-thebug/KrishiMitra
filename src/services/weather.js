// Weather service. Returns a NORMALIZED forecast shape regardless of provider,
// so the advisory engine never cares where the data came from.
//
// provider "mock"  -> deterministic synthetic forecast (no key, always works)
// provider "openweather" -> real 5-day/3-hour forecast (needs OPENWEATHER_API_KEY)
//
// Open-Meteo & IMD provide reliable, high-resolution regional weather across India.
// Open-Meteo is wired as the zero-key open source option, with OpenWeather & mock fallbacks.
import { config } from '../config.js';

// Normalized shape the rest of the app depends on:
// { source, location:{lat,lon}, daily:[{date, tMinC, tMaxC, rainMm, rainChance}] }

const geocodeCache = new Map();

export async function geocodeLocation(query) {
  if (!query || typeof query !== 'string') return null;
  const clean = query.trim();
  if (!clean) return null;

  if (geocodeCache.has(clean.toLowerCase())) {
    return geocodeCache.get(clean.toLowerCase());
  }

  const baseUrl = config.weather.openMeteoGeocodingUrl || 'https://geocoding-api.open-meteo.com/v1/search';
  
  // Extract place candidates (e.g., "Barabanki, Uttar Pradesh" -> ["Barabanki", "Bara Banki", "Uttar Pradesh"])
  const parts = clean.split(',').map(s => s.trim()).filter(Boolean);
  const primaryName = parts[0] || clean;
  const targetState = parts[1] ? parts[1].toLowerCase() : null;

  // 1. Try Open-Meteo Search with primary name
  try {
    const searchTerms = [primaryName];
    if (primaryName.toLowerCase().includes('barabanki')) searchTerms.push('Bara Banki');
    
    for (const term of searchTerms) {
      const url = `${baseUrl}?name=${encodeURIComponent(term)}&count=10&language=en&format=json`;
      const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
      if (res.ok) {
        const json = await res.json();
        const results = json.results;
        if (Array.isArray(results) && results.length > 0) {
          // If a state was specified in the query, look for matching admin1
          let match = results[0];
          if (targetState) {
            const stateMatch = results.find(r => 
              (r.admin1 && r.admin1.toLowerCase().includes(targetState)) ||
              (r.admin2 && r.admin2.toLowerCase().includes(targetState))
            );
            if (stateMatch) {
              match = stateMatch;
            } else {
              // State did not match this term's results; try next search term or fallback
              continue;
            }
          }

          if (typeof match.latitude === 'number' && typeof match.longitude === 'number') {
            const out = {
              lat: Number(match.latitude.toFixed(4)),
              lon: Number(match.longitude.toFixed(4)),
              name: match.name || primaryName,
              state: match.admin1 || '',
              country: match.country || '',
            };
            geocodeCache.set(clean.toLowerCase(), out);
            return out;
          }
        }
      }
    }
  } catch (err) {
    console.warn('[weather] Open-Meteo geocoding search error:', err.message);
  }

  // 2. Secondary fallback using Nominatim / OpenStreetMap
  try {
    const osmUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(clean)}&format=json&limit=1`;
    const res = await fetch(osmUrl, {
      headers: { 'User-Agent': 'KrishiMitra-Weather/1.0' },
      signal: AbortSignal.timeout(5000)
    });
    if (res.ok) {
      const list = await res.json();
      if (Array.isArray(list) && list.length > 0) {
        const item = list[0];
        const lat = parseFloat(item.lat);
        const lon = parseFloat(item.lon);
        if (!isNaN(lat) && !isNaN(lon)) {
          const out = {
            lat: Number(lat.toFixed(4)),
            lon: Number(lon.toFixed(4)),
            name: item.name || clean,
            state: targetState || '',
            country: 'India',
          };
          geocodeCache.set(clean.toLowerCase(), out);
          return out;
        }
      }
    }
  } catch (err) {
    console.warn('[weather] Nominatim geocoding fallback error:', err.message);
  }

  return null;
}

export async function openMeteoForecast(lat, lon) {
  const safeLat = Number(lat);
  const safeLon = Number(lon);
  if (isNaN(safeLat) || isNaN(safeLon)) {
    throw new Error(`Invalid coordinates: lat=${lat}, lon=${lon}`);
  }

  // Open-Meteo URL from config (not hardcoded)
  const baseUrl = config.weather.openMeteoUrl || 'https://api.open-meteo.com/v1/forecast';
  const url = `${baseUrl}?latitude=${encodeURIComponent(safeLat)}&longitude=${encodeURIComponent(safeLon)}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max&timezone=auto`;

  const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
  if (!res.ok) throw new Error(`Open-Meteo HTTP ${res.status}: ${res.statusText}`);
  const json = await res.json();

  if (!json.daily || !Array.isArray(json.daily.time)) {
    throw new Error('Open-Meteo returned invalid daily data structure');
  }

  const daily = json.daily.time.slice(0, 5).map((date, i) => {
    const tMin = json.daily.temperature_2m_min?.[i];
    const tMax = json.daily.temperature_2m_max?.[i];
    const rain = json.daily.precipitation_sum?.[i];
    const pop = json.daily.precipitation_probability_max?.[i];

    return {
      date,
      tMinC: tMin !== null && tMin !== undefined ? Math.round(tMin) : 20,
      tMaxC: tMax !== null && tMax !== undefined ? Math.round(tMax) : 30,
      rainMm: rain !== null && rain !== undefined ? Math.max(0, Math.round(rain)) : 0,
      rainChance: pop !== null && pop !== undefined ? Math.round(pop) : (rain > 0 ? 70 : 15),
    };
  });

  return {
    source: 'open-meteo',
    location: { lat: safeLat, lon: safeLon },
    daily,
  };
}

function mockForecast(lat, lon) {
  // Deterministic pseudo-weather seeded by location + day, so demos are stable.
  const days = [];
  const base = 24 + ((Math.abs(Math.round(lat)) % 6) - 3); // vary by latitude
  for (let i = 0; i < 5; i++) {
    const seed = (Math.round((lat + lon) * 10) + i) % 10;
    const rain = seed >= 7 ? (seed - 6) * 6 : 0; // some days rain
    const d = new Date();
    d.setDate(d.getDate() + i);
    days.push({
      date: d.toISOString().slice(0, 10),
      tMinC: base - 6 + (seed % 3),
      tMaxC: base + 6 - (seed % 2),
      rainMm: rain,
      rainChance: rain > 0 ? Math.min(90, 40 + rain * 4) : 10 + seed * 2,
    });
  }
  return { source: 'mock', location: { lat, lon }, daily: days };
}

async function openWeatherForecast(lat, lon) {
  const key = config.weather.openWeatherKey;
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${key}`;
  const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
  if (!res.ok) throw new Error(`OpenWeather ${res.status}`);
  const json = await res.json();

  // Collapse 3-hourly entries into per-day min/max/rain.
  const byDay = new Map();
  for (const item of json.list) {
    const date = item.dt_txt.slice(0, 10);
    const cur = byDay.get(date) || { tMin: Infinity, tMax: -Infinity, rain: 0, pop: 0, n: 0 };
    cur.tMin = Math.min(cur.tMin, item.main.temp_min);
    cur.tMax = Math.max(cur.tMax, item.main.temp_max);
    cur.rain += item.rain?.['3h'] || 0;
    cur.pop = Math.max(cur.pop, item.pop || 0);
    cur.n++;
    byDay.set(date, cur);
  }
  const daily = [...byDay.entries()].slice(0, 5).map(([date, v]) => ({
    date,
    tMinC: Math.round(v.tMin),
    tMaxC: Math.round(v.tMax),
    rainMm: Math.round(v.rain),
    rainChance: Math.round(v.pop * 100),
  }));
  return { source: 'openweather', location: { lat, lon }, daily };
}

export async function getForecast(lat, lon) {
  const provider = (config.weather.provider || 'openmeteo').toLowerCase();

  // Primary: Open-Meteo (real-time free API, no secret key required, URL configurable)
  if (provider === 'openmeteo' || provider === 'open-meteo' || provider === 'auto') {
    try {
      return await openMeteoForecast(lat, lon);
    } catch (err) {
      console.warn('[weather] Open-Meteo forecast failed, falling back to mock:', err.message);
      return mockForecast(lat, lon);
    }
  }

  // Optional: OpenWeather
  if (provider === 'openweather' && config.weather.openWeatherKey) {
    try {
      return await openWeatherForecast(lat, lon);
    } catch (err) {
      console.warn('[weather] OpenWeather provider failed, using mock:', err.message);
      return mockForecast(lat, lon);
    }
  }

  // Fallback: deterministic mock
  return mockForecast(lat, lon);
}
