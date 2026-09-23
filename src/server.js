// KrishiMitraaz API server — Phase 1 advisory spine.
import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import compression from 'compression';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { config } from './config.js';
import { farmers } from './routes/farmers.js';
import { reference } from './routes/reference.js';
import { auth } from './routes/auth.js';
import { chat } from './routes/chat.js';
import { monitoring } from './routes/monitoring.js';
import { logger } from './services/logger.js';
import { connectDB, getPool } from './db/store.js';
import { createUnifiedNotFoundHandler, unifiedErrorHandler } from './middleware/unifiedRouteHandler.js';

try {
  process.loadEnvFile?.();
} catch {}

const app = express();

// High-performance response compression (Gzip / Brotli) for static assets and API payloads
app.use(compression({
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  },
  threshold: 1024 // Only compress responses larger than 1KB
}));

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Production-grade request telemetry and structured logging
app.use((req, res, next) => {
  const start = Date.now();
  const reqId = req.headers['x-request-id'] || Math.random().toString(36).substring(2, 9);
  req.reqId = reqId;
  res.setHeader('X-Request-ID', reqId);

  res.on('finish', () => {
    const duration = Date.now() - start;
    const statusCode = res.statusCode;
    const meta = {
      source: 'backend',
      reqId,
      path: req.originalUrl || req.url,
      method: req.method,
      statusCode,
      durationMs: duration
    };

    if (statusCode >= 500) {
      logger.error(`API Failure: ${req.method} ${req.originalUrl} returned ${statusCode} (${duration}ms)`, meta);
    } else if (statusCode >= 400) {
      logger.warn(`Client Warning: ${req.method} ${req.originalUrl} returned ${statusCode} (${duration}ms)`, meta);
    } else {
      logger.info(`${req.method} ${req.originalUrl} ${statusCode} (${duration}ms)`, meta);
    }
  });

  next();
});

app.get('/health', (_req, res) => res.json({ ok: true, service: 'krishimitraaz', phase: 1 }));

app.use('/api/monitoring', monitoring);
app.use('/api/auth', auth);
app.use('/api/farmers', farmers);
app.use('/api/chat', chat);
app.use('/api', reference);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const candidateDistPaths = [
  path.join(projectRoot, 'frontend', 'dist'),
  path.join(projectRoot, 'dist'),
  path.resolve('frontend/dist'),
  path.resolve('dist')
];

let frontendDist = candidateDistPaths.find(p => fs.existsSync(path.join(p, 'index.html')));

if (!frontendDist) {
  console.log('[server] Building frontend assets...');
  try {
    const { execSync } = await import('node:child_process');
    execSync('npm run build', { cwd: projectRoot, stdio: 'inherit' });
  } catch (e) {
    console.error('[server] Failed to build frontend:', e.message);
  }
  frontendDist = candidateDistPaths.find(p => fs.existsSync(path.join(p, 'index.html')));
}

if (frontendDist && fs.existsSync(path.join(frontendDist, 'index.html'))) {
  console.log(`[server] Serving static frontend from: ${frontendDist}`);
  app.use(express.static(frontendDist, { 
    redirect: false, 
    index: false,
    maxAge: '1d',
    setHeaders: (res, pathUrl) => {
      if (pathUrl.endsWith('.html')) {
        // Prevent stale HTML shells so new deployments reflect instantly
        res.setHeader('Cache-Control', 'no-cache');
      } else if (pathUrl.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf)$/)) {
        // Cache hashed production assets for 1 year (Lighthouse Best Practice)
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      }
    }
  }));
  
  // Legitimate client-side application routes that serve index.html
  const legitimateFrontendRoutes = [
    '/',
    '/login',
    '/dashboard',
    '/mandi',
    '/satellite',
    '/rotation',
    '/disease',
    '/calculator',
    '/schemes',
    '/suggestions',
    '/soil',
    '/helpline'
  ];

  legitimateFrontendRoutes.forEach(routePath => {
    app.get(routePath, (_req, res) => {
      res.sendFile(path.join(frontendDist, 'index.html'));
    });
  });
} else {
  // Friendly root documentation for API fallback
  app.get('/', (_req, res) => {
    res.json({
      service: 'KrishiMitraaz — Smart Crop Advisory & Farm Intelligence Platform',
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

// Unified 404 route handler: intercepts all unhandled frontend-navigation and API-based paths
app.use(createUnifiedNotFoundHandler(frontendDist));

// Unified unhandled error handler: intercepts uncaught 500 errors and routes gracefully
app.use(unifiedErrorHandler);


async function start() {
  const server = app.listen(config.port, '0.0.0.0', () => {
    console.log(`\n🌱 KrishiMitraaz API running on http://0.0.0.0:${config.port}`);
    console.log(`   Try:  curl http://0.0.0.0:${config.port}/api/crops\n`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`[server] Port ${config.port} temporarily busy, retrying in 500ms...`);
      setTimeout(() => {
        server.close();
        server.listen(config.port, '0.0.0.0');
      }, 500);
    } else {
      console.error('[server] Server error:', err);
    }
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
