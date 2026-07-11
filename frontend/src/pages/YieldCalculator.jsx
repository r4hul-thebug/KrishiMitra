import { useState, useEffect } from 'react';
import axios from 'axios';
import { Calculator, Wheat, IndianRupee, Sprout, HandCoins } from 'lucide-react';
import '../index.css';
import { API_URL } from '../config';
import { useLanguage } from '../contexts/LanguageContext';

export default function YieldCalculator() {
  const { t, currentLang } = useLanguage();
  const [cropsList, setCropsList] = useState([]);
  const [selectedCropId, setSelectedCropId] = useState('');
  const [acreage, setAcreage] = useState(1);
  const [cropData, setCropData] = useState(null);
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCrops = async () => {
      try {
        const res = await axios.get(`${API_URL}/crops`);
        setCropsList(res.data);
      } catch {
        console.error('Failed to load crop list.');
      }
    };
    fetchCrops();
  }, []);

  useEffect(() => {
    if (!selectedCropId) {
      setCropData(null);
      return;
    }
    const fetchCropDetails = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/crops/${selectedCropId}`);
        setCropData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCropDetails();
  }, [selectedCropId]);

  return (
    <div className="container page-wrapper">
      <div className="header-banner animate-fade-in-down" style={{ background: 'linear-gradient(135deg, #1565C0, #1976D2)' }}>
        <h1>{t('calcTitle')}</h1>
        <p>{t('calcSubtitle')}</p>
        <div style={{ position: 'absolute', top: '-20px', right: '-20px', opacity: 0.2, transform: 'scale(3)' }}>
          <Calculator size={120} />
        </div>
      </div>

      <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        
        <div className="glass-card animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--primary-green-dark)' }}>{t('calcInputs')}</h2>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>{t('selectCrop')}</label>
            <select 
              className="form-control"
              value={selectedCropId} 
              onChange={(e) => setSelectedCropId(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '1rem' }}
            >
              <option value="">{t('chooseCrop')}</option>
              {cropsList.map(c => (
                <option key={c.id} value={c.id}>{c.name[currentLang] || c.name.en} {currentLang !== 'en' && c.name.en !== c.name[currentLang] ? `(${c.name.en})` : ''}</option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>{t('landAreaAcres')}</label>
            <input 
              type="number" 
              min="0.1" 
              step="0.1"
              value={acreage}
              onChange={(e) => setAcreage(parseFloat(e.target.value) || 0)}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '1rem' }}
            />
          </div>
        </div>

        <div className="glass-card animate-fade-in-up" style={{ animationDelay: '0.2s', background: '#F8FAF8' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--primary-green-dark)' }}>{t('finProjections')}</h2>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}><div className="spinner"></div></div>
          ) : !cropData ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
              <Sprout size={48} style={{ opacity: 0.5, margin: '0 auto 1rem auto' }} />
              <p>{t('selectCropPrompt')}</p>
            </div>
          ) : (
            <div className="animate-fade-in-up">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid #E0E0E0' }}>
                <Wheat size={32} color="var(--primary-green)" />
                <div>
                  <span style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{t('expectedYield')}: </span>
                  <span style={{ fontSize: '1.2rem', color: 'var(--primary-green)' }}>{(cropData.yieldPerAcreQuintals * acreage).toFixed(1)} Quintals</span>
                </div>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem', marginLeft: '36px' }}>
                ({t('averageYield')} {cropData.yieldPerAcreQuintals} q/acre)
              </p>

              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '1.05rem' }}>
                  <span style={{ color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}><IndianRupee size={16} /> {t('govtRate')}</span>
                  <strong>₹{cropData.mspPerQuintal || 0}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: '#E8F5E9', borderRadius: '8px', border: '1px solid #C8E6C9', fontSize: '1.1rem' }}>
                  <span style={{ color: 'var(--text-main)' }}>{t('grossRevenue')}</span>
                  <strong style={{ color: 'var(--primary-green)' }}>₹{((cropData.yieldPerAcreQuintals * acreage) * (cropData.mspPerQuintal || 0)).toLocaleString()}</strong>
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ margin: '0 0 12px 0', color: 'var(--accent-urgent)' }}>{t('estExpenditure')}</h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.95rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{t('seeds')} ({acreage} {t('acres')})</span>
                  <strong>-₹{((cropData.seedCostPerAcre || 0) * acreage).toLocaleString()}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.95rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{t('fertilizers')}</span>
                  <strong>-₹{((cropData.fertilizerCostPerAcre || 0) * acreage).toLocaleString()}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid #E0E0E0', marginTop: '12px', fontSize: '1.05rem' }}>
                  <span style={{ fontWeight: 'bold' }}>{t('totalExpenditure')}</span>
                  <strong style={{ color: 'var(--accent-urgent)' }}>-₹{(((cropData.seedCostPerAcre || 0) + (cropData.fertilizerCostPerAcre || 0)) * acreage).toLocaleString()}</strong>
                </div>
              </div>

              <div style={{ background: 'var(--primary-green-light)', color: 'white', borderRadius: '12px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <HandCoins size={24} /> {t('projectedProfit')}
                </span>
                <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                  ₹{(((cropData.yieldPerAcreQuintals * acreage) * (cropData.mspPerQuintal || 0)) - (((cropData.seedCostPerAcre || 0) + (cropData.fertilizerCostPerAcre || 0)) * acreage)).toLocaleString()}
                </span>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
