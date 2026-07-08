// KrishiMitraaz API server — Phase 1 advisory spine.
import express from 'express';
import cors from 'cors';
import { config } from './config.js';
import { farmers } from './routes/farmers.js';
import { reference } from './routes/reference.js';
import { auth } from './routes/auth.js';
import { chat } from './routes/chat.js';

const app = express();
app.use(cors());
app.use(express.json());

// Simple request log so a solo dev can see what's happening.
app.use((req, _res, next) => {
  console.log(`${new Date().toISOString()}  ${req.method} ${req.url}`);
  next();
});

app.get('/health', (_req, res) => res.json({ ok: true, service: 'krishimitraaz', phase: 1 }));

app.use('/api/auth', auth);
app.use('/api/farmers', farmers);
app.use('/api/chat', chat);
app.use('/api', reference);

// Friendly root that documents the API (handy while there's no frontend yet).
app.get('/', (_req, res) => {
  res.json({
    service: 'KrishiMitraaz — Smart Crop Advisory (SIH25010)',
    phase: 1,
    endpoints: {
      'GET /health': 'liveness check',
      'GET /api/crops': 'list supported crops',
      'GET /api/crops/:id': 'full crop knowledge (stages, nutrients)',
      'GET /api/weather?lat=&lon=': 'normalized 5-day forecast',
      'GET /api/prices?commodity=wheat': 'mandi prices',
      'POST /api/farmers': 'create a farmer profile',
      'GET /api/farmers': 'list farmers',
      'GET /api/farmers/:id': 'get one farmer',
      'PATCH /api/farmers/:id': 'update a farmer',
      'GET /api/farmers/:id/advisory?speech=1': 'THE personalized advisory',
      'GET /api/farmers/:id/prices': 'prices for the farmer\'s crop',
    },
  });
});

app.use((err, _req, res, _next) => {
  console.error('[error]', err);
  res.status(500).json({ error: 'internal error', detail: err.message });
});

app.listen(config.port, () => {
  console.log(`\n🌱 KrishiMitraaz API running on http://localhost:${config.port}`);
  console.log(`   Try:  curl http://localhost:${config.port}/api/crops\n`);
});
