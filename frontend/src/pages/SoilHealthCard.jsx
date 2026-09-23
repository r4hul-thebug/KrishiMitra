import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  FlaskConical, CheckCircle2, Printer, 
  Sparkles, FileText
} from 'lucide-react';

const PRESETS = [
  {
    name: 'All-India Balanced (संतुलित मृदा)',
    data: { pH: 7.2, ec: 0.45, organicCarbon: 0.60, nitrogenKgHa: 275, phosphorusKgHa: 19, potassiumKgHa: 220, zincPpm: 0.9, sulfurPpm: 12.5 }
  },
  {
    name: 'Alkaline / Saline Soil (ऊसर / क्षारीय मृदा)',
    data: { pH: 8.6, ec: 1.4, organicCarbon: 0.35, nitrogenKgHa: 180, phosphorusKgHa: 12, potassiumKgHa: 280, zincPpm: 0.4, sulfurPpm: 7.0 }
  },
  {
    name: 'Acidic Soil (अम्लीय मृदा)',
    data: { pH: 5.4, ec: 0.3, organicCarbon: 0.70, nitrogenKgHa: 310, phosphorusKgHa: 8, potassiumKgHa: 140, zincPpm: 0.7, sulfurPpm: 9.0 }
  }
];

export default function SoilHealthCard() {
  const { currentLang } = useLanguage();
  const isHi = currentLang === 'hi';

  const [form, setForm] = useState({
    crop: 'wheat',
    acres: 2,
    pH: 7.4,
    ec: 0.5,
    organicCarbon: 0.55,
    nitrogenKgHa: 260,
    phosphorusKgHa: 18,
    potassiumKgHa: 210,
    zincPpm: 0.8,
    sulfurPpm: 12.0
  });

  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/soil/analyze`, form);
      setAnalysis(res.data);
    } catch (err) {
      console.error('Soil analysis error:', err);
    } finally {
      setLoading(false);
    }
  }, [form]);

  useEffect(() => {
    document.title = isHi ? 'मृदा स्वास्थ्य कार्ड विश्लेषक - कृषिमित्राज़' : 'Soil Health Card Analyzer - KrishiMitraaz';
  }, [isHi]);

  useEffect(() => {
    handleAnalyze();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const applyPreset = (preset) => {
    setForm(prev => ({ ...prev, ...preset.data }));
  };

  const printReport = () => {
    window.print();
  };

  return (
    <div className="container" style={{ padding: '1.5rem 1rem 3rem', maxWidth: '1280px', margin: '0 auto' }}>
      {/* 1. Official Header Banner */}
      <div className="header-banner" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.15)', padding: '3px 10px', borderRadius: '3px', fontSize: '0.75rem', fontWeight: 700, marginBottom: '8px' }}>
              <FlaskConical size={14} color="#FDE047" />
              <span>{isHi ? 'राष्ट्रीय मृदा स्वास्थ्य कार्ड योजना (ICAR-IISS प्रमाणित)' : 'National Soil Health Card Scheme (ICAR Certified)'}</span>
            </div>
            <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 900 }}>
              {isHi ? 'डिजिटल मृदा स्वास्थ्य कार्ड एवं पोषक तत्व निर्धारक' : 'Digital Soil Health Card & Nutrient Amendment Analyzer'}
            </h1>
            <p style={{ margin: '6px 0 0', fontSize: '0.9rem', color: '#E2E8F0', maxWidth: '850px', lineHeight: 1.5 }}>
              {isHi 
                ? 'स्वस्थ धरा, खेत हरा: अपनी प्रयोगशाला परीक्षण रिपोर्ट के 12 मानक पोषक तत्व दर्ज करें और आईसीएआर दिशानिर्देशों के अनुसार यूरिया, डीएपी, पोटाश एवं जिंक की संतुलित मात्रा प्राप्त करें।'
                : 'Swasth Dhara, Khet Hara: Input your certified lab sample parameters to receive scientific ICAR fertilizer prescriptions, soil amendment guidance (Gypsum/Lime), and crop-specific split schedules.'}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={printReport}
              className="gov-btn gov-btn-secondary no-print"
              style={{ background: 'rgba(255,255,255,0.15)', color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.3)' }}
            >
              <Printer size={15} />
              <span>{isHi ? 'मृदा कार्ड प्रिंट करें' : 'Print Soil Card'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Preset Quick Fill Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0A3161' }}>
          {isHi ? '⚡ नमूना परीक्षण डेटा लोड करें:' : '⚡ Quick Sample Presets:'}
        </span>
        {PRESETS.map((p, idx) => (
          <button
            key={idx}
            onClick={() => applyPreset(p)}
            style={{
              padding: '4px 12px',
              borderRadius: '3px',
              border: '1px solid #CBD5E1',
              background: '#FFFFFF',
              color: '#334155',
              fontSize: '0.76rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            {p.name}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Form Inputs Card */}
        <div className="gov-card" style={{ borderTop: '4px solid #004D25' }}>
          <div className="gov-card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={18} color="#004D25" />
              <span>{isHi ? 'मृदा परीक्षण पैरामीटर दर्ज करें' : 'Enter Lab Test Parameters'}</span>
            </div>
            <span style={{ fontSize: '0.72rem', color: '#64748B' }}>12 Parametric Test</span>
          </div>

          <div className="gov-card-body" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#0A3161', marginBottom: '4px' }}>
                  {isHi ? 'फसल चुनें (Target Crop):' : 'Target Crop:'}
                </label>
                <select
                  value={form.crop}
                  onChange={(e) => setForm({ ...form, crop: e.target.value })}
                  style={{ width: '100%', padding: '7px 10px', borderRadius: '3px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                >
                  <option value="wheat">{isHi ? 'गेहूं (Wheat)' : 'Wheat'}</option>
                  <option value="rice">{isHi ? 'धान (Rice / Paddy)' : 'Rice / Paddy'}</option>
                  <option value="maize">{isHi ? 'मक्का (Maize)' : 'Maize'}</option>
                  <option value="cotton">{isHi ? 'कपास (Cotton)' : 'Cotton'}</option>
                  <option value="mustard">{isHi ? 'सरसों (Mustard)' : 'Mustard'}</option>
                  <option value="potato">{isHi ? 'आलू (Potato)' : 'Potato'}</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#0A3161', marginBottom: '4px' }}>
                  {isHi ? 'खेत का रकबा (Acres):' : 'Land Area (Acres):'}
                </label>
                <input
                  type="number"
                  min="0.25"
                  step="0.25"
                  value={form.acres}
                  onChange={(e) => setForm({ ...form, acres: Number(e.target.value) || 1 })}
                  style={{ width: '100%', padding: '7px 10px', borderRadius: '3px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                />
              </div>
            </div>

            <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '10px', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.76rem', fontWeight: 800, color: '#004D25', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                {isHi ? 'रासायनिक एवं भौतिक गुण' : 'Chemical & Physical Properties'}
              </span>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#475569' }}>pH (मान)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="4.0"
                    max="10.0"
                    value={form.pH}
                    onChange={(e) => setForm({ ...form, pH: parseFloat(e.target.value) || 7 })}
                    style={{ width: '100%', padding: '6px 8px', borderRadius: '3px', border: '1px solid #CBD5E1', fontSize: '0.82rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#475569' }}>EC (dS/m)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={form.ec}
                    onChange={(e) => setForm({ ...form, ec: parseFloat(e.target.value) || 0.5 })}
                    style={{ width: '100%', padding: '6px 8px', borderRadius: '3px', border: '1px solid #CBD5E1', fontSize: '0.82rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#475569' }}>{isHi ? 'जैविक C %' : 'Organic C %'}</label>
                  <input
                    type="number"
                    step="0.05"
                    min="0.1"
                    value={form.organicCarbon}
                    onChange={(e) => setForm({ ...form, organicCarbon: parseFloat(e.target.value) || 0.5 })}
                    style={{ width: '100%', padding: '6px 8px', borderRadius: '3px', border: '1px solid #CBD5E1', fontSize: '0.82rem' }}
                  />
                </div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '10px', marginBottom: '14px' }}>
              <span style={{ fontSize: '0.76rem', fontWeight: 800, color: '#004D25', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                {isHi ? 'प्राथमिक एवं सूक्ष्म पोषक तत्व' : 'Primary & Secondary Nutrients'}
              </span>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#475569' }}>N (kg/ha)</label>
                  <input
                    type="number"
                    value={form.nitrogenKgHa}
                    onChange={(e) => setForm({ ...form, nitrogenKgHa: Number(e.target.value) || 250 })}
                    style={{ width: '100%', padding: '6px 8px', borderRadius: '3px', border: '1px solid #CBD5E1', fontSize: '0.82rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#475569' }}>P (kg/ha)</label>
                  <input
                    type="number"
                    value={form.phosphorusKgHa}
                    onChange={(e) => setForm({ ...form, phosphorusKgHa: Number(e.target.value) || 15 })}
                    style={{ width: '100%', padding: '6px 8px', borderRadius: '3px', border: '1px solid #CBD5E1', fontSize: '0.82rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#475569' }}>K (kg/ha)</label>
                  <input
                    type="number"
                    value={form.potassiumKgHa}
                    onChange={(e) => setForm({ ...form, potassiumKgHa: Number(e.target.value) || 200 })}
                    style={{ width: '100%', padding: '6px 8px', borderRadius: '3px', border: '1px solid #CBD5E1', fontSize: '0.82rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#475569' }}>Zinc Zn (ppm)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={form.zincPpm}
                    onChange={(e) => setForm({ ...form, zincPpm: parseFloat(e.target.value) || 0.6 })}
                    style={{ width: '100%', padding: '6px 8px', borderRadius: '3px', border: '1px solid #CBD5E1', fontSize: '0.82rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#475569' }}>Sulfur S (ppm)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={form.sulfurPpm}
                    onChange={(e) => setForm({ ...form, sulfurPpm: parseFloat(e.target.value) || 10 })}
                    style={{ width: '100%', padding: '6px 8px', borderRadius: '3px', border: '1px solid #CBD5E1', fontSize: '0.82rem' }}
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="gov-btn gov-btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <Sparkles size={16} />
              <span>{loading ? (isHi ? 'विश्लेषण जारी है...' : 'Calculating...') : (isHi ? 'आईसीएआर वैज्ञानिक अनुशंसा उत्पन्न करें' : 'Generate ICAR Prescription')}</span>
            </button>
          </div>
        </div>

        {/* Results Card */}
        {analysis && (
          <div className="gov-card" style={{ borderTop: '4px solid #0A3161' }}>
            <div className="gov-card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={18} color="#059669" />
                <span>{isHi ? 'आधिकारिक मृदा परीक्षण परिणाम' : 'Soil Analysis Report Card'}</span>
              </div>
              <span style={{ fontSize: '0.72rem', color: '#64748B' }}>
                Ref: SHC-2026-IN
              </span>
            </div>

            <div className="gov-card-body" style={{ padding: '1.25rem' }}>
              {/* Soil Health Status Overview */}
              <div style={{
                background: '#F0F9FF',
                padding: '10px 14px',
                borderRadius: '4px',
                border: '1px solid #BAE6FD',
                marginBottom: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div>
                  <span style={{ fontSize: '0.72rem', color: '#0369A1', fontWeight: 700, textTransform: 'uppercase' }}>
                    {isHi ? 'मृदा स्वास्थ्य स्थिति' : 'Overall Soil Health'}
                  </span>
                  <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#0A3161' }}>
                    {analysis.soilType || (isHi ? 'मध्यम उर्वरा मृदा' : 'Moderate Fertility Soil')}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.72rem', color: '#64748B' }}>{isHi ? 'अनुशंसित फसल:' : 'Crop:'}</span>
                  <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#004D25' }}>
                    {form.crop.toUpperCase()} ({form.acres} Acres)
                  </div>
                </div>
              </div>

              {/* Fertilizer Prescriptions Table */}
              <div style={{ marginBottom: '14px' }}>
                <strong style={{ fontSize: '0.82rem', color: '#0A3161', display: 'block', marginBottom: '6px' }}>
                  {isHi ? 'उर्वरक मात्रा (कुल ' + form.acres + ' एकड़ हेतु):' : `Fertilizer Requirements (for ${form.acres} Acres):`}
                </strong>
                <table className="gov-table" style={{ margin: 0, fontSize: '0.8rem' }}>
                  <thead>
                    <tr>
                      <th>{isHi ? 'उर्वरक प्रकार' : 'Fertilizer'}</th>
                      <th>{isHi ? 'मात्रा (kg)' : 'Dose (kg)'}</th>
                      <th>{isHi ? 'बोरी (Bags)' : 'Standard Bags'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>{isHi ? 'यूरिया (Urea - 46% N)' : 'Urea (46% N)'}</strong></td>
                      <td>{analysis.fertilizerRecommendation?.ureaKg || Math.round(form.acres * 55)} kg</td>
                      <td>{Math.ceil((analysis.fertilizerRecommendation?.ureaKg || (form.acres * 55)) / 45)} {isHi ? 'बोरी (45 kg)' : 'Bags'}</td>
                    </tr>
                    <tr>
                      <td><strong>{isHi ? 'डीएपी (DAP - 18:46:0)' : 'DAP (18:46:0)'}</strong></td>
                      <td>{analysis.fertilizerRecommendation?.dapKg || Math.round(form.acres * 35)} kg</td>
                      <td>{Math.ceil((analysis.fertilizerRecommendation?.dapKg || (form.acres * 35)) / 50)} {isHi ? 'बोरी (50 kg)' : 'Bags'}</td>
                    </tr>
                    <tr>
                      <td><strong>{isHi ? 'एमओपी (MOP / Potash)' : 'MOP (Potash)'}</strong></td>
                      <td>{analysis.fertilizerRecommendation?.mopKg || Math.round(form.acres * 25)} kg</td>
                      <td>{Math.ceil((analysis.fertilizerRecommendation?.mopKg || (form.acres * 25)) / 50)} {isHi ? 'बोरी (50 kg)' : 'Bags'}</td>
                    </tr>
                    <tr>
                      <td><strong>{isHi ? 'जिंक सल्फेट (Zinc)' : 'Zinc Sulfate (21%)'}</strong></td>
                      <td>{analysis.fertilizerRecommendation?.zincKg || Math.round(form.acres * 5)} kg</td>
                      <td>{Math.ceil((analysis.fertilizerRecommendation?.zincKg || (form.acres * 5)) / 10)} {isHi ? 'पैक' : 'Packs'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Amendment Guidelines */}
              {analysis.amendment && (
                <div style={{ background: '#FFFBEB', border: '1px solid #FCD34D', padding: '10px 12px', borderRadius: '4px', fontSize: '0.8rem', color: '#92400E' }}>
                  <strong>{isHi ? 'मृदा सुधारक अनुशंसा:' : 'Soil Amendment Notice:'}</strong>
                  <p style={{ margin: '4px 0 0', lineHeight: 1.4 }}>
                    {analysis.amendment}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
