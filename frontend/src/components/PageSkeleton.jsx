import React from 'react';

export default function PageSkeleton() {
  return (
    <div 
      className="container" 
      style={{ padding: '1.5rem 1rem 3rem', maxWidth: '1280px', margin: '0 auto', minHeight: '600px' }}
      role="status"
      aria-live="polite"
      aria-label="Loading page..."
    >
      {/* Top Banner Skeleton */}
      <div 
        style={{ 
          background: 'linear-gradient(135deg, #0A3161 0%, #004D25 100%)', 
          borderRadius: '6px', 
          padding: '2rem', 
          marginBottom: '1.5rem',
          opacity: 0.9
        }}
      >
        <div style={{ width: '220px', height: '20px', background: 'rgba(255,255,255,0.2)', borderRadius: '4px', marginBottom: '12px' }} />
        <div style={{ width: '55%', height: '32px', background: 'rgba(255,255,255,0.3)', borderRadius: '4px', marginBottom: '12px' }} />
        <div style={{ width: '75%', height: '18px', background: 'rgba(255,255,255,0.18)', borderRadius: '4px' }} />
      </div>

      {/* Metrics Row Skeleton */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {[1, 2, 3, 4].map((n) => (
          <div key={n} style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '4px', padding: '16px' }}>
            <div style={{ width: '50%', height: '14px', background: '#E2E8F0', borderRadius: '3px', marginBottom: '8px' }} />
            <div style={{ width: '70%', height: '24px', background: '#CBD5E1', borderRadius: '4px', marginBottom: '8px' }} />
            <div style={{ width: '40%', height: '12px', background: '#F1F5F9', borderRadius: '3px' }} />
          </div>
        ))}
      </div>

      {/* Main Content Area Skeleton */}
      <div style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '4px', padding: '1.5rem' }}>
        <div style={{ width: '35%', height: '22px', background: '#E2E8F0', borderRadius: '4px', marginBottom: '1.25rem' }} />
        <div style={{ width: '100%', height: '160px', background: '#F8FAFC', borderRadius: '4px', border: '1px dashed #CBD5E1' }} />
      </div>
    </div>
  );
}
