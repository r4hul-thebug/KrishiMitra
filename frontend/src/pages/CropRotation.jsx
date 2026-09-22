import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  Repeat, Sprout, Calendar, ShieldAlert, Sparkles, 
  TrendingUp, Award, Droplet, ArrowRight, CheckCircle2, Clock, Printer
} from 'lucide-react';

const CROPS = [
  { id: 'wheat', nameEn: 'Wheat', nameHi: 'गेहूं (Wheat)' },
  { id: 'rice', nameEn: 'Rice / Paddy', nameHi: 'धान (Rice / Paddy)' },
  { id: 'maize', nameEn: 'Maize', nameHi: 'मक्का (Maize)' },
  { id: 'cotton', nameEn: 'Cotton', nameHi: 'कपास (Cotton)' },
  { id: 'mustard', nameEn: 'Mustard', nameHi: 'सरसों (Mustard)' },
];

export default function CropRotation() {
  const { currentLang } = useLanguage();
  const isHi = currentLang === 'hi';

  const [selectedCrop, setSelectedCrop] = useState('wheat');
  const [rotationData, setRotationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activePlanIdx, setActivePlanIdx] = useState(0);

  useEffect(() => {
    document.title = isHi 
      ? 'फसल चक्रण एवं विविधीकरण योजना - कृषिमित्राज़' 
      : 'Crop Rotation & Diversification Plan - KrishiMitraaz';
  }, [isHi]);

  const fetchRotation = async (cropId) => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/rotation/${cropId}`);
      setRotationData(res.data);
    } catch (err) {
      console.error('Failed to fetch rotation data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRotation(selectedCrop);
  }, [selectedCrop]);

  const plans = rotationData?.details?.recommendedRotations || [];
  const currentPlan = plans[activePlanIdx] || plans[0];
  const timeline = rotationData?.details?.timeline || [];

  return (
    <div className="container" style={{ padding: '1.5rem 1rem 3rem', maxWidth: '1280px', margin: '0 auto' }}>
      {/* 1. Official Header Banner */}
      <div className="header-banner" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.15)', padding: '3px 10px', borderRadius: '3px', fontSize: '0.75rem', fontWeight: 700, marginBottom: '8px' }}>
              <Repeat size={14} color="#FDE047" />
              <span>{isHi ? 'भारतीय कृषि अनुसंधान परिषद (ICAR) एवं राष्ट्रीय खाद्य सुरक्षा मिशन' : 'ICAR & National Food Security Mission (Crop Diversification)'}</span>
            </div>
            <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 900 }}>
              {isHi ? 'वैज्ञानिक फसल चक्रण, मृदा पुनर्जनन एवं वार्षिक कृषि कैलेंडर' : 'Scientific Crop Rotation, Soil Rejuvenation & Agronomy Calendar'}
            </h1>
            <p style={{ margin: '6px 0 0', fontSize: '0.9rem', color: '#E2E8F0', maxWidth: '850px', lineHeight: 1.5 }}>
              {isHi 
                ? 'खरीफ → रबी → जायद त्रैमासिक वैज्ञानिक फसल क्रम: दलहनी फसलों द्वारा प्राकृतिक नाइट्रोजन स्थिरीकरण, एकफसली कीट चक्र का टूटना एवं प्रति एकड़ शुद्ध आय वृद्धि।'
                : 'Kharif → Rabi → Zaid seasonal agronomic sequencing to biologically fix atmospheric nitrogen, disrupt persistent monoculture soil pests, and optimize farm economics.'}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#FFFFFF' }}>{isHi ? 'वर्तमान फसल:' : 'Current Crop:'}</label>
            <select
              value={selectedCrop}
              onChange={(e) => {
                setSelectedCrop(e.target.value);
                setActivePlanIdx(0);
              }}
              style={{ padding: '6px 12px', borderRadius: '3px', border: '1px solid #CBD5E1', fontSize: '0.85rem', fontWeight: 700, background: '#FFFFFF', color: '#0A3161' }}
            >
              {CROPS.map(c => (
                <option key={c.id} value={c.id}>{isHi ? c.nameHi : c.nameEn}</option>
              ))}
            </select>

            <button
              onClick={() => window.print()}
              className="gov-btn gov-btn-secondary no-print"
              style={{ background: 'rgba(255,255,255,0.15)', color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.3)', padding: '6px 12px' }}
            >
              <Printer size={14} />
              <span>{isHi ? 'प्रिंट' : 'Print'}</span>
            </button>
          </div>
        </div>
      </div>

      {rotationData && (
        <>
          {/* Crop Profile Summary */}
          <div className="gov-card" style={{ marginBottom: '1.5rem' }}>
            <div className="gov-card-body" style={{ padding: '14px 16px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', background: '#F8FAFC' }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 800 }}>{isHi ? 'फसल कुल / परिवार' : 'Crop Family'}</span>
                <div style={{ fontWeight: 800, color: '#0A3161', fontSize: '0.95rem', marginTop: '2px' }}>{rotationData.details?.family}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 800 }}>{isHi ? 'सक्रिय मौसम' : 'Active Season'}</span>
                <div style={{ fontWeight: 800, color: '#004D25', fontSize: '0.95rem', marginTop: '2px' }}>{rotationData.details?.season}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 800 }}>{isHi ? 'जड़ गहराई प्रोफ़ाइल' : 'Root Depth Profile'}</span>
                <div style={{ fontWeight: 800, color: '#0A3161', fontSize: '0.95rem', marginTop: '2px' }}>{rotationData.details?.rootDepth}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 800 }}>{isHi ? 'पोषक तत्व मांग' : 'Nutrient Appetite'}</span>
                <div style={{ fontWeight: 800, color: '#D97706', fontSize: '0.95rem', marginTop: '2px' }}>{rotationData.details?.nutrientDemand}</div>
              </div>
            </div>
          </div>

          {/* Plan Selector Tabs */}
          <div style={{ display: 'flex', gap: '6px', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            {plans.map((p, i) => (
              <button
                key={i}
                onClick={() => setActivePlanIdx(i)}
                className={`gov-btn ${activePlanIdx === i ? 'gov-btn-primary' : 'gov-btn-secondary'}`}
                style={{ fontSize: '0.8rem' }}
              >
                <Award size={15} />
                <span>{p.planName}</span>
              </button>
            ))}
          </div>

          {/* Active Plan Showcase */}
          {currentPlan && (
            <div className="gov-card" style={{ marginBottom: '1.5rem', borderLeft: '4px solid #004D25' }}>
              <div className="gov-card-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sprout size={18} color="#004D25" />
                  <span>{currentPlan.planName}</span>
                </div>
                <span style={{ fontSize: '0.72rem', color: '#065F46', background: '#ECFDF5', padding: '2px 8px', borderRadius: '3px', fontWeight: 700 }}>
                  {isHi ? 'अनुशंसित चक्र' : 'Recommended Cycle'}
                </span>
              </div>

              <div className="gov-card-body" style={{ padding: '1.25rem' }}>
                <p style={{ color: '#475569', fontSize: '0.88rem', margin: '0 0 1rem 0', lineHeight: 1.5 }}>
                  {currentPlan.description}
                </p>

                {/* 3-Step Rotation Sequence Visual */}
                <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '4px', border: '1px solid #E2E8F0', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', alignItems: 'center' }}>
                    {(currentPlan.cycle || []).map((step, idx) => (
                      <div 
                        key={idx} 
                        style={{ 
                          background: '#FFFFFF', 
                          padding: '12px', 
                          borderRadius: '3px', 
                          border: '1px solid #CBD5E1',
                          textAlign: 'center'
                        }}
                      >
                        <div style={{ fontSize: '0.7rem', color: '#0A3161', fontWeight: 800, textTransform: 'uppercase', marginBottom: '2px' }}>
                          {isHi ? `चरण ${idx + 1}` : `Phase ${idx + 1}`}
                        </div>
                        <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#004D25' }}>
                          {step}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Impact Metrics Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  <div style={{ background: '#F0FDF4', border: '1px solid #DCFCE7', padding: '10px 12px', borderRadius: '3px' }}>
                    <span style={{ fontSize: '0.74rem', color: '#065F46', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Sprout size={14} /> {isHi ? 'प्राकृतिक नाइट्रोजन स्थिरीकरण' : 'Nitrogen Fixation'}
                    </span>
                    <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#065F46', marginTop: '2px' }}>
                      +{currentPlan.nitrogenFixedKgPerHa} kg/ha
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#047857' }}>{isHi ? 'वायुमंडलीय N₂ संचयन' : 'Atmospheric N₂ deposited'}</div>
                  </div>

                  <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', padding: '10px 12px', borderRadius: '3px' }}>
                    <span style={{ fontSize: '0.74rem', color: '#92400E', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <ShieldAlert size={14} /> {isHi ? 'कीट चक्र विराम' : 'Pest Disruption'}
                    </span>
                    <div style={{ fontSize: '1rem', fontWeight: 900, color: '#92400E', marginTop: '4px' }}>
                      {currentPlan.pestReductionRating}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#B45309' }}>{isHi ? 'कीट लार्वा संहार' : 'Breaks monoculture pests'}</div>
                  </div>

                  <div style={{ background: '#F0F9FF', border: '1px solid #BAE6FD', padding: '10px 12px', borderRadius: '3px' }}>
                    <span style={{ fontSize: '0.74rem', color: '#0369A1', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <TrendingUp size={14} /> {isHi ? 'आय वृद्धि अनुपात' : 'Income Boost'}
                    </span>
                    <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0369A1', marginTop: '2px' }}>
                      {currentPlan.incomeBoostPct}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#0284C7' }}>{isHi ? 'उच्चतम वार्षिक लाभ' : 'Net profitability boost'}</div>
                  </div>

                  <div style={{ background: '#FAF5FF', border: '1px solid #E9D5FF', padding: '10px 12px', borderRadius: '3px' }}>
                    <span style={{ fontSize: '0.74rem', color: '#6B21A8', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Sparkles size={14} /> {isHi ? 'मृदा कार्बन संवृद्धि' : 'Organic Carbon'}
                    </span>
                    <div style={{ fontSize: '1rem', fontWeight: 900, color: '#6B21A8', marginTop: '4px' }}>
                      {currentPlan.organicCarbonImpact}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#7E22CE' }}>{isHi ? 'दीर्घकालिक सूक्ष्मजीव स्वास्थ्य' : 'Soil microbial health'}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Agronomy Calendar */}
          <div className="gov-card">
            <div className="gov-card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={18} color="#0A3161" />
                <span>{isHi ? 'माहवार कृषि कार्य योजना एवं कैलेंडर' : 'Month-by-Month Agronomy Operations Calendar'}</span>
              </div>
              <span style={{ fontSize: '0.72rem', color: '#64748B' }}>ICAR Crop Almanac</span>
            </div>

            <div className="gov-card-body" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                {timeline.map((item, idx) => (
                  <div 
                    key={idx} 
                    style={{ 
                      border: '1px solid #CBD5E1', 
                      borderRadius: '3px', 
                      padding: '12px', 
                      background: '#FFFFFF',
                      borderLeft: `4px solid ${item.season === 'Kharif' ? '#004D25' : item.season === 'Rabi' ? '#D97706' : '#0A3161'}` 
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <strong style={{ fontSize: '0.88rem', color: '#0A3161' }}>
                        {item.month}
                      </strong>
                      <span style={{ 
                        padding: '1px 6px', 
                        borderRadius: '3px', 
                        fontSize: '0.7rem', 
                        fontWeight: 700,
                        background: item.season === 'Kharif' ? '#ECFDF5' : item.season === 'Rabi' ? '#FFFBEB' : '#EFF6FF',
                        color: item.season === 'Kharif' ? '#065F46' : item.season === 'Rabi' ? '#B45309' : '#1D4ED8'
                      }}>
                        {item.season} {isHi ? 'मौसम' : 'Season'}
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.82rem', color: '#475569', lineHeight: 1.4 }}>
                      {item.task}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
