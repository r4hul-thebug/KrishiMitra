import { useState, useEffect } from 'react';
import axios from 'axios';
import { Calculator, Wheat, IndianRupee, Sprout, HandCoins, History, Printer } from 'lucide-react';
import { API_URL } from '../config';
import { useLanguage } from '../contexts/LanguageContext';

export default function YieldCalculator() {
  const { t, currentLang } = useLanguage();
  const isHi = currentLang === 'hi';

  const [cropsList, setCropsList] = useState([]);
  const [selectedCropId, setSelectedCropId] = useState('');
  const [acreage, setAcreage] = useState(1);
  const [cropData, setCropData] = useState(null);
  const [farmerYieldHistory, setFarmerYieldHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  // Custom cost adjustments
  const [laborCostPerAcre, setLaborCostPerAcre] = useState(2500);
  const [irrigationMachineryCost, setIrrigationMachineryCost] = useState(1800);

  useEffect(() => {
    document.title = isHi 
      ? 'फसल उत्पादन एवं शुद्ध लाभ गणक - कृषिमित्राज़' 
      : 'Crop Yield & Farm Profitability Calculator - KrishiMitraaz';
  }, [isHi]);

  useEffect(() => {
    const fetchCrops = async () => {
      try {
        const res = await axios.get(`${API_URL}/crops`);
        setCropsList(res.data);
        if (res.data.length > 0 && !selectedCropId) {
          setSelectedCropId(res.data[0].id);
        }
      } catch {
        console.error('Failed to load crop list.');
      }
    };
    fetchCrops();

    // Fetch farmer profile for yield history
    const farmerId = localStorage.getItem('krishimitraaz_farmer_id');
    if (farmerId) {
      axios.get(`${API_URL}/farmers/${farmerId}`)
        .then(res => {
          if (res.data?.yieldHistory) {
            setFarmerYieldHistory(res.data.yieldHistory);
          }
          if (res.data?.crop && !selectedCropId) {
            setSelectedCropId(res.data.crop);
          }
          if (res.data?.landAcres) {
            setAcreage(res.data.landAcres);
          }
        })
        .catch(() => {});
    }
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

  const totalYieldQuintals = cropData ? (cropData.yieldPerAcreQuintals * acreage) : 0;
  const mspRate = cropData?.mspPerQuintal || 2275;
  const mandiRate = Math.round(mspRate * 1.05);

  const grossRevenueMsp = Math.round(totalYieldQuintals * mspRate);
  const grossRevenueMandi = Math.round(totalYieldQuintals * mandiRate);

  const seedCost = Math.round((cropData?.seedCostPerAcre || 1800) * acreage);
  const fertilizerCost = Math.round((cropData?.fertilizerCostPerAcre || 2400) * acreage);
  const laborCost = Math.round(laborCostPerAcre * acreage);
  const machineryCost = Math.round(irrigationMachineryCost * acreage);
  const totalExpenditure = seedCost + fertilizerCost + laborCost + machineryCost;

  const netProfitMsp = grossRevenueMsp - totalExpenditure;
  const netProfitMandi = grossRevenueMandi - totalExpenditure;
  const profitMarginPct = grossRevenueMsp > 0 ? ((netProfitMsp / grossRevenueMsp) * 100).toFixed(1) : 0;

  return (
    <div className="container" style={{ padding: '1.5rem 1rem 3rem', maxWidth: '1280px', margin: '0 auto' }}>
      {/* 1. Official Header Banner */}
      <div className="header-banner" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.15)', padding: '3px 10px', borderRadius: '3px', fontSize: '0.75rem', fontWeight: 700, marginBottom: '8px' }}>
              <Calculator size={14} color="#FDE047" />
              <span>{isHi ? 'कृषि लागत एवं मूल्य आयोग (CACP) - आर्थिक विश्लेषण प्रभाग' : 'Commission for Agricultural Costs & Prices (CACP) - Economic Modeling'}</span>
            </div>
            <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 900 }}>
              {isHi ? 'फसल उत्पादन उपज एवं शुद्ध लाभ पूर्वानुमान गणक' : 'Farm Yield & Production Profitability Forecaster'}
            </h1>
            <p style={{ margin: '6px 0 0', fontSize: '0.9rem', color: '#E2E8F0', maxWidth: '850px', lineHeight: 1.5 }}>
              {isHi 
                ? 'सरकारी न्यूनतम समर्थन मूल्य (MSP) एवं एपीएमसी मंडी औसत दरों पर आधारित खेती की कुल लागत (A2+FL), प्रति एकड़ अनुमानित उपज एवं शुद्ध लाभ मार्जिन निर्धारण।'
                : 'Comprehensive cost-of-cultivation modeling (A2+FL formulas), official MSP realization vs open mandi trends, and historical yield performance.'}
            </p>
          </div>

          <button
            onClick={() => window.print()}
            className="gov-btn gov-btn-secondary no-print"
            style={{ background: 'rgba(255,255,255,0.15)', color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.3)' }}
          >
            <Printer size={14} />
            <span>{isHi ? 'प्रिंट रिपोर्ट' : 'Print Statement'}</span>
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
        {/* Left Column: Cultivation Parameters */}
        <div className="gov-card">
          <div className="gov-card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sprout size={18} color="#0A3161" />
              <span>{isHi ? 'खेती के बुनियादी मापदंड एवं लागत इनपुट' : 'Cultivation Parameters & Input Costs'}</span>
            </div>
            <span style={{ fontSize: '0.72rem', color: '#64748B' }}>Cost of Cultivation</span>
          </div>

          <div className="gov-card-body" style={{ padding: '1.25rem' }}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: 700, fontSize: '0.82rem', color: '#0A3161' }}>
                {isHi ? 'लक्षित फसल चुनें:' : 'Select Target Crop:'}
              </label>
              <select 
                value={selectedCropId} 
                onChange={(e) => setSelectedCropId(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '3px', border: '1px solid #CBD5E1', fontSize: '0.85rem', background: '#fff', color: '#0A3161', fontWeight: 700 }}
              >
                <option value="">{t('chooseCrop')}</option>
                {cropsList.map(c => (
                  <option key={c.id} value={c.id}>
                    {typeof c.name === 'object' ? (c.name[currentLang] || c.name.en) : c.name}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: 700, fontSize: '0.82rem', color: '#0A3161' }}>
                {isHi ? 'भूमि का कुल रकबा (एकड़):' : 'Land Holding Area (Acres):'}
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input 
                  type="number" 
                  min="0.25" 
                  step="0.25"
                  value={acreage}
                  onChange={(e) => setAcreage(Math.max(0.25, parseFloat(e.target.value) || 0.25))}
                  style={{ width: '100px', padding: '6px 10px', borderRadius: '3px', border: '1px solid #CBD5E1', fontSize: '0.95rem', fontWeight: 700 }}
                />
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569' }}>{isHi ? 'एकड़' : 'Acres'}</span>
              </div>
            </div>

            <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '1rem' }}>
              <h3 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0A3161', marginBottom: '10px' }}>
                {isHi ? 'परिचालन व्यय अनुमान (₹ / एकड़):' : 'Operational Expense Estimates (₹ / Acre):'}
              </h3>

              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', color: '#475569', marginBottom: '3px', fontWeight: 600 }}>
                  {isHi ? 'श्रम, बुवाई व कटाई मजदूरी (₹ / एकड़):' : 'Labor, Sowing & Harvesting Wages (₹ / Acre):'}
                </label>
                <input
                  type="number"
                  value={laborCostPerAcre}
                  onChange={(e) => setLaborCostPerAcre(Number(e.target.value) || 0)}
                  style={{ width: '100%', padding: '6px 10px', borderRadius: '3px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: '#475569', marginBottom: '3px', fontWeight: 600 }}>
                  {isHi ? 'ट्रैक्टर जुताई, डीजल व सिंचाई पंपिंग (₹ / एकड़):' : 'Tractor, Diesel & Irrigation Pumping (₹ / Acre):'}
                </label>
                <input
                  type="number"
                  value={irrigationMachineryCost}
                  onChange={(e) => setIrrigationMachineryCost(Number(e.target.value) || 0)}
                  style={{ width: '100%', padding: '6px 10px', borderRadius: '3px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Financial Projections & Balance Sheet */}
        <div className="gov-card">
          <div className="gov-card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <IndianRupee size={18} color="#0A3161" />
              <span>{isHi ? 'वित्तीय विवरण एवं आय-व्यय संतुलन पत्र' : 'Financial Balance Sheet & Profit Realization'}</span>
            </div>
            <span style={{ fontSize: '0.72rem', color: '#64748B' }}>CACP Economic Tally</span>
          </div>

          <div className="gov-card-body" style={{ padding: '1.25rem' }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}><div className="spinner"></div></div>
            ) : !cropData ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#64748B' }}>
                <Sprout size={40} style={{ opacity: 0.5, margin: '0 auto 8px auto' }} />
                <p style={{ fontSize: '0.85rem' }}>{t('selectCropPrompt')}</p>
              </div>
            ) : (
              <div>
                {/* Output Biomass */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem', paddingBottom: '10px', borderBottom: '1px solid #E2E8F0' }}>
                  <Wheat size={28} color="#004D25" />
                  <div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>{isHi ? 'अनुमानित कुल उपज:' : 'Estimated Output Yield:'} </span>
                    <strong style={{ fontSize: '1.2rem', color: '#004D25', fontWeight: 900 }}>
                      {totalYieldQuintals.toFixed(1)} {isHi ? 'क्विंटल' : 'Quintals'}
                    </strong>
                    <div style={{ fontSize: '0.74rem', color: '#64748B' }}>
                      ({cropData.yieldPerAcreQuintals} {isHi ? 'क्विंटल/एकड़ x' : 'q/acre across'} {acreage} {isHi ? 'एकड़' : 'acres'})
                    </div>
                  </div>
                </div>

                {/* Revenue Projections */}
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.82rem' }}>
                    <span style={{ color: '#475569' }}>{isHi ? 'सरकारी न्यूनतम समर्थन मूल्य (MSP):' : 'Official Govt MSP Benchmark:'}</span>
                    <strong style={{ color: '#0A3161' }}>₹{mspRate} / {isHi ? 'क्विंटल' : 'Qtl'}</strong>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: '#ECFDF5', borderRadius: '3px', border: '1px solid #A7F3D0', fontSize: '0.92rem', marginBottom: '6px' }}>
                    <span style={{ color: '#065F46', fontWeight: 700 }}>{isHi ? 'MSP पर सकल राजस्व:' : 'Gross Revenue at MSP:'}</span>
                    <strong style={{ color: '#065F46', fontWeight: 900 }}>₹{grossRevenueMsp.toLocaleString('en-IN')}</strong>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 12px', background: '#F0F9FF', borderRadius: '3px', border: '1px solid #BAE6FD', fontSize: '0.82rem' }}>
                    <span style={{ color: '#0369A1' }}>{isHi ? 'खुली मंडी बिक्री अनुमान (~₹' + mandiRate + '):' : `Open Mandi Realization (~₹${mandiRate}/Qtl):`}</span>
                    <strong style={{ color: '#0369A1' }}>₹{grossRevenueMandi.toLocaleString('en-IN')}</strong>
                  </div>
                </div>

                {/* Expenditure Breakdown */}
                <div style={{ marginBottom: '1rem' }}>
                  <h4 style={{ margin: '0 0 6px 0', color: '#991B1B', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {isHi ? 'खेती की कुल लागत (Cost of Cultivation A2+FL):' : 'Total Cultivation Outflow (A2+FL):'}
                  </h4>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.8rem', color: '#475569' }}>
                    <span>{isHi ? 'प्रमाणित बीज एवं बीजोपचार:' : 'Certified Seeds & Treatment:'}</span>
                    <strong>₹{seedCost.toLocaleString('en-IN')}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.8rem', color: '#475569' }}>
                    <span>{isHi ? 'उर्वरक एवं सूक्ष्म पोषक तत्व:' : 'Fertilizers & Nutrients:'}</span>
                    <strong>₹{fertilizerCost.toLocaleString('en-IN')}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.8rem', color: '#475569' }}>
                    <span>{isHi ? 'श्रम एवं निराई-गुड़ाई मजदूरी:' : 'Labor & Weeding Wages:'}</span>
                    <strong>₹{laborCost.toLocaleString('en-IN')}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.8rem', color: '#475569' }}>
                    <span>{isHi ? 'मशीनरी, डीजल एवं सिंचाई:' : 'Machinery & Water Fuel:'}</span>
                    <strong>₹{machineryCost.toLocaleString('en-IN')}</strong>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid #E2E8F0', fontSize: '0.88rem' }}>
                    <span style={{ fontWeight: 800, color: '#334155' }}>{isHi ? 'कुल उत्पादन लागत:' : 'Total Production Outflow:'}</span>
                    <strong style={{ color: '#991B1B' }}>₹{totalExpenditure.toLocaleString('en-IN')}</strong>
                  </div>
                </div>

                {/* Net Profit Card */}
                <div style={{ background: '#004D25', color: 'white', borderRadius: '4px', padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <div>
                    <span style={{ fontSize: '0.88rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <HandCoins size={16} /> {isHi ? 'MSP पर शुद्ध लाभ' : 'Net Profit at MSP'}
                    </span>
                    <div style={{ fontSize: '0.72rem', opacity: 0.9 }}>
                      {isHi ? `लाभ मार्जिन: ${profitMarginPct}% प्रतिफल` : `Profit Margin: ${profitMarginPct}% return`}
                    </div>
                  </div>
                  <span style={{ fontSize: '1.3rem', fontWeight: 900 }}>
                    ₹{netProfitMsp.toLocaleString('en-IN')}
                  </span>
                </div>

                <div style={{ background: '#F8FAFC', color: '#0A3161', borderRadius: '3px', padding: '8px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #CBD5E1' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700 }}>
                    {isHi ? 'मंडी में बिक्री पर अनुमानित लाभ:' : 'Estimated Profit at Open Mandi:'}
                  </span>
                  <strong style={{ fontSize: '1rem', fontWeight: 800, color: '#0A3161' }}>
                    ₹{netProfitMandi.toLocaleString('en-IN')}
                  </strong>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Yield History Records Section */}
      {farmerYieldHistory.length > 0 && (
        <div className="gov-card">
          <div className="gov-card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <History size={18} color="#0A3161" />
              <span>{isHi ? 'किसान पूर्व फसल उत्पादन इतिहास (प्रमाणित अभिलेख)' : 'Farmer Historical Harvest Records & Crop Progression'}</span>
            </div>
            <span style={{ fontSize: '0.72rem', color: '#64748B' }}>Verified Yield Archive</span>
          </div>

          <div className="gov-card-body" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              {farmerYieldHistory.map((rec, idx) => (
                <div key={idx} style={{ background: '#F8FAFC', border: '1px solid #CBD5E1', borderRadius: '3px', padding: '12px' }}>
                  <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700 }}>{isHi ? 'वर्ष' : 'Year'} {rec.year}</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0A3161', margin: '2px 0' }}>{rec.crop?.toUpperCase()}</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#004D25' }}>
                    {rec.yield} <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B' }}>{rec.unit || 'Quintals'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
