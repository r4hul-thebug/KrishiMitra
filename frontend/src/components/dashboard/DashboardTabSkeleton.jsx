import React from 'react';

export default function DashboardTabSkeleton({ tabName = 'Loading tab content...' }) {
  return (
    <div 
      className="gov-card-body" 
      style={{ padding: '1.5rem', minHeight: '320px', animation: 'pulse 1.5s infinite ease-in-out' }}
      role="status"
      aria-live="polite"
      aria-label={tabName}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div style={{ width: '40%', height: '22px', background: '#E2E8F0', borderRadius: '4px' }} />
        <div style={{ width: '18%', height: '32px', background: '#E2E8F0', borderRadius: '4px' }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {[1, 2, 3].map((i) => (
          <div key={i} style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '4px', padding: '16px' }}>
            <div style={{ width: '60%', height: '16px', background: '#E2E8F0', borderRadius: '4px', marginBottom: '10px' }} />
            <div style={{ width: '80%', height: '28px', background: '#CBD5E1', borderRadius: '4px', marginBottom: '10px' }} />
            <div style={{ width: '40%', height: '14px', background: '#E2E8F0', borderRadius: '4px' }} />
          </div>
        ))}
      </div>

      <div style={{ width: '100%', height: '120px', background: '#F1F5F9', borderRadius: '4px', border: '1px dashed #CBD5E1' }} />
    </div>
  );
}
