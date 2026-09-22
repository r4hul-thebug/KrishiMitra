import { useState, useEffect } from 'react';
import axios from 'axios';
import { Lightbulb, Sprout, ShieldAlert, Printer } from 'lucide-react';
import { API_URL } from '../config';
import { useLanguage } from '../contexts/LanguageContext';

export default function Suggestions() {
  const { t, currentLang } = useLanguage();
  const isHi = currentLang === 'hi';

  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const farmerId = localStorage.getItem('krishimitraaz_farmer_id') || 'demo-farmer-001';

  useEffect(() => {
    document.title = isHi 
      ? 'फसल उपयुक्तता एवं अनुशंसा - कृषिमित्राज़' 
      : 'Crop Suitability Assessment - KrishiMitraaz';
  }, [isHi]);

  useEffect(() => {
    const fetchSuitability = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await axios.get(`${API_URL}/farmers/${farmerId}/suitability?lang=${currentLang}`);
        setSuggestions(res.data.suggestions || []);
      } catch {
        try {
          const fallbackRes = await axios.get(`${API_URL}/farmers/demo-farmer-001/suitability?lang=${currentLang}`);
          setSuggestions(fallbackRes.data.suggestions || []);
        } catch {
          setError(isHi 
            ? 'फसल उपयुक्तता डेटा प्राप्त करने में असमर्थ। कृपया पुनः प्रयास करें।'
            : 'Unable to load crop suggestions. Please retry or update your location in your Profile.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSuitability();
  }, [farmerId, currentLang, isHi]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '3rem 1rem', textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
        <div className="spinner"></div>
        <h2 style={{ fontSize: '1.2rem', color: '#0A3161', marginTop: '1rem' }}>{t('analyzingMicroclimate')}</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container" style={{ padding: '3rem 1rem', textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
        <ShieldAlert size={48} color="#DC2626" style={{ margin: '0 auto' }} />
        <h2 style={{ marginTop: '1rem', color: '#991B1B', fontSize: '1.2rem' }}>{t('analysisError')}</h2>
        <p style={{ marginBottom: '1.5rem', color: '#475569', fontSize: '0.85rem' }}>{error}</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '1.5rem 1rem 3rem', maxWidth: '1280px', margin: '0 auto' }}>
      {/* 1. Official Header Banner */}
      <div className="header-banner" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.15)', padding: '3px 10px', borderRadius: '3px', fontSize: '0.75rem', fontWeight: 700, marginBottom: '8px' }}>
              <Lightbulb size={14} color="#FDE047" />
              <span>{isHi ? 'आईसीएआर कृषि-जलवायु क्षेत्र एवं मृदा उपयुक्तता प्रभाग' : 'ICAR Agro-Climatic Zone & Soil Suitability Division'}</span>
            </div>
            <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 900 }}>
              {isHi ? 'कृषि-जलवायु क्षेत्र फसल उपयुक्तता एवं लाभप्रदता अनुशंसा' : 'Agro-Climatic Crop Suitability & Yield Assessment'}
            </h1>
            <p style={{ margin: '6px 0 0', fontSize: '0.9rem', color: '#E2E8F0', maxWidth: '850px', lineHeight: 1.5 }}>
              {isHi 
                ? 'स्थानीय तापमान, मौसमी वर्षा, मृदा प्रकार एवं न्यूनतम समर्थन मूल्य (MSP) के आधार पर अनुकूलतम फसलों का वैज्ञानिक मिलान।'
                : 'Microclimate temperature, seasonal monsoon rainfall, soil classification, and MSP price modeling for your agro-ecological zone.'}
            </p>
          </div>

          <button
            onClick={() => window.print()}
            className="gov-btn gov-btn-secondary no-print"
            style={{ background: 'rgba(255,255,255,0.15)', color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.3)' }}
          >
            <Printer size={14} />
            <span>{isHi ? 'प्रिंट अनुशंसा' : 'Print Advisory'}</span>
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {suggestions.map((crop, index) => (
          <div key={index} className="gov-card" style={{ borderTop: `4px solid ${index === 0 ? '#004D25' : '#0A3161'}` }}>
            <div className="gov-card-header" style={{ justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sprout size={18} color="#004D25" />
                <strong style={{ fontSize: '1rem', color: '#0A3161' }}>
                  {crop.cropNameLocal || crop.name?.en} <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 500 }}>({crop.name?.[currentLang] || crop.name?.hi})</span>
                </strong>
              </div>
              <span style={{ 
                background: '#ECFDF5', 
                color: '#065F46', 
                padding: '2px 8px', 
                borderRadius: '3px', 
                fontWeight: 800, 
                fontSize: '0.72rem',
                border: '1px solid #A7F3D0'
              }}>
                {crop.score}% {isHi ? 'अनुकूल' : 'Match'}
              </span>
            </div>

            <div className="gov-card-body" style={{ padding: '1.25rem' }}>
              <p style={{ color: '#334155', margin: '0 0 12px 0', fontSize: '0.82rem', lineHeight: 1.5 }}>
                {crop.reasoning}
              </p>
              
              <div style={{ display: 'flex', gap: '12px', borderTop: '1px solid #E2E8F0', paddingTop: '10px', marginBottom: '12px', flexWrap: 'wrap' }}>
                <div>
                  <span style={{ display: 'block', fontSize: '0.7rem', color: '#64748B', fontWeight: 700 }}>{t('season')}</span>
                  <strong style={{ fontSize: '0.85rem', color: '#0A3161' }}>{crop.season?.charAt(0).toUpperCase() + crop.season?.slice(1)}</strong>
                </div>
                <div>
                  <span style={{ display: 'block', fontSize: '0.7rem', color: '#64748B', fontWeight: 700 }}>{t('duration')}</span>
                  <strong style={{ fontSize: '0.85rem', color: '#0A3161' }}>{crop.durationDays} {isHi ? 'दिन' : 'days'}</strong>
                </div>
                <div>
                  <span style={{ display: 'block', fontSize: '0.7rem', color: '#64748B', fontWeight: 700 }}>{t('avgYieldTitle')}</span>
                  <strong style={{ fontSize: '0.85rem', color: '#004D25' }}>{crop.yieldPerAcreQuintals} {isHi ? 'क्विंटल/एकड़' : 'q/acre'}</strong>
                </div>
              </div>

              {/* Economic Balance Preview */}
              <div style={{ background: '#F8FAFC', border: '1px solid #CBD5E1', padding: '10px 12px', borderRadius: '3px' }}>
                <h4 style={{ margin: '0 0 6px 0', fontSize: '0.78rem', color: '#0A3161', fontWeight: 800 }}>{t('financialEvaluation')}</h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '3px' }}>
                  <span style={{ color: '#64748B' }}>{t('govtRate')}</span>
                  <strong style={{ color: '#0A3161' }}>₹{crop.mspPerQuintal} / {isHi ? 'क्विंटल' : 'q'}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '3px' }}>
                  <span style={{ color: '#64748B' }}>{t('seedCost')}</span>
                  <strong style={{ color: '#991B1B' }}>-₹{crop.seedCostPerAcre}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '6px' }}>
                  <span style={{ color: '#64748B' }}>{t('fertilizerCost')}</span>
                  <strong style={{ color: '#991B1B' }}>-₹{crop.fertilizerCostPerAcre}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', borderTop: '1px solid #E2E8F0', paddingTop: '6px' }}>
                  <span style={{ fontWeight: 800, color: '#334155' }}>{t('profitMargin')}</span>
                  <strong style={{ color: '#004D25' }}>
                    ₹{(crop.yieldPerAcreQuintals * crop.mspPerQuintal) - (crop.seedCostPerAcre + crop.fertilizerCostPerAcre)}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
