import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, Lock, ArrowRight, Map, Calendar, TrendingUp, Plus, Eye, EyeOff, Globe, ShieldCheck, ArrowLeft } from 'lucide-react';
import { API_URL } from '../config';
import { useLanguage } from '../contexts/LanguageContext';
import { getStateLanguage } from '../utils/languageDetector';
import { detectFarmerLocation, geocodePlace } from '../utils/locationHelper';
import Logo from '../components/Logo';

const AUTH_URL = `${API_URL}/auth`;

export default function AuthScreen({ token, setToken }) {
  const { currentLang, setCurrentLang, setDetectedLocalLang, t } = useLanguage();
  const isHi = currentLang === 'hi';
  const location = useLocation();
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [officialId, setOfficialId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [crop, setCrop] = useState('wheat');
  const [landAcres, setLandAcres] = useState('');
  const [sowingDate, setSowingDate] = useState('');
  
  // Yield History Toggle
  const [showYieldForm, setShowYieldForm] = useState(false);
  const [yieldHistoryList, setYieldHistoryList] = useState([
    { year: new Date().getFullYear() - 1, crop: '', yield: '', unit: 'Quintals' }
  ]);
  
  const [availableCrops, setAvailableCrops] = useState([]);
  const [locationDetecting, setLocationDetecting] = useState(false);
  const [locationCoords, setLocationCoords] = useState({ lat: null, lon: null });
  const [locationStatus, setLocationStatus] = useState('');
  const [village, setVillage] = useState('');
  const [stateName, setStateName] = useState('');

  const detectLocation = async () => {
    setLocationDetecting(true);
    setLocationStatus(isHi ? 'खेत का स्थान खोजा जा रहा है...' : 'Detecting farm location...');
    try {
      const loc = await detectFarmerLocation();
      setLocationCoords({ lat: loc.lat, lon: loc.lon });
      if (loc.state) {
        setStateName(prev => prev || loc.state);
        const langCode = getStateLanguage(loc.state);
        if (langCode) {
          setDetectedLocalLang(langCode);
          if (!localStorage.getItem('krishimitraaz_lang')) {
            setCurrentLang(langCode);
          }
        }
      }
      if (loc.village) setVillage(prev => prev || loc.village);
      setLocationStatus(loc.locationStr || `${loc.lat}° N, ${loc.lon}° E`);
    } catch (e) {
      console.warn('Location detection fallback:', e);
      setLocationCoords({ lat: 26.85, lon: 80.95 });
      setLocationStatus('Barabanki, Uttar Pradesh (Agricultural Hub)');
    } finally {
      setLocationDetecting(false);
    }
  };

  const handlePlaceBlur = async () => {
    const q = [village, stateName].filter(Boolean).join(', ');
    if (!q) return;
    try {
      const geo = await geocodePlace(q);
      if (geo && geo.lat && geo.lon) {
        const lat = Number(geo.lat.toFixed(4));
        const lon = Number(geo.lon.toFixed(4));
        setLocationCoords({ lat, lon });
        setLocationStatus(`${geo.name || village}, ${geo.state || stateName} (${lat}° N, ${lon}° E)`);
      }
    } catch {
      // Continue with current coords
    }
  };

  // Fetch Crops & Detect Location
  useEffect(() => {
    const fetchCrops = async () => {
      try {
        const res = await axios.get(`${API_URL}/crops`);
        const sortedCrops = res.data.sort((a, b) => a.name.en.localeCompare(b.name.en));
        setAvailableCrops(sortedCrops);
        if (sortedCrops.length > 0) setCrop(sortedCrops[0].id);
      } catch (err) {
        console.error("Failed to load crops", err);
      }
    };
    fetchCrops();

    if (!isLogin && !locationCoords.lat) {
      detectLocation();
    }
  }, [isLogin]);
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = isLogin 
      ? (isHi ? 'किसान लॉगिन - कृषिमित्राज़' : 'Farmer Login - KrishiMitraaz')
      : (isHi ? 'किसान पंजीकरण - कृषिमित्राज़' : 'Farmer Registration - KrishiMitraaz');
  }, [isLogin, isHi]);

  const handleAddYieldRecord = (e) => {
    e.preventDefault();
    setYieldHistoryList([
      ...yieldHistoryList, 
      { year: new Date().getFullYear() - (yieldHistoryList.length + 1), crop: '', yield: '', unit: 'Quintals' }
    ]);
  };

  const updateYieldRecord = (index, field, value) => {
    const updatedList = [...yieldHistoryList];
    updatedList[index][field] = value;
    setYieldHistoryList(updatedList);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isLogin ? '/login' : '/register';
      
      let payload = { officialId, password };
      if (!isLogin) {
        payload = { 
          ...payload, 
          name, 
          crop, 
          landAcres: landAcres || 1, 
          sowingDate: sowingDate || null,
          village: village.trim() || null,
          state: stateName.trim() || null,
          location: (locationCoords.lat && locationCoords.lon) 
            ? locationCoords 
            : { lat: 28.61, lon: 77.20 }
        };
        
        if (showYieldForm) {
          const validHistory = yieldHistoryList
            .filter(record => record.yield)
            .map(record => ({
              year: parseInt(record.year),
              crop: record.crop || crop,
              yield: parseFloat(record.yield),
              unit: record.unit
            }));
          if (validHistory.length > 0) {
            payload.yieldHistory = validHistory;
          }
        }
      }

      const res = await axios.post(`${AUTH_URL}${endpoint}`, payload);
      
      const { token: receivedToken, farmer } = res.data;
      localStorage.setItem('krishimitraaz_token', receivedToken);
      localStorage.setItem('krishimitraaz_farmer_id', farmer.id);
      
      setToken(receivedToken);
      const destination = location.state?.from || '/dashboard';
      navigate(destination, { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || err.message || (isHi ? 'सत्यापन विफल रहा। विवरण जांचें।' : 'Authentication failed. Please verify credentials.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem', background: '#F8FAFC' }}>
      
      {/* Top Bar with Language selector */}
      <div style={{ position: 'fixed', top: '15px', right: '20px', zIndex: 50, display: 'flex', alignItems: 'center', gap: '8px', background: '#FFFFFF', padding: '4px 10px', borderRadius: '3px', border: '1px solid #CBD5E1', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
        <Globe size={15} color="#0A3161" />
        <select 
          value={currentLang} 
          onChange={(e) => setCurrentLang(e.target.value)}
          style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.8rem', fontWeight: 700, color: '#0A3161', cursor: 'pointer' }}
        >
          <option value="en">English (Official)</option>
          <option value="hi">हिन्दी (राजभाषा)</option>
        </select>
      </div>

      <div className="gov-card" style={{ maxWidth: '520px', width: '100%', borderTop: '4px solid #004D25', boxShadow: '0 4px 14px rgba(0,0,0,0.08)' }}>
        
        {/* Header Branding */}
        <div style={{ padding: '1.5rem 1.5rem 1rem', textAlign: 'center', borderBottom: '1px solid #E2E8F0', background: '#FFFFFF' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
            <Logo size={52} showText={false} />
          </div>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#15803D', letterSpacing: '0.04em' }}>
            {isHi ? 'कृषिमित्राज़ - स्मार्ट फसल सलाहकार' : 'KRISHIMITRAAZ • SMART CROP ADVISORY'}
          </div>
          <h1 style={{ fontSize: '1.35rem', fontWeight: 900, margin: '4px 0', color: '#0A3161' }}>
            {isLogin 
              ? (isHi ? 'किसान पोर्टल लॉगिन' : 'Farmer Portal Sign-In')
              : (isHi ? 'नवीन किसान पंजीकरण' : 'New Farmer Registration')}
          </h1>
          <p style={{ margin: 0, fontSize: '0.8rem', color: '#475569' }}>
            {isHi ? 'एआई एवं उपग्रह आधारित वैज्ञानिक फसल परामर्श एवं मंडी भाव' : 'AI & Satellite-Powered Crop Advisory and Market Decision Support'}
          </p>
        </div>

        <div className="gov-card-body" style={{ padding: '1.5rem' }}>
          {token && (
            <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '4px', padding: '12px 14px', marginBottom: '1.25rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#15803D', marginBottom: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <ShieldCheck size={16} color="#15803D" />
                <span>{isHi ? 'सक्रिय सत्र उपलब्ध है' : 'Active Farmer Session Detected'}</span>
              </div>
              <p style={{ fontSize: '0.78rem', color: '#166534', margin: '0 0 10px 0' }}>
                {isHi 
                  ? 'आप वर्तमान में KrishiMitraaz पोर्टल में लॉगिन हैं।' 
                  : 'You are currently authenticated in KrishiMitraaz.'}
              </p>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => navigate(location.state?.from || '/dashboard')}
                  className="gov-btn gov-btn-primary"
                  style={{ padding: '6px 14px', fontSize: '0.78rem' }}
                >
                  {isHi ? 'डैशबोर्ड पर आगे बढ़ें →' : 'Continue to Dashboard →'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (window.history.length > 1) {
                      navigate(-1);
                    } else {
                      navigate('/dashboard');
                    }
                  }}
                  className="gov-btn gov-btn-secondary"
                  style={{ padding: '6px 12px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <ArrowLeft size={13} />
                  <span>{isHi ? 'पीछे जाएं' : 'Go Back'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    localStorage.removeItem('krishimitraaz_token');
                    localStorage.removeItem('krishimitraaz_farmer_id');
                    localStorage.removeItem('krishimitraaz_farmer_state');
                    setToken(null);
                  }}
                  className="gov-btn"
                  style={{ padding: '6px 10px', fontSize: '0.75rem', background: '#F1F5F9', border: '1px solid #CBD5E1', color: '#475569' }}
                >
                  {isHi ? 'खाता बदलें' : 'Switch Account'}
                </button>
              </div>
            </div>
          )}

          {isLogin && !token && (
            <div style={{ background: '#F8FAFC', border: '1px solid #CBD5E1', borderRadius: '3px', padding: '8px 12px', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ textAlign: 'left', fontSize: '0.78rem', color: '#0A3161' }}>
                <strong>{isHi ? 'डेमो किसान प्रोफ़ाइल:' : 'Demo Profile:'}</strong> FARMER-001 / password123
              </div>
              <button
                type="button"
                onClick={() => {
                  setOfficialId('FARMER-001');
                  setPassword('password123');
                }}
                className="gov-btn gov-btn-secondary"
                style={{ padding: '3px 8px', fontSize: '0.72rem' }}
              >
                {isHi ? 'डेमो भरें' : 'Fill Demo'}
              </button>
            </div>
          )}

          {error && (
            <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', color: '#991B1B', padding: '10px 12px', borderRadius: '3px', marginBottom: '1.25rem', fontSize: '0.8rem', textAlign: 'center', fontWeight: 600 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            {!isLogin && (
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.8rem', fontWeight: 700, color: '#0A3161' }}>
                  {isHi ? 'किसान का पूरा नाम (आधार अनुसार):' : 'Farmer Full Name (as on Aadhaar):'}
                </label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required 
                  style={inputStyle}
                  placeholder={isHi ? 'उदा. राम कुमार' : 'e.g. Rajesh Kumar'}
                />
              </div>
            )}

            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.8rem', fontWeight: 700, color: '#0A3161' }}>
                {isHi ? 'किसान आईडी / मोबाइल / आधार संख्या:' : 'Farmer Official ID / Mobile / Kisan ID:'}
              </label>
              <div style={{ position: 'relative' }}>
                <User size={16} color="#64748B" style={{ position: 'absolute', top: '10px', left: '10px' }} />
                <input 
                  type="text" 
                  value={officialId} 
                  onChange={(e) => setOfficialId(e.target.value)} 
                  required 
                  style={{ ...inputStyle, paddingLeft: '34px' }}
                  placeholder="FARMER-001 or Mobile / Kisan ID"
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.8rem', fontWeight: 700, color: '#0A3161' }}>
                {isHi ? 'गोपनीय पासवर्ड:' : 'Password:'}
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="#64748B" style={{ position: 'absolute', top: '10px', left: '10px' }} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                  style={{ ...inputStyle, paddingLeft: '34px', paddingRight: '36px' }}
                  placeholder="••••••••"
                />
                <button 
                  type="button"
                  onMouseDown={() => setShowPassword(true)}
                  onMouseUp={() => setShowPassword(false)}
                  onMouseLeave={() => setShowPassword(false)}
                  style={{ position: 'absolute', top: '8px', right: '10px', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                  {showPassword ? <EyeOff size={16} color="#64748B" /> : <Eye size={16} color="#64748B" />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.8rem', fontWeight: 700, color: '#0A3161' }}>{t('primaryCrop')}</label>
                    <select value={crop} onChange={(e) => setCrop(e.target.value)} style={inputStyle}>
                      {availableCrops.length > 0 ? (
                        availableCrops.map(c => (
                          <option key={c.id} value={c.id}>{c.name[currentLang] || c.name.en}</option>
                        ))
                      ) : (
                        <option value="wheat">Wheat</option>
                      )}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.8rem', fontWeight: 700, color: '#0A3161' }}>{t('landArea')}</label>
                    <div style={{ position: 'relative' }}>
                      <Map size={16} color="#64748B" style={{ position: 'absolute', top: '10px', left: '10px' }} />
                      <input 
                        type="number" 
                        step="0.1"
                        value={landAcres} 
                        onChange={(e) => setLandAcres(e.target.value)} 
                        required 
                        style={{ ...inputStyle, paddingLeft: '34px' }}
                        placeholder="e.g. 2.5"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.8rem', fontWeight: 700, color: '#0A3161' }}>{t('sowingDate')}</label>
                  <div style={{ position: 'relative' }}>
                    <Calendar size={16} color="#64748B" style={{ position: 'absolute', top: '10px', left: '10px' }} />
                    <input 
                      type="date" 
                      value={sowingDate} 
                      onChange={(e) => setSowingDate(e.target.value)} 
                      required 
                      style={{ ...inputStyle, paddingLeft: '34px' }}
                    />
                  </div>
                </div>

                {/* Farmer Location & Farm Coordinates */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.8rem', fontWeight: 700, color: '#0A3161' }}>{isHi ? 'ग्राम / कस्बा' : 'Village / Town'}</label>
                    <input 
                      type="text" 
                      value={village} 
                      onChange={(e) => setVillage(e.target.value)} 
                      onBlur={handlePlaceBlur}
                      style={inputStyle}
                      placeholder="e.g. Kheri / Barabanki"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.8rem', fontWeight: 700, color: '#0A3161' }}>{isHi ? 'राज्य' : 'State'}</label>
                    <input 
                      type="text" 
                      value={stateName} 
                      onChange={(e) => setStateName(e.target.value)} 
                      onBlur={handlePlaceBlur}
                      style={inputStyle}
                      placeholder="e.g. Uttar Pradesh"
                    />
                  </div>
                </div>

                <div style={{ padding: '8px 12px', background: '#F8FAFC', borderRadius: '3px', border: '1px solid #CBD5E1', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                  <div style={{ fontSize: '0.78rem', color: '#0A3161', flex: 1 }}>
                    <strong>📍 {isHi ? 'खेत जीपीएस:' : 'Field GPS:'}</strong> {locationCoords.lat ? `${locationCoords.lat}° N, ${locationCoords.lon}° E` : (locationStatus || 'Ready to detect')}
                  </div>
                  <button
                    type="button"
                    onClick={detectLocation}
                    disabled={locationDetecting}
                    className="gov-btn gov-btn-secondary"
                    style={{ padding: '3px 8px', fontSize: '0.72rem' }}
                  >
                    {locationDetecting ? (isHi ? 'खोज जारी...' : 'Detecting...') : (isHi ? 'जीपीएस लाएं' : 'Detect GPS')}
                  </button>
                </div>

                <div style={{ padding: '10px', background: '#FFFFFF', borderRadius: '3px', border: '1px solid #CBD5E1' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontWeight: 700, fontSize: '0.8rem', color: '#0A3161' }}>
                      <input 
                        type="checkbox" 
                        checked={showYieldForm} 
                        onChange={(e) => setShowYieldForm(e.target.checked)} 
                        style={{ width: '16px', height: '16px' }}
                      />
                      <TrendingUp size={15} color="#004D25" />
                      {t('addHistory')}
                    </label>
                    
                    {showYieldForm && (
                      <button 
                        type="button" 
                        onClick={handleAddYieldRecord}
                        className="gov-btn gov-btn-secondary"
                        style={{ padding: '2px 6px', fontSize: '0.7rem' }}
                      >
                        <Plus size={12} /> {t('addYear')}
                      </button>
                    )}
                  </div>
                  
                  {showYieldForm && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
                      {yieldHistoryList.map((record, index) => (
                        <div key={index} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '6px', paddingBottom: '8px', borderBottom: index < yieldHistoryList.length - 1 ? '1px dashed #CBD5E1' : 'none' }}>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.7rem', marginBottom: '2px' }}>{t('year')}</label>
                            <input type="number" value={record.year} onChange={e => updateYieldRecord(index, 'year', e.target.value)} style={inputStyle} />
                          </div>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.7rem', marginBottom: '2px' }}>{t('crop')}</label>
                            <input type="text" value={record.crop} onChange={e => updateYieldRecord(index, 'crop', e.target.value)} style={inputStyle} placeholder="e.g. Wheat" />
                          </div>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.7rem', marginBottom: '2px' }}>{t('yieldPerAcre')}</label>
                            <input type="number" step="0.1" value={record.yield} onChange={e => updateYieldRecord(index, 'yield', e.target.value)} style={inputStyle} placeholder="e.g. 18" />
                          </div>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.7rem', marginBottom: '2px' }}>{t('unit')}</label>
                            <select value={record.unit} onChange={e => updateYieldRecord(index, 'unit', e.target.value)} style={inputStyle}>
                              <option value="Quintals">Quintals</option>
                              <option value="Kg">Kg</option>
                              <option value="Tonnes">Tonnes</option>
                            </select>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}

            <button type="submit" disabled={loading} className="gov-btn gov-btn-primary" style={{ width: '100%', padding: '10px', fontSize: '0.9rem', justifyContent: 'center' }}>
              {loading ? (isHi ? 'प्रमाणन जारी...' : 'Processing Authentication...') : (isLogin ? (isHi ? 'सुरक्षित किसान लॉगिन' : 'Secure Farmer Sign In') : (isHi ? 'पंजीकरण पूर्ण करें' : 'Complete Farmer Registration'))}
              {!loading && <ArrowRight size={16} />}
            </button>

            {isLogin && (
              <button
                type="button"
                onClick={() => {
                  localStorage.setItem('krishimitraaz_token', 'krishimitraaz_demo_token');
                  localStorage.setItem('krishimitraaz_farmer_id', 'demo-farmer-001');
                  setToken('krishimitraaz_demo_token');
                  const destination = location.state?.from || '/dashboard';
                  navigate(destination, { replace: true });
                }}
                className="gov-btn gov-btn-secondary"
                style={{ width: '100%', padding: '8px', fontSize: '0.82rem', justifyContent: 'center', borderColor: '#004D25', color: '#004D25' }}
              >
                🌾 {isHi ? 'सीधे पोर्टल खोलें (अतिथि किसान मोड)' : 'Access Citizen Agricultural Dashboard (Guest Mode)'}
              </button>
            )}
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #E2E8F0', fontSize: '0.8rem', color: '#475569' }}>
            {isLogin ? (isHi ? 'नया किसान खाता?' : 'New farmer without AgriStack ID?') : (isHi ? 'पहले से पंजीकृत हैं?' : 'Already have a Farmer ID?')}
            <button 
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              style={{ background: 'none', border: 'none', color: '#0A3161', fontWeight: 800, marginLeft: '6px', cursor: 'pointer', textDecoration: 'underline' }}
            >
              {isLogin ? (isHi ? 'यहां पंजीकरण करें' : 'Register Here') : (isHi ? 'यहां लॉगिन करें' : 'Sign In Here')}
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '1rem', fontSize: '0.72rem', color: '#64748B' }}>
            <ShieldCheck size={14} color="#059669" />
            <span>{isHi ? 'सुरक्षित एवं एन्क्रिप्टेड किसान डेटा संरक्षण प्रणाली' : 'Encrypted & Secure Agronomy Decision Support Platform'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '7px 10px',
  borderRadius: '3px',
  border: '1px solid #CBD5E1',
  fontSize: '0.85rem',
  background: '#FFFFFF',
  color: '#0A3161'
};
