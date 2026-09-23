import { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowRight, RefreshCw } from 'lucide-react';
import { API_URL } from '../../config';

const DEFAULT_CROPS = [
  { id: 'wheat', en: 'Wheat', hi: 'गेहूं (Wheat)', msp: 2275, fallbackModal: 2275 },
  { id: 'rice', en: 'Paddy / Rice', hi: 'धान / चावल (Paddy)', msp: 2183, fallbackModal: 2320 },
  { id: 'mustard', en: 'Mustard Seed', hi: 'सरसों (Mustard)', msp: 5650, fallbackModal: 5650 },
  { id: 'cotton', en: 'Cotton (Medium)', hi: 'कपास (Cotton)', msp: 7020, fallbackModal: 7120 },
  { id: 'chickpea', en: 'Bengal Gram (Chana)', hi: 'चना (Gram)', msp: 5440, fallbackModal: 5440 }
];

export default function DashboardMandiTab({ isHi, navigate }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      setLoading(true);
      try {
        const fetched = await Promise.all(
          DEFAULT_CROPS.map(async (c) => {
            try {
              const res = await axios.get(`${API_URL}/market/mandi?commodity=${c.id}`, { timeout: 4000 });
              const avg = res.data?.averagePrice || c.fallbackModal;
              const msp = res.data?.govtMsp || c.msp;
              const diff = avg - msp;
              let trend = 'MSP Parity';
              let tag = '#059669';
              if (diff > 0) {
                trend = `+₹${diff.toLocaleString('en-IN')} Premium`;
                tag = '#059669';
              } else if (diff < 0) {
                trend = `-₹${Math.abs(diff).toLocaleString('en-IN')} below MSP`;
                tag = '#DC2626';
              }
              return {
                id: c.id,
                crop: isHi ? c.hi : c.en,
                price: `₹${avg.toLocaleString('en-IN')}`,
                msp: `₹${msp.toLocaleString('en-IN')}`,
                trend,
                tag
              };
            } catch {
              return {
                id: c.id,
                crop: isHi ? c.hi : c.en,
                price: `₹${c.fallbackModal.toLocaleString('en-IN')}`,
                msp: `₹${c.msp.toLocaleString('en-IN')}`,
                trend: 'MSP Parity',
                tag: '#059669'
              };
            }
          })
        );
        if (isMounted) setItems(fetched);
      } catch (err) {
        console.warn('Dashboard mandi fetch fallback:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadData();
    return () => { isMounted = false; };
  }, [isHi]);

  const displayList = items.length > 0 ? items : DEFAULT_CROPS.map(c => ({
    id: c.id,
    crop: isHi ? c.hi : c.en,
    price: `₹${c.fallbackModal.toLocaleString('en-IN')}`,
    msp: `₹${c.msp.toLocaleString('en-IN')}`,
    trend: 'MSP Parity',
    tag: '#059669'
  }));

  return (
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
          id="dashboard-explore-mandis-btn"
          onClick={() => navigate('/mandi')} 
          className="gov-btn gov-btn-primary"
          style={{ padding: '6px 14px', fontSize: '0.8rem' }}
        >
          <span>{isHi ? 'सभी 1,360+ मंडियां देखें' : 'Explore All 1,360+ Mandis'}</span>
          <ArrowRight size={14} />
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
        {displayList.map((c, i) => (
          <div key={i} style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '4px', padding: '12px', borderLeft: `4px solid ${c.tag}` }}>
            <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#1E293B' }}>{c.crop}</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0A3161', margin: '4px 0' }}>
              {c.price} <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600 }}>/ क्विंटल</span>
            </div>
            <div style={{ fontSize: '0.72rem', color: '#64748B', display: 'flex', justifyContent: 'space-between' }}>
              <span>MSP: {c.msp}</span>
              <span style={{ color: c.tag, fontWeight: 700 }}>{c.trend}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
