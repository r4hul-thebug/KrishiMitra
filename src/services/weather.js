// Weather service. Returns a NORMALIZED forecast shape regardless of provider,
// so the advisory engine never cares where the data came from.
//
// provider "mock"  -> deterministic synthetic forecast (no key, always works)
// provider "openweather" -> real 5-day/3-hour forecast (needs OPENWEATHER_API_KEY)
//
// For the SIH build, IMD is the credibility-aligned source. IMD's public APIs
// are finicky, so OpenWeather is wired as the pragmatic real option; swap in an
// IMD adapter here later without touching callers.
import { config } from '../config.js';

// Normalized shape the rest of the app depends on:
// { source, location:{lat,lon}, daily:[{date, tMinC, tMaxC, rainMm, rainChance}] }

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
  const res = await fetch(url);
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
  if (config.weather.provider === 'openweather' && config.weather.openWeatherKey) {
    try {
      return await openWeatherForecast(lat, lon);
    } catch (err) {
      // Never let a flaky upstream break the advisory — fall back gracefully.
      console.warn('[weather] real provider failed, using mock:', err.message);
      return mockForecast(lat, lon);
    }
  }
  return mockForecast(lat, lon);
}
