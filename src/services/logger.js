// Production-Grade Structured Logger with In-Memory Buffer & Telemetry
import { randomUUID } from 'node:crypto';

export const LOG_LEVELS = {
  DEBUG: 10,
  INFO: 20,
  WARN: 30,
  ERROR: 40,
  CRITICAL: 50
};

const LEVEL_NAMES = {
  10: 'DEBUG',
  20: 'INFO',
  30: 'WARN',
  40: 'ERROR',
  50: 'CRITICAL'
};

class ProductionLogger {
  constructor(options = {}) {
    this.minLevel = process.env.NODE_ENV === 'test' ? LOG_LEVELS.DEBUG : LOG_LEVELS.INFO;
    this.bufferSize = options.bufferSize || 500;
    this.ringBuffer = [];
    this.stats = {
      startTime: Date.now(),
      totalLogs: 0,
      errorCount: 0,
      warnCount: 0,
      criticalCount: 0
    };
  }

  formatEntry(level, message, meta = {}) {
    const timestamp = new Date().toISOString();
    const levelName = LEVEL_NAMES[level] || 'INFO';
    const id = randomUUID();

    const entry = {
      id,
      timestamp,
      level: levelName,
      levelValue: level,
      message: typeof message === 'string' ? message : JSON.stringify(message),
      source: meta.source || 'backend',
      reqId: meta.reqId || null,
      path: meta.path || null,
      method: meta.method || null,
      statusCode: meta.statusCode || null,
      durationMs: meta.durationMs || null,
      farmerId: meta.farmerId || null,
      stack: meta.stack || null,
      extra: meta.extra || null
    };

    return entry;
  }

  log(level, message, meta = {}) {
    this.stats.totalLogs++;
    if (level === LOG_LEVELS.WARN) this.stats.warnCount++;
    if (level === LOG_LEVELS.ERROR) this.stats.errorCount++;
    if (level === LOG_LEVELS.CRITICAL) this.stats.criticalCount++;

    const entry = this.formatEntry(level, message, meta);

    // Maintain in-memory ring buffer for live health inspection
    this.ringBuffer.push(entry);
    if (this.ringBuffer.length > this.bufferSize) {
      this.ringBuffer.shift();
    }

    // Output formatting
    if (process.env.NODE_ENV !== 'test') {
      const color = level >= LOG_LEVELS.ERROR ? '\x1b[31m' : level === LOG_LEVELS.WARN ? '\x1b[33m' : '\x1b[36m';
      const reset = '\x1b[0m';
      const metaStr = meta.path ? ` [${meta.method || 'GET'} ${meta.path}]` : '';
      console.log(`${color}[${entry.timestamp}] [${entry.level}]${reset}${metaStr} ${entry.message}`);
      if (entry.stack && level >= LOG_LEVELS.ERROR) {
        console.error(entry.stack);
      }
    }

    return entry;
  }

  debug(msg, meta) { return this.log(LOG_LEVELS.DEBUG, msg, meta); }
  info(msg, meta) { return this.log(LOG_LEVELS.INFO, msg, meta); }
  warn(msg, meta) { return this.log(LOG_LEVELS.WARN, msg, meta); }
  error(msg, meta) { return this.log(LOG_LEVELS.ERROR, msg, meta); }
  critical(msg, meta) { return this.log(LOG_LEVELS.CRITICAL, msg, meta); }

  getRecentLogs(filter = {}) {
    let result = [...this.ringBuffer];
    if (filter.level) {
      const targetLevel = filter.level.toUpperCase();
      result = result.filter(l => l.level === targetLevel);
    }
    if (filter.source) {
      result = result.filter(l => l.source === filter.source);
    }
    if (filter.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(l => l.message.toLowerCase().includes(q) || (l.path && l.path.toLowerCase().includes(q)));
    }
    const limit = Math.min(Number(filter.limit) || 100, 500);
    return result.slice(-limit).reverse();
  }

  getHealthMetrics() {
    const uptimeSec = Math.round((Date.now() - this.stats.startTime) / 1000);
    const totalRequests = this.stats.totalLogs;
    const errorRate = totalRequests > 0 
      ? Number(((this.stats.errorCount + this.stats.criticalCount) / totalRequests * 100).toFixed(2)) 
      : 0;

    return {
      status: errorRate > 15 ? 'DEGRADED' : 'HEALTHY',
      uptimeSec,
      totalLogs: this.stats.totalLogs,
      errorCount: this.stats.errorCount,
      warnCount: this.stats.warnCount,
      criticalCount: this.stats.criticalCount,
      errorRatePct: errorRate,
      bufferUtilization: `${this.ringBuffer.length}/${this.bufferSize}`,
      memoryUsageMb: Math.round(process.memoryUsage().heapUsed / 1024 / 1024)
    };
  }

  clearBuffer() {
    this.ringBuffer = [];
  }
}

export const logger = new ProductionLogger();
