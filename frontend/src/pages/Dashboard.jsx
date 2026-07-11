import { useState, useEffect } from 'react';
import axios from 'axios';
import { Leaf, Droplets, Thermometer, ShieldAlert, Satellite, RefreshCw, Volume2, AlertTriangle } from 'lucide-react';
import '../index.css';
import { API_URL } from '../config';
import { useLanguage } from '../contexts/LanguageContext';

const iconMap = {
  'Hold irrigation': <Droplets size={24} color="white" />,
  'Irrigation schedule': <Droplets size={24} color="white" />,
  'Heat stress': <Thermometer size={24} color="white" />,
  'Cold stress': <Thermometer size={24} color="white" />,
  'Disease': <ShieldAlert size={24} color="white" />,
  'Satellite': <Satellite size={24} color="white" />,
  'Stage': <Leaf size={24} color="white" />,
  'Nutrient': <Leaf size={24} color="white" />,
  'Rotation': <RefreshCw size={24} color="white" />
};

function getIconForTitle(title) {
  for (const [key, icon] of Object.entries(iconMap)) {
    if (title.includes(key)) return icon;
  }
  return <Leaf size={24} color="white" />;
}

export default function Dashboard() {
  const { t, currentLang } = useLanguage();
  const [advisory, setAdvisory] = useState(null);
  const [threats, setThreats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const farmerId = localStorage.getItem('krishimitraaz_farmer_id');

  useEffect(() => {
    document.title = 'Dashboard - KrishiMitraaz';
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError('');
        
        const [advisoryRes, threatsRes] = await Promise.all([
          axios.get(`${API_URL}/farmers/${farmerId}/advisory?speech=1&lang=${currentLang}`),
          axios.get(`${API_URL}/farmers/${farmerId}/threats?lang=${currentLang}`)
        ]);
        
        setAdvisory(advisoryRes.data);
        setThreats(threatsRes.data.threats || []);
      } catch (err) {
        setError(err.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    if (farmerId) fetchDashboardData();
  }, [farmerId, currentLang]);

  if (loading) {
    return (
      <div className="container loading-container">
        <div className="spinner"></div>
        <h2 className="animate-fade-in-up">{t('gatheringData')}</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container loading-container">
        <ShieldAlert size={64} color="var(--accent-urgent)" />
        <h2 style={{marginTop: '1rem', color: 'var(--accent-urgent)'}}>{t('connectionError')}</h2>
        <p style={{marginBottom: '2rem'}}>{error}</p>
        <button onClick={fetchDashboardData} className="btn-primary">{t('tryAgain')}</button>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Hero Header */}
      <div className="header-banner animate-fade-in-down">
        <h1>{t('welcomeBack') || 'Welcome Back!'}</h1>
        <p>{t('liveAdvisoryFor') || 'Live AI & Satellite powered advisory for your'} <strong>{advisory?.cropName?.[currentLang] || advisory?.cropName?.hi || advisory?.cropName?.en || 'Crop'}</strong> {t('fieldAt') || 'field at'} <strong>{advisory?.stage?.name || 'Unknown Stage'}</strong>.</p>
        <div style={{ position: 'absolute', top: '-20px', right: '-20px', opacity: 0.2, transform: 'scale(3)' }}>
          <Leaf size={120} />
        </div>
      </div>

      {/* Voice Summary Segment */}
      {advisory?.speech && (
        <div className="voice-card animate-fade-in-up" style={{animationDelay: '0.1s', position: 'relative'}}>
          <div className="voice-icon">
            <Volume2 size={28} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <h2 style={{color: 'var(--primary-green-dark)', margin: 0}}>{t('voiceAssistant')}</h2>
              <button 
                onClick={() => {
                  if (window.speechSynthesis.speaking) {
                    window.speechSynthesis.cancel();
                  } else {
                    const utterance = new SpeechSynthesisUtterance(advisory.speech);
                    utterance.lang = 'en-IN'; // Indian English accent
                    utterance.rate = 0.9;     // Slightly slower for clarity
                    window.speechSynthesis.speak(utterance);
                  }
                }}
                className="btn-primary"
                style={{ padding: '6px 12px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Volume2 size={16} /> Play Audio
              </button>
            </div>
            <div style={{fontSize: '1.125rem', lineHeight: 1.8, color: 'var(--text-main)'}}>
              {advisory.speech.split('\n').map((line, idx) => (
                <div 
                  key={idx} 
                  style={line.match(/^\d+\./) ? { paddingLeft: '24px', textIndent: '-24px', marginBottom: '4px' } : { marginBottom: '12px', fontWeight: 'bold' }}
                >
                  {line}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Real-Time Threat Center */}
      {threats.length > 0 && (
        <div className="animate-fade-in-up" style={{ marginBottom: '2.5rem', animationDelay: '0.15s' }}>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem', color: 'var(--accent-urgent)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={28} /> {t('realTimeThreats') || 'Real-Time Threat Center'}
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {threats.map((t, idx) => (
              <div key={idx} className="glass-card" style={{ borderLeft: '4px solid var(--accent-urgent)', background: 'var(--accent-urgent-bg)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
                  <ShieldAlert color="var(--accent-urgent)" size={24} />
                  <h3 style={{ fontSize: '1.25rem', margin: 0, color: 'var(--accent-urgent)' }}>{t.title}</h3>
                </div>
                <p style={{ color: 'var(--text-main)', fontSize: '1.05rem', lineHeight: '1.5' }}>{t.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <h2 style={{fontSize: '1.75rem', marginBottom: '1rem', color: 'var(--primary-green-dark)'}}>
        {t('detailedInsights') || 'Detailed Insights'}
      </h2>

      {/* Insights Grid */}
      <div className="dashboard-grid">
        {advisory?.items?.map((item, index) => {
          let severityClass = 'severity-info';
          let iconBg = 'var(--primary-green-light)';
          
          if (item.severity === 'urgent') {
            severityClass = 'severity-urgent';
            iconBg = 'var(--accent-urgent)';
          } else if (item.severity === 'important') {
            severityClass = 'severity-important';
            iconBg = 'var(--accent-important)';
          }

          return (
            <div 
              key={index} 
              className={`glass-card animate-fade-in-up ${severityClass}`}
              style={{animationDelay: `${0.15 + (index * 0.05)}s`}}
            >
              <div className="flex items-center gap-4" style={{marginBottom: '1rem'}}>
                <div style={{
                  background: iconBg, 
                  padding: '12px', 
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}>
                  {getIconForTitle(item.title)}
                </div>
                <h3 style={{fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-main)'}}>
                  {item.title}
                </h3>
              </div>
              <p style={{color: 'var(--text-muted)', fontSize: '1rem'}}>
                {item.message}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
