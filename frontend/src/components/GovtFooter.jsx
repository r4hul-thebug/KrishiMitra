import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { ExternalLink, X, CheckCircle2, PhoneCall, Info, ShieldCheck } from 'lucide-react';

export default function GovtFooter() {
  const { currentLang } = useLanguage();
  const isHi = currentLang === 'hi';
  const [activeModal, setActiveModal] = useState(null); // 'portals' | 'about'

  const officialPortals = [
    { name: isHi ? 'पीएम-किसान सम्मान निधि' : 'PM-KISAN Portal', url: 'https://pmkisan.gov.in', desc: 'Direct Benefit Transfer for Indian farmers' },
    { name: isHi ? 'राष्ट्रीय कृषि बाजार (e-NAM)' : 'National Agriculture Market (e-NAM)', url: 'https://enam.gov.in', desc: 'Pan-India electronic trading portal for farm produce' },
    { name: isHi ? 'प्रधानमंत्री फसल बीमा योजना (PMFBY)' : 'PM Fasal Bima Yojana', url: 'https://pmfby.gov.in', desc: 'Comprehensive crop insurance against natural risks' },
    { name: isHi ? 'मृदा स्वास्थ्य कार्ड पोर्टल' : 'Soil Health Card Portal', url: 'https://soilhealth.dac.gov.in', desc: 'Nutrient status and customized fertilizer dosage recommendations' },
    { name: isHi ? 'भारतीय कृषि अनुसंधान परिषद (ICAR)' : 'ICAR Research Portal', url: 'https://icar.org.in', desc: 'Apex body for agricultural education and scientific crop advisories' },
    { name: isHi ? 'मौसम कृषि सेवा (IMD Agromet)' : 'IMD Agromet Advisory', url: 'https://mausam.imd.gov.in', desc: 'District-wise weather forecast and farming advisories' }
  ];

  return (
    <footer 
      className="no-print" 
      style={{
        background: '#0F172A',
        color: '#CBD5E1',
        borderTop: '1px solid #1E293B',
        width: '100%',
        fontSize: '0.72rem',
        padding: '6px 18px',
        marginTop: 'auto',
        minHeight: '36px',
        display: 'flex',
        alignItems: 'center'
      }}
    >
      <div style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '8px'
      }}>
        {/* Left: KrishiMitra Brand & Purpose */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
            alt="KrishiMitraaz Emblem" 
            style={{ width: '18px', height: '18px', borderRadius: '50%', objectFit: 'contain' }}
          />
          <span style={{ color: '#F8FAFC', fontWeight: 700 }}>
            {isHi ? 'कृषिमित्राज़' : 'KrishiMitraaz'}
          </span>
          <span style={{ color: '#64748B' }}>•</span>
          <span style={{ color: '#94A3B8' }}>
            {isHi 
              ? 'भारतीय किसानों के लिए एआई एवं उपग्रह आधारित स्मार्ट फसल सलाहकार प्रणाली' 
              : 'AI & Satellite-Powered Smart Crop Advisory System'}
          </span>
        </div>

        {/* Center: Real Data Integration Badges */}
        <div className="hidden lg:flex" style={{ alignItems: 'center', gap: '8px', color: '#64748B', fontSize: '0.68rem' }}>
          <span>e-NAM</span>
          <span>•</span>
          <span>IMD Weather</span>
          <span>•</span>
          <span>ISRO Bhuvan</span>
          <span>•</span>
          <span>ICAR Guidelines</span>
        </div>

        {/* Right: Quick Agri Portals & Helpline */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button 
            type="button"
            onClick={() => setActiveModal('portals')}
            style={{ 
              background: 'rgba(255,255,255,0.08)', 
              border: '1px solid rgba(255,255,255,0.15)', 
              color: '#38BDF8', 
              cursor: 'pointer', 
              padding: '2px 7px', 
              borderRadius: '3px',
              fontSize: '0.68rem',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.16)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
          >
            <ExternalLink size={10} />
            <span>{isHi ? 'कृषि पोर्टल' : 'Agri Portals'}</span>
          </button>

          <a 
            href="tel:18001801551" 
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '4px', 
              color: '#FCD34D', 
              fontWeight: 700, 
              fontSize: '0.7rem',
              textDecoration: 'none' 
            }}
            title="Kisan Call Centre 24x7 Helpline"
          >
            <PhoneCall size={11} />
            <span>1800-180-1551</span>
          </a>
        </div>
      </div>

      {/* Official Portals Directory Modal */}
      {activeModal === 'portals' && (
        <div className="modal-backdrop" onClick={() => setActiveModal(null)}>
          <div 
            className="modal-content gov-card"
            style={{ maxWidth: '620px', margin: '20px', background: '#FFFFFF' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="gov-card-header" style={{ background: '#0F172A', color: '#FFFFFF', padding: '12px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ExternalLink size={16} color="#38BDF8" />
                <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>
                  {isHi ? 'महत्वपूर्ण आधिकारिक कृषि पोर्टल' : 'Official Indian Agriculture Portals'}
                </span>
              </div>
              <button 
                type="button"
                onClick={() => setActiveModal(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', display: 'flex' }}
              >
                <X size={18} />
              </button>
            </div>
            <div className="gov-card-body" style={{ padding: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '10px' }}>
                {officialPortals.map((p, idx) => (
                  <a
                    key={idx}
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'block',
                      padding: '10px 12px',
                      background: '#F8FAFC',
                      border: '1px solid #E2E8F0',
                      borderRadius: '6px',
                      textDecoration: 'none',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#EFF6FF';
                      e.currentTarget.style.borderColor = '#93C5FD';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#F8FAFC';
                      e.currentTarget.style.borderColor = '#E2E8F0';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#0F172A', fontWeight: 800, fontSize: '0.8rem' }}>
                      <span>{p.name}</span>
                      <ExternalLink size={12} color="#0284C7" />
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#64748B', marginTop: '3px' }}>
                      {p.desc}
                    </div>
                  </a>
                ))}
              </div>
              <div style={{ marginTop: '14px', textAlign: 'right' }}>
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="gov-btn gov-btn-primary"
                  style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                >
                  <CheckCircle2 size={14} />
                  <span>{isHi ? 'बंद करें' : 'Close'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
