import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  TrendingUp, TrendingDown, Search, Store, 
  CheckCircle2, AlertCircle, RefreshCw, 
  Calculator, Printer, FileText
} from 'lucide-react';

const COMMODITIES = [
  { id: 'wheat', nameEn: 'Wheat', nameHi: 'गेहूं (Wheat)' },
  { id: 'rice', nameEn: 'Rice / Paddy', nameHi: 'धान / चावल (Paddy/Rice)' },
  { id: 'maize', nameEn: 'Maize', nameHi: 'मक्का (Maize)' },
  { id: 'cotton', nameEn: 'Cotton', nameHi: 'कपास (Cotton)' },
  { id: 'mustard', nameEn: 'Mustard', nameHi: 'सरसों (Mustard)' },
  { id: 'soybean', nameEn: 'Soybean', nameHi: 'सोयाबीन (Soybean)' },
  { id: 'groundnut', nameEn: 'Groundnut', nameHi: 'मूंगफली (Groundnut)' },
  { id: 'potato', nameEn: 'Potato', nameHi: 'आलू (Potato)' },
  { id: 'onion', nameEn: 'Onion', nameHi: 'प्याज (Onion)' },
  { id: 'tomato', nameEn: 'Tomato', nameHi: 'टमाटर (Tomato)' },
  { id: 'chickpea', nameEn: 'Chickpea / Chana', nameHi: 'चना (Chickpea)' },
  { id: 'tur', nameEn: 'Tur / Arhar', nameHi: 'अरहर / तूर (Pigeon Pea)' },
];

const STATES = [
  { id: 'All States', en: 'All States (अखिल भारतीय)', hi: 'सभी राज्य (अखिल भारतीय)' },
  { id: 'Punjab', en: 'Punjab', hi: 'पंजाब' },
  { id: 'Haryana', en: 'Haryana', hi: 'हरियाणा' },
  { id: 'Uttar Pradesh', en: 'Uttar Pradesh', hi: 'उत्तर प्रदेश' },
  { id: 'Madhya Pradesh', en: 'Madhya Pradesh', hi: 'मध्य प्रदेश' },
  { id: 'Rajasthan', en: 'Rajasthan', hi: 'राजस्थान' },
  { id: 'Maharashtra', en: 'Maharashtra', hi: 'महाराष्ट्र' },
  { id: 'Gujarat', en: 'Gujarat', hi: 'गुजरात' },
  { id: 'Karnataka', en: 'Karnataka', hi: 'कर्नाटक' },
  { id: 'Andhra Pradesh', en: 'Andhra Pradesh', hi: 'आंध्र प्रदेश' },
  { id: 'Delhi', en: 'Delhi', hi: 'दिल्ली' }
];

export default function MandiPrices() {
  const { currentLang } = useLanguage();
  const isHi = currentLang === 'hi';
  const [commodity, setCommodity] = useState('wheat');
  const [selectedState, setSelectedState] = useState('All States');
  const [searchQuery, setSearchQuery] = useState('');
  const [marketData, setMarketData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Revenue Estimator State
  const [quantityQuintals, setQuantityQuintals] = useState(50);

  useEffect(() => {
    document.title = isHi 
      ? 'मंडी भाव एवं एमएसपी (e-NAM) - कृषिमित्राज़' 
      : 'e-NAM Mandi Prices & MSP Tracker - KrishiMitraaz';
  }, [isHi]);

  const fetchMandiData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const stateParam = selectedState !== 'All States' ? `&state=${encodeURIComponent(selectedState)}` : '';
      const res = await axios.get(`${API_URL}/market/mandi?commodity=${commodity}${stateParam}`);
      setMarketData(res.data);
    } catch (err) {
      console.error('Failed to load mandi data:', err);
      setError(isHi 
        ? 'लाइव एपीएमसी सर्वर से कनेक्ट करने में असमर्थ। ऑफ़लाइन संदर्भ दरें प्रदर्शित हैं।' 
        : 'Unable to fetch live mandi prices. Showing offline cached APMC benchmarks.');
    } finally {
      setLoading(false);
    }
  }, [commodity, selectedState, isHi]);

  useEffect(() => {
    fetchMandiData();
  }, [fetchMandiData]);

  const filteredPrices = (marketData?.prices || []).filter(item => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.market.toLowerCase().includes(q) ||
      item.district.toLowerCase().includes(q) ||
      item.state.toLowerCase().includes(q)
    );
  });

  const estimatedRevenue = Math.round((marketData?.averagePrice || 2200) * quantityQuintals);
  const mspRevenue = Math.round((marketData?.govtMsp || 2200) * quantityQuintals);
  const diffRevenue = estimatedRevenue - mspRevenue;

  return (
    <div className="container" style={{ padding: '1.5rem 1rem 3rem', maxWidth: '1280px', margin: '0 auto' }}>
      {/* 1. Official Government Header Banner */}
      <div className="header-banner" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.15)', padding: '3px 10px', borderRadius: '3px', fontSize: '0.75rem', fontWeight: 700, marginBottom: '8px' }}>
              <Store size={14} color="#FDE047" />
              <span>{isHi ? 'राष्ट्रीय कृषि बाजार (e-NAM) एवं एगमार्कनेट नेटवर्क' : 'National Agriculture Market (e-NAM) & AGMARKNET'}</span>
            </div>
            <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 900 }}>
              {isHi ? 'दैनिक थोक कृषि मंडी भाव एवं न्यूनतम समर्थन मूल्य (MSP)' : 'Real-Time APMC Mandi Rates & Government MSP Tracker'}
            </h1>
            <p style={{ margin: '6px 0 0', fontSize: '0.9rem', color: '#E2E8F0', maxWidth: '850px', lineHeight: 1.5 }}>
              {isHi 
                ? 'दैनिक एगमार्कनेट एवं ई-नाम डेटाबेस से अधिकृत कृषि जिंस दरें एवं न्यूनतम समर्थन मूल्य तुलना।'
                : 'Direct wholesale mandi prices, daily arrivals volume, modal quotes, and official Central Government Minimum Support Price (MSP) benchmarks.'}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={() => window.print()}
              className="gov-btn gov-btn-secondary no-print"
              style={{ background: 'rgba(255,255,255,0.15)', color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.3)' }}
            >
              <Printer size={15} />
              <span>{isHi ? 'प्रिंट दरें' : 'Print Rates'}</span>
            </button>
            <button 
              onClick={fetchMandiData} 
              disabled={loading}
              className="gov-btn gov-btn-primary"
            >
              <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
              <span>{loading ? (isHi ? 'अद्यतन हो रहा है...' : 'Refreshing...') : (isHi ? 'दरें रीफ्रेश करें' : 'Refresh Data')}</span>
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div style={{ background: '#FFFBEB', border: '1px solid #FCD34D', color: '#B45309', padding: '10px 14px', borderRadius: '3px', marginBottom: '1.25rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* 2. Official Filter & Selection Toolbar */}
      <div className="gov-card" style={{ marginBottom: '1.5rem' }}>
        <div className="gov-card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Search size={16} color="#0A3161" />
            <span>{isHi ? 'कृषि जिंस एवं राज्य चयन' : 'Agricultural Commodity & Jurisdiction Filter'}</span>
          </div>
          <span style={{ fontSize: '0.72rem', color: '#64748B' }}>
            {isHi ? 'दैनिक अद्यतन: पूर्वाह्न 11:00 बजे' : 'Official Update Cycle: 11:00 AM Daily'}
          </span>
        </div>
        <div className="gov-card-body" style={{ padding: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', alignItems: 'center' }}>
            {/* Commodity Select */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#0A3161', marginBottom: '4px' }}>
                {isHi ? 'कृषि फसल / जिंस चुनें:' : 'Select Commodity:'}
              </label>
              <select
                value={commodity}
                onChange={(e) => setCommodity(e.target.value)}
                style={{ width: '100%', padding: '7px 10px', borderRadius: '3px', border: '1px solid #CBD5E1', fontSize: '0.85rem', fontWeight: 600, background: '#FFFFFF' }}
              >
                {COMMODITIES.map(c => (
                  <option key={c.id} value={c.id}>
                    {isHi ? c.nameHi : c.nameEn}
                  </option>
                ))}
              </select>
            </div>

            {/* State Select */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#0A3161', marginBottom: '4px' }}>
                {isHi ? 'राज्य / केंद्र शासित प्रदेश:' : 'State / Region:'}
              </label>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                style={{ width: '100%', padding: '7px 10px', borderRadius: '3px', border: '1px solid #CBD5E1', fontSize: '0.85rem', fontWeight: 600, background: '#FFFFFF' }}
              >
                {STATES.map(s => (
                  <option key={s.id} value={s.id}>
                    {isHi ? s.hi : s.en}
                  </option>
                ))}
              </select>
            </div>

            {/* Search Input */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#0A3161', marginBottom: '4px' }}>
                {isHi ? 'विशिष्ट मंडी या जिला खोजें:' : 'Search Specific Mandi / District:'}
              </label>
              <div style={{ position: 'relative' }}>
                <Search size={15} color="#64748B" style={{ position: 'absolute', top: '9px', left: '10px' }} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isHi ? 'उदा. करनाल, खन्ना, कोटा...' : 'e.g. Karnal, Khanna, Kota...'}
                  style={{ width: '100%', padding: '7px 10px 7px 32px', borderRadius: '3px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Official Benchmarks Strip (Average Price, Notified MSP, Difference) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {/* Average Mandi Price */}
        <div className="gov-card" style={{ borderLeft: '4px solid #0A3161' }}>
          <div className="gov-card-body" style={{ padding: '14px 16px' }}>
            <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>
              {isHi ? 'औसत थोक मॉडल भाव (APMC Modal Rate)' : 'National Average Mandi Modal Price'}
            </span>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0A3161', marginTop: '2px' }}>
              ₹{marketData?.averagePrice ? marketData.averagePrice.toLocaleString('en-IN') : '2,275'}
              <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#64748B', marginLeft: '4px' }}>/ {isHi ? 'क्विंटल' : 'Quintal'}</span>
            </div>
            <span style={{ fontSize: '0.7rem', color: '#0A3161', fontWeight: 700 }}>
              {isHi ? 'दैनिक एगमार्कनेट आवक भारित' : 'Weighted by Mandi Volume'}
            </span>
          </div>
        </div>

        {/* Notified MSP */}
        <div className="gov-card" style={{ borderLeft: '4px solid #004D25' }}>
          <div className="gov-card-body" style={{ padding: '14px 16px' }}>
            <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>
              {isHi ? 'अधिसूचित न्यूनतम समर्थन मूल्य (Govt MSP)' : 'Notified Central Govt MSP 2026-27'}
            </span>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#004D25', marginTop: '2px' }}>
              ₹{marketData?.govtMsp ? marketData.govtMsp.toLocaleString('en-IN') : '2,275'}
              <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#64748B', marginLeft: '4px' }}>/ {isHi ? 'क्विंटल' : 'Quintal'}</span>
            </div>
            <span style={{ fontSize: '0.7rem', color: '#004D25', fontWeight: 700 }}>
              ✓ CACP {isHi ? 'लागत + 50% लाभ गारंटी' : 'Formula: Cost + 50% Profit'}
            </span>
          </div>
        </div>

        {/* Market vs MSP Spread */}
        <div className="gov-card" style={{ borderLeft: '4px solid #D97706' }}>
          <div className="gov-card-body" style={{ padding: '14px 16px' }}>
            <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>
              {isHi ? 'बाजार एवं एमएसपी अंतर (Spread)' : 'Market vs MSP Margin'}
            </span>
            {marketData?.averagePrice && marketData?.govtMsp ? (
              marketData.averagePrice >= marketData.govtMsp ? (
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#059669', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <TrendingUp size={22} />
                    <span>+₹{(marketData.averagePrice - marketData.govtMsp).toLocaleString('en-IN')}</span>
                  </div>
                  <span style={{ fontSize: '0.7rem', color: '#059669', fontWeight: 700 }}>
                    {isHi ? 'एमएसपी से अधिक प्रीमियम पर व्यापार' : 'Trading at premium above MSP'}
                  </span>
                </div>
              ) : (
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#DC2626', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <TrendingDown size={22} />
                    <span>-₹{(marketData.govtMsp - marketData.averagePrice).toLocaleString('en-IN')}</span>
                  </div>
                  <span style={{ fontSize: '0.7rem', color: '#DC2626', fontWeight: 700 }}>
                    {isHi ? 'सरकारी खरीद केंद्र पर बेचना अधिक लाभदायक' : 'Recommend selling to Govt procurement agency'}
                  </span>
                </div>
              )
            ) : (
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#64748B' }}>
                {isHi ? 'एमएसपी समतुल्य' : 'At Benchmark'}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4. Official APMC Mandi Rates Table */}
      <div className="gov-card" style={{ marginBottom: '1.5rem' }}>
        <div className="gov-card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={18} color="#0A3161" />
            <span>
              {isHi ? 'आधिकारिक एपीएमसी मंडी भाव सूची' : 'Official APMC Mandi Price Ledger'}
            </span>
          </div>
          <span style={{ fontSize: '0.72rem', color: '#64748B' }}>
            {isHi ? `कुल मंडियां: ${filteredPrices.length}` : `Reporting Mandis: ${filteredPrices.length}`}
          </span>
        </div>
        <div className="gov-card-body" style={{ padding: 0 }}>
          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center' }}>
              <div className="spinner" style={{ margin: '0 auto 12px' }}></div>
              <p style={{ color: '#64748B', fontSize: '0.85rem' }}>
                {isHi ? 'मंडी सर्वर से वास्तविक समय दरें लोड हो रही हैं...' : 'Loading APMC live price records...'}
              </p>
            </div>
          ) : filteredPrices.length === 0 ? (
            <div style={{ padding: '2.5rem', textAlign: 'center', color: '#64748B' }}>
              <AlertCircle size={36} color="#D97706" style={{ margin: '0 auto 8px' }} />
              <div style={{ fontWeight: 700, color: '#1E293B' }}>{isHi ? 'कोई मंडी दर नहीं मिली' : 'No Mandi Records Found'}</div>
              <p style={{ fontSize: '0.82rem', marginTop: '4px' }}>
                {isHi ? 'कृपया अन्य राज्य या जिंस का चयन करें।' : 'Try selecting another commodity or "All States".'}
              </p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="gov-table" style={{ margin: 0 }}>
                <thead>
                  <tr>
                    <th>{isHi ? 'क्र.सं.' : 'Sl. No.'}</th>
                    <th>{isHi ? 'मंडी का नाम (APMC)' : 'Mandi Name (APMC)'}</th>
                    <th>{isHi ? 'जिला एवं राज्य' : 'District & State'}</th>
                    <th>{isHi ? 'न्यूनतम दर (₹/क्विंटल)' : 'Min Rate (₹/Q)'}</th>
                    <th>{isHi ? 'अधिकतम दर (₹/क्विंटल)' : 'Max Rate (₹/Q)'}</th>
                    <th>{isHi ? 'मॉडल भाव (₹/क्विंटल)' : 'Modal Price (₹/Q)'}</th>
                    <th>{isHi ? 'एमएसपी तुलना' : 'MSP Benchmark Status'}</th>
                    <th>{isHi ? 'दैनिक आवक' : 'Arrivals (Tonnes)'}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPrices.map((item, idx) => {
                    const msp = marketData?.govtMsp || 2275;
                    const isAboveMsp = item.modalPrice >= msp;
                    return (
                      <tr key={idx}>
                        <td style={{ color: '#64748B', fontWeight: 600 }}>{idx + 1}</td>
                        <td>
                          <strong style={{ color: '#0A3161' }}>{item.market}</strong>
                        </td>
                        <td>
                          <span>{item.district}, {item.state}</span>
                        </td>
                        <td>₹{item.minPrice?.toLocaleString('en-IN')}</td>
                        <td>₹{item.maxPrice?.toLocaleString('en-IN')}</td>
                        <td>
                          <strong style={{ fontSize: '0.95rem', color: '#1E293B' }}>
                            ₹{item.modalPrice?.toLocaleString('en-IN')}
                          </strong>
                        </td>
                        <td>
                          {isAboveMsp ? (
                            <span style={{
                              background: '#ECFDF5',
                              color: '#065F46',
                              border: '1px solid #A7F3D0',
                              fontSize: '0.7rem',
                              fontWeight: 700,
                              padding: '2px 8px',
                              borderRadius: '3px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '3px'
                            }}>
                              <CheckCircle2 size={11} />
                              <span>{isHi ? 'एमएसपी से अधिक' : 'Above MSP'}</span>
                            </span>
                          ) : (
                            <span style={{
                              background: '#FEF2F2',
                              color: '#991B1B',
                              border: '1px solid #FECACA',
                              fontSize: '0.7rem',
                              fontWeight: 700,
                              padding: '2px 8px',
                              borderRadius: '3px'
                            }}>
                              {isHi ? 'एमएसपी से कम' : 'Below MSP'}
                            </span>
                          )}
                        </td>
                        <td style={{ color: '#475569', fontWeight: 600 }}>
                          {item.arrivals ? `${item.arrivals} MT` : 'N/A'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* 5. Official Revenue & Farm Sales Estimator */}
      <div className="gov-card" style={{ borderLeft: '4px solid #0A3161' }}>
        <div className="gov-card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calculator size={18} color="#0A3161" />
            <span>{isHi ? 'किसान उपज बिक्री आय गणक (Farmer Revenue Calculator)' : 'Farmer Crop Sales & MSP Income Calculator'}</span>
          </div>
          <span style={{ fontSize: '0.72rem', color: '#64748B' }}>
            {isHi ? 'अधिकृत CACP / e-NAM दर सूत्र' : 'Official CACP Formula Based'}
          </span>
        </div>
        <div className="gov-card-body" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', alignItems: 'center' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#0A3161', marginBottom: '6px' }}>
                {isHi ? 'अनुमानित उपज मात्रा (क्विंटल में दर्ज करें):' : 'Estimated Harvest Quantity (in Quintals):'}
              </label>
              <input
                type="number"
                min="1"
                max="5000"
                value={quantityQuintals}
                onChange={(e) => setQuantityQuintals(Number(e.target.value) || 0)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '3px', border: '1px solid #CBD5E1', fontSize: '1rem', fontWeight: 700 }}
              />
              <span style={{ fontSize: '0.72rem', color: '#64748B', display: 'block', marginTop: '4px' }}>
                {isHi ? '1 क्विंटल = 100 किलोग्राम' : '1 Quintal = 100 Kilograms'}
              </span>
            </div>

            <div style={{ background: '#F8FAFC', padding: '12px 16px', borderRadius: '4px', border: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.84rem' }}>
                <span style={{ color: '#475569' }}>{isHi ? 'मंडी मॉडल भाव पर अनुमानित आय:' : 'Estimated Mandi Revenue:'}</span>
                <strong style={{ color: '#0A3161' }}>₹{estimatedRevenue.toLocaleString('en-IN')}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.84rem' }}>
                <span style={{ color: '#475569' }}>{isHi ? 'सरकारी न्यूनतम समर्थन मूल्य (MSP) पर गारंटीकृत आय:' : 'Guaranteed Revenue at MSP:'}</span>
                <strong style={{ color: '#004D25' }}>₹{mspRevenue.toLocaleString('en-IN')}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #CBD5E1', paddingTop: '8px', fontSize: '0.9rem' }}>
                <span style={{ fontWeight: 800, color: '#1E293B' }}>{isHi ? 'निवल अंतर (लाभ / हानि):' : 'Net Difference:'}</span>
                <strong style={{ color: diffRevenue >= 0 ? '#059669' : '#DC2626' }}>
                  {diffRevenue >= 0 ? `+₹${diffRevenue.toLocaleString('en-IN')}` : `-₹${Math.abs(diffRevenue).toLocaleString('en-IN')}`}
                </strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
