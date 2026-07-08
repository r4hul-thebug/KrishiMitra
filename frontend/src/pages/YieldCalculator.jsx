import { useState, useEffect } from 'react';
import axios from 'axios';
import { Calculator, Sprout, HandCoins, Landmark } from 'lucide-react';
import '../index.css';
import { API_URL } from '../config';

export default function YieldCalculator() {
  const [cropsList, setCropsList] = useState([]);
  const [selectedCropId, setSelectedCropId] = useState('');
  const [acreage, setAcreage] = useState(1);
  const [cropData, setCropData] = useState(null);
  
  const [loading, setLoading] = useState(false);

  // Initial load: Fetch list of crops
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

  // When crop is selected, fetch full details for financial projection
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
      <div className="header-banner animate-fade-in-down" style={{ background: 'linear-gradient(135deg, #2196F3, #1976D2)' }}>
        <h1>Yield & Financial Calculator</h1>
        <p>Estimate gross production, revenue, and profit margins based on real-time ICAR guidelines and Govt MSP.</p>
        <div style={{ position: 'absolute', top: '-20px', right: '-20px', opacity: 0.2, transform: 'scale(3)' }}>
          <Calculator size={120} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        
        {/* Input Form Column */}
        <div className="glass-card animate-fade-in-up">
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--primary-green-dark)' }}>Calculator Inputs</h2>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Select Crop</label>
            <select 
              className="form-control"
              value={selectedCropId} 
              onChange={(e) => setSelectedCropId(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '1rem' }}
            >
              <option value="">-- Choose a Crop --</option>
              {cropsList.map(c => (
                <option key={c.id} value={c.id}>{c.name.en} ({c.name.hi})</option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Land Area (in Acres)</label>
            <input 
              type="number" 
              min="0.1" 
              step="0.1"
              value={acreage}
              onChange={(e) => setAcreage(parseFloat(e.target.value) || 0)}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '1rem' }}
            />
          </div>
          
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            * This calculator utilizes the latest agricultural engineering models combined with average Govt Minimum Support Prices (MSP) and standard input costs.
          </p>
        </div>

        {/* Results Column */}
        <div className="glass-card animate-fade-in-up" style={{ animationDelay: '0.1s', background: '#F8FAF8' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--primary-green-dark)' }}>Financial Projections</h2>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}><div className="spinner"></div></div>
          ) : !cropData ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
              <Calculator size={48} style={{ opacity: 0.5, marginBottom: '1rem' }} />
              <p>Select a crop and enter your land area to view projections.</p>
            </div>
          ) : (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
                <Sprout size={24} color="var(--primary-green)" />
                <span style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Expected Yield: </span>
                <span style={{ fontSize: '1.2rem', color: 'var(--primary-green)' }}>{(cropData.yieldPerAcreQuintals * acreage).toFixed(1)} Quintals</span>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem', marginLeft: '36px' }}>
                (Based on average {cropData.yieldPerAcreQuintals} q/acre)
              </p>

              <div style={{ background: 'white', borderRadius: '12px', padding: '16px', border: '1px solid #E0E0E0', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Landmark size={18} /> Govt MSP (per q)
                  </span>
                  <strong>₹{cropData.mspPerQuintal || 0}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: 'var(--text-main)' }}>Gross Revenue</span>
                  <strong style={{ color: 'var(--primary-green)' }}>₹{((cropData.yieldPerAcreQuintals * acreage) * (cropData.mspPerQuintal || 0)).toLocaleString()}</strong>
                </div>
              </div>

              <div style={{ background: 'white', borderRadius: '12px', padding: '16px', border: '1px solid #E0E0E0', marginBottom: '1rem' }}>
                <h4 style={{ margin: '0 0 12px 0', color: 'var(--accent-urgent)' }}>Estimated Expenditure</h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Seeds ({acreage} acres)</span>
                  <strong>-₹{((cropData.seedCostPerAcre || 0) * acreage).toLocaleString()}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Fertilizers & Protection</span>
                  <strong>-₹{((cropData.fertilizerCostPerAcre || 0) * acreage).toLocaleString()}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #EEE', paddingTop: '8px' }}>
                  <span style={{ fontWeight: 'bold' }}>Total Expenditure</span>
                  <strong style={{ color: 'var(--accent-urgent)' }}>-₹{(((cropData.seedCostPerAcre || 0) + (cropData.fertilizerCostPerAcre || 0)) * acreage).toLocaleString()}</strong>
                </div>
              </div>

              <div style={{ background: 'var(--primary-green-light)', color: 'white', borderRadius: '12px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <HandCoins size={24} /> Projected Profit
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
