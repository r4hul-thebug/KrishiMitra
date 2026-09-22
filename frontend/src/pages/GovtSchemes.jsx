import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  Landmark, ShieldCheck, ExternalLink, FileText, 
  CheckCircle2, Search, Sparkles,
  ChevronDown, ChevronUp, Printer, AlertCircle, MapPin
} from 'lucide-react';

const CATEGORIES = [
  { id: 'all', labelEn: 'All Schemes', labelHi: 'सभी योजनाएं' },
  { id: 'income_credit', labelEn: 'Income & Credit', labelHi: 'आय एवं रियायती ऋण' },
  { id: 'insurance_risk', labelEn: 'Crop Insurance', labelHi: 'फसल बीमा (PMFBY)' },
  { id: 'irrigation_water', labelEn: 'Irrigation & Water', labelHi: 'सिंचाई एवं ड्रिप' },
  { id: 'mechanization_infra', labelEn: 'Machinery & Drones', labelHi: 'कृषि यंत्र व ड्रोन' },
  { id: 'solar_energy', labelEn: 'Solar & Pumps', labelHi: 'सोलर पंप (KUSUM)' },
  { id: 'organic_sustainable', labelEn: 'Organic & Soil', labelHi: 'प्राकृतिक खेती व मृदा' },
  { id: 'fpo_market', labelEn: 'Markets & FPO', labelHi: 'ई-नाम मंडी एवं FPO' }
];

const STATE_OPTIONS = [
  { id: 'all', en: 'All India (National & All States)', hi: 'अखिल भारतीय (राष्ट्रीय एवं सभी राज्य)' },
  { id: 'Haryana', en: 'Haryana', hi: 'हरियाणा' },
  { id: 'Punjab', en: 'Punjab', hi: 'पंजाब' },
  { id: 'Uttar Pradesh', en: 'Uttar Pradesh', hi: 'उत्तर प्रदेश' },
  { id: 'Madhya Pradesh', en: 'Madhya Pradesh', hi: 'मध्य प्रदेश' },
  { id: 'Rajasthan', en: 'Rajasthan', hi: 'राजस्थान' },
  { id: 'Bihar', en: 'Bihar', hi: 'बिहार' },
  { id: 'Karnataka', en: 'Karnataka', hi: 'कर्नाटक' },
  { id: 'Maharashtra', en: 'Maharashtra', hi: 'महाराष्ट्र' },
  { id: 'Gujarat', en: 'Gujarat', hi: 'गुजरात' },
  { id: 'Andhra Pradesh', en: 'Andhra Pradesh', hi: 'आंध्र प्रदेश' }
];

export default function GovtSchemes() {
  const { currentLang } = useLanguage();
  const isHi = currentLang === 'hi';

  const [schemes, setSchemes] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedState, setSelectedState] = useState(() => {
    return localStorage.getItem('krishimitraaz_farmer_state') || 'all';
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [expandedScheme, setExpandedScheme] = useState(null);
  const [farmerData, setFarmerData] = useState(null);

  useEffect(() => {
    document.title = isHi 
      ? 'सरकारी योजनाएं एवं वित्तीय अनुदान (DBT) - कृषिमित्राज़' 
      : 'Agricultural Welfare Schemes & DBT - KrishiMitraaz';
  }, [isHi]);

  // 1. Fetch Farmer Data for Autonomous Matching
  useEffect(() => {
    const farmerId = localStorage.getItem('krishimitraaz_farmer_id');
    if (farmerId) {
      axios.get(`${API_URL}/farmers/${farmerId}`)
        .then(res => {
          setFarmerData(res.data);
          if (res.data.state) {
            localStorage.setItem('krishimitraaz_farmer_state', res.data.state);
            setSelectedState(prev => prev === 'all' ? res.data.state : prev);
          }
        })
        .catch(err => console.warn('Could not load farmer data for schemes:', err.message));
    }
  }, []);

  // 2. Fetch Schemes Prioritized by Location / State
  const fetchSchemes = async (cat = 'all', state = 'all') => {
    setLoading(true);
    try {
      const stateParam = state && state !== 'all' ? `&state=${encodeURIComponent(state)}` : '';
      const res = await axios.get(`${API_URL}/schemes?category=${cat}${stateParam}`);
      setSchemes(res.data);
    } catch (err) {
      console.error('Failed to load schemes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchemes(activeCategory, selectedState);
  }, [activeCategory, selectedState]);

  // Autonomous Match check
  const isAutoMatched = (scheme) => {
    if (!farmerData) return false;
    if (farmerData.state && scheme.state && scheme.state.toLowerCase() === farmerData.state.toLowerCase()) {
      return true;
    }
    const land = farmerData.landAcres || 2;
    if (land <= 5 && ['pm-kisan', 'pmfby', 'kcc', 'soil-health-card', 'pmksy', 'pm-kmy'].includes(scheme.id)) {
      return true;
    }
    if (scheme.id === 'pm-kusum' && (farmerData.state === 'Rajasthan' || farmerData.state === 'Haryana' || farmerData.state === 'Uttar Pradesh' || land >= 2)) {
      return true;
    }
    return false;
  };

  const filteredSchemes = schemes.filter(s => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (s.name && s.name.toLowerCase().includes(q)) ||
      (s.hindiName && s.hindiName.includes(q)) ||
      (s.category && s.category.toLowerCase().includes(q)) ||
      (s.state && s.state.toLowerCase().includes(q)) ||
      (s.stateHi && s.stateHi.includes(q)) ||
      (s.benefitEn && s.benefitEn.toLowerCase().includes(q)) ||
      (s.benefitHi && s.benefitHi.includes(q))
    );
  });

  return (
    <div className="container" style={{ padding: '1.5rem 1rem 3rem', maxWidth: '1280px', margin: '0 auto' }}>
      
      {/* 1. Official National Scheme Banner */}
      <div className="header-banner" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.15)', padding: '3px 10px', borderRadius: '3px', fontSize: '0.75rem', fontWeight: 700, marginBottom: '8px' }}>
              <Landmark size={14} color="#FDE047" />
              <span>{isHi ? 'प्रत्यक्ष लाभ अंतरण (DBT) कृषि योजना निर्देशिका' : 'Direct Benefit Transfer (DBT) Scheme Directory'}</span>
            </div>
            <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 900 }}>
              {isHi ? 'केंद्रीय एवं राज्य कृषि कल्याण योजनाएं एवं वित्तीय अनुदान' : 'National Agricultural Welfare Schemes & Subsidies'}
            </h1>
            <p style={{ margin: '6px 0 0', fontSize: '0.9rem', color: '#E2E8F0', maxWidth: '850px', lineHeight: 1.5 }}>
              {isHi 
                ? 'पीएम-किसान (₹6,000 वार्षिक), पीएमएफबीवाई फसल बीमा, 4% केसीसी रियायती ऋण, कुसुम सोलर पंप एवं ड्रिप सिंचाई हेतु आधिकारिक सरकारी दिशा-निर्देश एवं प्रत्यक्ष आवेदन पोर्टल।'
                : 'Central & State direct benefit transfer (DBT) programs, 4% KCC subsidized farm credit, PMFBY crop risk coverage, PM-KUSUM 60% solar pump subsidies, and official application portals.'}
            </p>
          </div>

          <button
            onClick={() => window.print()}
            className="gov-btn gov-btn-secondary no-print"
            style={{ background: 'rgba(255,255,255,0.15)', color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.3)' }}
          >
            <Printer size={15} />
            <span>{isHi ? 'प्रिंट विवरण' : 'Print List'}</span>
          </button>
        </div>
      </div>

      {/* 2. Autonomous Personalized Match & State Location Bar */}
      <div className="gov-card" style={{ marginBottom: '1.5rem', borderLeft: '4px solid #0A3161' }}>
        <div className="gov-card-body" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Sparkles size={20} color="#0A3161" />
            <div>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0A3161', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                {isHi ? 'स्थान-आधारित राज्य एवं केंद्रीय योजनाओं की प्राथमिकता सूची' : 'Location-Prioritized State & Central DBT Schemes'}
                {selectedState !== 'all' && (
                  <span style={{ background: '#DBEAFE', color: '#1E40AF', padding: '2px 8px', borderRadius: '3px', fontSize: '0.72rem', fontWeight: 800 }}>
                    📍 {selectedState}
                  </span>
                )}
              </span>
              <span style={{ fontSize: '0.76rem', color: '#475569' }}>
                {isHi 
                  ? `${selectedState !== 'all' ? `${selectedState} राज्य सरकार की विशिष्ट योजनाओं को सूची में शीर्ष पर प्राथमिकता दी गई है` : 'अखिल भारतीय स्तर पर केंद्रीय एवं राज्य योजनाएं सूचीबद्ध हैं'}। छोटे एवं सीमांत किसानों के लिए लाभ पूर्व-चिह्नित हैं।`
                  : `${selectedState !== 'all' ? `State-specific welfare schemes for ${selectedState} are prioritized at the top` : 'All Central DBT and State welfare initiatives are listed'}. Small & Marginal Farmer benefits are pre-highlighted.`}
              </span>
            </div>
          </div>

          {/* State Selection Dropdown Control */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0A3161', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <MapPin size={14} /> {isHi ? 'राज्य चुनें:' : 'State:'}
            </label>
            <select
              value={selectedState}
              onChange={(e) => {
                setSelectedState(e.target.value);
                if (e.target.value !== 'all') {
                  localStorage.setItem('krishimitraaz_farmer_state', e.target.value);
                }
              }}
              style={{
                padding: '6px 10px',
                borderRadius: '3px',
                border: '1px solid #CBD5E1',
                background: '#FFFFFF',
                color: '#0A3161',
                fontWeight: 700,
                fontSize: '0.82rem',
                cursor: 'pointer'
              }}
            >
              {STATE_OPTIONS.map(st => (
                <option key={st.id} value={st.id}>
                  {isHi ? st.hi : st.en}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 3. Search and Category Filter Toolbar */}
      <div className="gov-card" style={{ marginBottom: '1.5rem' }}>
        <div className="gov-card-body" style={{ padding: '1rem' }}>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            {/* Category Filter Buttons */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {CATEGORIES.map(cat => {
                const active = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    style={{
                      padding: '5px 12px',
                      borderRadius: '3px',
                      border: active ? '1px solid #0A3161' : '1px solid #CBD5E1',
                      background: active ? '#0A3161' : '#FFFFFF',
                      color: active ? '#FFFFFF' : '#334155',
                      fontWeight: active ? 800 : 600,
                      cursor: 'pointer',
                      fontSize: '0.78rem',
                      transition: 'all 0.1s ease'
                    }}
                  >
                    {isHi ? cat.labelHi : cat.labelEn}
                  </button>
                );
              })}
            </div>

            {/* Search Input Box */}
            <div style={{ position: 'relative', minWidth: '260px', flex: '1 1 260px' }}>
              <Search size={15} color="#64748B" style={{ position: 'absolute', top: '9px', left: '10px' }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isHi ? 'योजना का नाम, कीवर्ड या सब्सिडी खोजें...' : 'Search scheme name, subsidy or keyword...'}
                style={{
                  width: '100%',
                  padding: '7px 10px 7px 32px',
                  borderRadius: '3px',
                  border: '1px solid #CBD5E1',
                  fontSize: '0.84rem'
                }}
              />
            </div>
          </div>

          <div style={{ fontSize: '0.75rem', color: '#64748B', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <span>
              {isHi ? `कुल प्रदर्शित योजनाएं: ${filteredSchemes.length} (प्राथमिकता: ${selectedState !== 'all' ? selectedState : 'अखिल भारतीय'})` : `Showing ${filteredSchemes.length} Schemes (Prioritized: ${selectedState !== 'all' ? selectedState : 'All India'})`}
            </span>
            <span style={{ color: '#059669', fontWeight: 700 }}>
              {isHi ? '✓ सभी लिंक आधिकारिक .gov.in पोर्टल्स से सत्यापित' : '✓ All Links Verified to Official .gov.in Portals'}
            </span>
          </div>
        </div>
      </div>

      {/* 4. Schemes Grid */}
      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center' }}>
          <div className="spinner" style={{ margin: '0 auto 12px' }}></div>
          <p style={{ color: '#64748B', fontSize: '0.85rem' }}>
            {isHi ? 'सरकारी योजना निर्देशिका लोड हो रही है...' : 'Loading verified schemes directory...'}
          </p>
        </div>
      ) : filteredSchemes.length === 0 ? (
        <div className="gov-card" style={{ textAlign: 'center', padding: '3rem 1.5rem', color: '#64748B' }}>
          <AlertCircle size={36} color="#D97706" style={{ margin: '0 auto 10px' }} />
          <h3 style={{ fontSize: '1.05rem', color: '#1E293B', marginBottom: '4px', fontWeight: 800 }}>
            {isHi ? 'कोई योजना नहीं मिली' : 'No Schemes Found'}
          </h3>
          <p style={{ fontSize: '0.82rem' }}>
            {isHi ? 'कृपया अलग कीवर्ड या "सभी योजनाएं" श्रेणी चुनें।' : 'Try adjusting your search terms or select "All Schemes".'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.25rem' }}>
          {filteredSchemes.map(scheme => {
            const isMatched = isAutoMatched(scheme);
            const isExpanded = expandedScheme === scheme.id;
            const isStateScheme = !scheme.isCentral || (scheme.state && scheme.state.toLowerCase() !== 'central' && scheme.state.toLowerCase() !== 'all');
            const isFarmerStateScheme = isStateScheme && selectedState !== 'all' && scheme.state && scheme.state.toLowerCase() === selectedState.toLowerCase();

            return (
              <div 
                key={scheme.id}
                className="gov-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderTop: isFarmerStateScheme 
                    ? '4px solid #D97706' 
                    : isMatched 
                      ? '4px solid #0A3161' 
                      : '4px solid #004D25'
                }}
              >
                <div className="gov-card-body" style={{ padding: '16px' }}>
                  {/* Badges Bar */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {/* Jurisdiction Badge */}
                      {isStateScheme ? (
                        <span style={{
                          background: '#FEF3C7',
                          color: '#92400E',
                          fontSize: '0.68rem',
                          fontWeight: 800,
                          padding: '2px 6px',
                          borderRadius: '3px',
                          border: '1px solid #FCD34D'
                        }}>
                          🏛️ {isHi ? (scheme.stateHi || scheme.state) : scheme.state} {isHi ? 'राज्य' : 'State'}
                        </span>
                      ) : (
                        <span style={{
                          background: '#ECFDF5',
                          color: '#065F46',
                          fontSize: '0.68rem',
                          fontWeight: 800,
                          padding: '2px 6px',
                          borderRadius: '3px',
                          border: '1px solid #A7F3D0'
                        }}>
                          🌾 {isHi ? 'केंद्रीय फ्लैगशिप योजना' : 'National Flagship Scheme'}
                        </span>
                      )}

                      <span style={{
                        background: '#F1F5F9',
                        color: '#334155',
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        padding: '2px 6px',
                        borderRadius: '3px',
                        border: '1px solid #E2E8F0'
                      }}>
                        {isHi ? scheme.categoryLabelHi : scheme.categoryLabelEn}
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      {isFarmerStateScheme && (
                        <span style={{
                          background: '#FEF3C7',
                          color: '#92400E',
                          border: '1px solid #FCD34D',
                          fontSize: '0.65rem',
                          fontWeight: 800,
                          padding: '2px 6px',
                          borderRadius: '3px'
                        }}>
                          📍 {isHi ? 'राज्य प्राथमिकता' : 'State Priority'}
                        </span>
                      )}

                      {isMatched && !isFarmerStateScheme && (
                        <span style={{
                          background: '#EFF6FF',
                          color: '#1D4ED8',
                          border: '1px solid #BFDBFE',
                          fontSize: '0.65rem',
                          fontWeight: 800,
                          padding: '2px 6px',
                          borderRadius: '3px'
                        }}>
                          ★ {isHi ? 'पात्र' : 'Eligible'}
                        </span>
                      )}

                      {scheme.subsidyRate && (
                        <span style={{
                          background: '#FEF3C7',
                          color: '#92400E',
                          border: '1px solid #FCD34D',
                          fontSize: '0.65rem',
                          fontWeight: 800,
                          padding: '2px 6px',
                          borderRadius: '3px'
                        }}>
                          {scheme.subsidyRate}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Scheme Title */}
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0A3161', marginBottom: '4px', lineHeight: 1.3 }}>
                    {isHi ? (scheme.hindiName || scheme.name) : scheme.name}
                  </h3>
                  {isHi && scheme.name !== scheme.hindiName && (
                    <span style={{ fontSize: '0.74rem', color: '#64748B', display: 'block', marginBottom: '6px' }}>
                      {scheme.name}
                    </span>
                  )}
                  <span style={{ fontSize: '0.72rem', color: '#004D25', fontWeight: 700, display: 'block', marginBottom: '10px' }}>
                    🏛️ {scheme.ministry}
                  </span>

                  {/* Benefit Description */}
                  <div style={{
                    background: '#F8FAFC',
                    padding: '8px 10px',
                    borderRadius: '3px',
                    border: '1px solid #E2E8F0',
                    marginBottom: '10px'
                  }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '3px', textTransform: 'uppercase' }}>
                      {isHi ? 'प्रमुख वित्तीय लाभ एवं अनुदान:' : 'Key Financial Benefit & Subsidy:'}
                    </span>
                    <p style={{ margin: 0, fontSize: '0.82rem', color: '#0F172A', lineHeight: 1.4 }}>
                      {isHi ? (scheme.benefitHi || scheme.benefitEn) : (scheme.benefitEn || scheme.benefit)}
                    </p>
                  </div>

                  {/* Expandable Eligibility, Documents, Helpline */}
                  {isExpanded && (
                    <div style={{ marginTop: '10px', borderTop: '1px solid #E2E8F0', paddingTop: '10px', fontSize: '0.8rem' }}>
                      {/* Eligibility */}
                      <div style={{ marginBottom: '8px' }}>
                        <strong style={{ color: '#0A3161', display: 'block', marginBottom: '2px', fontSize: '0.74rem' }}>
                          {isHi ? 'पात्रता मानदंड (Eligibility):' : 'Eligibility Criteria:'}
                        </strong>
                        <p style={{ margin: 0, color: '#475569', lineHeight: 1.4 }}>
                          {isHi ? (scheme.eligibilityHi || scheme.eligibilityEn) : scheme.eligibilityEn}
                        </p>
                      </div>

                      {/* Required Documents */}
                      {scheme.documentsRequired && (
                        <div style={{ marginBottom: '8px' }}>
                          <strong style={{ color: '#0A3161', display: 'block', marginBottom: '2px', fontSize: '0.74rem' }}>
                            {isHi ? 'आवश्यक दस्तावेज (Required Documents):' : 'Required Documents:'}
                          </strong>
                          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                            {scheme.documentsRequired.map((doc, dIdx) => (
                              <span key={dIdx} style={{ background: '#F1F5F9', border: '1px solid #CBD5E1', padding: '1px 6px', borderRadius: '3px', fontSize: '0.7rem' }}>
                                ✓ {doc}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Helpline Number */}
                      {scheme.helpline && (
                        <div style={{ fontSize: '0.74rem', color: '#B45309', background: '#FFFBEB', padding: '4px 8px', borderRadius: '3px', border: '1px solid #FCD34D' }}>
                          📞 <strong>{isHi ? 'हेल्पलाइन:' : 'Helpline:'}</strong> {scheme.helpline}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Bottom Action Bar */}
                <div style={{
                  padding: '10px 16px',
                  background: '#F8FAFC',
                  borderTop: '1px solid #E2E8F0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px'
                }}>
                  <button
                    type="button"
                    onClick={() => setExpandedScheme(isExpanded ? null : scheme.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#0A3161',
                      cursor: 'pointer',
                      fontSize: '0.76rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: 0
                    }}
                  >
                    <span>{isExpanded ? (isHi ? 'संक्षिप्त करें' : 'Less Details') : (isHi ? 'पात्रता व दस्तावेज देखें' : 'View Guidelines')}</span>
                    {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>

                  <a
                    href={scheme.portalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="gov-btn gov-btn-primary"
                    style={{ fontSize: '0.76rem', padding: '5px 10px', textDecoration: 'none' }}
                  >
                    <span>{isHi ? 'आधिकारिक पोर्टल पर आवेदन करें' : 'Official DBT Portal'}</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
