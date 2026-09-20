// KrishiMitraaz API server — Phase 1 advisory spine.
import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import path from 'node:path';
import fs from 'node:fs';
import { config } from './config.js';
import { farmers } from './routes/farmers.js';
import { reference } from './routes/reference.js';
import { auth } from './routes/auth.js';
import { chat } from './routes/chat.js';
import { connectDB, getPool } from './db/store.js';

try {
  process.loadEnvFile?.();
} catch {}

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

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

const frontendDist = path.resolve('frontend/dist');
if (!fs.existsSync(frontendDist)) {
  console.log('Building frontend assets...');
  try {
    const { execSync } = await import('node:child_process');
    execSync('npm run build --prefix frontend', { stdio: 'inherit' });
  } catch (e) {
    console.error('Failed to build frontend:', e.message);
  }
}

if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path === '/health') {
      return next();
    }
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
} else {
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
}

app.use((err, _req, res, _next) => {
  console.error('[error]', err);
  res.status(500).json({ error: 'internal error', detail: err.message });
});


async function start() {
  const server = app.listen(config.port, '0.0.0.0', () => {
    console.log(`\n🌱 KrishiMitraaz API running on http://0.0.0.0:${config.port}`);
    console.log(`   Try:  curl http://0.0.0.0:${config.port}/api/crops\n`);
  });

  try {
    await connectDB(process.env.DATABASE_URL);
  } catch (err) {
    console.warn('[store] DB connection error:', err.message);
  }

  // Graceful shutdown
  const shutdown = async (signal) => {
    console.log(`\n[${signal}] Shutting down gracefully...`);
    server.close(async () => {
      console.log('HTTP server closed.');
      try {
        const pool = getPool();
        if (pool) {
          await pool.end();
          console.log('Database pool closed.');
        }
        process.exit(0);
      } catch (err) {
        console.error('Error during shutdown:', err);
        process.exit(1);
      }
    });
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

start();
