import { Router } from 'express';
import { logger, LOG_LEVELS } from '../services/logger.js';

export const monitoring = Router();

// Ingest client-side exceptions and telemetry in real-time
monitoring.post('/logs', (req, res) => {
  const { logs, message, level, stack, meta } = req.body || {};

  // Batch ingestion
  if (Array.isArray(logs)) {
    for (const item of logs) {
      const lvl = item.level ? (LOG_LEVELS[item.level.toUpperCase()] || LOG_LEVELS.INFO) : LOG_LEVELS.INFO;
      logger.log(lvl, item.message || 'Client log', {
        source: 'frontend',
        stack: item.stack,
        path: item.path || item.url,
        ...item.meta
      });
    }
    return res.status(202).json({ accepted: logs.length });
  }

  // Single entry ingestion
  if (message) {
    const lvl = level ? (LOG_LEVELS[level.toUpperCase()] || LOG_LEVELS.ERROR) : LOG_LEVELS.ERROR;
    logger.log(lvl, message, {
      source: 'frontend',
      stack,
      ...meta
    });
    return res.status(202).json({ accepted: 1 });
  }

  res.status(400).json({ error: 'Payload must contain message or logs array' });
});

// Query recent logs with filtering
monitoring.get('/logs', (req, res) => {
  const { level, source, search, limit } = req.query;
  const logs = logger.getRecentLogs({ level, source, search, limit });
  res.json({
    total: logs.length,
    logs
  });
});

// System telemetry & health diagnostics
monitoring.get('/health', (_req, res) => {
  const metrics = logger.getHealthMetrics();
  res.json(metrics);
});

// Clear logs buffer (testing/dev)
monitoring.delete('/logs', (_req, res) => {
  logger.clearBuffer();
  res.json({ ok: true, message: 'Log buffer cleared' });
});
