import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { logger as clientLogger } from '@/services/logger.js';
import { logger as serverLogger } from '@backend/services/logger.js';

describe('Logging Service: Frontend ClientLogger', () => {
  beforeEach(() => {
    clientLogger.clear();
    jest.restoreAllMocks();
  });

  it('should format and buffer log entries across all severity levels', () => {
    clientLogger.debug('Debug test', { detail: '123' });
    clientLogger.info('Info test');
    clientLogger.warn('Warning test');
    clientLogger.error('Error test', { code: 500 });
    clientLogger.critical('Critical failure');

    const logs = clientLogger.getLogs();
    expect(logs.length).toBe(5);
    expect(logs[0].level).toBe('CRITICAL');
    expect(logs[1].level).toBe('ERROR');
    expect(logs[2].level).toBe('WARN');
    expect(logs[3].level).toBe('INFO');
    expect(logs[4].level).toBe('DEBUG');
  });

  it('should notify active subscribers when a new log is recorded', () => {
    const subscriber = jest.fn();
    const unsubscribe = clientLogger.subscribe(subscriber);

    clientLogger.error('Something broke');
    expect(subscriber).toHaveBeenCalledTimes(1);
    expect(subscriber).toHaveBeenCalledWith(expect.objectContaining({
      level: 'ERROR',
      message: 'Something broke'
    }));

    unsubscribe();
    clientLogger.info('Next message');
    expect(subscriber).toHaveBeenCalledTimes(1); // Not called after unsubscribe
  });

  it('should cap memory buffer to maxBuffer entries', () => {
    clientLogger.maxBuffer = 5;
    for (let i = 0; i < 10; i++) {
      clientLogger.info(`Log #${i}`);
    }
    const logs = clientLogger.getLogs();
    expect(logs.length).toBe(5);
    expect(logs[0].message).toBe('Log #9'); // newest first
  });

  it('should queue items and flush to server endpoint', async () => {
    const fetchMock = jest.fn().mockResolvedValue({ ok: true });
    globalThis.fetch = fetchMock;

    clientLogger.error('Error to send to server');
    expect(clientLogger.queue.length).toBe(1);

    await clientLogger.flush();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(clientLogger.queue.length).toBe(0);
  });
});

describe('Logging Service: Backend ProductionLogger', () => {
  beforeEach(() => {
    serverLogger.clearBuffer();
  });

  it('should record entries in ring buffer with correlation ID and metadata', () => {
    const entry = serverLogger.info('Worker started', {
      reqId: 'req-abc-123',
      path: '/api/crops',
      method: 'GET',
      durationMs: 42
    });

    expect(entry.id).toBeDefined();
    expect(entry.reqId).toBe('req-abc-123');
    expect(entry.path).toBe('/api/crops');
    expect(entry.durationMs).toBe(42);

    const logs = serverLogger.getRecentLogs();
    expect(logs.length).toBeGreaterThan(0);
    expect(logs[0].message).toBe('Worker started');
  });

  it('should correctly filter logs by level and search query', () => {
    serverLogger.info('Query crops successful', { path: '/api/crops' });
    serverLogger.warn('Slow external geocoder', { path: '/api/weather' });
    serverLogger.error('Database query timeout', { path: '/api/farmers' });

    const errorLogs = serverLogger.getRecentLogs({ level: 'ERROR' });
    expect(errorLogs.length).toBe(1);
    expect(errorLogs[0].message).toBe('Database query timeout');

    const weatherLogs = serverLogger.getRecentLogs({ search: 'weather' });
    expect(weatherLogs.length).toBe(1);
    expect(weatherLogs[0].message).toBe('Slow external geocoder');
  });

  it('should compute accurate health metrics and error rate percentages', () => {
    serverLogger.stats.totalLogs = 100;
    serverLogger.stats.errorCount = 4;
    serverLogger.stats.criticalCount = 1;

    const metrics = serverLogger.getHealthMetrics();
    expect(metrics.totalLogs).toBe(100);
    expect(metrics.errorCount).toBe(4);
    expect(metrics.criticalCount).toBe(1);
    expect(metrics.errorRatePct).toBe(5); // (4+1)/100 = 5%
    expect(metrics.status).toBe('HEALTHY');

    // High error rate test
    serverLogger.stats.errorCount = 20;
    const degradedMetrics = serverLogger.getHealthMetrics();
    expect(degradedMetrics.status).toBe('DEGRADED');
  });
});
