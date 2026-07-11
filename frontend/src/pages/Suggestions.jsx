import { useState, useEffect } from 'react';
import axios from 'axios';
import { Lightbulb, Sprout, ShieldAlert } from 'lucide-react';
import '../index.css';
import { API_URL } from '../config';
import { useLanguage } from '../contexts/LanguageContext';

export default function Suggestions() {
  const { t, currentLang } = useLanguage();
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const farmerId = localStorage.getItem('krishimitraaz_farmer_id');

  useEffect(() => {
    document.title = 'Crop Prediction - KrishiMitraaz';
  }, []);

  useEffect(() => {
    const fetchSuitability = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/farmers/${farmerId}/suitability?lang=${currentLang}`);
        setSuggestions(res.data.suggestions);
      } catch {
        setError('Failed to fetch crop suggestions. Ensure location is enabled on the Dashboard first.');
      } finally {
        setLoading(false);
      }
    };

    fetchSuitability();
  }, [farmerId, currentLang]);

  if (loading) {
    return (
      <div className="container loading-container">
        <div className="spinner"></div>
        <h2 className="animate-fade-in-up">{t('analyzingMicroclimate')}</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container loading-container">
        <ShieldAlert size={64} color="var(--accent-urgent)" />
        <h2 style={{marginTop: '1rem', color: 'var(--accent-urgent)'}}>{t('analysisError')}</h2>
        <p style={{marginBottom: '2rem'}}>{error}</p>
      </div>
    );
  }

  return (
    <div className="container page-wrapper">
      <div className="header-banner animate-fade-in-down" style={{ background: 'linear-gradient(135deg, #FF9800, #F57C00)' }}>
        <h1>{t('cropSuitability')}</h1>
        <p>{t('suitabilitySubtitle')}</p>
        <div style={{ position: 'absolute', top: '-20px', right: '-20px', opacity: 0.2, transform: 'scale(3)' }}>
          <Lightbulb size={120} />
        </div>
      </div>

      <div className="dashboard-grid">
        {suggestions.map((crop, index) => (
          <div 
            key={index} 
            className="glass-card animate-fade-in-up severity-info"
            style={{animationDelay: `${0.1 + (index * 0.1)}s`}}
          >
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ background: 'var(--primary-green-light)', padding: '10px', borderRadius: '10px' }}>
                  <Sprout size={24} color="white" />
                </div>
                <h3 style={{ fontSize: '1.4rem', color: 'var(--text-main)', margin: 0 }}>
                  {crop.cropNameLocal || crop.name.en} <span style={{fontSize: '1rem', color: 'var(--text-muted)'}}>({crop.name[currentLang] || crop.name.hi})</span>
                </h3>
              </div>
              <div style={{ background: '#E8F5E9', color: 'var(--primary-green-dark)', padding: '4px 12px', borderRadius: '16px', fontWeight: 'bold', textAlign: 'center' }}>
                {crop.score}% <br/> {t('match') || 'Match'}
              </div>
            </div>
            
            <p style={{ color: 'var(--text-main)', marginBottom: '12px', lineHeight: 1.5 }}>
              {crop.reasoning}
            </p>
            
            <div style={{ display: 'flex', gap: '16px', borderTop: '1px solid #EEE', paddingTop: '12px', marginBottom: '12px' }}>
              <div>
                <span style={{display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)'}}>{t('season')}</span>
                <strong>{crop.season.charAt(0).toUpperCase() + crop.season.slice(1)}</strong>
              </div>
              <div>
                <span style={{display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)'}}>{t('duration')}</span>
                <strong>{crop.durationDays} days</strong>
              </div>
              <div>
                <span style={{display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)'}}>{t('avgYieldTitle')}</span>
                <strong>{crop.yieldPerAcreQuintals} q/acre</strong>
              </div>
            </div>

            <div style={{ background: '#F8FAF8', border: '1px solid #E0E0E0', padding: '12px', borderRadius: '8px' }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '0.95rem', color: 'var(--primary-green-dark)' }}>{t('financialEvaluation')}</h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '4px' }}>
                <span style={{ color: 'var(--text-muted)' }}>{t('govtRate')}</span>
                <strong>₹{crop.mspPerQuintal}/q</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '4px' }}>
                <span style={{ color: 'var(--text-muted)' }}>{t('seedCost')}</span>
                <strong style={{ color: 'var(--accent-urgent)' }}>-₹{crop.seedCostPerAcre}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>{t('fertilizerCost')}</span>
                <strong style={{ color: 'var(--accent-urgent)' }}>-₹{crop.fertilizerCostPerAcre}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.05rem', borderTop: '1px solid #DDD', paddingTop: '8px' }}>
                <span style={{ fontWeight: 'bold' }}>{t('profitMargin')}</span>
                <strong style={{ color: 'var(--primary-green)' }}>
                  ₹{(crop.yieldPerAcreQuintals * crop.mspPerQuintal) - (crop.seedCostPerAcre + crop.fertilizerCostPerAcre)}
                </strong>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
