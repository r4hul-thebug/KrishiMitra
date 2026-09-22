import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  PhoneCall, Globe, Eye, User, LogOut, ChevronDown, CheckCircle2,
  Sparkles, CloudSun, MapPin
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import ProfileModal from './ProfileModal';
import axios from 'axios';
import { API_URL } from '../config';

export default function GovtHeader({ token, setToken }) {
  const { currentLang, setCurrentLang } = useLanguage();
  const isHi = currentLang === 'hi';
  const navigate = useNavigate();
  const location = useLocation();

  const [fontSizeLevel, setFontSizeLevel] = useState(0); // -1, 0, 1
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [isFarmerMenuOpen, setIsFarmerMenuOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const isAuthenticated = Boolean(token || localStorage.getItem('krishimitraaz_token'));
  const farmerId = localStorage.getItem('krishimitraaz_farmer_id');
  const [farmerData, setFarmerData] = useState({ name: 'Farmer', landAcres: 2.5, state: 'Punjab' });

  useEffect(() => {
    if (isAuthenticated && farmerId) {
      axios.get(`${API_URL}/farmers/${farmerId}`)
        .then(res => {
          if (res.data) setFarmerData(res.data);
        })
        .catch(() => {});
    }
  }, [farmerId, isAuthenticated]);

  const handleSignOut = () => {
    localStorage.removeItem('krishimitraaz_token');
    localStorage.removeItem('krishimitraaz_farmer_id');
    localStorage.removeItem('krishimitraaz_farmer_state');
    if (setToken) setToken(null);
    setIsFarmerMenuOpen(false);
    setIsProfileModalOpen(false);
    navigate('/login');
  };

  const handleBrandClick = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      if (location.pathname === '/login') {
        return;
      }
      navigate('/dashboard');
    }
  };

  const changeFontSize = (delta) => {
    let next = 0;
    if (delta === 0) next = 0;
    else next = Math.max(-1, Math.min(1, fontSizeLevel + delta));
    setFontSizeLevel(next);
    const root = document.documentElement;
    if (next === -1) root.style.fontSize = '14.5px';
    else if (next === 1) root.style.fontSize = '17.5px';
    else root.style.fontSize = '16px';
  };

  const toggleContrast = () => {
    const next = !isHighContrast;
    setIsHighContrast(next);
    if (next) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  };

  const toggleLanguage = () => {
    const nextLang = currentLang === 'hi' ? 'en' : 'hi';
    setCurrentLang(nextLang);
    localStorage.setItem('krishimitraaz_lang', nextLang);
  };

  // Determine current active section for breadcrumb
  const getSectionTitle = () => {
    const path = location.pathname;
    if (path.includes('dashboard')) return isHi ? 'कृषि डैशबोर्ड' : 'Agronomy Dashboard';
    if (path.includes('mandi')) return isHi ? 'मंडी भाव एवं MSP' : 'Mandi Rates & MSP';
    if (path.includes('satellite')) return isHi ? 'इसरो उपग्रह निगरानी' : 'ISRO Satellite Telemetry';
    if (path.includes('disease')) return isHi ? 'फसल डॉक्टर (रोग निदान)' : 'AI Crop Doctor';
    if (path.includes('soil')) return isHi ? 'मृदा स्वास्थ्य कार्ड' : 'Soil Health Card';
    if (path.includes('calculator')) return isHi ? 'उपज एवं आय गणक' : 'Yield & Profit Calculator';
    if (path.includes('rotation')) return isHi ? 'फसल चक्र योजना' : 'Crop Rotation Planner';
    if (path.includes('schemes')) return isHi ? 'सरकारी योजनाएं (DBT)' : 'Govt Schemes & DBT';
    if (path.includes('suggestions')) return isHi ? 'फसल परामर्श' : 'Crop Suitability';
    if (path.includes('helpline')) return isHi ? 'किसान हेल्पलाइन 1551' : 'Kisan Emergency Help';
    return isHi ? 'स्मार्ट फसल सलाहकार' : 'Crop Advisory';
  };

  return (
    <header 
      className="govt-header-root no-print" 
      style={{ 
        width: '100%', 
        position: 'sticky', 
        top: 0, 
        zIndex: 100, 
        background: '#FFFFFF', 
        borderBottom: '1px solid #E2E8F0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)' 
      }}
    >
      {/* 1. Subtle Aesthetic Tricolor Accent (2px) */}
      <div style={{ height: '2.5px', width: '100%', display: 'flex' }}>
        <div style={{ flex: 1, background: '#F59E0B' }}></div>
        <div style={{ flex: 1, background: '#FFFFFF' }}></div>
        <div style={{ flex: 1, background: '#10B981' }}></div>
      </div>

      {/* 2. Sleek, Single-Row Top Bar (52px) */}
      <div style={{
        maxWidth: '100%',
        margin: '0 auto',
        padding: '0 18px',
        height: '52px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '14px'
      }}>
        {/* Left: KrishiMitra Brand Identity & Section Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0 }}>
          <div 
            onClick={handleBrandClick}
            style={{ display: 'flex', alignItems: 'center', gap: '9px', cursor: 'pointer', textDecoration: 'none', flexShrink: 0 }}
            title="KrishiMitraaz - Smart Crop Advisory Platform"
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
              alt="KrishiMitraaz Emblem" 
              style={{ 
                height: '34px', 
                width: '34px', 
                borderRadius: '50%',
                boxShadow: '0 2px 4px rgba(21, 128, 61, 0.18)',
                flexShrink: 0,
                objectFit: 'contain'
              }}
            />
            <div style={{ display: 'inline-flex', alignItems: 'baseline' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 900, letterSpacing: '-0.02em', lineHeight: 1 }}>
                <span style={{ color: '#15803D' }}>{isHi ? 'कृषि' : 'Krishi'}</span>
                <span style={{ color: '#0284C7' }}>{isHi ? 'मित्रा' : 'Mitra'}</span>
                <span style={{ color: '#F59E0B' }}>{isHi ? 'ज़' : 'az'}</span>
              </span>
            </div>
          </div>

          {/* Vertical Separator */}
          <div style={{ height: '22px', width: '1px', background: '#E2E8F0', flexShrink: 0 }} />

          {/* Current Page Context Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
            <span style={{ 
              fontSize: '0.82rem', 
              fontWeight: 700, 
              color: '#1E293B',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {getSectionTitle()}
            </span>
            <span style={{
              background: '#ECFDF5',
              color: '#047857',
              border: '1px solid #A7F3D0',
              fontSize: '0.62rem',
              fontWeight: 800,
              padding: '1px 6px',
              borderRadius: '9999px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '3px',
              flexShrink: 0
            }}>
              <Sparkles size={10} color="#059669" />
              <span>AI Active</span>
            </span>
          </div>
        </div>

        {/* Right: Live Telemetry, Toll-Free Helpline, Language & Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          {/* Live Agromet Quick Weather Badge */}
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px', 
              background: '#F0FDF4', 
              border: '1px solid #BBF7D0', 
              color: '#166534', 
              padding: '3px 9px', 
              borderRadius: '4px',
              fontSize: '0.72rem',
              fontWeight: 700
            }}
            className="hidden sm:flex"
            title="Live IMD Agromet Advisory Sync"
          >
            <CloudSun size={14} color="#15803D" />
            <span>{isHi ? 'मौसम: 28°C • अनुकूल' : 'Weather: 28°C • Clear'}</span>
          </div>

          {/* 24x7 Kisan Helpline Badge */}
          <a 
            href="tel:18001801551" 
            title="Kisan Call Centre 24x7 Toll Free Support"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '4px', 
              background: '#FFFBEB', 
              border: '1px solid #FCD34D',
              color: '#B45309', 
              padding: '3px 8px', 
              borderRadius: '4px', 
              fontSize: '0.72rem', 
              fontWeight: 800,
              textDecoration: 'none'
            }}
            className="hidden md:flex"
          >
            <PhoneCall size={12} color="#D97706" />
            <span>1800-180-1551</span>
          </a>

          {/* Accessibility Controls: Font Resizer */}
          <div style={{ display: 'flex', alignItems: 'center', background: '#F1F5F9', border: '1px solid #E2E8F0', borderRadius: '4px', padding: '1px 3px', gap: '2px' }}>
            <button 
              onClick={() => changeFontSize(-1)}
              style={{ background: 'transparent', border: 'none', color: '#475569', cursor: 'pointer', fontSize: '0.68rem', padding: '2px 4px', fontWeight: fontSizeLevel === -1 ? 800 : 500 }}
              title="Decrease Font Size"
            >
              A-
            </button>
            <button 
              onClick={() => changeFontSize(0)}
              style={{ background: 'transparent', border: 'none', color: '#0F172A', cursor: 'pointer', fontSize: '0.72rem', padding: '2px 4px', fontWeight: fontSizeLevel === 0 ? 800 : 500 }}
              title="Reset Font Size"
            >
              A
            </button>
            <button 
              onClick={() => changeFontSize(1)}
              style={{ background: 'transparent', border: 'none', color: '#475569', cursor: 'pointer', fontSize: '0.76rem', padding: '2px 4px', fontWeight: fontSizeLevel === 1 ? 800 : 500 }}
              title="Increase Font Size"
            >
              A+
            </button>
          </div>

          {/* Contrast Mode Toggle */}
          <button
            onClick={toggleContrast}
            style={{
              background: isHighContrast ? '#000000' : '#F8FAFC',
              color: isHighContrast ? '#FFFF00' : '#475569',
              border: '1px solid #CBD5E1',
              padding: '3px 7px',
              borderRadius: '4px',
              fontSize: '0.7rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
            title="Toggle High Contrast Mode"
          >
            <Eye size={12} />
            <span className="hidden sm:inline">{isHighContrast ? 'Standard' : 'Contrast'}</span>
          </button>

          {/* Bilingual Switcher: English / हिन्दी */}
          <button
            onClick={toggleLanguage}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              background: '#0B3B60',
              color: '#FFFFFF',
              border: 'none',
              padding: '3px 8px',
              borderRadius: '4px',
              fontSize: '0.72rem',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 1px 2px rgba(11, 59, 96, 0.2)'
            }}
            title="Switch Language / भाषा बदलें"
          >
            <Globe size={12} />
            <span>{isHi ? 'English' : 'हिन्दी'}</span>
          </button>

          {/* Farmer Profile Quick Pill & Dropdown (When Authenticated) OR Sign In Button */}
          {isAuthenticated ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setIsFarmerMenuOpen(!isFarmerMenuOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '7px',
                  background: '#F0F9FF',
                  border: '1px solid #BAE6FD',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
                title="Farmer Profile / किसान खाता"
              >
                <div style={{ 
                  width: '26px', 
                  height: '26px', 
                  borderRadius: '50%', 
                  background: '#0284C7', 
                  color: '#FFFFFF', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontWeight: 800, 
                  fontSize: '0.75rem' 
                }}>
                  <User size={14} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <span style={{ fontSize: '0.76rem', fontWeight: 800, color: '#0369A1' }}>
                      {farmerData.name || 'Farmer'}
                    </span>
                    <ChevronDown size={11} color="#0284C7" />
                  </div>
                </div>
              </button>

              {/* Dropdown Menu */}
              {isFarmerMenuOpen && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: '108%',
                  background: '#FFFFFF',
                  border: '1px solid #CBD5E1',
                  borderRadius: '6px',
                  boxShadow: '0 10px 20px -3px rgba(0,0,0,0.12)',
                  width: '230px',
                  zIndex: 200,
                  overflow: 'hidden'
                }}>
                  <div style={{ padding: '10px 12px', background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0F172A' }}>{farmerData.name}</div>
                    <div style={{ fontSize: '0.7rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                      <MapPin size={11} color="#0284C7" />
                      <span>{farmerData.village ? `${farmerData.village}, ${farmerData.state}` : `State: ${farmerData.state || 'Punjab'}`}</span>
                    </div>
                    <div style={{ fontSize: '0.68rem', color: '#059669', fontWeight: 700, marginTop: '4px' }}>
                      ✓ Soil Health Card & Aadhaar Linked
                    </div>
                  </div>

                  <div style={{ padding: '4px 0' }}>
                    <button
                      onClick={() => { setIsProfileModalOpen(true); setIsFarmerMenuOpen(false); }}
                      style={{ width: '100%', padding: '8px 12px', background: 'none', border: 'none', textAlign: 'left', fontSize: '0.78rem', color: '#334155', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#F0F9FF'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                    >
                      <User size={14} color="#0284C7" />
                      <span>{isHi ? 'किसान प्रोफ़ाइल एवं भूमि रिकॉर्ड' : 'Farmer Profile & Farm Records'}</span>
                    </button>

                    <button
                      onClick={handleSignOut}
                      style={{ width: '100%', padding: '8px 12px', background: 'none', border: 'none', textAlign: 'left', fontSize: '0.78rem', color: '#DC2626', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', borderTop: '1px solid #F1F5F9' }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#FEF2F2'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                    >
                      <LogOut size={14} />
                      <span>{isHi ? 'लॉगआउट / बाहर निकलें' : 'Sign Out'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => navigate('/login')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                background: '#047857',
                color: '#FFFFFF',
                border: 'none',
                padding: '4px 10px',
                borderRadius: '4px',
                fontSize: '0.75rem',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 1px 3px rgba(4, 120, 87, 0.25)'
              }}
              title="Farmer Login / किसान लॉगिन"
            >
              <User size={13} />
              <span>{isHi ? 'साइन इन' : 'Sign In'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Farmer Profile Modal Dialog */}
      {isProfileModalOpen && (
        <ProfileModal 
          isOpen={isProfileModalOpen} 
          onClose={() => setIsProfileModalOpen(false)} 
          farmerData={farmerData}
          onLogout={handleSignOut}
        />
      )}
    </header>
  );
}
