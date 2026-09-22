// Central config. Reads process.env with safe defaults so the app runs
// with ZERO setup (all providers default to "mock").
import 'node:process';

export const config = {
  port: 3000,
  weather: {
    provider: process.env.WEATHER_PROVIDER || 'openmeteo',
    openMeteoUrl: process.env.OPENMETEO_API_URL || process.env.WEATHER_API_URL || 'https://api.open-meteo.com/v1/forecast',
    openMeteoGeocodingUrl: process.env.OPENMETEO_GEOCODING_URL || 'https://geocoding-api.open-meteo.com/v1/search',
    openWeatherKey: process.env.OPENWEATHER_API_KEY || '',
  },
  market: {
    provider: process.env.MARKET_PROVIDER || 'mock',
    dataGovKey: process.env.DATAGOV_API_KEY || '',
  },
};
