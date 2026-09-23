import { useState, useEffect } from 'react';
import { X, LogOut, MapPin, Wheat, Sprout, TrendingUp, Plus, Save, UserCheck, Shield, Edit2, Navigation } from 'lucide-react';
import axios from 'axios';
import { API_URL } from '../config';
import { useLanguage } from '../contexts/LanguageContext';
import { detectFarmerLocation, geocodePlace } from '../utils/locationHelper';
import { Globe } from 'lucide-react';

export default function ProfileModal({ isOpen, onClose, farmerData, onLogout }) {
  const { currentLang, setCurrentLang, t } = useLanguage();
  const isHi = currentLang === 'hi';

  const [localHistory, setLocalHistory] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ year: new Date().getFullYear(), crop: farmerData?.crop || '', yieldAmount: '', unit: 'Quintals' });
  const [loading, setLoading] = useState(false);

  // Editable Location State
  const [showLocationEdit, setShowLocationEdit] = useState(false);
  const [locVillage, setLocVillage] = useState(farmerData?.village || '');
  const [locState, setLocState] = useState(farmerData?.state || '');
  const [locDetecting, setLocDetecting] = useState(false);
  const [locMsg, setLocMsg] = useState('');

  useEffect(() => {
    if (farmerData?.yieldHistory) {
      setLocalHistory(farmerData.yieldHistory);
    }
    if (farmerData?.village) setLocVillage(farmerData.village);
    if (farmerData?.state) setLocState(farmerData.state);
  }, [farmerData]);

  if (!isOpen || !farmerData) return null;

  const handleSaveLocation = async (e) => {
    e?.preventDefault();
    setLocDetecting(true);
    setLocMsg(isHi ? 'स्थान अद्यतन हो रहा है...' : 'Updating location coordinates...');
    try {
      let lat = farmerData.location?.lat;
      let lon = farmerData.location?.lon;
      const q = [locVillage, locState].filter(Boolean).join(', ');
      if (q) {
        const geo = await geocodePlace(q);
        if (geo?.lat && geo?.lon) {
          lat = Number(geo.lat.toFixed(4));
          lon = Number(geo.lon.toFixed(4));
        }
      }
      const patchData = {
        village: locVillage.trim(),
        state: locState.trim(),
        ...(lat && lon ? { location: { lat, lon } } : {})
      };
      const res = await axios.patch(`${API_URL}/farmers/${farmerData.id}`, patchData);
      const updatedFarmer = res.data?.farmer || {
        ...farmerData,
        village: locVillage,
        state: locState,
        ...(lat && lon ? { location: { lat, lon } } : {}),
        locationStr: [locVillage, locState].filter(Boolean).join(', ')
      };
      if (locState) localStorage.setItem('krishimitraaz_farmer_state', locState);
      window.dispatchEvent(new CustomEvent('farmer_updated', { detail: updatedFarmer }));
      setLocMsg(isHi ? 'स्थान सफलतापूर्वक सुरक्षित किया गया!' : 'Location updated successfully!');
      setTimeout(() => {
        setShowLocationEdit(false);
        setLocMsg('');
      }, 1000);
    } catch {
      setLocMsg(isHi ? 'स्थान सहेजने में त्रुटि' : 'Failed to update location');
    } finally {
      setLocDetecting(false);
    }
  };

  const handleDetectGPSInModal = async () => {
    setLocDetecting(true);
    setLocMsg(isHi ? 'खेत का स्थान खोजा जा रहा है...' : 'Detecting GPS/Network location...');
    try {
      const loc = await detectFarmerLocation();
      if (loc.village) setLocVillage(loc.village);
      if (loc.state) setLocState(loc.state);
      setLocMsg(`📍 ${loc.locationStr}`);
    } catch {
      setLocMsg(isHi ? 'स्थान नहीं मिला' : 'Could not detect location');
    } finally {
      setLocDetecting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/farmers/${farmerData.id}/yield`, {
        year: formData.year,
        crop: formData.crop,
        yield: formData.yieldAmount,
        unit: formData.unit
      });
      setLocalHistory(res.data);
      setShowAddForm(false);
      setFormData({ year: new Date().getFullYear(), crop: farmerData.crop || '', yieldAmount: '', unit: 'Quintals' });
    } catch (err) {
      console.error('Failed to add yield record:', err);
      alert(isHi ? 'अभिलेख जोड़ने में त्रुटि हुई।' : 'Failed to add record.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content gov-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px', width: '100%', borderTop: '4px solid #004D25', boxShadow: '0 8px 30px rgba(0,0,0,0.2)' }}>
        
        {/* Official Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#0A3161', color: '#FFFFFF', borderTopLeftRadius: '3px', borderTopRightRadius: '3px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <UserCheck size={18} color="#FDE047" />
            <strong style={{ fontSize: '0.95rem' }}>
              {isHi ? 'डिजिटल किसान पहचान पत्र (Kisan AgriStack Profile)' : 'Farmer Digital Registry Profile (AgriStack ID)'}
            </strong>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(255,255,255,0.15)', padding: '3px 8px', borderRadius: '3px' }}>
              <Globe size={13} color="#FFFFFF" />
              <select 
                value={currentLang} 
                onChange={(e) => setCurrentLang(e.target.value)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  outline: 'none'
                }}
              >
                <option value="en" style={{ color: '#000' }}>English</option>
                <option value="hi" style={{ color: '#000' }}>हिन्दी</option>
              </select>
            </div>
            
            <button 
              onClick={onClose} 
              style={{ 
                background: 'rgba(255,255,255,0.15)', 
                border: 'none', 
                borderRadius: '3px', 
                padding: '4px', 
                cursor: 'pointer', 
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <div style={{ padding: '1.25rem' }}>
          {/* Verified Badge Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: '#ECFDF5', color: '#065F46', border: '1px solid #A7F3D0', padding: '2px 8px', borderRadius: '3px', fontSize: '0.72rem', fontWeight: 800, marginBottom: '6px' }}>
                <Shield size={12} />
                <span>{isHi ? 'प्रमाणित किसान (आधार / भू-अभिलेख सत्यापित)' : 'Verified Aadhaar & Land Record Linked'}</span>
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 900, margin: '0 0 4px 0', color: '#0A3161' }}>{farmerData.name}</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px', color: '#64748B', fontSize: '0.8rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={13} color="#004D25" />
                  {(farmerData.locationStr && farmerData.locationStr !== 'Detecting location...')
                    ? farmerData.locationStr
                    : (farmerData.village && farmerData.state
                        ? `${farmerData.village}, ${farmerData.state}`
                        : (farmerData.location?.lat
                            ? `Lat: ${Number(farmerData.location.lat).toFixed(2)}, Lon: ${Number(farmerData.location.lon).toFixed(2)}`
                            : 'Location unavailable'))}
                </span>
                {farmerData.location?.lat && (
                  <span style={{ fontSize: '0.72rem', background: '#F1F5F9', padding: '1px 6px', borderRadius: '3px', color: '#475569', fontWeight: 700 }}>
                    GPS: {Number(farmerData.location.lat).toFixed(2)}° N, {Number(farmerData.location.lon).toFixed(2)}° E
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => setShowLocationEdit(!showLocationEdit)}
                  style={{
                    background: '#F1F5F9',
                    border: '1px solid #CBD5E1',
                    borderRadius: '3px',
                    padding: '2px 8px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: '#0A3161',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Edit2 size={11} />
                  <span>{isHi ? 'स्थान बदलें' : 'Change Location'}</span>
                </button>
              </div>

              {/* Inline Location Update Form */}
              {showLocationEdit && (
                <div style={{ marginTop: '10px', padding: '10px', background: '#F0FDF4', border: '1px solid #86EFAC', borderRadius: '4px' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#15803D', marginBottom: '6px' }}>
                    {isHi ? 'खेत का नया स्थान चुनें (जीपीएस या कस्बा/राज्य):' : 'Update Farm Location (GPS or Village/State):'}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                    <div>
                      <label style={{ fontSize: '0.7rem', fontWeight: 700, color: '#334155', display: 'block' }}>{isHi ? 'ग्राम / कस्बा' : 'Village / Town'}</label>
                      <input 
                        type="text" 
                        value={locVillage} 
                        onChange={(e) => setLocVillage(e.target.value)} 
                        style={inputStyle}
                        placeholder="e.g. Kheri / Barabanki"
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.7rem', fontWeight: 700, color: '#334155', display: 'block' }}>{isHi ? 'राज्य' : 'State'}</label>
                      <input 
                        type="text" 
                        value={locState} 
                        onChange={(e) => setLocState(e.target.value)} 
                        style={inputStyle}
                        placeholder="e.g. Uttar Pradesh"
                      />
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={handleDetectGPSInModal}
                      disabled={locDetecting}
                      className="gov-btn gov-btn-secondary"
                      style={{ padding: '3px 8px', fontSize: '0.72rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                    >
                      <Navigation size={12} />
                      <span>{locDetecting ? (isHi ? 'खोज जारी...' : 'Detecting...') : (isHi ? 'ऑटो GPS डिटेक्ट' : 'Auto Detect GPS')}</span>
                    </button>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        type="button"
                        onClick={() => setShowLocationEdit(false)}
                        className="gov-btn gov-btn-secondary"
                        style={{ padding: '3px 8px', fontSize: '0.72rem' }}
                      >
                        {isHi ? 'रद्द करें' : 'Cancel'}
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveLocation}
                        disabled={locDetecting}
                        className="gov-btn gov-btn-primary"
                        style={{ padding: '3px 10px', fontSize: '0.72rem' }}
                      >
                        {isHi ? 'सहेजें' : 'Save Location'}
                      </button>
                    </div>
                  </div>
                  {locMsg && (
                    <div style={{ marginTop: '6px', fontSize: '0.72rem', color: '#0369A1', fontWeight: 600 }}>
                      {locMsg}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.7rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 700 }}>Official ID</span>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0A3161' }}>{farmerData.officialId || farmerData.id || 'FARMER-001'}</div>
            </div>
          </div>

          {/* Core Info Blocks */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '1.25rem' }}>
            <div style={{ background: '#F8FAFC', padding: '10px 12px', borderRadius: '3px', border: '1px solid #CBD5E1' }}>
              <span style={{ fontSize: '0.72rem', color: '#64748B', display: 'block', fontWeight: 700 }}>{t('primaryCrop') || 'Primary Crop'}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '1rem', fontWeight: 800, color: '#004D25', marginTop: '2px' }}>
                <Wheat size={16} /> {farmerData.crop?.toUpperCase() || 'WHEAT'}
              </div>
            </div>
            <div style={{ background: '#F8FAFC', padding: '10px 12px', borderRadius: '3px', border: '1px solid #CBD5E1' }}>
              <span style={{ fontSize: '0.72rem', color: '#64748B', display: 'block', fontWeight: 700 }}>{t('landSize') || 'Land Size'}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '1rem', fontWeight: 800, color: '#0A3161', marginTop: '2px' }}>
                <Sprout size={16} /> {farmerData.landAcres || 1} {t('acres') || 'Acres'}
              </div>
            </div>
          </div>

          {/* Historical Records Section */}
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <strong style={{ fontSize: '0.85rem', color: '#0A3161', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <TrendingUp size={16} color="#004D25" /> {t('yieldHistory') || 'Yield History'}
              </strong>
              <button 
                onClick={() => setShowAddForm(!showAddForm)}
                className="gov-btn gov-btn-secondary"
                style={{ padding: '3px 8px', fontSize: '0.72rem' }}
              >
                {showAddForm ? <X size={13} /> : <Plus size={13} />} {showAddForm ? 'Cancel' : (t('addRecord') || 'Add Record')}
              </button>
            </div>

            {showAddForm && (
              <form onSubmit={handleSubmit} style={{ background: '#F8FAFC', border: '1px solid #CBD5E1', padding: '10px', borderRadius: '3px', marginBottom: '10px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '6px', marginBottom: '8px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.7rem', marginBottom: '2px', fontWeight: 700 }}>Year</label>
                    <input type="number" required value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.7rem', marginBottom: '2px', fontWeight: 700 }}>Crop</label>
                    <input type="text" required value={formData.crop} onChange={e => setFormData({...formData, crop: e.target.value})} style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.7rem', marginBottom: '2px', fontWeight: 700 }}>Yield / Acre</label>
                    <input type="number" step="0.1" required value={formData.yieldAmount} onChange={e => setFormData({...formData, yieldAmount: e.target.value})} style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.7rem', marginBottom: '2px', fontWeight: 700 }}>Unit</label>
                    <select value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})} style={inputStyle}>
                      <option value="Quintals">Quintals</option>
                      <option value="Kg">Kg</option>
                      <option value="Tonnes">Tonnes</option>
                    </select>
                  </div>
                </div>
                <button type="submit" disabled={loading} className="gov-btn gov-btn-primary" style={{ width: '100%', padding: '6px', fontSize: '0.75rem', justifyContent: 'center' }}>
                  <Save size={13} /> {loading ? 'Saving...' : 'Save Record to AgriStack'}
                </button>
              </form>
            )}

            {localHistory.length === 0 ? (
              <div style={{ padding: '1.25rem', textAlign: 'center', color: '#64748B', background: '#F8FAFC', borderRadius: '3px', border: '1px dashed #CBD5E1', fontSize: '0.8rem' }}>
                {t('noYieldHistory') || 'No yield history found. Add your past records to track your progress!'}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {localHistory.map((record, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: '#F8FAFC', borderRadius: '3px', border: '1px solid #E2E8F0', fontSize: '0.82rem' }}>
                    <span style={{ fontWeight: 700, color: '#0A3161' }}>{record.year} - {record.crop?.toUpperCase()}</span>
                    <span style={{ color: '#004D25', fontWeight: 800 }}>{record.yield} {record.unit} / Acre</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ paddingTop: '10px', borderTop: '1px solid #E2E8F0' }}>
            <button onClick={onLogout} className="gov-btn gov-btn-secondary" style={{
              width: '100%',
              borderColor: '#DC2626',
              color: '#DC2626',
              padding: '8px',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '0.85rem'
            }}>
              <LogOut size={16} /> {t('logout') || 'Secure Sign Out'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '6px 8px',
  borderRadius: '3px',
  border: '1px solid #CBD5E1',
  fontSize: '0.8rem',
  background: '#FFFFFF'
};
