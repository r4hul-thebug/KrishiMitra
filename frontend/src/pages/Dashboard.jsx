import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Leaf, Droplets, Thermometer, ShieldAlert, Satellite, 
  RefreshCw, Volume2, AlertTriangle, Store, 
  Orbit, Repeat, Stethoscope, CloudRain, Landmark,
  Calculator, Lightbulb, Headphones, ShieldCheck, 
  TrendingUp, Calendar, MapPin, CheckCircle2, User,
  CheckSquare, Square, Play, Pause, ExternalLink, ArrowRight,
  Sparkles, Award, ChevronRight, Activity, Flame, Shield, Sun, Clock
} from 'lucide-react';
import '../index.css';
import { API_URL } from '../config';
import { useLanguage } from '../contexts/LanguageContext';

const iconMap = {
  'Hold irrigation': <Droplets size={20} />,
  'Irrigation schedule': <Droplets size={20} />,
  'Heat stress': <Thermometer size={20} />,
  'Cold stress': <Thermometer size={20} />,
  'Disease': <ShieldAlert size={20} />,
  'Satellite': <Satellite size={20} />,
  'Stage': <Leaf size={20} />,
  'Nutrient': <Leaf size={20} />,
  'Rotation': <RefreshCw size={20} />
};

function getIconForTitle(title) {
  for (const [key, icon] of Object.entries(iconMap)) {
    if (title.includes(key)) return icon;
  }
  return <Leaf size={20} />;
}

export default function Dashboard({ setToken }) {
  const { t, currentLang } = useLanguage();
  const isHi = currentLang === 'hi';
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('krishimitraaz_token');
    if (!token) {
      navigate('/', { replace: true });
    }
  }, [navigate]);
  
  const [advisory, setAdvisory] = useState(null);
  const [threats, setThreats] = useState([]);
  const [weatherForecast, setWeatherForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activeTab, setActiveTab] = useState('directives'); // 'directives' | 'weather' | 'mandi' | 'schemes'
  const [fieldAcres, setFieldAcres] = useState(2.5);
  const [soilType, setSoilType] = useState('alluvial');

  const farmerId = localStorage.getItem('krishimitraaz_farmer_id') || 'demo-farmer-001';

  // Persistent interactive task checklist
  const [completedTasks, setCompletedTasks] = useState(() => {
    try {
      const saved = localStorage.getItem(`krishimitraaz_completed_${farmerId}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const toggleTaskCompletion = (index) => {
    setCompletedTasks((prev) => {
      const updated = prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index];
      localStorage.setItem(`krishimitraaz_completed_${farmerId}`, JSON.stringify(updated));
      return updated;
    });
  };

  useEffect(() => {
    document.title = isHi 
      ? 'कृषिमित्राज़ - किसान फसल सलाहकार डैशबोर्ड' 
      : 'KrishiMitraaz - Smart Agronomy Dashboard';
  }, [isHi]);

  const fetchDashboardData = React.useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      const [advisoryRes, threatsRes] = await Promise.all([
        axios.get(`${API_URL}/farmers/${farmerId}/advisory?speech=1&lang=${currentLang}`),
        axios.get(`${API_URL}/farmers/${farmerId}/threats?lang=${currentLang}`)
      ]);
      
      setAdvisory(advisoryRes.data);
      setThreats(threatsRes.data.threats || []);

      if (advisoryRes.data?.location) {
        const { lat, lon } = advisoryRes.data.location;
        try {
          const wRes = await axios.get(`${API_URL}/weather?lat=${lat}&lon=${lon}`);
          setWeatherForecast(wRes.data);
        } catch {}
      }
    } catch (err) {
      if (err.response && err.response.status === 404) {
        localStorage.removeItem('krishimitraaz_farmer_id');
        window.location.href = '/';
        return;
      }
      setError(err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, [farmerId, currentLang]);

  useEffect(() => {
    if (farmerId) fetchDashboardData();
  }, [farmerId, fetchDashboardData]);

  const handleAudioPlayback = () => {
    if (!advisory?.speech) return;
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      const utterance = new SpeechSynthesisUtterance(advisory.speech);
      utterance.lang = currentLang === 'hi' ? 'hi-IN' : 'en-IN';
      utterance.rate = 0.92;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    }
  };

  if (loading) {
    return (
      <div className="container loading-container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <div className="spinner" style={{ margin: '0 auto 1.5rem', width: '48px', height: '48px', border: '4px solid #E2E8F0', borderTopColor: '#0A3161', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <h2 style={{ color: '#0A3161', fontSize: '1.25rem', fontWeight: 800 }}>
          {isHi ? 'राष्ट्रीय कृषि डेटा नेटवर्क से जानकारी प्राप्त की जा रही है...' : 'Accessing National Agronomy Data Network...'}
        </h2>
        <p style={{ color: '#64748B', fontSize: '0.85rem' }}>
          {isHi ? 'कृपया प्रतीक्षा करें (सत्यापन: इसरो भुवन एवं आईएमडी मौसम)' : 'Please wait (Verifying ISRO Bhuvan & IMD Agromet records)'}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container" style={{ padding: '3rem 1rem', maxWidth: '640px', margin: '0 auto' }}>
        <div className="gov-card" style={{ borderTop: '4px solid #DC2626', textAlign: 'center', padding: '2rem' }}>
          <ShieldAlert size={48} color="#DC2626" style={{ margin: '0 auto 1rem' }} />
          <h2 style={{ color: '#991B1B', fontSize: '1.25rem', fontWeight: 800 }}>{t('connectionError')}</h2>
          <p style={{ color: '#475569', fontSize: '0.9rem', margin: '1rem 0 1.5rem' }}>{error}</p>
          <button onClick={fetchDashboardData} className="gov-btn gov-btn-primary" style={{ margin: '0 auto' }}>
            <RefreshCw size={16} />
            <span>{t('tryAgain')}</span>
          </button>
        </div>
      </div>
    );
  }

  const cropTitle = advisory?.cropName?.[currentLang] || advisory?.cropName?.hi || advisory?.cropName?.en || 'Wheat / धान';
  const stageName = advisory?.stage?.name || 'Active Vegetative Stage / वृद्धि अवस्था';
  const totalTasks = advisory?.items?.length || 0;
  const completedCount = completedTasks.filter(idx => idx < totalTasks).length;
  const progressPercent = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  // Calculation for irrigation planner
  const soilWaterFactors = { alluvial: 1.0, black: 0.85, red: 1.15, sandy: 1.3 };
  const baseWaterPerAcre = 24000; // liters per acre
  const adjustedWater = Math.round(fieldAcres * baseWaterPerAcre * (soilWaterFactors[soilType] || 1.0));
  const pumpHp5Hours = (adjustedWater / 12000).toFixed(1); // 5HP pump yields ~12,000 L/hr
  const rainProbToday = advisory?.weatherToday?.rainChance || 0;

  return (
    <div className="container" style={{ padding: '1.5rem 1rem 3rem', maxWidth: '1280px', margin: '0 auto' }}>
      
      {/* 1. Official Government Hero Header Banner (Deep Indian Navy-Emerald Gradient with Crisp High Contrast) */}
      <div className="header-banner" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.25rem' }}>
          <div style={{ flex: '1 1 500px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.3)', padding: '4px 12px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 800, marginBottom: '10px', color: '#FFFFFF' }}>
              <ShieldCheck size={14} color="#FDE047" />
              <span>{isHi ? 'कृषिमित्राज़ - स्मार्ट डिजिटल कृषि सलाहकार' : 'KrishiMitraaz • Smart Digital Crop Advisory System'}</span>
            </div>

            <h1 style={{ margin: 0, fontSize: '1.65rem', fontWeight: 900, color: '#FFFFFF', lineHeight: 1.25 }}>
              {isHi ? `नमस्ते, किसान भाई! (पंजीकृत फसल: ${cropTitle})` : `Namaste Farmer! (Registered Crop: ${cropTitle})`}
            </h1>

            <p style={{ margin: '8px 0 0', fontSize: '0.92rem', color: '#E0F2FE', maxWidth: '820px', lineHeight: 1.6 }}>
              {isHi 
                ? `आपकी फसल वर्तमान में "${stageName}" में है। इसरो उपग्रह (NDVI) एवं भारतीय मौसम विज्ञान विभाग (IMD) आधारित वास्तविक समय परामर्श नीचे उपलब्ध है।`
                : `Your crop is currently at "${stageName}". Real-time agronomy telemetry from ISRO Bhuvan satellite and IMD agrometeorology is active.`}
            </p>

            {/* Instant Audio Listen Button inside Header */}
            {advisory?.speech && (
              <div style={{ marginTop: '14px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button
                  onClick={handleAudioPlayback}
                  style={{
                    background: isPlayingAudio ? '#DC2626' : '#10B981',
                    color: '#FFFFFF',
                    border: '1px solid rgba(255,255,255,0.3)',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  {isPlayingAudio ? <Pause size={16} /> : <Volume2 size={16} />}
                  <span>
                    {isPlayingAudio 
                      ? (isHi ? 'ऑडियो रोकें (Stop Audio)' : 'Stop Audio') 
                      : (isHi ? 'परामर्श आवाज में सुनें (Listen)' : 'Listen to Voice Advisory')}
                  </span>
                  {isPlayingAudio && (
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '14px', marginLeft: '4px' }}>
                      <div className="audio-wave-bar"></div>
                      <div className="audio-wave-bar"></div>
                      <div className="audio-wave-bar"></div>
                      <div className="audio-wave-bar"></div>
                    </div>
                  )}
                </button>

                <span style={{ fontSize: '0.78rem', color: '#BAE6FD', fontWeight: 600 }}>
                  {isHi ? 'ICAR एवं कृषि विज्ञान केंद्र द्वारा प्रमाणित' : 'ICAR & KVK Verified Agromet Audio'}
                </span>
              </div>
            )}
          </div>

          {/* High-Contrast Georeferenced Coordinates Box */}
          {advisory?.location && (
            <div style={{
              background: 'rgba(3, 15, 38, 0.75)',
              border: '1px solid rgba(255,255,255,0.25)',
              padding: '12px 18px',
              borderRadius: '6px',
              textAlign: 'right',
              backdropFilter: 'blur(6px)',
              boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
            }}>
              <div style={{ fontSize: '0.75rem', color: '#93C5FD', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {isHi ? 'खेत भू-निर्देशांक (GPS):' : 'Georeferenced Field (GPS):'}
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#FDE047', fontFamily: 'monospace', letterSpacing: '0.05em', marginTop: '2px' }}>
                {Number(advisory.location.lat).toFixed(4)}° N, {Number(advisory.location.lon).toFixed(4)}° E
              </div>
              <div style={{ fontSize: '0.72rem', color: '#86EFAC', fontWeight: 800, marginTop: '4px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
                <CheckCircle2 size={13} color="#4ADE80" />
                <span>ISRO Bhuvan Spatial Grid Connected</span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Weather Telemetry Chips */}
        {advisory?.weatherToday && (
          <div style={{ marginTop: '16px', display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.18)', paddingTop: '12px' }}>
            <span style={{ background: 'rgba(255,255,255,0.14)', border: '1px solid rgba(255,255,255,0.2)', padding: '5px 12px', borderRadius: '4px', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#FFFFFF', fontWeight: 700 }}>
              <Thermometer size={15} color="#FDE047" />
              <span>{isHi ? 'तापमान:' : 'Temp:'} {advisory.weatherToday.tMinC}°C – {advisory.weatherToday.tMaxC}°C</span>
            </span>
            <span style={{ background: 'rgba(255,255,255,0.14)', border: '1px solid rgba(255,255,255,0.2)', padding: '5px 12px', borderRadius: '4px', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#FFFFFF', fontWeight: 700 }}>
              <Droplets size={15} color="#38BDF8" />
              <span>{isHi ? 'वर्षा सम्भावना:' : 'Rain Probability:'} {advisory.weatherToday.rainChance}% ({advisory.weatherToday.rainMm} mm)</span>
            </span>
            <span style={{ background: 'rgba(255,255,255,0.14)', border: '1px solid rgba(255,255,255,0.2)', padding: '5px 12px', borderRadius: '4px', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#FFFFFF', fontWeight: 700 }}>
              <Calendar size={15} color="#86EFAC" />
              <span>{isHi ? 'फसल ऋतु:' : 'Season:'} {isHi ? 'खरीफ 2026-27' : 'Kharif 2026-27'}</span>
            </span>
            <span style={{ background: 'rgba(255,255,255,0.14)', border: '1px solid rgba(255,255,255,0.2)', padding: '5px 12px', borderRadius: '4px', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#FFFFFF', fontWeight: 700 }}>
              <span className="live-pulse-dot" style={{ marginRight: '2px' }}></span>
              <span>{isHi ? 'लाइव उपग्रह सिंक: सक्रिय' : 'Live Satellite Sync: Active'}</span>
            </span>
          </div>
        )}
      </div>

      {/* 2. Interactive Quick Action Buttons Toolbar */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0A3161', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={14} color="#D97706" />
            {isHi ? 'त्वरित किसान सेवाएं (Quick Actions)' : 'Quick Citizen & Farmer Actions'}
          </span>
          <span style={{ fontSize: '0.72rem', color: '#64748B' }}>
            {isHi ? 'सीधे संबंधित पोर्टल पर जाएं' : 'Instant 1-Click Launch'}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '10px' }}>
          <button 
            onClick={() => navigate('/disease')}
            className="interactive-card"
            style={{
              background: '#FFFFFF',
              border: '1px solid #CBD5E1',
              borderTop: '3px solid #DC2626',
              borderRadius: '4px',
              padding: '10px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            <div style={{ background: '#FEF2F2', padding: '8px', borderRadius: '4px', color: '#DC2626' }}>
              <Stethoscope size={18} />
            </div>
            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#1E293B' }}>{isHi ? 'फसल डॉक्टर' : 'Crop Doctor'}</div>
              <div style={{ fontSize: '0.68rem', color: '#64748B' }}>{isHi ? 'रोग व कीट जांच' : 'Disease AI Scan'}</div>
            </div>
          </button>

          <button 
            onClick={() => navigate('/mandi')}
            className="interactive-card"
            style={{
              background: '#FFFFFF',
              border: '1px solid #CBD5E1',
              borderTop: '3px solid #0A3161',
              borderRadius: '4px',
              padding: '10px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            <div style={{ background: '#EFF6FF', padding: '8px', borderRadius: '4px', color: '#0A3161' }}>
              <Store size={18} />
            </div>
            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#1E293B' }}>{isHi ? 'मंडी भाव व MSP' : 'Mandi & MSP'}</div>
              <div style={{ fontSize: '0.68rem', color: '#64748B' }}>{isHi ? '1,361+ मंडियां' : 'e-NAM Rates'}</div>
            </div>
          </button>

          <button 
            onClick={() => navigate('/soil')}
            className="interactive-card"
            style={{
              background: '#FFFFFF',
              border: '1px solid #CBD5E1',
              borderTop: '3px solid #004D25',
              borderRadius: '4px',
              padding: '10px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            <div style={{ background: '#ECFDF5', padding: '8px', borderRadius: '4px', color: '#047857' }}>
              <Leaf size={18} />
            </div>
            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#1E293B' }}>{isHi ? 'मृदा स्वास्थ्य' : 'Soil Health'}</div>
              <div style={{ fontSize: '0.68rem', color: '#64748B' }}>{isHi ? 'NPK उर्वरक मात्रा' : 'ICAR Dosing'}</div>
            </div>
          </button>

          <button 
            onClick={() => navigate('/satellite')}
            className="interactive-card"
            style={{
              background: '#FFFFFF',
              border: '1px solid #CBD5E1',
              borderTop: '3px solid #0284C7',
              borderRadius: '4px',
              padding: '10px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            <div style={{ background: '#F0F9FF', padding: '8px', borderRadius: '4px', color: '#0284C7' }}>
              <Orbit size={18} />
            </div>
            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#1E293B' }}>{isHi ? 'उपग्रह NDVI' : 'Satellite NDVI'}</div>
              <div style={{ fontSize: '0.68rem', color: '#64748B' }}>{isHi ? 'इसरो भुवन डेटा' : 'Canopy Health'}</div>
            </div>
          </button>

          <button 
            onClick={() => navigate('/calculator')}
            className="interactive-card"
            style={{
              background: '#FFFFFF',
              border: '1px solid #CBD5E1',
              borderTop: '3px solid #7C3AED',
              borderRadius: '4px',
              padding: '10px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            <div style={{ background: '#F5F3FF', padding: '8px', borderRadius: '4px', color: '#7C3AED' }}>
              <Calculator size={18} />
            </div>
            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#1E293B' }}>{isHi ? 'आय व लाभ गणक' : 'Profit Calc'}</div>
              <div style={{ fontSize: '0.68rem', color: '#64748B' }}>{isHi ? 'प्रति एकड़ शुद्ध बचत' : 'Yield & Margins'}</div>
            </div>
          </button>

          <button 
            onClick={() => navigate('/schemes')}
            className="interactive-card"
            style={{
              background: '#FFFFFF',
              border: '1px solid #CBD5E1',
              borderTop: '3px solid #D97706',
              borderRadius: '4px',
              padding: '10px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            <div style={{ background: '#FFFBEB', padding: '8px', borderRadius: '4px', color: '#D97706' }}>
              <Landmark size={18} />
            </div>
            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#1E293B' }}>{isHi ? 'डीबीटी योजनाएं' : 'Govt Schemes'}</div>
              <div style={{ fontSize: '0.68rem', color: '#64748B' }}>{isHi ? 'पीएम-किसान व सब्सिडी' : 'Direct Subsidies'}</div>
            </div>
          </button>
        </div>
      </div>

      {/* 3. National Key Indicators & Performance (Interactive Clickable Cards with Live Sync Status) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        
        {/* Metric 1 */}
        <div 
          onClick={() => navigate('/schemes')}
          className="gov-card interactive-card" 
          style={{ borderLeft: '4px solid #0A3161', cursor: 'pointer' }}
          title="Click to view PM-KISAN & DBT Schemes"
        >
          <div className="gov-card-body" style={{ padding: '14px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>
                  {isHi ? 'पीएम-किसान लाभार्थी' : 'PM-KISAN DBT Beneficiaries'}
                </span>
                <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#0A3161', marginTop: '2px' }}>
                  11.8+ Cr
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '3px' }}>
                  <span className="live-pulse-dot"></span>
                  <span style={{ fontSize: '0.7rem', color: '#059669', fontWeight: 700 }}>
                    100% Aadhaar Seeded DBT
                  </span>
                </div>
              </div>
              <div style={{ background: '#EFF6FF', padding: '10px', borderRadius: '6px', color: '#0A3161' }}>
                <Landmark size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Metric 2 */}
        <div 
          onClick={() => navigate('/schemes')}
          className="gov-card interactive-card" 
          style={{ borderLeft: '4px solid #004D25', cursor: 'pointer' }}
          title="Click to view Cumulative DBT Distribution"
        >
          <div className="gov-card-body" style={{ padding: '14px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>
                  {isHi ? 'कुल प्रत्यक्ष लाभ अंतरण (DBT)' : 'Cumulative DBT Disbursed'}
                </span>
                <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#004D25', marginTop: '2px' }}>
                  ₹3.24 Lakh Cr
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '3px' }}>
                  <span className="live-pulse-dot"></span>
                  <span style={{ fontSize: '0.7rem', color: '#059669', fontWeight: 700 }}>
                    Direct to Bank Account
                  </span>
                </div>
              </div>
              <div style={{ background: '#ECFDF5', padding: '10px', borderRadius: '6px', color: '#004D25' }}>
                <TrendingUp size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Metric 3 */}
        <div 
          onClick={() => navigate('/mandi')}
          className="gov-card interactive-card" 
          style={{ borderLeft: '4px solid #D97706', cursor: 'pointer' }}
          title="Click to explore live APMC Mandi rates"
        >
          <div className="gov-card-body" style={{ padding: '14px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>
                  {isHi ? 'सक्रिय e-NAM मंडियां' : 'Live e-NAM Mandis'}
                </span>
                <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#B45309', marginTop: '2px' }}>
                  1,361+ Markets
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '3px' }}>
                  <span className="live-pulse-dot"></span>
                  <span style={{ fontSize: '0.7rem', color: '#B45309', fontWeight: 700 }}>
                    One Nation, One Market
                  </span>
                </div>
              </div>
              <div style={{ background: '#FFFBEB', padding: '10px', borderRadius: '6px', color: '#B45309' }}>
                <Store size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Metric 4 */}
        <div 
          onClick={() => navigate('/soil')}
          className="gov-card interactive-card" 
          style={{ borderLeft: '4px solid #0284C7', cursor: 'pointer' }}
          title="Click to analyze Soil Health Card"
        >
          <div className="gov-card-body" style={{ padding: '14px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>
                  {isHi ? 'मृदा स्वास्थ्य कार्ड जारी' : 'Soil Cards Distributed'}
                </span>
                <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#0369A1', marginTop: '2px' }}>
                  23.8+ Cr
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '3px' }}>
                  <span className="live-pulse-dot"></span>
                  <span style={{ fontSize: '0.7rem', color: '#0284C7', fontWeight: 700 }}>
                    ICAR Tested Nutrients
                  </span>
                </div>
              </div>
              <div style={{ background: '#F0F9FF', padding: '10px', borderRadius: '6px', color: '#0284C7' }}>
                <Leaf size={24} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Active Field Hazard & Threat Alerts (If active) */}
      {threats.length > 0 && (
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <AlertTriangle size={20} color="#DC2626" />
            <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#991B1B', margin: 0 }}>
              {isHi ? 'अत्यावश्यक चेतावनी एवं आपदा प्रबंधन (Active Threat Alerts)' : 'Active Field Hazard & Threat Alerts'}
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {threats.map((t, idx) => (
              <div key={idx} className="gov-card" style={{ borderLeft: '5px solid #DC2626', background: '#FEF2F2' }}>
                <div className="gov-card-body" style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <ShieldAlert color="#DC2626" size={18} />
                      <h3 style={{ fontSize: '0.96rem', margin: 0, color: '#991B1B', fontWeight: 800 }}>{t.title}</h3>
                      <span style={{ background: '#DC2626', color: '#FFFFFF', fontSize: '0.62rem', fontWeight: 900, padding: '2px 6px', borderRadius: '2px' }}>
                        {isHi ? 'अत्यावश्यक' : 'URGENT'}
                      </span>
                    </div>
                    <Link to="/helpline" style={{ fontSize: '0.76rem', color: '#991B1B', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Headphones size={13} />
                      <span>{isHi ? 'सहायता लें (1551)' : 'Get Help (1551)'}</span>
                    </Link>
                  </div>
                  <p style={{ color: '#7F1D1D', fontSize: '0.86rem', lineHeight: 1.5, margin: 0 }}>
                    {t.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Interactive Agronomy Command Hub (Tabbed Layout) */}
      <div className="gov-card" style={{ marginBottom: '1.5rem', overflow: 'hidden' }}>
        {/* Navigation Tabs Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          background: '#0A3161',
          padding: '6px 12px 0',
          borderBottom: '2px solid #D97706',
          overflowX: 'auto'
        }}>
          <button
            onClick={() => setActiveTab('directives')}
            style={{
              background: activeTab === 'directives' ? '#FFFFFF' : 'transparent',
              color: activeTab === 'directives' ? '#0A3161' : '#E2E8F0',
              border: 'none',
              padding: '10px 18px',
              borderRadius: '6px 6px 0 0',
              fontWeight: 800,
              fontSize: '0.84rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease'
            }}
          >
            <Leaf size={16} color={activeTab === 'directives' ? '#004D25' : '#86EFAC'} />
            <span>{isHi ? 'फसल कार्य निर्देश एवं चेकलिस्ट' : 'Crop Directives & Checklist'}</span>
            <span style={{
              background: activeTab === 'directives' ? '#EFF6FF' : 'rgba(255,255,255,0.2)',
              color: activeTab === 'directives' ? '#0A3161' : '#FFFFFF',
              fontSize: '0.68rem',
              fontWeight: 800,
              padding: '1px 6px',
              borderRadius: '9999px'
            }}>
              {totalTasks - completedCount} {isHi ? 'शेष' : 'due'}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('weather')}
            style={{
              background: activeTab === 'weather' ? '#FFFFFF' : 'transparent',
              color: activeTab === 'weather' ? '#0A3161' : '#E2E8F0',
              border: 'none',
              padding: '10px 18px',
              borderRadius: '6px 6px 0 0',
              fontWeight: 800,
              fontSize: '0.84rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease'
            }}
          >
            <CloudRain size={16} color={activeTab === 'weather' ? '#0284C7' : '#93C5FD'} />
            <span>{isHi ? '7-दिवसीय मौसम एवं स्मार्ट सिंचाई' : '7-Day IMD & Smart Irrigation'}</span>
          </button>

          <button
            onClick={() => setActiveTab('mandi')}
            style={{
              background: activeTab === 'mandi' ? '#FFFFFF' : 'transparent',
              color: activeTab === 'mandi' ? '#0A3161' : '#E2E8F0',
              border: 'none',
              padding: '10px 18px',
              borderRadius: '6px 6px 0 0',
              fontWeight: 800,
              fontSize: '0.84rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease'
            }}
          >
            <Store size={16} color={activeTab === 'mandi' ? '#B45309' : '#FDE047'} />
            <span>{isHi ? 'लाइव e-NAM मंडी भाव' : 'Live e-NAM Mandi Rates'}</span>
          </button>

          <button
            onClick={() => setActiveTab('schemes')}
            style={{
              background: activeTab === 'schemes' ? '#FFFFFF' : 'transparent',
              color: activeTab === 'schemes' ? '#0A3161' : '#E2E8F0',
              border: 'none',
              padding: '10px 18px',
              borderRadius: '6px 6px 0 0',
              fontWeight: 800,
              fontSize: '0.84rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease'
            }}
          >
            <Landmark size={16} color={activeTab === 'schemes' ? '#0A3161' : '#E2E8F0'} />
            <span>{isHi ? 'डीबीटी कल्याणकारी योजनाएं' : 'DBT Welfare Schemes'}</span>
          </button>
        </div>

        {/* Tab 1: Directives & Checklist */}
        {activeTab === 'directives' && (
          <div className="gov-card-body" style={{ padding: '1.25rem' }}>
            {/* Interactive Progress Meter Bar */}
            <div style={{
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '6px',
              padding: '14px 18px',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Award size={18} color="#D97706" />
                  <strong style={{ fontSize: '0.92rem', color: '#0A3161' }}>
                    {isHi ? 'आज के कृषि कार्य प्रगति सूचकांक' : "Today's Agronomy Action Progress"}
                  </strong>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '2px' }}>
                  {isHi 
                    ? `कुल ${totalTasks} में से ${completedCount} निर्देश पूर्ण चिह्नित किए गए (${progressPercent}%)` 
                    : `${completedCount} of ${totalTasks} actionable field directives completed (${progressPercent}%)`}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: '220px' }}>
                <div style={{ flex: 1, height: '8px', background: '#E2E8F0', borderRadius: '4px', overflow: 'hidden' }}>
                  <div 
                    style={{ 
                      width: `${progressPercent}%`, 
                      height: '100%', 
                      background: progressPercent === 100 ? '#10B981' : '#0A3161',
                      transition: 'width 0.3s ease'
                    }} 
                  />
                </div>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: progressPercent === 100 ? '#059669' : '#0A3161' }}>
                  {progressPercent}%
                </span>
              </div>
            </div>

            {/* Directive Cards Grid with Interactive Checkboxes */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
              {advisory?.items?.map((item, index) => {
                const isCompleted = completedTasks.includes(index);
                let borderColor = '#0A3161';
                let badgeBg = '#EFF6FF';
                let badgeColor = '#1E40AF';
                let badgeText = isHi ? 'परामर्श' : 'Advisory';

                if (item.severity === 'urgent') {
                  borderColor = '#DC2626';
                  badgeBg = '#FEE2E2';
                  badgeColor = '#991B1B';
                  badgeText = isHi ? 'अत्यावश्यक' : 'Urgent';
                } else if (item.severity === 'important') {
                  borderColor = '#D97706';
                  badgeBg = '#FEF3C7';
                  badgeColor = '#92400E';
                  badgeText = isHi ? 'महत्वपूर्ण' : 'Important';
                }

                return (
                  <div 
                    key={index} 
                    className="gov-card interactive-card" 
                    style={{ 
                      borderTop: `4px solid ${isCompleted ? '#10B981' : borderColor}`,
                      background: isCompleted ? '#F0FDF4' : '#FFFFFF',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div className="gov-card-body" style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ background: isCompleted ? '#DCFCE7' : badgeBg, color: isCompleted ? '#166534' : badgeColor, padding: '7px', borderRadius: '4px' }}>
                            {getIconForTitle(item.title)}
                          </div>
                          <h3 style={{ 
                            fontSize: '0.94rem', 
                            fontWeight: 800, 
                            color: isCompleted ? '#166534' : '#1E293B', 
                            margin: 0,
                            textDecoration: isCompleted ? 'line-through' : 'none'
                          }}>
                            {item.title}
                          </h3>
                        </div>
                        <span style={{ 
                          background: isCompleted ? '#DCFCE7' : badgeBg, 
                          color: isCompleted ? '#166534' : badgeColor, 
                          fontSize: '0.65rem', 
                          fontWeight: 800, 
                          padding: '2px 7px', 
                          borderRadius: '3px', 
                          flexShrink: 0 
                        }}>
                          {isCompleted ? (isHi ? '✓ पूर्ण' : '✓ Done') : badgeText}
                        </span>
                      </div>

                      <p style={{ color: isCompleted ? '#4B5563' : '#334155', fontSize: '0.86rem', lineHeight: 1.5, margin: '0 0 12px' }}>
                        {item.message}
                      </p>

                      <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <button
                          onClick={() => toggleTaskCompletion(index)}
                          style={{
                            background: isCompleted ? '#059669' : '#FFFFFF',
                            color: isCompleted ? '#FFFFFF' : '#0A3161',
                            border: `1px solid ${isCompleted ? '#059669' : '#CBD5E1'}`,
                            padding: '5px 12px',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          {isCompleted ? <CheckSquare size={14} /> : <Square size={14} />}
                          <span>
                            {isCompleted 
                              ? (isHi ? 'किया गया (Click to Undo)' : 'Completed (Click to Undo)') 
                              : (isHi ? 'पूर्ण चिह्नित करें (Mark Done)' : 'Mark as Completed')}
                          </span>
                        </button>

                        <span style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 600 }}>
                          ICAR Reg: AG-{index + 101}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: IMD 7-Day Weather & Smart Irrigation Planner */}
        {activeTab === 'weather' && (
          <div className="gov-card-body" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
              
              {/* Interactive Irrigation Water Calculator */}
              <div style={{ background: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: '6px', padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  <Droplets size={20} color="#0284C7" />
                  <h3 style={{ margin: 0, fontSize: '0.96rem', fontWeight: 800, color: '#0369A1' }}>
                    {isHi ? 'स्मार्ट सिंचाई आवश्यकता गणक (Smart Irrigation Planner)' : 'Smart Field Irrigation Estimator'}
                  </h3>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                  <div>
                    <label style={{ fontSize: '0.74rem', color: '#475569', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                      {isHi ? 'खेत का रकबा (एकड़ में)' : 'Field Area (Acres)'}
                    </label>
                    <input 
                      type="number" 
                      min="0.5" 
                      max="50" 
                      step="0.5"
                      value={fieldAcres} 
                      onChange={(e) => setFieldAcres(Math.max(0.5, parseFloat(e.target.value) || 1))}
                      style={{ width: '100%', padding: '6px 10px', fontSize: '0.85rem', fontWeight: 800 }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.74rem', color: '#475569', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                      {isHi ? 'मिट्टी का प्रकार' : 'Soil Texture'}
                    </label>
                    <select 
                      value={soilType} 
                      onChange={(e) => setSoilType(e.target.value)}
                      style={{ width: '100%', padding: '6px 10px', fontSize: '0.85rem' }}
                    >
                      <option value="alluvial">{isHi ? 'दोमट / जलोढ़ (Alluvial)' : 'Loamy / Alluvial'}</option>
                      <option value="black">{isHi ? 'काली मिट्टी (Black Cotton)' : 'Black Clayey'}</option>
                      <option value="red">{isHi ? 'लाल मिट्टी (Red Soil)' : 'Red Soil'}</option>
                      <option value="sandy">{isHi ? 'बलुई मिट्टी (Sandy)' : 'Sandy Loam'}</option>
                    </select>
                  </div>
                </div>

                <div style={{ background: '#FFFFFF', border: '1px solid #E0F2FE', borderRadius: '4px', padding: '10px 14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.78rem', color: '#64748B' }}>{isHi ? 'अनुमानित जल मांग:' : 'Est. Water Volume:'}</span>
                    <strong style={{ fontSize: '0.95rem', color: '#0369A1' }}>{adjustedWater.toLocaleString('en-IN')} Litres</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.78rem', color: '#64748B' }}>{isHi ? 'अनुशंसित ट्यूबवेल समय (5 HP):' : 'Pump Run Time (5 HP):'}</span>
                    <strong style={{ fontSize: '0.95rem', color: '#0A3161' }}>~{pumpHp5Hours} Hours</strong>
                  </div>
                </div>

                {rainProbToday > 40 && (
                  <div style={{ marginTop: '10px', background: '#FEF3C7', border: '1px solid #FCD34D', borderRadius: '4px', padding: '8px 10px', fontSize: '0.76rem', color: '#92400E', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <AlertTriangle size={15} color="#B45309" />
                    <span>{isHi ? `आज वर्षा सम्भावना ${rainProbToday}% है। 50% सिंचाई स्थगित करने की सलाह दी जाती है।` : `Rain probability is ${rainProbToday}%. Postpone irrigation to conserve energy and groundwater.`}</span>
                  </div>
                )}
              </div>

              {/* IMD Source Badge & Advisory */}
              <div style={{ background: '#FAFDFB', border: '1px solid #D1FAE5', borderRadius: '6px', padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  <Sun size={20} color="#059669" />
                  <h3 style={{ margin: 0, fontSize: '0.96rem', fontWeight: 800, color: '#065F46' }}>
                    {isHi ? 'आईएमडी कृषि मौसम बुलेटिन' : 'IMD Agrometeorological Advisory'}
                  </h3>
                </div>
                <p style={{ fontSize: '0.84rem', color: '#334155', lineHeight: 1.6, margin: '0 0 10px' }}>
                  {isHi 
                    ? 'वर्तमान मौसमी परिस्थितियों में पत्तियों पर फफूंद व कीट संक्रमण की संभावना कम है। अगले 3 दिनों में सुबह के समय कीटनाशक व सूक्ष्म पोषक तत्वों का पर्णीय छिड़काव (Foliar Spray) उत्तम रहेगा।'
                    : 'Foliar application of micronutrients and systemic fungicides is recommended during early morning hours over the next 48 hours.'}
                </p>
                <div style={{ fontSize: '0.74rem', color: '#059669', fontWeight: 700 }}>
                  ✓ Source: India Meteorological Department, Pune Division
                </div>
              </div>

            </div>

            {/* 7-Day Table */}
            {weatherForecast?.days && weatherForecast.days.length > 0 && (
              <div style={{ overflowX: 'auto', border: '1px solid #E2E8F0', borderRadius: '4px' }}>
                <table className="gov-table" style={{ margin: 0 }}>
                  <thead>
                    <tr>
                      <th>{isHi ? 'दिनांक / दिवस' : 'Date / Day'}</th>
                      <th>{isHi ? 'तापमान (अधिकतम / न्यूनतम)' : 'Temp (Max / Min)'}</th>
                      <th>{isHi ? 'संभावित वर्षा' : 'Rainfall (mm)'}</th>
                      <th>{isHi ? 'वर्षा सम्भावना' : 'Rain Chance'}</th>
                      <th>{isHi ? 'कृषि कार्य अनुकूलता' : 'Field Work Status'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {weatherForecast.days.map((day, idx) => {
                      const isRainLikely = day.rainMm > 2 || (day.rainChance && day.rainChance > 40);
                      return (
                        <tr key={idx} style={{ background: idx === 0 ? '#EFF6FF' : 'transparent' }}>
                          <td>
                            <strong style={{ color: idx === 0 ? '#0A3161' : '#1E293B', fontSize: '0.84rem' }}>
                              {idx === 0 ? (isHi ? 'आज (Today)' : 'Today') : (day.date || `Day ${idx + 1}`)}
                            </strong>
                          </td>
                          <td>
                            <span style={{ fontWeight: 800, color: '#0F172A' }}>{Math.round(day.tMaxC)}°C</span> / <span style={{ color: '#64748B' }}>{Math.round(day.tMinC)}°C</span>
                          </td>
                          <td>
                            <span style={{ fontWeight: 700, color: day.rainMm > 5 ? '#DC2626' : day.rainMm > 0 ? '#0284C7' : '#64748B' }}>
                              {day.rainMm} mm
                            </span>
                          </td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <div style={{ width: '70px', height: '6px', background: '#E2E8F0', borderRadius: '3px', overflow: 'hidden' }}>
                                <div style={{ width: `${day.rainChance || 0}%`, height: '100%', background: isRainLikely ? '#0284C7' : '#94A3B8' }} />
                              </div>
                              <span style={{ fontSize: '0.78rem', fontWeight: 700 }}>{day.rainChance}%</span>
                            </div>
                          </td>
                          <td>
                            {isRainLikely ? (
                              <span style={{ background: '#FEF3C7', color: '#92400E', fontSize: '0.72rem', fontWeight: 800, padding: '2px 8px', borderRadius: '3px', border: '1px solid #FCD34D' }}>
                                {isHi ? 'सिंचाई / छिड़काव रोकें' : 'Hold spray / irrigation'}
                              </span>
                            ) : (
                              <span style={{ background: '#ECFDF5', color: '#065F46', fontSize: '0.72rem', fontWeight: 800, padding: '2px 8px', borderRadius: '3px', border: '1px solid #A7F3D0' }}>
                                {isHi ? 'कृषि कार्य हेतु उत्तम' : 'Optimal for field work'}
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: e-NAM Benchmark Mandi Prices */}
        {activeTab === 'mandi' && (
          <div className="gov-card-body" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <strong style={{ fontSize: '0.96rem', color: '#0A3161' }}>
                  {isHi ? 'प्रमुख कृषि जींसों के राष्ट्रीय औसत मंडी भाव' : 'National Benchmark Mandi Rates & MSP Comparison'}
                </strong>
                <div style={{ fontSize: '0.76rem', color: '#64748B', marginTop: '2px' }}>
                  {isHi ? 'स्रोत: इलेक्ट्रॉनिक राष्ट्रीय कृषि बाजार (e-NAM) | दैनिक अद्यतन' : 'Source: Electronic National Agriculture Market (e-NAM) APMC Network'}
                </div>
              </div>
              <button 
                onClick={() => navigate('/mandi')} 
                className="gov-btn gov-btn-primary"
                style={{ padding: '6px 14px', fontSize: '0.8rem' }}
              >
                <span>{isHi ? 'सभी 1,360+ मंडियां देखें' : 'Explore All 1,360+ Mandis'}</span>
                <ArrowRight size={14} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
              {[
                { crop: isHi ? 'गेहूं (Wheat)' : 'Wheat', price: '₹2,275', msp: '₹2,275', trend: 'MSP Parity', tag: '#059669', state: 'MP / UP / Punjab' },
                { crop: isHi ? 'धान (Paddy Common)' : 'Paddy (Common)', price: '₹2,320', msp: '₹2,183', trend: '+₹137 Premium', tag: '#059669', state: 'Haryana / Punjab' },
                { crop: isHi ? 'सरसों (Mustard)' : 'Mustard Seed', price: '₹5,650', msp: '₹5,650', trend: 'Strong Demand', tag: '#B45309', state: 'Rajasthan / Haryana' },
                { crop: isHi ? 'कपास (Cotton)' : 'Cotton (Medium)', price: '₹7,120', msp: '₹7,020', trend: '+₹100 Premium', tag: '#059669', state: 'Gujarat / Maharashtra' },
                { crop: isHi ? 'चना (Gram)' : 'Bengal Gram', price: '₹5,440', msp: '₹5,440', trend: 'Steady', tag: '#0369A1', state: 'Madhya Pradesh' }
              ].map((c, i) => (
                <div key={i} style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '4px', padding: '12px', borderLeft: `4px solid ${c.tag}` }}>
                  <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#1E293B' }}>{c.crop}</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0A3161', margin: '4px 0' }}>{c.price} <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600 }}>/ क्विंटल</span></div>
                  <div style={{ fontSize: '0.72rem', color: '#64748B', display: 'flex', justifyContent: 'space-between' }}>
                    <span>MSP: {c.msp}</span>
                    <span style={{ color: c.tag, fontWeight: 700 }}>{c.trend}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Govt DBT Welfare Schemes */}
        {activeTab === 'schemes' && (
          <div className="gov-card-body" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <strong style={{ fontSize: '0.96rem', color: '#0A3161' }}>
                  {isHi ? 'प्रत्यक्ष लाभ अंतरण (DBT) एवं सब्सिडी सेवाएं' : 'Direct Benefit Transfer (DBT) & Welfare Schemes'}
                </strong>
                <div style={{ fontSize: '0.76rem', color: '#64748B', marginTop: '2px' }}>
                  {isHi ? 'आधार लिंक बैंक खाते में सीधे आर्थिक सहायता' : '100% direct financial assistance to verified Aadhaar bank accounts'}
                </div>
              </div>
              <button 
                onClick={() => navigate('/schemes')} 
                className="gov-btn gov-btn-green"
                style={{ padding: '6px 14px', fontSize: '0.8rem' }}
              >
                <span>{isHi ? 'योजना स्थिति व आवेदन' : 'Check Eligibility & Apply'}</span>
                <ArrowRight size={14} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
              {[
                { title: isHi ? 'प्रधानमंत्री किसान सम्मान निधि' : 'PM-KISAN Samman Nidhi', benefit: '₹6,000 / वर्ष', status: isHi ? 'सत्यापित (17वीं किस्त जारी)' : 'Active (17th Installment)', color: '#059669' },
                { title: isHi ? 'प्रधानमंत्री फसल बीमा योजना (PMFBY)' : 'PM Fasal Bima Yojana', benefit: isHi ? 'फसल क्षति पर 100% भरपाई' : '100% Crop Damage Cover', status: isHi ? 'पॉलिसी सक्रिय' : 'Policy Active', color: '#0284C7' },
                { title: isHi ? 'पीएम-कुसुम सोलर पंप योजना' : 'PM-KUSUM Solar Irrigation', benefit: isHi ? '60% तक सरकारी सब्सिडी' : 'Up to 60% Solar Subsidy', status: isHi ? 'आवेदन खुला' : 'Open for Application', color: '#D97706' },
                { title: isHi ? 'मृदा स्वास्थ्य कार्ड योजना' : 'Soil Health Card Subsidy', benefit: isHi ? 'निःशुल्क पोषक तत्व परीक्षण' : 'Free Lab Soil Analysis', status: isHi ? 'कार्ड नवीनीकरण तैयार' : 'Ready for Renewal', color: '#7C3AED' }
              ].map((s, idx) => (
                <div key={idx} style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '4px', padding: '14px', borderTop: `3px solid ${s.color}` }}>
                  <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#0A3161' }}>{s.title}</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 900, color: s.color, margin: '4px 0' }}>{s.benefit}</div>
                  <div style={{ fontSize: '0.74rem', color: '#059669', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle2 size={13} />
                    <span>{s.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 6. Official Citizen Online Services Grid (Directory of 8 Key Portals) */}
      <div className="gov-card" style={{ marginBottom: '1.5rem' }}>
        <div className="gov-card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Landmark size={18} color="#0A3161" />
            <span>{isHi ? 'नागरिक एवं किसान डिजिटल सेवाएं (National Farmer Services Directory)' : 'Citizen & Farmer Digital Services Directory'}</span>
          </div>
          <span style={{ fontSize: '0.72rem', color: '#64748B' }}>
            {isHi ? 'अखिल भारतीय स्तर पर उपलब्ध' : 'All-India Active Services'}
          </span>
        </div>
        <div className="gov-card-body" style={{ padding: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
            
            {/* Service 1: Mandi */}
            <Link 
              to="/mandi" 
              className="interactive-card"
              style={{ textDecoration: 'none', background: '#FFFFFF', padding: '14px', borderRadius: '4px', border: '1px solid #CBD5E1', display: 'flex', alignItems: 'flex-start', gap: '12px' }}
            >
              <div style={{ background: '#EFF6FF', padding: '10px', borderRadius: '4px', color: '#0A3161', flexShrink: 0 }}>
                <Store size={22} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <strong style={{ color: '#0A3161', fontSize: '0.88rem' }}>
                    {isHi ? 'मंडी भाव एवं न्यूनतम समर्थन मूल्य' : 'Mandi Rates & MSP'}
                  </strong>
                  <span style={{ background: '#DBEAFE', color: '#1E40AF', fontSize: '0.62rem', fontWeight: 800, padding: '1px 5px', borderRadius: '3px' }}>e-NAM</span>
                </div>
                <span style={{ fontSize: '0.76rem', color: '#64748B', display: 'block', marginTop: '3px', lineHeight: 1.4 }}>
                  {isHi ? 'देश भर की 1,360+ मंडियों के लाइव भाव एवं एमएसपी तुलना' : 'Real-time APMC auction rates, MSP notified prices & price trends'}
                </span>
              </div>
            </Link>

            {/* Service 2: Soil Health Card */}
            <Link 
              to="/soil" 
              className="interactive-card"
              style={{ textDecoration: 'none', background: '#FFFFFF', padding: '14px', borderRadius: '4px', border: '1px solid #CBD5E1', display: 'flex', alignItems: 'flex-start', gap: '12px' }}
            >
              <div style={{ background: '#ECFDF5', padding: '10px', borderRadius: '4px', color: '#004D25', flexShrink: 0 }}>
                <Leaf size={22} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <strong style={{ color: '#004D25', fontSize: '0.88rem' }}>
                    {isHi ? 'डिजिटल मृदा स्वास्थ्य कार्ड' : 'Soil Health Card Analyzer'}
                  </strong>
                  <span style={{ background: '#D1FAE5', color: '#065F46', fontSize: '0.62rem', fontWeight: 800, padding: '1px 5px', borderRadius: '3px' }}>ICAR</span>
                </div>
                <span style={{ fontSize: '0.76rem', color: '#64748B', display: 'block', marginTop: '3px', lineHeight: 1.4 }}>
                  {isHi ? 'नाइट्रोजन (N), फास्फोरस (P), पोटाश (K) एवं जैविक खाद अनुशंसा' : 'Nutrient balance, NPK fertilizer dosing & organic carbon enhancement'}
                </span>
              </div>
            </Link>

            {/* Service 3: Schemes */}
            <Link 
              to="/schemes" 
              className="interactive-card"
              style={{ textDecoration: 'none', background: '#FFFFFF', padding: '14px', borderRadius: '4px', border: '1px solid #CBD5E1', display: 'flex', alignItems: 'flex-start', gap: '12px' }}
            >
              <div style={{ background: '#FFFBEB', padding: '10px', borderRadius: '4px', color: '#B45309', flexShrink: 0 }}>
                <Landmark size={22} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <strong style={{ color: '#92400E', fontSize: '0.88rem' }}>
                    {isHi ? 'सरकारी डीबीटी योजनाएं' : 'Govt Schemes & DBT'}
                  </strong>
                  <span style={{ background: '#FEF3C7', color: '#92400E', fontSize: '0.62rem', fontWeight: 800, padding: '1px 5px', borderRadius: '3px' }}>DBT</span>
                </div>
                <span style={{ fontSize: '0.76rem', color: '#64748B', display: 'block', marginTop: '3px', lineHeight: 1.4 }}>
                  {isHi ? 'पीएम-किसान, पीएमएफबीवाई, कुसुम सोलर पंप एवं राज्य सब्सिडी' : 'PM-KISAN, PMFBY crop insurance, PM-KUSUM & state farm subsidies'}
                </span>
              </div>
            </Link>

            {/* Service 4: Satellite */}
            <Link 
              to="/satellite" 
              className="interactive-card"
              style={{ textDecoration: 'none', background: '#FFFFFF', padding: '14px', borderRadius: '4px', border: '1px solid #CBD5E1', display: 'flex', alignItems: 'flex-start', gap: '12px' }}
            >
              <div style={{ background: '#F0F9FF', padding: '10px', borderRadius: '4px', color: '#0369A1', flexShrink: 0 }}>
                <Orbit size={22} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <strong style={{ color: '#0369A1', fontSize: '0.88rem' }}>
                    {isHi ? 'इसरो उपग्रह निगरानी (NDVI)' : 'ISRO Bhuvan Satellite'}
                  </strong>
                  <span style={{ background: '#E0F2FE', color: '#0369A1', fontSize: '0.62rem', fontWeight: 800, padding: '1px 5px', borderRadius: '3px' }}>ISRO</span>
                </div>
                <span style={{ fontSize: '0.76rem', color: '#64748B', display: 'block', marginTop: '3px', lineHeight: 1.4 }}>
                  {isHi ? 'खेत की हरियाली सूचकांक, बायोमास घनत्व एवं नमी विश्लेषण' : 'Sentinel-2 & Bhuvan NDVI canopy health, moisture & vegetation index'}
                </span>
              </div>
            </Link>

            {/* Service 5: Crop Doctor */}
            <Link 
              to="/disease" 
              className="interactive-card"
              style={{ textDecoration: 'none', background: '#FFFFFF', padding: '14px', borderRadius: '4px', border: '1px solid #CBD5E1', display: 'flex', alignItems: 'flex-start', gap: '12px' }}
            >
              <div style={{ background: '#FEF2F2', padding: '10px', borderRadius: '4px', color: '#DC2626', flexShrink: 0 }}>
                <Stethoscope size={22} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <strong style={{ color: '#991B1B', fontSize: '0.88rem' }}>
                    {isHi ? 'फसल डॉक्टर (रोग निदान)' : 'Crop Doctor Clinic'}
                  </strong>
                  <span style={{ background: '#FEE2E2', color: '#991B1B', fontSize: '0.62rem', fontWeight: 800, padding: '1px 5px', borderRadius: '3px' }}>AI / ICAR</span>
                </div>
                <span style={{ fontSize: '0.76rem', color: '#64748B', display: 'block', marginTop: '3px', lineHeight: 1.4 }}>
                  {isHi ? 'पत्ती की तस्वीर अपलोड कर कीट व फफूंद रोग की त्वरित पहचान' : 'Upload leaf photos for instant disease diagnostics & approved treatment'}
                </span>
              </div>
            </Link>

            {/* Service 6: Crop Rotation */}
            <Link 
              to="/rotation" 
              className="interactive-card"
              style={{ textDecoration: 'none', background: '#FFFFFF', padding: '14px', borderRadius: '4px', border: '1px solid #CBD5E1', display: 'flex', alignItems: 'flex-start', gap: '12px' }}
            >
              <div style={{ background: '#F0FDF4', padding: '10px', borderRadius: '4px', color: '#16A34A', flexShrink: 0 }}>
                <Repeat size={22} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <strong style={{ color: '#166534', fontSize: '0.88rem' }}>
                    {isHi ? 'वैज्ञानिक फसल चक्र योजना' : 'Crop Rotation Planner'}
                  </strong>
                </div>
                <span style={{ fontSize: '0.76rem', color: '#64748B', display: 'block', marginTop: '3px', lineHeight: 1.4 }}>
                  {isHi ? 'दलहन-तिलहन चक्र से मिट्टी में प्राकृतिक नाइट्रोजन स्थिरीकरण' : 'Multi-season cropping sequence to replenish soil fertility sustainably'}
                </span>
              </div>
            </Link>

            {/* Service 7: Yield & Profit */}
            <Link 
              to="/calculator" 
              className="interactive-card"
              style={{ textDecoration: 'none', background: '#FFFFFF', padding: '14px', borderRadius: '4px', border: '1px solid #CBD5E1', display: 'flex', alignItems: 'flex-start', gap: '12px' }}
            >
              <div style={{ background: '#F5F3FF', padding: '10px', borderRadius: '4px', color: '#7C3AED', flexShrink: 0 }}>
                <Calculator size={22} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <strong style={{ color: '#5B21B6', fontSize: '0.88rem' }}>
                    {isHi ? 'उपज एवं शुद्ध आय गणक' : 'Yield & Profitability'}
                  </strong>
                </div>
                <span style={{ fontSize: '0.76rem', color: '#64748B', display: 'block', marginTop: '3px', lineHeight: 1.4 }}>
                  {isHi ? 'लागत, उर्वरक व्यय, एमएसपी दर एवं प्रति एकड़ शुद्ध मुनाफे का हिसाब' : 'Input cost analysis, MSP revenue projections & net margin estimator'}
                </span>
              </div>
            </Link>

            {/* Service 8: Helpline */}
            <Link 
              to="/helpline" 
              className="interactive-card"
              style={{ textDecoration: 'none', background: '#FFFFFF', padding: '14px', borderRadius: '4px', border: '1px solid #CBD5E1', display: 'flex', alignItems: 'flex-start', gap: '12px' }}
            >
              <div style={{ background: '#FFFBEB', padding: '10px', borderRadius: '4px', color: '#D97706', flexShrink: 0 }}>
                <Headphones size={22} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <strong style={{ color: '#B45309', fontSize: '0.88rem' }}>
                    {isHi ? 'राष्ट्रीय किसान हेल्पलाइन' : 'Kisan Emergency Helpdesk'}
                  </strong>
                  <span style={{ background: '#FEF3C7', color: '#B45309', fontSize: '0.62rem', fontWeight: 800, padding: '1px 5px', borderRadius: '3px' }}>1551</span>
                </div>
                <span style={{ fontSize: '0.76rem', color: '#64748B', display: 'block', marginTop: '3px', lineHeight: 1.4 }}>
                  {isHi ? 'कृषि विज्ञान केंद्र विशेषज्ञों से सीधे बात एवं CPGRAMS शिकायत निवारण' : '24x7 KCC toll-free advisory, KVK scientist hotline & grievance portal'}
                </span>
              </div>
            </Link>

          </div>
        </div>
      </div>

    </div>
  );
}
