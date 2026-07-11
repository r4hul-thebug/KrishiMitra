import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { User, Lock, ArrowRight, ShieldCheck, Map, Calendar, TrendingUp, Plus, Eye, EyeOff, Globe } from 'lucide-react';
import '../index.css';
import { API_URL } from '../config';
import { useLanguage } from '../contexts/LanguageContext';
import { getStateLanguage } from '../utils/languageDetector';

const AUTH_URL = `${API_URL}/auth`;

export default function AuthScreen({ setToken }) {
  const { currentLang, setCurrentLang, detectedLocalLang, setDetectedLocalLang, t, availableLangs } = useLanguage();
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

    // Location Detection for Local Language
    if (!detectedLocalLang && navigator.geolocation) {
      setLocationDetecting(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const res = await axios.get(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
            const stateName = res.data.address?.state || res.data.display_name;
            console.log("Geocoded location:", stateName);
            if (stateName) {
              const langCode = getStateLanguage(stateName);
              console.log("Mapped Language Code:", langCode);
              if (langCode) {
                setDetectedLocalLang(langCode);
                // Optionally auto-switch to it if they are registering
                if (!localStorage.getItem('krishimitraaz_lang')) {
                  setCurrentLang(langCode);
                }
              }
            }
          } catch (err) {
            console.error("Geocoding failed", err);
          } finally {
            setLocationDetecting(false);
          }
        },
        () => {
          setLocationDetecting(false); // Silent fail if user denies permission
        },
        { timeout: 5000 }
      );
    }
  }, [detectedLocalLang, setCurrentLang, setDetectedLocalLang]);
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = isLogin ? 'Login - KrishiMitraaz' : 'Register - KrishiMitraaz';
  }, [isLogin]);

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
          sowingDate: sowingDate || null 
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
      
      const { token, farmer } = res.data;
      localStorage.setItem('krishimitraaz_token', token);
      localStorage.setItem('krishimitraaz_farmer_id', farmer.id);
      
      setToken(token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '90vh', position: 'relative' }}>
      
      {/* Language Selector */}
      <div style={{ position: 'absolute', top: '20px', right: '20px', display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.9)', padding: '8px 12px', borderRadius: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <Globe size={18} color="var(--primary-green)" />
        <select 
          value={currentLang} 
          onChange={(e) => setCurrentLang(e.target.value)}
          style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.9rem', fontWeight: 'bold', cursor: 'pointer' }}
        >
          <option value="en">English</option>
          <option value="hi">हिंदी</option>
          {detectedLocalLang && detectedLocalLang !== 'hi' && detectedLocalLang !== 'en' && (
            <option value={detectedLocalLang}>{availableLangs[detectedLocalLang]?.languageName}</option>
          )}
        </select>
      </div>

      <div className="glass-card animate-fade-in-up" style={{ maxWidth: '540px', width: '100%', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <ShieldCheck size={48} color="var(--primary-green)" style={{ marginBottom: '1rem' }} />
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{t('welcome')}</h1>
          <p style={{ color: 'var(--text-muted)' }}>{t('subtitle')}</p>
          {locationDetecting && !isLogin && (
            <p style={{ color: 'var(--primary-green)', fontSize: '0.85rem', marginTop: '8px' }}>{t('detectingLocation')}</p>
          )}
        </div>

        {error && (
          <div style={{ backgroundColor: 'var(--accent-urgent-bg)', color: 'var(--accent-urgent)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {!isLogin && (
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>{t('fullName')}</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
                style={inputStyle}
                placeholder={t('fullNamePlaceholder')}
              />
            </div>
          )}

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>{t('officialId')}</label>
            <div style={{ position: 'relative' }}>
              <User size={20} color="var(--text-muted)" style={{ position: 'absolute', top: '12px', left: '12px' }} />
              <input 
                type="text" 
                value={officialId} 
                onChange={(e) => setOfficialId(e.target.value)} 
                required 
                style={{...inputStyle, paddingLeft: '40px'}}
                placeholder={t('officialIdPlaceholder')}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>{t('password')}</label>
            <div style={{ position: 'relative' }}>
              <Lock size={20} color="var(--text-muted)" style={{ position: 'absolute', top: '12px', left: '12px' }} />
              <input 
                type={showPassword ? "text" : "password"} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                style={{...inputStyle, paddingLeft: '40px', paddingRight: '40px'}}
                placeholder="••••••••"
              />
              <button 
                type="button"
                onMouseDown={() => setShowPassword(true)}
                onMouseUp={() => setShowPassword(false)}
                onMouseLeave={() => setShowPassword(false)}
                style={{ position: 'absolute', top: '12px', right: '12px', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                {showPassword ? <EyeOff size={20} color="var(--text-muted)" /> : <Eye size={20} color="var(--text-muted)" />}
              </button>
            </div>
          </div>

          {!isLogin && (
            <>
              <div className="auth-grid">
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>{t('primaryCrop')}</label>
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
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>{t('landArea')}</label>
                  <div style={{ position: 'relative' }}>
                    <Map size={20} color="var(--text-muted)" style={{ position: 'absolute', top: '12px', left: '12px' }} />
                    <input 
                      type="number" 
                      step="0.1"
                      value={landAcres} 
                      onChange={(e) => setLandAcres(e.target.value)} 
                      required 
                      style={{...inputStyle, paddingLeft: '40px'}}
                      placeholder="e.g. 2.5"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>{t('sowingDate')}</label>
                <div style={{ position: 'relative' }}>
                  <Calendar size={20} color="var(--text-muted)" style={{ position: 'absolute', top: '12px', left: '12px' }} />
                  <input 
                    type="date" 
                    value={sowingDate} 
                    onChange={(e) => setSowingDate(e.target.value)} 
                    required 
                    style={{...inputStyle, paddingLeft: '40px'}}
                  />
                </div>
              </div>

              <div style={{ padding: '1rem', background: '#F8FAF8', borderRadius: '8px', border: '1px solid #E0E0E0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                    <input 
                      type="checkbox" 
                      checked={showYieldForm} 
                      onChange={(e) => setShowYieldForm(e.target.checked)} 
                      style={{ width: '18px', height: '18px' }}
                    />
                    <TrendingUp size={18} color="var(--primary-green)" />
                    {t('addHistory')}
                  </label>
                  
                  {showYieldForm && (
                    <button 
                      type="button" 
                      onClick={handleAddYieldRecord}
                      style={{ background: 'var(--primary-green-light)', border: 'none', color: 'white', padding: '4px 8px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}
                    >
                      <Plus size={14} /> {t('addYear')}
                    </button>
                  )}
                </div>
                
                {showYieldForm && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                    {yieldHistoryList.map((record, index) => (
                      <div key={index} className="yield-grid" style={{ paddingBottom: '1rem', borderBottom: index < yieldHistoryList.length - 1 ? '1px dashed #CCC' : 'none' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '4px' }}>{t('year')}</label>
                          <input type="number" value={record.year} onChange={e => updateYieldRecord(index, 'year', e.target.value)} style={inputStyle} />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '4px' }}>{t('crop')}</label>
                          <input type="text" value={record.crop} onChange={e => updateYieldRecord(index, 'crop', e.target.value)} style={inputStyle} placeholder="e.g. Wheat" />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '4px' }}>{t('yieldPerAcre')}</label>
                          <input type="number" step="0.1" value={record.yield} onChange={e => updateYieldRecord(index, 'yield', e.target.value)} style={inputStyle} placeholder="e.g. 18" />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '4px' }}>{t('unit')}</label>
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

          <button type="submit" disabled={loading} style={buttonStyle}>
            {loading ? t('processing') : (isLogin ? t('secureLogin') : t('createAccount'))}
            {!loading && <ArrowRight size={20} />}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <p style={{ color: 'var(--text-muted)' }}>
            {isLogin ? t('noAccount') : t('alreadyRegistered')}
            <button 
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              style={{ background: 'none', border: 'none', color: 'var(--primary-green)', fontWeight: 'bold', marginLeft: '8px', cursor: 'pointer' }}
            >
              {isLogin ? t('registerHere') : t('loginHere')}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '12px',
  borderRadius: '8px',
  border: '1px solid #ccc',
  fontSize: '1rem',
  background: 'rgba(255,255,255,0.9)'
};

const buttonStyle = {
  width: '100%',
  padding: '14px',
  borderRadius: '8px',
  border: 'none',
  background: 'linear-gradient(135deg, var(--primary-green), var(--primary-green-light))',
  color: 'white',
  fontSize: '1.125rem',
  fontWeight: 'bold',
  cursor: 'pointer',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '8px',
  boxShadow: '0 4px 12px rgba(46, 125, 50, 0.2)'
};
