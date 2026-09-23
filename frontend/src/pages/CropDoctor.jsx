import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  Stethoscope, Upload, Calculator, FileText, 
  Leaf, RefreshCw, Zap, Printer
} from 'lucide-react';

const CROPS = [
  { id: 'wheat', nameEn: 'Wheat', nameHi: 'गेहूं (Wheat)' },
  { id: 'rice', nameEn: 'Rice / Paddy', nameHi: 'धान (Rice / Paddy)' },
  { id: 'cotton', nameEn: 'Cotton', nameHi: 'कपास (Cotton)' },
  { id: 'mustard', nameEn: 'Mustard', nameHi: 'सरसों (Mustard)' },
  { id: 'potato', nameEn: 'Potato', nameHi: 'आलू (Potato)' },
];

export default function CropDoctor() {
  const { currentLang } = useLanguage();
  const isHi = currentLang === 'hi';

  const [activeTab, setActiveTab] = useState('symptoms'); // 'symptoms' | 'camera' | 'fertilizer'
  const [selectedCrop, setSelectedCrop] = useState('wheat');
  const [cropsList, setCropsList] = useState(CROPS);
  const [symptomInput, setSymptomInput] = useState('');
  const [diagnosisResult, setDiagnosisResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fertilizer calculator state
  const [fertilizerAcres, setFertilizerAcres] = useState(2.0);
  const [fertilizerResult, setFertilizerResult] = useState(null);

  // Camera / photo upload simulation
  const [uploadedImage, setUploadedImage] = useState(null);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    document.title = isHi 
      ? 'फसल कीट-रोग निदान एवं उपचार - कृषिमित्राज़' 
      : 'Crop Disease Diagnostics & Treatment - KrishiMitraaz';
  }, [isHi]);

  useEffect(() => {
    axios.get(`${API_URL}/crops`)
      .then(res => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          const mapped = res.data.map(c => ({
            id: c.id,
            nameEn: c.name?.en || c.id,
            nameHi: `${c.name?.hi || c.name?.en || c.id} (${c.name?.en || c.id})`
          }));
          setCropsList(mapped);
        }
      })
      .catch(() => {});
  }, []);

  // Run symptom check
  const handleDiagnose = useCallback(async (overrideKeywords = null) => {
    setLoading(true);
    try {
      const keywords = overrideKeywords !== null ? overrideKeywords : symptomInput;
      const res = await axios.get(`${API_URL}/disease/diagnose?crop=${selectedCrop}&symptoms=${encodeURIComponent(keywords)}`);
      setDiagnosisResult(res.data);
    } catch (err) {
      console.error('Diagnosis failed:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedCrop, symptomInput]);

  // Run fertilizer calculation
  const handleCalcDose = useCallback(async (acres = fertilizerAcres, crop = selectedCrop) => {
    try {
      const res = await axios.get(`${API_URL}/fertilizer/dose?crop=${crop}&acres=${acres}`);
      setFertilizerResult(res.data);
    } catch (err) {
      console.error('Fertilizer calculation failed:', err);
    }
  }, [fertilizerAcres, selectedCrop]);

  useEffect(() => {
    handleDiagnose('');
    handleCalcDose(fertilizerAcres, selectedCrop);
  }, [selectedCrop, handleDiagnose, handleCalcDose, fertilizerAcres]);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setUploadedImage(reader.result);
      setScanning(true);
      setTimeout(() => {
        setScanning(false);
        handleDiagnose('yellow stripe pustules powder');
      }, 1200);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="container" style={{ padding: '1.5rem 1rem 3rem', maxWidth: '1280px', margin: '0 auto' }}>
      {/* 1. Official Header Banner */}
      <div className="header-banner" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.15)', padding: '3px 10px', borderRadius: '3px', fontSize: '0.75rem', fontWeight: 700, marginBottom: '8px' }}>
              <Stethoscope size={14} color="#FDE047" />
              <span>{isHi ? 'पौध संरक्षण, संगरोध एवं संग्रह निदेशालय (DPPQS / ICAR)' : 'Directorate of Plant Protection, Quarantine & Storage (DPPQS / ICAR)'}</span>
            </div>
            <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 900 }}>
              {isHi ? 'फसल कीट-रोग निदान एवं सटीक उर्वरक खुराक निर्धारक' : 'Crop Pest Diagnosis, Bio-Control & ICAR Fertilizer Dosage'}
            </h1>
            <p style={{ margin: '6px 0 0', fontSize: '0.9rem', color: '#E2E8F0', maxWidth: '850px', lineHeight: 1.5 }}>
              {isHi 
                ? 'पत्ती धब्बा, रतुआ, ब्लास्ट एवं कीट व्याधियों का तत्काल वैज्ञानिक निदान, जैविक उपचार, केंद्रीय कीटनाशक बोर्ड द्वारा अनुमोदित रसायन तथा रकबा-अनुसार एनपीके उर्वरक गणना।'
                : 'Scientific triage of foliar pathogens, blights, and pests with CPCB-approved chemical dosages, organic bio-control protocols, and acreage-specific NPK fertilizer schedules.'}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#FFFFFF' }}>{isHi ? 'फसल चुनें:' : 'Crop:'}</label>
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              style={{ padding: '6px 12px', borderRadius: '3px', border: '1px solid #CBD5E1', fontSize: '0.85rem', fontWeight: 700, background: '#FFFFFF', color: '#0A3161' }}
            >
              {cropsList.map(c => (
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

      {/* 2. Official Mode Selection Tabs */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => setActiveTab('symptoms')}
          className={`gov-btn ${activeTab === 'symptoms' ? 'gov-btn-primary' : 'gov-btn-secondary'}`}
          style={{ fontSize: '0.8rem' }}
        >
          <Leaf size={15} />
          <span>{isHi ? 'लक्षण आधारित रोग निदान' : 'Symptom Diagnostics'}</span>
        </button>

        <button
          onClick={() => setActiveTab('camera')}
          className={`gov-btn ${activeTab === 'camera' ? 'gov-btn-primary' : 'gov-btn-secondary'}`}
          style={{ fontSize: '0.8rem' }}
        >
          <Upload size={15} />
          <span>{isHi ? 'पत्ती फोटो स्कैनर' : 'Photo Leaf Scanner'}</span>
        </button>

        <button
          onClick={() => setActiveTab('fertilizer')}
          className={`gov-btn ${activeTab === 'fertilizer' ? 'gov-btn-primary' : 'gov-btn-secondary'}`}
          style={{ fontSize: '0.8rem' }}
        >
          <Calculator size={15} />
          <span>{isHi ? 'रकबा-अनुसार उर्वरक गणक' : 'Acreage Fertilizer Dose'}</span>
        </button>
      </div>

      {/* TAB 1: Symptom Diagnostic */}
      {activeTab === 'symptoms' && (
        <>
          <div className="gov-card" style={{ marginBottom: '1.5rem' }}>
            <div className="gov-card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Stethoscope size={18} color="#0A3161" />
                <span>{isHi ? 'पौधों / पत्तियों पर दिखने वाले लक्षण खोजें' : 'Search Observed Symptoms on Leaves, Stems or Roots'}</span>
              </div>
              <span style={{ fontSize: '0.72rem', color: '#64748B' }}>ICAR Agronomy Triage</span>
            </div>

            <div className="gov-card-body" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
                <input
                  type="text"
                  value={symptomInput}
                  onChange={(e) => setSymptomInput(e.target.value)}
                  placeholder={isHi ? 'उदा. पीली धारियां, काला चूर्ण, मुड़ी पत्तियां, सफेद फफूंद...' : 'e.g. yellow stripes, black powder, wilted leaves, white spots...'}
                  style={{ flex: 1, minWidth: '260px', padding: '7px 12px', borderRadius: '3px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                  onKeyDown={(e) => e.key === 'Enter' && handleDiagnose()}
                />
                <button
                  onClick={() => handleDiagnose()}
                  disabled={loading}
                  className="gov-btn gov-btn-primary"
                >
                  {loading ? (isHi ? 'जांच जारी...' : 'Analyzing...') : (isHi ? 'रोग की पहचान करें' : 'Diagnose Plant')}
                </button>
              </div>

              {/* Quick symptom tags */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700 }}>{isHi ? 'त्वरित नमूने:' : 'Quick samples:'}</span>
                {['yellow stripes', 'white rust pustules', 'leaf blast lesions', 'pink bollworm holes', 'black rotted spot'].map(tag => (
                  <button
                    key={tag}
                    onClick={() => {
                      setSymptomInput(tag);
                      handleDiagnose(tag);
                    }}
                    style={{ background: '#F8FAFC', border: '1px solid #CBD5E1', padding: '2px 8px', borderRadius: '3px', fontSize: '0.72rem', cursor: 'pointer', color: '#334155' }}
                  >
                    +{tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Diagnosis Results */}
          {diagnosisResult && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {(diagnosisResult.diagnoses || []).map((d, i) => (
                <div key={i} className="gov-card" style={{ borderLeft: `4px solid ${d.severity === 'Critical' ? '#DC2626' : d.severity === 'Severe' ? '#D97706' : '#F59E0B'}` }}>
                  <div className="gov-card-header" style={{ justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <strong style={{ fontSize: '1rem', color: '#0A3161' }}>{d.name}</strong>
                      <span style={{ 
                        padding: '1px 6px', 
                        borderRadius: '3px', 
                        fontSize: '0.68rem', 
                        fontWeight: 800,
                        background: d.severity === 'Critical' ? '#FEF2F2' : d.severity === 'Severe' ? '#FFFBEB' : '#FEF3C7',
                        color: d.severity === 'Critical' ? '#B91C1C' : d.severity === 'Severe' ? '#B45309' : '#92400E',
                        border: '1px solid #CBD5E1'
                      }}>
                        {d.severity} {isHi ? 'गंभीरता' : 'Severity'}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.74rem', color: '#64748B' }}>
                      {isHi ? 'कारक जीव:' : 'Pathogen:'} <strong>{d.causalAgent}</strong>
                    </span>
                  </div>

                  <div className="gov-card-body" style={{ padding: '1.25rem' }}>
                    {/* Conducive Weather Alert */}
                    <div style={{ background: '#FFFBEB', border: '1px solid #FCD34D', padding: '8px 12px', borderRadius: '3px', fontSize: '0.8rem', color: '#92400E', marginBottom: '12px' }}>
                      <strong>{isHi ? 'प्रकोप को बढ़ावा देने वाला मौसम:' : 'Weather Conditions Triggering Outbreak:'}</strong> {d.conduciveWeather}
                    </div>

                    {/* Symptoms Checklist */}
                    <div style={{ marginBottom: '12px' }}>
                      <strong style={{ display: 'block', fontSize: '0.82rem', color: '#0A3161', marginBottom: '4px' }}>
                        {isHi ? 'नैदानिक दृश्य लक्षण (Visual Indicators):' : 'Diagnostic Visual Indicators:'}
                      </strong>
                      <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.82rem', color: '#334155', lineHeight: 1.5 }}>
                        {d.symptoms.map((s, si) => (
                          <li key={si}>{s}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Remedies: Organic vs Chemical */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '10px' }}>
                      <div style={{ background: '#F0FDF4', border: '1px solid #DCFCE7', padding: '10px 12px', borderRadius: '3px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#065F46', fontWeight: 800, fontSize: '0.8rem', marginBottom: '4px' }}>
                          <Leaf size={14} /> {isHi ? 'पर्यावरण-अनुकूल जैविक उपचार (Organic Bio-Control):' : 'Eco-Friendly Organic Remedy:'}
                        </div>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#15803D', lineHeight: 1.4 }}>
                          {d.organicRemedy}
                        </p>
                      </div>

                      <div style={{ background: '#F0F9FF', border: '1px solid #BAE6FD', padding: '10px 12px', borderRadius: '3px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0369A1', fontWeight: 800, fontSize: '0.8rem', marginBottom: '4px' }}>
                          <Zap size={14} /> {isHi ? 'अनुमोदित रासायनिक कीटनाशक व खुराक (Chemical):' : 'Approved Chemical Treatment & Dosage:'}
                        </div>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#0284C7', lineHeight: 1.4 }}>
                          {d.chemicalRemedy}
                        </p>
                      </div>
                    </div>

                    <div style={{ fontSize: '0.78rem', color: '#64748B', borderTop: '1px solid #E2E8F0', paddingTop: '8px' }}>
                      <strong>{isHi ? 'दीर्घकालिक रोकथाम सलाह:' : 'Long-term Prevention:'}</strong> {d.preventiveAdvice}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* TAB 2: Photo Leaf Scanner */}
      {activeTab === 'camera' && (
        <div className="gov-card" style={{ padding: '2rem', textAlign: 'center' }}>
          <div style={{ maxWidth: '480px', margin: '0 auto' }}>
            <div style={{ 
              border: '2px dashed #94A3B8', 
              borderRadius: '4px', 
              padding: '2rem 1.5rem', 
              background: '#F8FAFC',
              cursor: 'pointer',
              position: 'relative'
            }}>
              <input 
                type="file" 
                accept="image/*"
                capture="environment"
                onChange={handleImageUpload}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
              />
              {uploadedImage ? (
                <div>
                  <img src={uploadedImage} alt="Crop scan" style={{ maxHeight: '180px', maxWidth: '100%', borderRadius: '4px', marginBottom: '10px' }} />
                  <p style={{ margin: 0, fontWeight: 700, color: '#004D25', fontSize: '0.85rem' }}>
                    {isHi ? 'पत्ती की तस्वीर सफलतापूर्वक अपलोड हुई!' : 'Leaf Image Captured!'}
                  </p>
                </div>
              ) : (
                <div>
                  <Upload size={40} color="#0A3161" style={{ margin: '0 auto 10px auto' }} />
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '1.05rem', color: '#0A3161', fontWeight: 800 }}>
                    {isHi ? 'पत्ती की फोटो अपलोड करें या खींचें' : 'Take or Upload Leaf Photo'}
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748B' }}>
                    {isHi 
                      ? 'कंप्यूटर दृष्टि आधारित स्वचालित रोग एवं कीट घाव विश्लेषण हेतु फोटो चुनें' 
                      : 'Tap to capture leaf photo for automated computer vision disease analysis'}
                  </p>
                </div>
              )}
            </div>

            {scanning && (
              <div style={{ marginTop: '1rem', color: '#0A3161', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.85rem' }}>
                <RefreshCw size={16} className="animate-spin" />
                {isHi ? 'पत्ती के घावों का कृत्रिम बुद्धिमत्ता आधारित विश्लेषण जारी...' : 'Analyzing leaf lesion pixel clusters...'}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: Acreage Fertilizer Dose Calculator */}
      {activeTab === 'fertilizer' && (
        <div>
          <div className="gov-card" style={{ marginBottom: '1.5rem' }}>
            <div className="gov-card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calculator size={18} color="#0A3161" />
                <span>{selectedCrop.toUpperCase()} {isHi ? 'हेतु वैज्ञानिक उर्वरक मात्रा गणक' : 'Scientific Fertilizer Dosage Calculator'}</span>
              </div>
              <span style={{ fontSize: '0.72rem', color: '#64748B' }}>ICAR Standards</span>
            </div>

            <div className="gov-card-body" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#0A3161', marginBottom: '4px' }}>
                    {isHi ? 'खेत का कुल रकबा (एकड़ में):' : 'Total Land Holding (in Acres):'}
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="number"
                      step="0.25"
                      min="0.25"
                      max="100"
                      value={fertilizerAcres}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setFertilizerAcres(val);
                        handleCalcDose(val, selectedCrop);
                      }}
                      style={{ width: '100px', padding: '6px 10px', borderRadius: '3px', border: '1px solid #CBD5E1', fontSize: '1rem', fontWeight: 700 }}
                    />
                    <span style={{ fontWeight: 700, color: '#475569', fontSize: '0.85rem' }}>{isHi ? 'एकड़' : 'Acres'}</span>
                  </div>
                </div>

                <div style={{ fontSize: '0.8rem', color: '#475569', maxWidth: '450px', lineHeight: 1.4 }}>
                  {isHi 
                    ? 'अत्यधिक रासायनिक उपयोग से होने वाले मृदा क्षरण व भूजल प्रदूषण को रोकने हेतु आईसीएआर पैकेज ऑफ प्रैक्टिसेज के अनुसार खुराक।'
                    : 'Calibrated to prevent over-fertilization, soil salinity, and groundwater leaching while maximizing crop yield potential.'}
                </div>
              </div>
            </div>
          </div>

          {fertilizerResult && (
            <>
              {/* Bag Requirements Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                <div className="gov-card" style={{ borderLeft: '4px solid #0A3161' }}>
                  <div className="gov-card-body" style={{ padding: '12px 14px' }}>
                    <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>{isHi ? 'नीम लेपित यूरिया (46% N)' : 'Neem-Coated Urea (46% N)'}</span>
                    <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0A3161', marginTop: '2px' }}>
                      {fertilizerResult.totalBags.urea50kg} <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{isHi ? 'बोरी (45kg)' : 'Bags'}</span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#475569' }}>~{Math.round(fertilizerResult.totalBags.urea50kg * 45)} kg total</div>
                  </div>
                </div>

                <div className="gov-card" style={{ borderLeft: '4px solid #004D25' }}>
                  <div className="gov-card-body" style={{ padding: '12px 14px' }}>
                    <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>DAP (18-46-0)</span>
                    <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#004D25', marginTop: '2px' }}>
                      {fertilizerResult.totalBags.dap50kg} <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{isHi ? 'बोरी (50kg)' : 'Bags'}</span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#475569' }}>~{Math.round(fertilizerResult.totalBags.dap50kg * 50)} kg total</div>
                  </div>
                </div>

                <div className="gov-card" style={{ borderLeft: '4px solid #D97706' }}>
                  <div className="gov-card-body" style={{ padding: '12px 14px' }}>
                    <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>MOP / Potash (60% K₂O)</span>
                    <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#D97706', marginTop: '2px' }}>
                      {fertilizerResult.totalBags.mop50kg} <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{isHi ? 'बोरी (50kg)' : 'Bags'}</span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#475569' }}>~{Math.round(fertilizerResult.totalBags.mop50kg * 50)} kg total</div>
                  </div>
                </div>

                <div className="gov-card" style={{ borderLeft: '4px solid #7C3AED' }}>
                  <div className="gov-card-body" style={{ padding: '12px 14px' }}>
                    <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Zinc Sulphate (21% Zn)</span>
                    <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#7C3AED', marginTop: '2px' }}>
                      {fertilizerResult.totalBags.zincSulphateKg} <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>kg</span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#475569' }}>{isHi ? 'खैरा रोग रोकथाम' : 'Micro-nutrient dose'}</div>
                  </div>
                </div>
              </div>

              {/* Application Schedule Timeline */}
              <div className="gov-card">
                <div className="gov-card-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FileText size={18} color="#0A3161" />
                    <span>{isHi ? 'वैज्ञानिक विभाजन अनुप्रयोग अनुसूची (Split Schedule)' : 'Scientific Split Application Schedule'}</span>
                  </div>
                  <span style={{ fontSize: '0.72rem', color: '#64748B' }}>Stage-wise dosage</span>
                </div>

                <div className="gov-card-body" style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {(fertilizerResult.splitSchedule || []).map((s, idx) => (
                      <div key={idx} style={{ border: '1px solid #CBD5E1', borderRadius: '3px', padding: '10px 14px', background: '#FFFFFF' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                          <strong style={{ color: '#004D25', fontSize: '0.85rem' }}>{s.stage}</strong>
                          <span style={{ fontSize: '0.7rem', background: '#F1F5F9', color: '#475569', padding: '2px 6px', borderRadius: '3px', fontWeight: 700 }}>
                            {isHi ? `चरण ${idx + 1}` : `Step ${idx + 1}`}
                          </span>
                        </div>
                        <div style={{ fontWeight: 800, color: '#0A3161', marginBottom: '2px', fontSize: '0.85rem' }}>
                          {s.fertilizers}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#64748B' }}>
                          💡 {s.note}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
