// Production-Grade Frontend Real-Time Logger & Exception Monitor
import { API_URL } from '../config';

export const LOG_LEVELS = {
  DEBUG: 10,
  INFO: 20,
  WARN: 30,
  ERROR: 40,
  CRITICAL: 50
};

class ClientLogger {
  constructor() {
    this.buffer = [];
    this.maxBuffer = 100;
    this.queue = [];
    this.flushTimer = null;
    this.listeners = new Set();
    this.isInitialized = false;
  }

  init() {
    if (this.isInitialized || typeof window === 'undefined') return;
    this.isInitialized = true;

    // 1. Capture unhandled runtime exceptions
    window.addEventListener('error', (event) => {
      this.error(`Uncaught Exception: ${event.message}`, {
        source: 'frontend_uncaught',
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack || null
      });
    });

    // 2. Capture unhandled Promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      const reason = event.reason;
      const message = reason instanceof Error ? reason.message : String(reason);
      const stack = reason instanceof Error ? reason.stack : null;
      this.error(`Unhandled Rejection: ${message}`, {
        source: 'frontend_promise',
        stack
      });
    });
  }

  log(levelName, message, meta = {}) {
    const timestamp = new Date().toISOString();
    const entry = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp,
      level: levelName.toUpperCase(),
      message: typeof message === 'string' ? message : JSON.stringify(message),
      url: typeof window !== 'undefined' ? window.location.pathname : '',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      meta
    };

    // Store in internal memory buffer
    this.buffer.push(entry);
    if (this.buffer.length > this.maxBuffer) {
      this.buffer.shift();
    }

    // Notify any local UI subscribers (e.g. debug drawers)
    this.notifyListeners(entry);

    // Development console output
    if (typeof console !== 'undefined') {
      const prefix = `[KrishiMitraaz:${entry.level}]`;
      if (entry.level === 'ERROR' || entry.level === 'CRITICAL') {
        console.error(prefix, message, meta);
      } else if (entry.level === 'WARN') {
        console.warn(prefix, message, meta);
      } else {
        console.log(prefix, message, meta);
      }
    }

    // Queue for telemetry transmission
    this.queue.push(entry);
    this.scheduleFlush();

    return entry;
  }

  debug(msg, meta) { return this.log('DEBUG', msg, meta); }
  info(msg, meta) { return this.log('INFO', msg, meta); }
  warn(msg, meta) { return this.log('WARN', msg, meta); }
  error(msg, meta) { return this.log('ERROR', msg, meta); }
  critical(msg, meta) { return this.log('CRITICAL', msg, meta); }

  scheduleFlush() {
    if (this.flushTimer || this.queue.length === 0) return;
    this.flushTimer = setTimeout(() => {
      this.flush();
    }, 2000); // Debounce batch send every 2 seconds
  }

  async flush() {
    if (this.flushTimer) {
      clearTimeout(this.flushTimer);
      this.flushTimer = null;
    }
    if (this.queue.length === 0) return;

    const itemsToSend = [...this.queue];
    this.queue = [];

    try {
      if (typeof fetch !== 'undefined') {
        await fetch(`${API_URL}/monitoring/logs`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ logs: itemsToSend }),
          keepalive: true
        });
      }
    } catch {
      // Re-queue items if server is temporarily unreachable (up to maxBuffer)
      this.queue = [...itemsToSend.slice(-30), ...this.queue];
    }
  }

  getLogs() {
    return [...this.buffer].reverse();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notifyListeners(entry) {
    for (const listener of this.listeners) {
      try {
        listener(entry);
      } catch {}
    }
  }

  clear() {
    this.buffer = [];
    this.queue = [];
  }
}

export const logger = new ClientLogger();
