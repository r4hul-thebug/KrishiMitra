// Central config. Reads process.env with safe defaults so the app runs
// with ZERO setup (all providers default to "mock").
import 'node:process';

export const config = {
  port: Number(process.env.PORT) || 10000,
  weather: {
    provider: process.env.WEATHER_PROVIDER || 'mock',
    openWeatherKey: process.env.OPENWEATHER_API_KEY || '',
  },
  market: {
    provider: process.env.MARKET_PROVIDER || 'mock',
    dataGovKey: process.env.DATAGOV_API_KEY || '',
  },
};
