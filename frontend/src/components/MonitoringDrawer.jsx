import { useState, useEffect } from 'react';
import { Activity, X, RefreshCw, AlertCircle, CheckCircle2, ShieldAlert, Bug } from 'lucide-react';
import { logger } from '../services/logger';
import { monitoringService } from '../services/api';

export default function MonitoringDrawer({ isOpen, onClose }) {
  const [logs, setLogs] = useState([]);
  const [filterLevel, setFilterLevel] = useState('ALL');
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const refreshData = async () => {
      setLoading(true);
      try {
        const [localLogs, serverHealth] = await Promise.all([
          Promise.resolve(logger.getLogs()),
          monitoringService.getHealthMetrics().catch(() => null)
        ]);
        setLogs(localLogs);
        if (serverHealth) setHealth(serverHealth);
      } finally {
        setLoading(false);
      }
    };

    refreshData();

    // Subscribe to live log emissions
    const unsubscribe = logger.subscribe((newEntry) => {
      setLogs(prev => [newEntry, ...prev.slice(0, 99)]);
    });

    return () => unsubscribe();
  }, [isOpen]);

  if (!isOpen) return null;

  const filtered = filterLevel === 'ALL' 
    ? logs 
    : logs.filter(l => l.level === filterLevel);

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(0, 0, 0, 0.45)',
        display: 'flex',
        justifyContent: 'flex-end',
        backdropFilter: 'blur(2px)'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          width: '100%',
          maxWidth: '680px',
          height: '100%',
          background: '#0F172A',
          color: '#F8FAFC',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-4px 0 25px rgba(0,0,0,0.5)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #1E293B', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#090D16' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={18} color="#38BDF8" />
            <span style={{ fontWeight: 800, fontSize: '0.95rem', letterSpacing: '0.5px' }}>
              REAL-TIME PRODUCTION MONITOR
            </span>
          </div>
          <button 
            type="button"
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '4px' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Health Status Ribbon */}
        {health && (
          <div style={{ padding: '0.75rem 1.25rem', background: '#1E293B', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', fontSize: '0.75rem', borderBottom: '1px solid #334155' }}>
            <div>
              <div style={{ color: '#94A3B8' }}>Status</div>
              <strong style={{ color: health.status === 'HEALTHY' ? '#4ADE80' : '#F87171', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle2 size={12} /> {health.status}
              </strong>
            </div>
            <div>
              <div style={{ color: '#94A3B8' }}>Uptime</div>
              <strong>{health.uptimeSec}s</strong>
            </div>
            <div>
              <div style={{ color: '#94A3B8' }}>Error Rate</div>
              <strong style={{ color: health.errorRatePct > 5 ? '#F87171' : '#4ADE80' }}>
                {health.errorRatePct}%
              </strong>
            </div>
            <div>
              <div style={{ color: '#94A3B8' }}>Total Events</div>
              <strong>{health.totalLogs}</strong>
            </div>
          </div>
        )}

        {/* Filter Controls */}
        <div style={{ padding: '0.75rem 1.25rem', display: 'flex', gap: '8px', borderBottom: '1px solid #1E293B', background: '#131D31', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: '6px' }}>
            {['ALL', 'ERROR', 'WARN', 'INFO'].map(lvl => (
              <button
                key={lvl}
                type="button"
                onClick={() => setFilterLevel(lvl)}
                style={{
                  padding: '3px 10px',
                  borderRadius: '3px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: '1px solid',
                  borderColor: filterLevel === lvl ? '#38BDF8' : '#334155',
                  background: filterLevel === lvl ? '#0284C7' : '#1E293B',
                  color: '#FFFFFF'
                }}
              >
                {lvl}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => {
              logger.clear();
              setLogs([]);
            }}
            style={{ padding: '3px 8px', fontSize: '0.72rem', background: '#334155', color: '#E2E8F0', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
          >
            Clear Buffer
          </button>
        </div>

        {/* Log Viewer Stream */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0.75rem 1.25rem', fontFamily: 'monospace', fontSize: '0.78rem' }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#64748B' }}>
              <CheckCircle2 size={32} style={{ margin: '0 auto 8px', opacity: 0.6 }} />
              <div>No log events recorded in this filter view.</div>
            </div>
          ) : (
            filtered.map((entry) => {
              const isErr = entry.level === 'ERROR' || entry.level === 'CRITICAL';
              const isWarn = entry.level === 'WARN';
              const badgeColor = isErr ? '#EF4444' : isWarn ? '#F59E0B' : '#38BDF8';

              return (
                <div 
                  key={entry.id}
                  style={{
                    marginBottom: '8px',
                    padding: '8px 10px',
                    borderRadius: '4px',
                    background: '#1E293B',
                    borderLeft: `3px solid ${badgeColor}`,
                    lineHeight: 1.4
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.7rem' }}>
                    <span style={{ color: badgeColor, fontWeight: 800 }}>[{entry.level}]</span>
                    <span style={{ color: '#64748B' }}>{new Date(entry.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <div style={{ color: '#F1F5F9', wordBreak: 'break-word' }}>
                    {entry.message}
                  </div>
                  {entry.meta && Object.keys(entry.meta).length > 0 && (
                    <pre style={{ margin: '4px 0 0', padding: '4px', background: '#0F172A', borderRadius: '3px', color: '#94A3B8', fontSize: '0.68rem', overflowX: 'auto' }}>
                      {JSON.stringify(entry.meta, null, 2)}
                    </pre>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
