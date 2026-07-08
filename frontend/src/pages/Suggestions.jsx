import { useState, useEffect } from 'react';
import axios from 'axios';
import { Lightbulb, Sprout, ShieldAlert } from 'lucide-react';
import '../index.css';
import { API_URL } from '../config';

export default function Suggestions() {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const farmerId = localStorage.getItem('krishimitraaz_farmer_id');

  useEffect(() => {
    const fetchSuitability = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/farmers/${farmerId}/suitability`);
        setSuggestions(res.data.suggestions);
      } catch {
        setError('Failed to fetch crop suggestions. Ensure location is enabled on the Dashboard first.');
      } finally {
        setLoading(false);
      }
    };

    fetchSuitability();
  }, [farmerId]);

  if (loading) {
    return (
      <div className="container loading-container">
        <div className="spinner"></div>
        <h2 className="animate-fade-in-up">Analyzing Microclimate...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container loading-container">
        <ShieldAlert size={64} color="var(--accent-urgent)" />
        <h2 style={{marginTop: '1rem', color: 'var(--accent-urgent)'}}>Analysis Error</h2>
        <p style={{marginBottom: '2rem'}}>{error}</p>
      </div>
    );
  }

  return (
    <div className="container page-wrapper">
      <div className="header-banner animate-fade-in-down" style={{ background: 'linear-gradient(135deg, #FF9800, #F57C00)' }}>
        <h1>Crop Suitability</h1>
        <p>Based on the latest weather data for your exact location, here are the crops most suited for your microclimate right now.</p>
        <div style={{ position: 'absolute', top: '-20px', right: '-20px', opacity: 0.2, transform: 'scale(3)' }}>
          <Lightbulb size={120} />
        </div>
      </div>

      <div className="dashboard-grid">
        {suggestions.map((crop, index) => (
          <div 
            key={index} 
            className="glass-card animate-fade-in-up severity-info"
            style={{animationDelay: `${0.1 + (index * 0.1)}s`}}
          >
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ background: 'var(--primary-green-light)', padding: '10px', borderRadius: '10px' }}>
                  <Sprout size={24} color="white" />
                </div>
                <h3 style={{ fontSize: '1.4rem', color: 'var(--text-main)', margin: 0 }}>
                  {crop.name.en} <span style={{fontSize: '1rem', color: 'var(--text-muted)'}}>({crop.name.hi})</span>
                </h3>
              </div>
              <div style={{ background: '#E8F5E9', color: 'var(--primary-green-dark)', padding: '4px 12px', borderRadius: '16px', fontWeight: 'bold' }}>
                {crop.score}% Match
              </div>
            </div>
            
            <p style={{ color: 'var(--text-main)', marginBottom: '12px', lineHeight: 1.5 }}>
              {crop.reasoning}
            </p>
            
            <div style={{ display: 'flex', gap: '16px', borderTop: '1px solid #EEE', paddingTop: '12px', marginBottom: '12px' }}>
              <div>
                <span style={{display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)'}}>Season</span>
                <strong>{crop.season.charAt(0).toUpperCase() + crop.season.slice(1)}</strong>
              </div>
              <div>
                <span style={{display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)'}}>Duration</span>
                <strong>{crop.durationDays} days</strong>
              </div>
              <div>
                <span style={{display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)'}}>Avg Yield</span>
                <strong>{crop.yieldPerAcreQuintals} q/acre</strong>
              </div>
            </div>

            <div style={{ background: '#F8FAF8', border: '1px solid #E0E0E0', padding: '12px', borderRadius: '8px' }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '0.95rem', color: 'var(--primary-green-dark)' }}>Financial Evaluation (per Acre)</h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '4px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Govt Rate (MSP):</span>
                <strong>₹{crop.mspPerQuintal}/q</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '4px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Est. Seed Cost:</span>
                <strong style={{ color: 'var(--accent-urgent)' }}>-₹{crop.seedCostPerAcre}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Est. Fertilizer Cost:</span>
                <strong style={{ color: 'var(--accent-urgent)' }}>-₹{crop.fertilizerCostPerAcre}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.05rem', borderTop: '1px solid #DDD', paddingTop: '8px' }}>
                <span style={{ fontWeight: 'bold' }}>Projected Profit Margin:</span>
                <strong style={{ color: 'var(--primary-green)' }}>
                  ₹{(crop.yieldPerAcreQuintals * crop.mspPerQuintal) - (crop.seedCostPerAcre + crop.fertilizerCostPerAcre)}
                </strong>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
