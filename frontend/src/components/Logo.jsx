import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export default function Logo({ size = 42, showText = true, subtitle = true, lightText = false }) {
  const { currentLang } = useLanguage();
  const isHindi = currentLang === 'hi';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
      <div 
        style={{ 
          width: size, 
          height: size, 
          borderRadius: '50%', 
          overflow: 'hidden', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
          background: '#ffffff',
          flexShrink: 0,
          border: '1.5px solid #047857'
        }}
      >
        <img 
          src="/logo.jpeg" 
          onError={(e) => { 
            if (e.target.src.includes('logo.jpeg')) {
              e.target.src = '/logo.png';
            } else if (e.target.src.includes('logo.png')) {
              e.target.src = '/logo.jpg';
            } else if (e.target.src.includes('logo.jpg')) {
              e.target.src = '/emblem.svg';
            }
          }}
          alt="KrishiMitraaz Official Emblem" 
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      </div>
      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
          <div style={{ display: 'inline-flex', alignItems: 'baseline' }}>
            <span style={{ 
              fontSize: size > 40 ? '1.35rem' : '1.18rem', 
              fontWeight: 900, 
              letterSpacing: '-0.02em',
              lineHeight: 1
            }}>
              <span style={{ color: lightText ? '#4ADE80' : '#144A28' }}>
                {isHindi ? 'कृषि' : 'Krishi'}
              </span>
              <span style={{ color: lightText ? '#60A5FA' : '#0284C7' }}>
                {isHindi ? 'मित्रा' : 'Mitra'}
              </span>
              <span style={{ color: '#F59E0B' }}>
                {isHindi ? 'ज़' : 'az'}
              </span>
            </span>
          </div>
          {subtitle && (
            <span style={{ 
              fontSize: '0.68rem', 
              color: lightText ? '#38BDF8' : '#0284C7', 
              fontWeight: 800, 
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              marginTop: '2px'
            }}>
              {isHindi ? 'किसान का डिजिटल दोस्त' : 'Kisaan Ka Digital Dost'}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
