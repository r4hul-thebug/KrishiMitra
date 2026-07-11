import { useState, useEffect } from 'react';
import { X, LogOut, MapPin, Wheat, Sprout, TrendingUp, Plus, Save } from 'lucide-react';
import axios from 'axios';
import '../index.css';
import { API_URL } from '../config';
import { useLanguage } from '../contexts/LanguageContext';
import { Globe } from 'lucide-react';

export default function ProfileModal({ isOpen, onClose, farmerData, onLogout }) {
  const { currentLang, setCurrentLang, detectedLocalLang, t, availableLangs } = useLanguage();
  const [localHistory, setLocalHistory] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ year: new Date().getFullYear(), crop: farmerData?.crop || '', yieldAmount: '', unit: 'Quintals' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (farmerData?.yieldHistory) {
      setLocalHistory(farmerData.yieldHistory);
    }
  }, [farmerData?.yieldHistory]);

  if (!isOpen || !farmerData) return null;

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
      alert('Failed to add record.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content glass-card animate-fade-in-down" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>
          <h2 style={{ color: 'var(--primary-green-dark)', margin: 0 }}>{t('farmerProfile') || 'Farmer Profile'}</h2>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#E8F5E9', padding: '6px 12px', borderRadius: '20px', border: '1px solid #C8E6C9' }}>
              <Globe size={16} color="var(--primary-green-dark)" />
              <select 
                value={currentLang} 
                onChange={(e) => setCurrentLang(e.target.value)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  fontSize: '0.85rem',
                  fontWeight: 'bold',
                  color: 'var(--primary-green-dark)',
                  cursor: 'pointer',
                  outline: 'none'
                }}
              >
                <option value="en">English</option>
                <option value="hi">हिंदी</option>
                {detectedLocalLang && detectedLocalLang !== 'hi' && detectedLocalLang !== 'en' && (
                  <option value={detectedLocalLang}>{availableLangs[detectedLocalLang]?.languageName}</option>
                )}
              </select>
            </div>
            
            <button 
              onClick={onClose} 
              style={{ 
                background: 'rgba(0,0,0,0.05)', 
                border: 'none', 
                borderRadius: '50%', 
                padding: '6px', 
                cursor: 'pointer', 
                color: 'var(--text-main)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.1)'}
              onMouseOut={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.05)'}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem', color: 'var(--text-main)' }}>{farmerData.name}</h1>
          <p style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <MapPin size={16} /> {farmerData.locationStr || 'Location unavailable'}
          </p>
        </div>

        <div className="auth-grid" style={{ marginTop: '0' }}>
          <div style={{ background: 'rgba(255,255,255,0.5)', padding: '1rem', borderRadius: '12px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>{t('primaryCrop') || 'Primary Crop'}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.25rem', fontWeight: 'bold' }}>
              <Wheat size={20} color="var(--primary-green)" /> {farmerData.crop?.toUpperCase() || 'N/A'}
            </div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.5)', padding: '1rem', borderRadius: '12px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>{t('landSize') || 'Land Size'}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.25rem', fontWeight: 'bold' }}>
              <Sprout size={20} color="var(--primary-green)" /> {farmerData.landAcres || 0} {t('acres') || 'Acres'}
            </div>
          </div>
        </div>

        <div style={{ marginTop: '2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.25rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp size={20} color="var(--primary-green)" /> {t('yieldHistory') || 'Yield History'}
            </h3>
            <button 
              onClick={() => setShowAddForm(!showAddForm)}
              style={{ background: 'var(--primary-green-light)', border: 'none', color: 'white', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem', fontWeight: 'bold' }}
            >
              {showAddForm ? <X size={16} /> : <Plus size={16} />} {showAddForm ? 'Cancel' : (t('addRecord') || 'Add Record')}
            </button>
          </div>

          {showAddForm && (
            <form onSubmit={handleSubmit} style={{ background: '#F8FAF8', border: '1px solid #E0E0E0', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
              <div className="auth-grid" style={{ marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '4px', fontWeight: 'bold' }}>Year</label>
                  <input type="number" required value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '4px', fontWeight: 'bold' }}>Crop</label>
                  <input type="text" required value={formData.crop} onChange={e => setFormData({...formData, crop: e.target.value})} style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '4px', fontWeight: 'bold' }}>Yield / Acre</label>
                  <input type="number" step="0.1" required value={formData.yieldAmount} onChange={e => setFormData({...formData, yieldAmount: e.target.value})} style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '4px', fontWeight: 'bold' }}>Unit</label>
                  <select value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})} style={inputStyle}>
                    <option value="Quintals">Quintals</option>
                    <option value="Kg">Kg</option>
                    <option value="Tonnes">Tonnes</option>
                  </select>
                </div>
              </div>
              <button type="submit" disabled={loading} style={{ width: '100%', background: 'var(--primary-green)', color: 'white', border: 'none', padding: '10px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <Save size={18} /> {loading ? 'Saving...' : 'Save Record'}
              </button>
            </form>
          )}

          {localHistory.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', background: '#F8FAF8', borderRadius: '8px', border: '1px dashed #CCC' }}>
              {t('noYieldHistory') || 'No yield history found. Add your past records to track your progress!'}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {localHistory.map((record, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: '#F8FAF8', borderRadius: '8px', border: '1px solid #E0E0E0' }}>
                  <span style={{ fontWeight: 'bold' }}>{record.year} - {record.crop?.toUpperCase()}</span>
                  <span style={{ color: 'var(--primary-green-dark)', fontWeight: 'bold' }}>{record.yield} {record.unit} / Acre</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ marginTop: '2.5rem' }}>
          


          <button onClick={onLogout} style={{
            width: '100%',
            background: 'var(--accent-urgent-bg)', 
            border: '1px solid var(--accent-urgent)', 
            color: 'var(--accent-urgent)', 
            padding: '12px', 
            borderRadius: '8px', 
            cursor: 'pointer', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            gap: '8px',
            fontWeight: 'bold',
            fontSize: '1.1rem'
          }}>
            <LogOut size={20} /> {t('logout')}
          </button>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '8px',
  borderRadius: '6px',
  border: '1px solid #CCC',
  fontSize: '0.95rem'
};
