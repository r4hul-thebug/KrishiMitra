import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  Orbit, Activity, Droplets, Sun, Layers, 
  MapPin, AlertTriangle, CheckCircle, RefreshCw,
  TrendingUp, Eye, Printer
} from 'lucide-react';

export default function SatelliteView() {
  const { currentLang } = useLanguage();
  const isHi = currentLang === 'hi';

  const [satelliteData, setSatelliteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const farmerId = localStorage.getItem('krishimitraaz_farmer_id');

  useEffect(() => {
    document.title = isHi 
      ? 'उपग्रह फसल स्वास्थ्य टेलीमेट्री (NDVI) - कृषिमित्राज़' 
      : 'Satellite Crop Telemetry (NDVI) - KrishiMitraaz';
  }, [isHi]);

  const fetchSatelliteTelemetry = async () => {
    setLoading(true);
    setError('');
    try {
      let url = `${API_URL}/satellite/ndvi`;
      if (farmerId) {
        url = `${API_URL}/farmers/${farmerId}/satellite`;
      }
      const res = await axios.get(url);
      setSatelliteData(res.data);
    } catch (err) {
      console.error('Failed to load satellite telemetry:', err);
      setError(isHi 
        ? 'उपग्रह डेटा सर्वर अनुपलब्ध। अंशांकित इसरो भुवन संदर्भ टेलीमेट्री प्रदर्शित है।' 
        : 'Live satellite feed unavailable. Showing calibrated ISRO Bhuvan telemetry.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSatelliteTelemetry();
  }, []);

  const ndviValue = satelliteData?.ndvi || 0.68;
  const ndviPct = Math.min(100, Math.max(0, Math.round(ndviValue * 100)));

  return (
    <div className="container" style={{ padding: '1.5rem 1rem 3rem', maxWidth: '1280px', margin: '0 auto' }}>
      {/* 1. Official Header Banner */}
      <div className="header-banner" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.15)', padding: '3px 10px', borderRadius: '3px', fontSize: '0.75rem', fontWeight: 700, marginBottom: '8px' }}>
              <Orbit size={14} color="#FDE047" />
              <span>{isHi ? 'इसरो भुवन एवं महालनोबिस राष्ट्रीय फसल पूर्वानुमान केंद्र (MNCFC/FASAL)' : 'ISRO Bhuvan & Mahalanobis National Crop Forecast Centre (MNCFC)'}</span>
            </div>
            <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 900 }}>
              {isHi ? 'उपग्रह सुदूर संवेदन फसल स्वास्थ्य टेलीमेट्री (NDVI)' : 'Satellite Remote Sensing & NDVI Crop Health Telemetry'}
            </h1>
            <p style={{ margin: '6px 0 0', fontSize: '0.9rem', color: '#E2E8F0', maxWidth: '850px', lineHeight: 1.5 }}>
              {isHi 
                ? 'सेंटिनल-2 एवं इसरो भुवन 10 मीटर स्थानिक रिज़ॉल्यूशन ऑप्टिकल मल्टी-स्पेक्ट्रल डेटा: फसल वनस्पति सूचकांक (NDVI), क्लोरोफिल बायोमास एवं मृदा नमी तनाव विश्लेषण।'
                : 'Sentinel-2 & ISRO Bhuvan 10m spatial optical multispectral remote sensing: Normalized Difference Vegetation Index (NDVI), canopy vigor, and root-zone moisture stress.'}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={() => window.print()}
              className="gov-btn gov-btn-secondary no-print"
              style={{ background: 'rgba(255,255,255,0.15)', color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.3)' }}
            >
              <Printer size={15} />
              <span>{isHi ? 'प्रिंट टेलीमेट्री' : 'Print Telemetry'}</span>
            </button>
            <button 
              onClick={fetchSatelliteTelemetry} 
              disabled={loading}
              className="gov-btn gov-btn-primary"
            >
              <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
              <span>{loading ? (isHi ? 'डेटा सिंक...' : 'Syncing Orbit...') : (isHi ? 'टेलीमेट्री रीफ्रेश करें' : 'Refresh Telemetry')}</span>
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div style={{ background: '#FFFBEB', color: '#92400E', border: '1px solid #FCD34D', padding: '10px 14px', borderRadius: '4px', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem' }}>
          <AlertTriangle size={16} color="#D97706" />
          <span>{error}</span>
        </div>
      )}

      {satelliteData && (
        <>
          {/* Main NDVI Hero Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
            {/* NDVI Index Card */}
            <div className="gov-card" style={{ borderTop: '4px solid #004D25' }}>
              <div className="gov-card-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Activity size={18} color="#004D25" />
                  <span>{isHi ? 'वर्तमान फसल छत्रक स्वास्थ्य सूचकांक (NDVI)' : 'Current Canopy Health Index (NDVI)'}</span>
                </div>
                <span style={{ 
                  padding: '2px 8px', 
                  borderRadius: '3px', 
                  background: '#ECFDF5', 
                  color: '#065F46', 
                  border: '1px solid #A7F3D0',
                  fontWeight: 800, 
                  fontSize: '0.72rem' 
                }}>
                  {satelliteData.classification}
                </span>
              </div>

              <div className="gov-card-body" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '12px' }}>
                  <span style={{ fontSize: '2.25rem', fontWeight: 900, color: '#0A3161' }}>
                    {satelliteData.ndvi}
                  </span>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#64748B' }}>/ 1.0 NDVI</span>
                </div>

                {/* Meter progress bar */}
                <div style={{ margin: '1rem 0' }}>
                  <div style={{ height: '10px', width: '100%', background: '#E2E8F0', borderRadius: '2px', overflow: 'hidden' }}>
                    <div 
                      style={{ 
                        height: '100%', 
                        width: `${ndviPct}%`, 
                        background: '#004D25',
                        transition: 'width 0.5s ease-in-out'
                      }} 
                    />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#64748B', marginTop: '4px' }}>
                    <span>0.0 ({isHi ? 'बंजर/खुली मिट्टी' : 'Bare Soil'})</span>
                    <span>0.3 ({isHi ? 'विरल' : 'Sparse'})</span>
                    <span>0.6 ({isHi ? 'संतोषजनक' : 'Healthy'})</span>
                    <span>1.0 ({isHi ? 'सघन हरियाली' : 'Dense Vigor'})</span>
                  </div>
                </div>

                <div style={{ background: '#F8FAFC', padding: '10px 12px', borderRadius: '3px', border: '1px solid #E2E8F0', fontSize: '0.82rem', color: '#334155' }}>
                  <strong style={{ color: '#0A3161' }}>{isHi ? 'कृषि वैज्ञानिक व्याख्या:' : 'Agronomist Interpretation:'}</strong> {satelliteData.actionAdvice}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem', borderTop: '1px solid #E2E8F0', paddingTop: '10px', fontSize: '0.76rem', color: '#64748B' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={13} color="#0A3161" />
                    <span>GPS: {satelliteData.location?.lat}°, {satelliteData.location?.lon}°</span>
                  </div>
                  <div>•</div>
                  <div>{isHi ? 'फसल:' : 'Crop:'} <strong style={{ color: '#004D25' }}>{satelliteData.crop?.toUpperCase()}</strong> ({satelliteData.das} {isHi ? 'दिन' : 'days'})</div>
                </div>
              </div>
            </div>

            {/* Multispectral Indicators Card */}
            <div className="gov-card" style={{ borderTop: '4px solid #0A3161' }}>
              <div className="gov-card-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Layers size={18} color="#0A3161" />
                  <span>{isHi ? 'उपग्रह मल्टी-स्पेक्ट्रल बायोमास संकेतक' : 'Multispectral Vegetation Biomass Indicators'}</span>
                </div>
                <span style={{ fontSize: '0.72rem', color: '#64748B' }}>10m Optical Band</span>
              </div>

              <div className="gov-card-body" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{ background: '#F0FDF4', border: '1px solid #DCFCE7', padding: '10px 12px', borderRadius: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#065F46', fontSize: '0.74rem', fontWeight: 700 }}>
                      <Sun size={14} /> {isHi ? 'क्लोरोफिल बायोमास' : 'Chlorophyll Index'}
                    </div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#065F46', marginTop: '2px' }}>
                      {satelliteData.chlorophyllIndex}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#047857' }}>{isHi ? 'अनुकूल प्रकाश संश्लेषण' : 'Optimal light absorption'}</div>
                  </div>

                  <div style={{ background: '#F0F9FF', border: '1px solid #E0F2FE', padding: '10px 12px', borderRadius: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#0369A1', fontSize: '0.74rem', fontWeight: 700 }}>
                      <Droplets size={14} /> {isHi ? 'मृदा नमी सूचकांक' : 'Soil Moisture Index'}
                    </div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0369A1', marginTop: '2px' }}>
                      {satelliteData.soilMoistureIndex}%
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#0284C7' }}>{isHi ? 'पर्याप्त जड़ आर्द्रता' : 'Adequate root hydration'}</div>
                  </div>
                </div>

                <div style={{ fontSize: '0.78rem', color: '#475569', lineHeight: 1.6 }}>
                  <div><strong>{isHi ? 'उपग्रह मंच:' : 'Platform:'}</strong> {satelliteData.satellite} (MNCFC Calibrated)</div>
                  <div><strong>{isHi ? 'स्पेक्ट्रल बैंड्स:' : 'Bands:'}</strong> Band 4 (Red 665nm) & Band 8 (NIR 842nm)</div>
                  <div><strong>{isHi ? 'स्थानिक विभेदन:' : 'Spatial Resolution:'}</strong> {satelliteData.resolution}</div>
                  <div><strong>{isHi ? 'अगला परिक्रमण:' : 'Next Overpass:'}</strong> ~48 {isHi ? 'घंटे में' : 'hours'}</div>
                </div>

                {satelliteData.stressAlerts && satelliteData.stressAlerts.length > 0 ? (
                  <div style={{ background: '#FEF2F2', border: '1px solid #FEE2E2', padding: '8px 10px', borderRadius: '3px', marginTop: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <AlertTriangle size={15} color="#DC2626" />
                    <span style={{ fontSize: '0.78rem', color: '#B91C1C', fontWeight: 700 }}>
                      {satelliteData.stressAlerts.join(', ')}
                    </span>
                  </div>
                ) : (
                  <div style={{ background: '#F0FDF4', border: '1px solid #DCFCE7', padding: '8px 10px', borderRadius: '3px', marginTop: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle size={15} color="#16A34A" />
                    <span style={{ fontSize: '0.78rem', color: '#15803D', fontWeight: 700 }}>
                      {isHi ? 'मुख्य फसल छत्रक में कोई जैविक तनाव नहीं पाया गया।' : 'Zero biological stress detected across primary canopy.'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sub-Plot Sector Breakdown */}
          <div className="gov-card" style={{ marginBottom: '1.5rem' }}>
            <div className="gov-card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Eye size={18} color="#0A3161" />
                <span>{isHi ? 'खेत उप-खंड सुदूर संवेदन विश्लेषण' : 'Field Sub-Sector Remote Sensing Segmentation'}</span>
              </div>
              <span style={{ fontSize: '0.72rem', color: '#64748B' }}>ISRO Bhuvan Spatial Grid</span>
            </div>

            <div className="gov-card-body" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                {(satelliteData.plotSectors || []).map((sector, idx) => (
                  <div 
                    key={idx} 
                    style={{ 
                      border: '1px solid #CBD5E1', 
                      borderRadius: '3px', 
                      padding: '12px', 
                      background: sector.status === 'Optimal' ? '#F8FAFC' : '#FFFBEB' 
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <strong style={{ color: '#0A3161', fontSize: '0.85rem' }}>{sector.name}</strong>
                      <span style={{ 
                        padding: '1px 6px', 
                        borderRadius: '3px', 
                        fontSize: '0.7rem', 
                        fontWeight: 800,
                        background: sector.status === 'Optimal' ? '#DCFCE7' : '#FEF3C7',
                        color: sector.status === 'Optimal' ? '#15803D' : '#D97706'
                      }}>
                        {sector.status}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#475569', marginBottom: '2px' }}>
                      <span>NDVI:</span>
                      <strong style={{ color: '#004D25' }}>{sector.ndvi}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#475569' }}>
                      <span>{isHi ? 'नमी सूचकांक:' : 'Moisture:'}</span>
                      <strong style={{ color: '#0A3161' }}>{sector.moisturePct}%</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 30-Day Historical Trend Bar Table */}
          <div className="gov-card">
            <div className="gov-card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <TrendingUp size={18} color="#0A3161" />
                <span>{isHi ? '30-दिवसीय फसल छत्रक विकास समयरेखा' : '30-Day Crop Canopy Development Timeline'}</span>
              </div>
              <span style={{ fontSize: '0.72rem', color: '#64748B' }}>Weekly Observation Cycle</span>
            </div>

            <div className="gov-card-body" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '8px' }}>
                {(satelliteData.history || []).map((h, i) => (
                  <div key={i} style={{ textAlign: 'center', background: '#F8FAFC', padding: '8px', borderRadius: '3px', border: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: '0.72rem', color: '#64748B', marginBottom: '6px' }}>{h.date.slice(5)}</div>
                    <div style={{ 
                      height: `${Math.round(h.ndvi * 50)}px`, 
                      background: '#004D25', 
                      width: '16px', 
                      margin: '0 auto', 
                      borderRadius: '2px'
                    }} />
                    <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0A3161', marginTop: '6px' }}>
                      {h.ndvi}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: '#0284C7' }}>
                      {h.moisture}% H₂O
                    </div>
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
