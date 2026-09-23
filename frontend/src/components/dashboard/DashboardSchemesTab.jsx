import { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { API_URL } from '../../config';

const FALLBACK_SCHEMES = [
  { titleEn: 'PM-KISAN Samman Nidhi', titleHi: 'प्रधानमंत्री किसान सम्मान निधि', benefit: '₹6,000 / वर्ष', status: 'Active (17th Installment)', statusHi: 'सत्यापित (17वीं किस्त जारी)', color: '#059669' },
  { titleEn: 'PM Fasal Bima Yojana (PMFBY)', titleHi: 'प्रधानमंत्री फसल बीमा योजना (PMFBY)', benefit: '100% Crop Damage Cover', benefitHi: 'फसल क्षति पर 100% भरपाई', status: 'Policy Active', statusHi: 'पॉलिसी सक्रिय', color: '#0284C7' },
  { titleEn: 'PM-KUSUM Solar Irrigation', titleHi: 'पीएम-कुसुम सोलर पंप योजना', benefit: 'Up to 60% Solar Subsidy', benefitHi: '60% तक सरकारी सब्सिडी', status: 'Open for Application', statusHi: 'आवेदन खुला', color: '#D97706' },
  { titleEn: 'Soil Health Card Scheme', titleHi: 'मृदा स्वास्थ्य कार्ड योजना', benefit: 'Free Lab Soil Analysis', benefitHi: 'निःशुल्क पोषक तत्व परीक्षण', status: 'Ready for Renewal', statusHi: 'कार्ड नवीनीकरण तैयार', color: '#7C3AED' }
];

export default function DashboardSchemesTab({ isHi, navigate }) {
  const [schemes, setSchemes] = useState([]);

  useEffect(() => {
    let isMounted = true;
    axios.get(`${API_URL}/schemes?category=all&state=all`)
      .then(res => {
        if (isMounted && Array.isArray(res.data) && res.data.length > 0) {
          const featured = res.data.filter(s => s.featured).slice(0, 4);
          const colorList = ['#059669', '#0284C7', '#D97706', '#7C3AED'];
          const mapped = featured.map((s, idx) => ({
            title: isHi ? (s.hindiName || s.name) : s.name,
            benefit: isHi ? (s.subsidyRate || s.benefitHi?.slice(0, 30)) : (s.subsidyRate || s.benefitEn?.slice(0, 30)),
            status: isHi ? 'सत्यापित एवं सक्रिय' : (s.statusBadge || 'Active Central DBT'),
            color: colorList[idx % colorList.length]
          }));
          setSchemes(mapped);
        }
      })
      .catch(() => {});
    return () => { isMounted = false; };
  }, [isHi]);

  const displayList = schemes.length > 0 ? schemes : FALLBACK_SCHEMES.map(s => ({
    title: isHi ? s.titleHi : s.titleEn,
    benefit: isHi ? (s.benefitHi || s.benefit) : s.benefit,
    status: isHi ? s.statusHi : s.status,
    color: s.color
  }));

  return (
    <div className="gov-card-body" style={{ padding: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <strong style={{ fontSize: '0.96rem', color: '#0A3161' }}>
            {isHi ? 'प्रत्यक्ष लाभ अंतरण (DBT) एवं सब्सिडी सेवाएं' : 'Direct Benefit Transfer (DBT) & Welfare Schemes'}
          </strong>
          <div style={{ fontSize: '0.76rem', color: '#64748B', marginTop: '2px' }}>
            {isHi ? 'आधार लिंक बैंक खाते में सीधे आर्थिक सहायता' : '100% direct financial assistance to verified Aadhaar bank accounts'}
          </div>
        </div>
        <button 
          id="dashboard-schemes-apply-btn"
          onClick={() => navigate('/schemes')} 
          className="gov-btn gov-btn-green"
          style={{ padding: '6px 14px', fontSize: '0.8rem' }}
        >
          <span>{isHi ? 'योजना स्थिति व आवेदन' : 'Check Eligibility & Apply'}</span>
          <ArrowRight size={14} />
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
        {displayList.map((s, idx) => (
          <div key={idx} style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '4px', padding: '14px', borderTop: `3px solid ${s.color}` }}>
            <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#0A3161' }}>{s.title}</div>
            <div style={{ fontSize: '1.05rem', fontWeight: 900, color: s.color, margin: '4px 0' }}>{s.benefit}</div>
            <div style={{ fontSize: '0.74rem', color: '#059669', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <CheckCircle2 size={13} />
              <span>{s.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
