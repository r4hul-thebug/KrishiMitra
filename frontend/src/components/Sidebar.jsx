import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, Store, Orbit, Repeat, Stethoscope, 
  Calculator, Landmark, Lightbulb, FlaskConical, Headphones,
  ChevronLeft, ChevronRight, LogOut, LogIn, ShieldCheck, PhoneCall
} from 'lucide-react';
import axios from 'axios';
import '../index.css';
import { API_URL } from '../config';
import ProfileModal from './ProfileModal';
import { useLanguage } from '../contexts/LanguageContext';

export default function Sidebar({ token, setToken, isCollapsed, setIsCollapsed }) {
  const { currentLang } = useLanguage();
  const isHi = currentLang === 'hi';
  const location = useLocation();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [farmerData, setFarmerData] = useState({ name: 'Farmer', locationStr: 'Detecting location...' });
  
  const farmerId = localStorage.getItem('krishimitraaz_farmer_id') || 'demo-farmer-001';

  useEffect(() => {
    if (!localStorage.getItem('krishimitraaz_farmer_id')) {
      localStorage.setItem('krishimitraaz_farmer_id', 'demo-farmer-001');
    }

    const fetchFarmer = () => {
      axios.get(`${API_URL}/farmers/${farmerId}`)
        .then(res => {
          const f = res.data;
          let loc = '';
          if (f.village && f.state) loc = `${f.village}, ${f.state}`;
          else if (f.location?.lat && f.location?.lon) loc = `Lat: ${Number(f.location.lat).toFixed(2)}, Lon: ${Number(f.location.lon).toFixed(2)}`;
          if (f.state) {
            localStorage.setItem('krishimitraaz_farmer_state', f.state);
          }
          setFarmerData(prev => ({ ...prev, ...f, locationStr: loc || prev.locationStr || 'Unknown Location' }));
        })
        .catch(err => console.error('Failed to load farmer info', err));
    };

    fetchFarmer();
  }, [farmerId]);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem('krishimitraaz_token');
    localStorage.removeItem('krishimitraaz_farmer_id');
    localStorage.removeItem('krishimitraaz_farmer_state');
    if (setToken) setToken(null);
    setIsProfileOpen(false);
    navigate('/login', { replace: true });
  };

  const navItems = [
    { path: '/dashboard', icon: <Home size={18} />, labelEn: 'Agronomy Dashboard', labelHi: 'डैशबोर्ड' },
    { path: '/mandi', icon: <Store size={18} />, labelEn: 'Mandi Rates & MSP', labelHi: 'मंडी भाव एवं MSP', badge: 'e-NAM' },
    { path: '/soil', icon: <FlaskConical size={18} />, labelEn: 'Soil Health Card', labelHi: 'मृदा स्वास्थ्य कार्ड', badge: 'ICAR' },
    { path: '/schemes', icon: <Landmark size={18} />, labelEn: 'Govt Schemes & DBT', labelHi: 'सरकारी योजनाएं (DBT)', badge: 'DBT' },
    { path: '/satellite', icon: <Orbit size={18} />, labelEn: 'Satellite NDVI Monitor', labelHi: 'उपग्रह फसल निगरानी', badge: 'ISRO' },
    { path: '/disease', icon: <Stethoscope size={18} />, labelEn: 'Crop Doctor (Diagnosis)', labelHi: 'फसल डॉक्टर (रोग निदान)' },
    { path: '/rotation', icon: <Repeat size={18} />, labelEn: 'Scientific Crop Rotation', labelHi: 'फसल चक्र योजना' },
    { path: '/calculator', icon: <Calculator size={18} />, labelEn: 'Yield & Profit Calculator', labelHi: 'उपज एवं आय गणक' },
    { path: '/suggestions', icon: <Lightbulb size={18} />, labelEn: 'Crop Suitability Advice', labelHi: 'फसल उपयुक्तता' },
    { path: '/helpline', icon: <Headphones size={18} />, labelEn: 'Kisan Emergency Desk', labelHi: 'किसान सहायता केंद्र', badge: '1551' }
  ];

  return (
    <>
      <aside 
        className={`govt-sidebar ${isCollapsed ? 'collapsed' : 'expanded'} no-print`}
        style={{
          width: isCollapsed ? '64px' : '260px',
          minWidth: isCollapsed ? '64px' : '260px',
          background: '#FFFFFF',
          borderRight: '1px solid #CBD5E1',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          transition: 'width 0.2s ease, min-width 0.2s ease',
          height: 'calc(100vh - 54.5px)',
          position: 'sticky',
          top: '54.5px',
          zIndex: 90,
          color: '#0F172A',
          boxShadow: '1px 0 3px rgba(0,0,0,0.04)'
        }}
      >
        {/* Top: Section Header & Collapse Toggle */}
        <div>
          <div style={{
            padding: isCollapsed ? '10px 6px' : '10px 14px',
            background: '#0F172A',
            color: '#FFFFFF',
            borderBottom: '2px solid #10B981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: isCollapsed ? 'center' : 'space-between'
          }}>
            {!isCollapsed && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={16} color="#34D399" />
                <span style={{ fontSize: '0.74rem', fontWeight: 800, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  {isHi ? 'कृषि सेवाएं एवं परामर्श' : 'FARMER ADVISORY'}
                </span>
              </div>
            )}

            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                border: 'none',
                color: '#FFFFFF',
                padding: '4px',
                borderRadius: '3px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
            </button>
          </div>

          {/* Farmer Identity Registry Strip */}
          {!isCollapsed && (
            <div style={{
              padding: '10px 14px',
              background: '#F8FAFC',
              borderBottom: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600 }}>
                  {isHi ? 'पंजीकृत किसान' : 'Registered Farmer'}
                </div>
                <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0A3161' }}>
                  {farmerData.name}
                </div>
                <div style={{ fontSize: '0.68rem', color: '#059669', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '3px' }}>
                  ✓ {isHi ? 'ई-केवाईसी सत्यापित' : 'Aadhaar Verified'}
                </div>
              </div>
              <button
                onClick={() => setIsProfileOpen(true)}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #CBD5E1',
                  color: '#0A3161',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: '3px',
                  cursor: 'pointer'
                }}
              >
                {isHi ? 'विवरण' : 'Details'}
              </button>
            </div>
          )}

          {/* Navigation Links */}
          <nav style={{ padding: '6px 0', overflowY: 'auto', maxHeight: 'calc(100vh - 310px)' }}>
            {navItems.map((item) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: isCollapsed ? 'center' : 'space-between',
                    padding: isCollapsed ? '11px 0' : '10px 14px',
                    textDecoration: 'none',
                    color: active ? '#FFFFFF' : '#1E293B',
                    background: active ? '#0A3161' : 'transparent',
                    borderLeft: active ? '4px solid #D97706' : '4px solid transparent',
                    borderBottom: '1px solid #F1F5F9',
                    fontSize: '0.82rem',
                    fontWeight: active ? 700 : 500,
                    transition: 'all 0.1s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!active) e.currentTarget.style.background = '#EFF6FF';
                  }}
                  onMouseLeave={(e) => {
                    if (!active) e.currentTarget.style.background = 'transparent';
                  }}
                  title={isHi ? item.labelHi : item.labelEn}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ color: active ? '#F59E0B' : '#0A3161' }}>
                      {item.icon}
                    </div>
                    {!isCollapsed && (
                      <span>{isHi ? item.labelHi : item.labelEn}</span>
                    )}
                  </div>

                  {!isCollapsed && item.badge && (
                    <span style={{
                      background: active ? '#F59E0B' : '#E2E8F0',
                      color: active ? '#0A3161' : '#334155',
                      fontSize: '0.62rem',
                      fontWeight: 800,
                      padding: '1px 5px',
                      borderRadius: '3px'
                    }}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: Helpline Quick Dial & Sign Out */}
        <div style={{ padding: isCollapsed ? '8px 4px' : '10px 14px', borderTop: '1px solid #CBD5E1', background: '#F8FAFC' }}>
          {!isCollapsed ? (
            <div style={{
              background: '#FFFBEB',
              border: '1px solid #FCD34D',
              borderRadius: '3px',
              padding: '8px',
              marginBottom: '8px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.72rem', fontWeight: 800, color: '#92400E' }}>
                <PhoneCall size={12} />
                <span>{isHi ? 'किसान हेल्पलाइन 24x7' : 'Kisan Helpline 24x7'}</span>
              </div>
              <a
                href="tel:18001801551"
                style={{
                  display: 'block',
                  fontSize: '0.82rem',
                  fontWeight: 900,
                  color: '#B45309',
                  textDecoration: 'none',
                  marginTop: '2px'
                }}
              >
                1800-180-1551
              </a>
              <div style={{ fontSize: '0.65rem', color: '#78350F' }}>
                {isHi ? 'निःशुल्क राष्ट्रीय परामर्श सेवा' : 'Toll-Free National Advisory'}
              </div>
            </div>
          ) : (
            <a 
              href="tel:18001801551"
              title="Call Kisan Helpline 1551"
              style={{ display: 'flex', justifyContent: 'center', padding: '6px 0', color: '#B45309' }}
            >
              <PhoneCall size={18} />
            </a>
          )}

          {token ? (
            <button
              onClick={handleLogout}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: isCollapsed ? 'center' : 'flex-start',
                gap: '8px',
                background: 'none',
                border: 'none',
                color: '#DC2626',
                fontSize: '0.76rem',
                fontWeight: 700,
                padding: '6px 4px',
                cursor: 'pointer',
                borderRadius: '3px'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#FEF2F2'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
              title={isHi ? 'लॉगआउट' : 'Sign Out'}
            >
              <LogOut size={15} />
              {!isCollapsed && <span>{isHi ? 'लॉगआउट / बाहर निकलें' : 'Sign Out'}</span>}
            </button>
          ) : (
            <button
              onClick={() => navigate('/login')}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: isCollapsed ? 'center' : 'flex-start',
                gap: '8px',
                background: '#ECFDF5',
                border: '1px solid #A7F3D0',
                color: '#047857',
                fontSize: '0.76rem',
                fontWeight: 800,
                padding: '6px 8px',
                cursor: 'pointer',
                borderRadius: '4px'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#D1FAE5'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#ECFDF5'}
              title={isHi ? 'किसान लॉगिन / पंजीकरण' : 'Farmer Login / Register'}
            >
              <LogIn size={15} />
              {!isCollapsed && <span>{isHi ? 'किसान लॉगिन करें' : 'Farmer Sign In'}</span>}
            </button>
          )}
        </div>
      </aside>

      {/* Profile Modal */}
      <ProfileModal 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
        farmerData={farmerData}
        onLogout={handleLogout}
      />
    </>
  );
}
