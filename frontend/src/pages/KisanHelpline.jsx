import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  PhoneCall, ShieldCheck, MapPin, AlertTriangle, ExternalLink, 
  HelpCircle, CheckCircle2, Info, Headphones, Clock, Landmark, Globe, Printer
} from 'lucide-react';

const HELPLINES = [
  {
    id: 'kcc',
    title: 'Kisan Call Centre (KCC)',
    titleHi: 'किसान कॉल सेंटर (केसीसी) - आईसीएआर वैज्ञानिक परामर्श',
    number: '1800-180-1551',
    timing: '6:00 AM – 10:00 PM (All 365 Days)',
    timingHi: 'प्रातः 6:00 से रात्रि 10:00 (सभी 365 दिन)',
    languages: 'Hindi, English & 22 Regional Languages',
    languagesHi: 'हिन्दी, अंग्रेजी एवं 22 क्षेत्रीय भाषाएं',
    desc: 'Direct consultation with agricultural scientists (Level 2) and agriculture graduates (Level 1) regarding crop pests, seeds, weather advisories, and fertilizers.',
    descHi: 'फसल रोग, कीट प्रबंधन, खाद, बीज एवं मौसम सलाह हेतु कृषि वैज्ञानिकों एवं विशेषज्ञों से सीधी निःशुल्क बातचीत।',
    actionText: 'Dial 1800-180-1551',
    badge: 'Toll-Free 365 Days',
    badgeColor: '#004D25',
    portalUrl: 'https://mkisan.gov.in'
  },
  {
    id: 'pmkisan',
    title: 'PM-KISAN Samman Nidhi Helpline',
    titleHi: 'पीएम-किसान सम्मान निधि शिकायत एवं सहायता केंद्र',
    number: '155261 / 011-24300606',
    timing: '9:30 AM – 6:00 PM (Monday to Friday)',
    timingHi: 'प्रातः 9:30 से सायं 6:00 (सोमवार से शुक्रवार)',
    languages: 'Hindi & English',
    languagesHi: 'हिन्दी एवं अंग्रेजी',
    desc: 'Assistance for DBT installment verification, Aadhaar-NPCI bank account seeding, land registry corrections, and e-KYC completion.',
    descHi: '₹6,000 वार्षिक सम्मान निधि किस्त, आधार बैंक सीडिंग, ई-केवाईसी एवं भूमि रिकॉर्ड सुधार हेतु सहायता।',
    actionText: 'Dial 155261',
    badge: 'DBT Support',
    badgeColor: '#0A3161',
    portalUrl: 'https://pmkisan.gov.in'
  },
  {
    id: 'pmfby',
    title: 'PM Fasal Bima Yojana (PMFBY) Grievance',
    titleHi: 'प्रधानमंत्री फसल बीमा योजना (72 घंटे में फसल क्षति सूचना)',
    number: '14447',
    timing: '24x7 Toll Free IVRS',
    timingHi: '24 घंटे निःशुल्क आईवीआरएस',
    languages: 'All Indian Languages',
    languagesHi: 'सभी भारतीय भाषाएं',
    desc: 'Report localized calamities (hailstorm, unseasonal torrential rain, inundation) within 72 hours of damage to trigger immediate field assessment and claim payout.',
    descHi: 'ओलावृष्टि, जलभराव या प्राकृतिक आपदा से फसल क्षति होने के 72 घंटे के भीतर नुकसान की सूचना दर्ज कराएं।',
    actionText: 'Dial 14447',
    badge: '72hr Window',
    badgeColor: '#D97706',
    portalUrl: 'https://pmfby.gov.in'
  },
  {
    id: 'kcc_loan',
    title: 'Kisan Credit Card (KCC Loan Desk)',
    titleHi: 'किसान क्रेडिट कार्ड (4% रियायती ऋण सहायता केंद्र)',
    number: '1800-11-2211',
    timing: '10:00 AM – 5:00 PM Banking Hours',
    timingHi: 'बैंकिंग कार्यदिवस 10:00 - 5:00',
    languages: 'Hindi & Regional',
    languagesHi: 'हिन्दी एवं क्षेत्रीय',
    desc: 'Queries regarding 4% interest rate crop production loan up to ₹3 Lakhs, collateral-free credit limit up to ₹1.6 Lakhs, and allied dairy/fisheries KCC.',
    descHi: '4% रियायती ब्याज दर पर ₹3 लाख तक फसल ऋण तथा ₹1.60 लाख तक बिना गारंटी केसीसी जारी कराने में सहायता।',
    actionText: 'Call KCC Desk',
    badge: '4% Subsidized Loan',
    badgeColor: '#0A3161',
    portalUrl: 'https://sbi.co.in/web/agri-rural/agriculture-banking/crop-loan/kisan-credit-card'
  },
  {
    id: 'enam_help',
    title: 'e-NAM National Agri Market Helpdesk',
    titleHi: 'राष्ट्रीय कृषि बाजार (ई-नाम) सहायता केंद्र',
    number: '1800-270-0224',
    timing: '9:00 AM – 9:00 PM (Monday to Saturday)',
    timingHi: 'प्रातः 9:00 से रात्रि 9:00 (सोमवार से शनिवार)',
    languages: 'Hindi, English & Regional',
    languagesHi: 'हिन्दी, अंग्रेजी व क्षेत्रीय',
    desc: 'Support for pan-India mandi online trading, electronic weighing/assaying, online payment settlement directly to farmer bank accounts, and APMC disputes.',
    descHi: 'अखिल भारतीय डिजिटल मंडी नीलामी, फसल गुणवत्ता जांच तथा सीधे बैंक खाते में भुगतान संबंधी सहायता।',
    actionText: 'Dial 1800-270-0224',
    badge: 'Market Desk',
    badgeColor: '#004D25',
    portalUrl: 'https://enam.gov.in'
  },
  {
    id: 'kusum_help',
    title: 'PM-KUSUM Solar Agriculture Pump Desk',
    titleHi: 'पीएम-कुसुम सोलर सिंचाई पंप सहायता केंद्र',
    number: '1800-180-3333',
    timing: '9:30 AM – 5:30 PM (Working Days)',
    timingHi: 'प्रातः 9:30 से सायं 5:30 (कार्यदिवस)',
    languages: 'Hindi & English',
    languagesHi: 'हिन्दी एवं अंग्रेजी',
    desc: 'Assistance for 60% solar pump subsidies, state renewable agency applications (Component B), and solar grid feed-in verification.',
    descHi: '60% सरकारी अनुदान पर सोलर सिंचाई पंप लगाने एवं राज्य अक्षय ऊर्जा एजेंसी आवेदन हेतु सहायता।',
    actionText: 'Dial 1800-180-3333',
    badge: '60% Solar Subsidy',
    badgeColor: '#D97706',
    portalUrl: 'https://pmkusum.mnre.gov.in'
  },
  {
    id: 'ndma_help',
    title: 'National Disaster Emergency Control (NDMA)',
    titleHi: 'राष्ट्रीय आपदा प्रबंधन नियंत्रण कक्ष (NDMA)',
    number: '1078 / 011-26701728',
    timing: '24x7 Emergency Helpline',
    timingHi: '24 घंटे आपातकालीन हेल्पलाइन',
    languages: 'All Languages',
    languagesHi: 'सभी भाषाएं',
    desc: 'Severe weather emergencies, flash floods, cyclone warnings, and immediate relief coordination for agrarian distress.',
    descHi: 'बाढ़, चक्रवात, आंधी-तूफान एवं भीषण मौसमी आपदा के समय तत्काल राहत एवं बचाव समन्वय।',
    actionText: 'Dial 1078',
    badge: '24x7 Disaster Desk',
    badgeColor: '#DC2626',
    portalUrl: 'https://ndma.gov.in'
  }
];

const DISASTER_ALERTS = [
  {
    type: 'Heavy Rainfall & Waterlogging (अत्यधिक वर्षा एवं जलभराव)',
    tips: [
      'Dig 30cm deep drainage channels along field boundaries to drain standing water within 24 hours.',
      'Do not apply chemical nitrogen/urea while field is inundated; it causes rapid leaching losses.',
      'Foliar spray 1% Potassium Nitrate (13-0-45) after drainage to revive root aeration.'
    ],
    tipsHi: [
      'खेत की मेड़ों के किनारे 30 सेमी गहरी जल निकासी नालियां बनाकर 24 घंटे में जमा पानी बाहर निकालें।',
      'जलभराव की स्थिति में यूरिया खाद न डालें, इससे खाद बहकर नष्ट हो जाती है।',
      'पानी निकलने के बाद जड़ों को सक्रिय करने के लिए 1% पोटेशियम नाइट्रेट (13-0-45) का छिड़काव करें।'
    ]
  },
  {
    type: 'Hailstorm & High Wind Storm (ओलावृष्टि एवं आंधी-तूफान)',
    tips: [
      'Immediately click geo-tagged photos and report damage on PMFBY app or toll-free 14447 within 72 hours.',
      'Spray Mancozeb 75% WP @ 2g/L or Carbendazim @ 1g/L to prevent secondary fungal entry through physical tears in leaves.'
    ],
    tipsHi: [
      'नुकसान के तुरंत फोटो लें तथा 72 घंटे के भीतर पीएमएफबीवाई ऐप या टोल-फ्री 14447 पर क्लेम दर्ज कराएं।',
      'पत्तियों के कटे-फटे भागों से फफूंद रोकने हेतु मेंकोजेब 75% WP @ 2 ग्राम प्रति लीटर पानी का छिड़काव करें।'
    ]
  },
  {
    type: 'Heatwave & High Temperature Stress (लू एवं उच्च तापमान)',
    tips: [
      'Apply light and frequent evening irrigations or use sprinkler micro-irrigation to cool canopy micro-climate.',
      'Foliar spray 0.2% Zinc Sulfate + 0.5% Urea or Salicylic acid @ 100 ppm during tillering and milking stages.'
    ],
    tipsHi: [
      'फसल को लू से बचाने के लिए शाम के समय हल्की सिंचाई करें अथवा स्प्रिंकलर से पानी छिड़कें।',
      'दूधिया अवस्था में 0.2% जिंक सल्फेट अथवा 100 पीपीएम सैलिसिलिक एसिड का छिड़काव करें।'
    ]
  }
];

export default function KisanHelpline() {
  const { currentLang } = useLanguage();
  const isHi = currentLang === 'hi';

  useEffect(() => {
    document.title = isHi 
      ? 'किसान आपातकालीन हेल्पलाइन एवं सहायता केंद्र - कृषिमित्राज़' 
      : 'Kisan Emergency Toll-Free & Grievance Desks - KrishiMitraaz';
  }, [isHi]);

  return (
    <div className="container" style={{ padding: '1.5rem 1rem 3rem', maxWidth: '1280px', margin: '0 auto' }}>
      {/* 1. Official Banner */}
      <div className="header-banner" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.15)', padding: '3px 10px', borderRadius: '3px', fontSize: '0.75rem', fontWeight: 700, marginBottom: '8px' }}>
              <Headphones size={14} color="#FDE047" />
              <span>{isHi ? 'किसान कॉल सेंटर 24x7 आपातकालीन सहायता' : 'Kisan Call Centre 24x7 Emergency Support'}</span>
            </div>
            <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 900 }}>
              {isHi ? 'राष्ट्रीय किसान सहायता केंद्र एवं आधिकारिक आपातकालीन टोल-फ्री निर्देशिका' : 'National Kisan Toll-Free Helplines & Grievance Directory'}
            </h1>
            <p style={{ margin: '6px 0 0', fontSize: '0.9rem', color: '#E2E8F0', maxWidth: '850px', lineHeight: 1.5 }}>
              {isHi 
                ? 'फसल कीट-रोग, मौसमी आपदा, पीएम-किसान सम्मान निधि (155261) तथा पीएमएफबीवाई फसल क्षति (14447) हेतु आधिकारिक सरकारी टोल-फ्री नंबरों पर सीधे संपर्क करें।'
                : 'Direct one-touch access to Govt of India official 24x7 Kisan Call Centers, PM-KISAN grievance desks, PMFBY 72-hour crop loss helplines, and disaster SOPs.'}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={() => window.print()}
              className="gov-btn gov-btn-secondary no-print"
              style={{ background: 'rgba(255,255,255,0.15)', color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.3)' }}
            >
              <Printer size={15} />
              <span>{isHi ? 'प्रिंट निर्देशिका' : 'Print Helplines'}</span>
            </button>
            <a
              href="tel:18001801551"
              className="gov-btn gov-btn-primary"
              style={{ background: '#FF9933', color: '#000000', borderColor: '#FF9933', fontWeight: 800, textDecoration: 'none' }}
            >
              <PhoneCall size={16} />
              <span>{isHi ? 'किसान कॉल सेंटर: 1800-180-1551' : 'Call KCC: 1800-180-1551'}</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. Grid of Helpline Services */}
      <div className="gov-card" style={{ marginBottom: '1.5rem' }}>
        <div className="gov-card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PhoneCall size={18} color="#0A3161" />
            <span>{isHi ? 'केंद्रीय एवं राज्य अधिकृत हेल्पलाइन नंबर' : 'Central & State Authorized Toll-Free Desks'}</span>
          </div>
          <span style={{ fontSize: '0.72rem', color: '#64748B' }}>
            {isHi ? 'निःशुल्क सरकारी सेवाएं' : 'Toll-Free Government Support'}
          </span>
        </div>
        <div className="gov-card-body" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
            {HELPLINES.map(item => (
              <div 
                key={item.id} 
                style={{ 
                  border: '1px solid #CBD5E1', 
                  borderRadius: '4px', 
                  padding: '1rem', 
                  background: '#FFFFFF', 
                  borderTop: `4px solid ${item.badgeColor}`,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px', gap: '6px' }}>
                    <span style={{ 
                      background: '#F1F5F9', 
                      color: item.badgeColor, 
                      padding: '2px 8px', 
                      borderRadius: '3px', 
                      fontSize: '0.7rem', 
                      fontWeight: 800,
                      border: '1px solid #E2E8F0'
                    }}>
                      {item.badge}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={12} /> {isHi ? item.timingHi : item.timing}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0A3161', marginBottom: '4px', lineHeight: 1.3 }}>
                    {isHi ? item.titleHi : item.title}
                  </h3>
                  <span style={{ fontSize: '0.74rem', color: '#004D25', fontWeight: 700, display: 'block', marginBottom: '8px' }}>
                    🗣️ {isHi ? item.languagesHi : item.languages}
                  </span>

                  <p style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.5, margin: '0 0 12px 0' }}>
                    {isHi ? item.descHi : item.desc}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid #E2E8F0' }}>
                  <a
                    href={`tel:${item.number.split('/')[0].trim()}`}
                    className="gov-btn gov-btn-primary"
                    style={{ flex: 1, justifyContent: 'center', textDecoration: 'none', fontSize: '0.82rem' }}
                  >
                    <PhoneCall size={14} />
                    <span>{item.number}</span>
                  </a>

                  {item.portalUrl && (
                    <a
                      href={item.portalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="gov-btn gov-btn-secondary"
                      style={{ padding: '7px 10px' }}
                      title="Official Portal"
                    >
                      <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Weather Disaster & Calamity SOPs */}
      <div className="gov-card">
        <div className="gov-card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={18} color="#D97706" />
            <span>{isHi ? 'प्राकृतिक आपदा एवं मौसम संकट मानक संचालन प्रक्रिया (SOP)' : 'Disaster Relief SOPs & ICAR Agronomic Advisory'}</span>
          </div>
          <span style={{ fontSize: '0.72rem', color: '#64748B' }}>
            NDMA & ICAR Approved
          </span>
        </div>
        <div className="gov-card-body" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
            {DISASTER_ALERTS.map((alert, index) => (
              <div 
                key={index}
                style={{ 
                  padding: '1rem', 
                  background: '#FFFBEB',
                  border: '1px solid #FCD34D',
                  borderRadius: '4px',
                  borderLeft: '4px solid #D97706'
                }}
              >
                <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#92400E', marginBottom: '8px', lineHeight: 1.3 }}>
                  {alert.type}
                </h3>

                <ul style={{ margin: 0, paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {(isHi ? alert.tipsHi : alert.tips).map((tip, idx) => (
                    <li key={idx} style={{ fontSize: '0.8rem', color: '#334155', lineHeight: 1.4 }}>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
