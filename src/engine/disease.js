// DISEASE & PEST ENGINE ── Disease detection and fertilizer use guidance (UVP #4)
// Provides symptom-based and image-assisted diagnostics with organic and safe chemical remedies,
// plus precise fertilizer dosage calculations tailored by acreage.

export function getDiseaseGuidance(cropId, wetWarmDays) {
  if (wetWarmDays >= 3) {
    return {
      title: 'Disease Triage Alert',
      message: `Weather is highly favorable for fungal infections. Use the crop doctor in the app to inspect leaves. Our agronomy engine detects early signs of rust, blight, and fungal pathogens.`,
      basis: `model:cnn_triage;weather:wetWarmDays=${wetWarmDays}`
    };
  }
  return null;
}

export const DISEASE_DATABASE = {
  wheat: [
    {
      id: 'yellow_rust',
      name: 'Yellow Rust / Stripe Rust (पीला रतुआ)',
      causalAgent: 'Fungus (Puccinia striiformis)',
      severity: 'Severe',
      symptoms: [
        'Linear yellow or orange pustules arranged in stripes on leaves',
        'Yellow powder rubbing off onto fingers when leaves are touched',
        'Premature drying of leaves reducing photosynthesis during grain filling'
      ],
      conduciveWeather: 'Cool humid weather (10-20°C) with persistent morning dew or light drizzle',
      organicRemedy: 'Spray 5% Cow Urine extract with neem leaves concoction or Trichoderma viride @ 5g/L at first symptom appearance.',
      chemicalRemedy: 'Propiconazole 25% EC (Tilt) @ 1 ml per liter of water (200 ml in 200 L water per acre). Repeat after 15 days if yellow stripes persist.',
      preventiveAdvice: 'Choose resistant cultivars like HD-2967, HD-3086, or DBW-187. Avoid excessive early nitrogen application.'
    },
    {
      id: 'karnal_bunt',
      name: 'Karnal Bunt (करनाल बंट)',
      causalAgent: 'Fungus (Tilletia indica)',
      severity: 'Moderate',
      symptoms: [
        'Partial conversion of wheat kernels into black powdery foul-smelling masses',
        'Rotten fish odor (trimethylamine) during threshing'
      ],
      conduciveWeather: 'Cloudy weather and high humidity during flowering stage',
      organicRemedy: 'Seed treatment with Trichoderma harzianum @ 10g/kg seed before sowing.',
      chemicalRemedy: 'Foliar spray of Propiconazole 25% EC @ 0.1% at 50% ear emergence stage.',
      preventiveAdvice: 'Never use grains from an infected field for seed next season. Practice crop rotation with non-cereal crops.'
    }
  ],
  rice: [
    {
      id: 'rice_blast',
      name: 'Rice Blast (धान का झुलसा रोग)',
      causalAgent: 'Fungus (Magnaporthe oryzae)',
      severity: 'Severe',
      symptoms: [
        'Spindle-shaped or eye-shaped lesions with brown margins and greyish centers on leaves',
        'Blackening and breaking of node or neck below the panicle (neck blast)'
      ],
      conduciveWeather: 'High relative humidity (>90%) with night temperatures around 20-22°C',
      organicRemedy: 'Spray Pseudomonas fluorescens @ 2.5 kg/ha in 500 L water or Neem Seed Kernel Extract (NSKE) 5%.',
      chemicalRemedy: 'Tricyclazole 75% WP (Baan) @ 0.6 g per liter of water, or Isoprothiolane 40% EC @ 1.5 ml/L.',
      preventiveAdvice: 'Avoid excess split of Urea fertilizer. Maintain thin water layer; do not let field crack dry during vegetative stage.'
    },
    {
      id: 'bacterial_leaf_blight',
      name: 'Bacterial Leaf Blight (BLB / जीवाणु झुलसा)',
      causalAgent: 'Bacterium (Xanthomonas oryzae)',
      severity: 'High',
      symptoms: [
        'Water-soaked lesions starting from leaf tips moving downwards along leaf margins',
        'Lesions turn wavy yellow-white, followed by curling and drying (kresek phase in seedlings)'
      ],
      conduciveWeather: 'Warm temperatures (25-34°C), strong winds, and heavy rain or overhead flooding',
      organicRemedy: 'Spray fresh cow dung filtrate (20 kg cow dung soaked in 100 L water, filtered, diluted to 200 L).',
      chemicalRemedy: 'Streptocycline 90% (Streptomycin sulphate) @ 6g + Copper Oxychloride 50% WP @ 500g in 200 L water per acre.',
      preventiveAdvice: 'Drain standing water for 2-3 days to inhibit bacterial spread. Apply Potash (MOP) to strengthen cell walls.'
    }
  ],
  cotton: [
    {
      id: 'pink_bollworm',
      name: 'Pink Bollworm (गुलाबी सुंडी)',
      causalAgent: 'Insect Pest (Pectinophora gossypiella)',
      severity: 'Critical',
      symptoms: [
        'Rosetted flowers that fail to open normally',
        'Entry holes on developing bolls sealed with excreta',
        'Stained lint and premature boll dropping'
      ],
      conduciveWeather: 'Continuous warm overcast weather during squaring and boll formation',
      organicRemedy: 'Install 5-8 Pheromone traps (Gossyplure) per acre for monitoring. Release Trichogramma egg parasitoids @ 60,000/acre.',
      chemicalRemedy: 'Emamectin Benzoate 5% SG @ 0.5g/L or Chlorantraniliprole 18.5% SC (Coragen) @ 0.3 ml/L water.',
      preventiveAdvice: 'Destroy crop residues immediately after last picking. Avoid extending crop duration into winter.'
    }
  ],
  mustard: [
    {
      id: 'white_rust',
      name: 'White Rust (सफेद रतुआ)',
      causalAgent: 'Oomycete (Albugo candida)',
      severity: 'Moderate',
      symptoms: [
        'White or creamy pustules on the lower surface of leaves',
        'Staghead malformation of flowering floral heads causing sterile seeds'
      ],
      conduciveWeather: 'Humid cool conditions in December-January',
      organicRemedy: 'Foliar spray of garlic clove bulb extract 2% or Neem oil 3000 ppm @ 5 ml/L.',
      chemicalRemedy: 'Metalaxyl 8% + Mancozeb 64% WP (Ridomil MZ) @ 2 g/L of water at first sign.',
      preventiveAdvice: 'Early sowing before October 20 helps escape the peak infestation window.'
    }
  ],
  potato: [
    {
      id: 'late_blight',
      name: 'Late Blight (पिछेती झुलसा)',
      causalAgent: 'Oomycete (Phytophthora infestans)',
      severity: 'Critical',
      symptoms: [
        'Water-soaked dark lesions on leaf tips and margins rapidly turning black',
        'White cottony fungal growth on lower leaf surface in morning dew',
        'Foul decaying smell across the field with tubers rotting inside ridge'
      ],
      conduciveWeather: 'Foggy, damp weather with temperatures 12-18°C and relative humidity >85%',
      organicRemedy: 'Preventive spray of Bordeaux mixture 1% or Trichoderma viride @ 5g/L.',
      chemicalRemedy: 'Cymoxanil 8% + Mancozeb 64% WP (Curzate) @ 3 g/L or Dimethomorph 50% WP @ 1.5 g/L.',
      preventiveAdvice: 'Spray preventive Mancozeb 75% WP @ 2.5g/L before cold foggy spell begins.'
    }
  ]
};

// General diagnostic lookup
export function diagnoseSymptoms(cropId = 'wheat', symptomKeywords = []) {
  const norm = cropId.toLowerCase().trim();
  const cropDiseases = DISEASE_DATABASE[norm] || DISEASE_DATABASE['wheat'];

  if (!symptomKeywords || symptomKeywords.length === 0) {
    return {
      crop: norm,
      diagnoses: cropDiseases.slice(0, 2),
      confidence: 'General Guide'
    };
  }

  const query = symptomKeywords.join(' ').toLowerCase();
  const scored = cropDiseases.map(d => {
    let score = 0;
    d.symptoms.forEach(s => {
      if (query.split(' ').some(w => w.length > 3 && s.toLowerCase().includes(w))) {
        score += 2;
      }
    });
    if (query.includes(d.name.toLowerCase()) || query.includes(d.id)) score += 5;
    return { ...d, matchScore: score };
  });

  scored.sort((a, b) => b.matchScore - a.matchScore);
  const top = scored[0].matchScore > 0 ? scored : cropDiseases;

  return {
    crop: norm,
    diagnoses: top,
    confidence: scored[0].matchScore > 2 ? 'High Match' : 'Probable Match'
  };
}

// Fertilizer Recommendation Calculator per Acre
export function calculateFertilizerDose(crop = 'wheat', acres = 1) {
  const normCrop = crop.toLowerCase().trim();
  const safeAcres = Math.max(0.25, Number(acres) || 1);

  // Recommended N-P-K (kg/acre)
  const npkNorms = {
    wheat: { N: 48, P: 24, K: 16, basalUreaKg: 22, basalDapKg: 52, basalMopKg: 27, topDress1UreaKg: 40, topDress2UreaKg: 40 },
    rice: { N: 40, P: 20, K: 20, basalUreaKg: 18, basalDapKg: 44, basalMopKg: 33, topDress1UreaKg: 35, topDress2UreaKg: 35 },
    maize: { N: 48, P: 24, K: 20, basalUreaKg: 20, basalDapKg: 52, basalMopKg: 33, topDress1UreaKg: 45, topDress2UreaKg: 45 },
    cotton: { N: 40, P: 20, K: 20, basalUreaKg: 15, basalDapKg: 44, basalMopKg: 33, topDress1UreaKg: 35, topDress2UreaKg: 35 },
    mustard: { N: 32, P: 16, K: 12, basalUreaKg: 14, basalDapKg: 35, basalMopKg: 20, topDress1UreaKg: 30, topDress2UreaKg: 25 },
    potato: { N: 60, P: 40, K: 40, basalUreaKg: 30, basalDapKg: 87, basalMopKg: 66, topDress1UreaKg: 50, topDress2UreaKg: 50 }
  };

  const norm = npkNorms[normCrop] || npkNorms['wheat'];

  // Bags (50kg bags)
  const dapBags = Number(((norm.basalDapKg * safeAcres) / 50).toFixed(1));
  const ureaBags = Number((((norm.basalUreaKg + norm.topDress1UreaKg + norm.topDress2UreaKg) * safeAcres) / 50).toFixed(1));
  const mopBags = Number(((norm.basalMopKg * safeAcres) / 50).toFixed(1));

  return {
    crop: normCrop,
    acres: safeAcres,
    totalBags: {
      urea50kg: ureaBags,
      dap50kg: dapBags,
      mop50kg: mopBags,
      zincSulphateKg: Math.round(10 * safeAcres)
    },
    splitSchedule: [
      {
        stage: 'Basal (At Sowing / Seed Bed Preparation)',
        fertilizers: `DAP: ${Math.round(norm.basalDapKg * safeAcres)} kg, MOP (Potash): ${Math.round(norm.basalMopKg * safeAcres)} kg, Zinc Sulphate 21%: ${Math.round(10 * safeAcres)} kg, Urea: ${Math.round(norm.basalUreaKg * safeAcres)} kg`,
        note: 'Place basal fertilizer 4-5 cm below and to the side of seed furrow.'
      },
      {
        stage: 'First Top Dressing (Tillering / CRI Stage - 21-25 DAS)',
        fertilizers: `Neem Coated Urea: ${Math.round(norm.topDress1UreaKg * safeAcres)} kg`,
        note: 'Broadcast immediately following the first light irrigation.'
      },
      {
        stage: 'Second Top Dressing (Jointing / Pre-Flowering - 50-55 DAS)',
        fertilizers: `Neem Coated Urea: ${Math.round(norm.topDress2UreaKg * safeAcres)} kg`,
        note: 'Apply when soil is moist, avoid application right before heavy rains.'
      }
    ]
  };
}

export function analyzeSoilHealthCard({
  pH = 7.2,
  ec = 0.5,
  organicCarbon = 0.55,
  nitrogenKgHa = 260,
  phosphorusKgHa = 18,
  potassiumKgHa = 210,
  zincPpm = 0.8,
  sulfurPpm = 12.0,
  crop = 'wheat',
  acres = 1.0
} = {}) {
  const p = Number(pH) || 7.2;
  const e = Number(ec) || 0.5;
  const oc = Number(organicCarbon) || 0.55;
  const n = Number(nitrogenKgHa) || 260;
  const phos = Number(phosphorusKgHa) || 18;
  const k = Number(potassiumKgHa) || 210;
  const zn = Number(zincPpm) || 0.8;
  const s = Number(sulfurPpm) || 12.0;
  const safeAcres = Math.max(0.25, Number(acres) || 1);

  // 1. Soil Reaction Evaluation
  let phRating = 'Normal / Ideal (तटस्थ)';
  let phStatus = 'good';
  let amendment = 'Soil pH is well-balanced for maximum nutrient uptake. No chemical amendment needed.';
  if (p < 6.0) {
    phRating = 'Acidic (अम्लीय)';
    phStatus = 'warning';
    amendment = `Soil is acidic (pH ${p}). Apply Agricultural Lime (CaCO3) @ ${Math.round(400 * safeAcres)} kg or Dolomite to neutralize soil acidity and enhance phosphorus availability.`;
  } else if (p > 8.2) {
    phRating = 'Alkaline / Saline (क्षारीय / लवणीय)';
    phStatus = 'urgent';
    amendment = `Soil is alkaline (pH ${p}). Apply Agricultural Gypsum (CaSO4.2H2O) @ ${Math.round(500 * safeAcres)} kg followed by green manuring (Dhaincha / Sesbania) before sowing.`;
  }

  // 2. Salinity (EC)
  let ecRating = 'Normal (< 1.0 dS/m)';
  if (e > 1.2) {
    ecRating = 'High Salinity (> 1.2 dS/m - Salt risk)';
  }

  // 3. Organic Carbon
  let ocRating = 'Medium (0.50 - 0.75%)';
  let ocAdvice = 'Incorporate crop residue and apply 2 tonnes of FYM (Compost) per acre.';
  if (oc < 0.5) {
    ocRating = 'Low (< 0.50% - Deficient)';
    ocAdvice = 'Apply 4-5 tonnes Farm Yard Manure (FYM) or Vermicompost per acre. Treat seeds with Azotobacter / Rhizobium biofertilizer.';
  } else if (oc > 0.75) {
    ocRating = 'High (> 0.75% - Rich)';
    ocAdvice = 'Soil has excellent microbial activity and biological health.';
  }

  // 4. Primary Nutrients N-P-K
  const nStatus = n < 280 ? 'Low (कम)' : (n > 560 ? 'High (अधिक)' : 'Medium (मध्यम)');
  const pStatus = phos < 10 ? 'Low (कम)' : (phos > 25 ? 'High (अधिक)' : 'Medium (मध्यम)');
  const kStatus = k < 108 ? 'Low (कम)' : (k > 280 ? 'High (अधिक)' : 'Medium (मध्यम)');

  // Micronutrients
  const znStatus = zn < 0.6 ? 'Deficient (जिंक की कमी)' : 'Adequate (पर्याप्त)';
  const sStatus = s < 10 ? 'Deficient (सल्फर की कमी)' : 'Adequate (पर्याप्त)';

  // Calculate adjusted fertilizer requirement based on soil test
  const baseDose = calculateFertilizerDose(crop, safeAcres);
  let adjustedUrea = baseDose.totalBags.urea50kg;
  let adjustedDap = baseDose.totalBags.dap50kg;
  let adjustedMop = baseDose.totalBags.mop50kg;

  if (n < 280) adjustedUrea = Number((adjustedUrea * 1.25).toFixed(1));
  else if (n > 560) adjustedUrea = Number((adjustedUrea * 0.80).toFixed(1));

  if (phos < 10) adjustedDap = Number((adjustedDap * 1.20).toFixed(1));
  else if (phos > 25) adjustedDap = Number((adjustedDap * 0.85).toFixed(1));

  if (k < 108) adjustedMop = Number((adjustedMop * 1.25).toFixed(1));
  else if (k > 280) adjustedMop = Number((adjustedMop * 0.75).toFixed(1));

  const soilHealthScore = Math.min(100, Math.max(30, Math.round(
    (p >= 6.2 && p <= 7.8 ? 25 : 12) +
    (oc >= 0.5 ? 25 : 10) +
    (n >= 250 ? 20 : 10) +
    (phos >= 12 ? 15 : 8) +
    (k >= 150 ? 15 : 8)
  )));

  return {
    crop,
    acres: safeAcres,
    soilHealthScore,
    grade: soilHealthScore >= 80 ? 'Grade A (Fertile & Balanced)' : (soilHealthScore >= 60 ? 'Grade B (Moderately Fertile)' : 'Grade C (Requires Amendment)'),
    parameters: {
      pH: { value: p, rating: phRating, status: phStatus },
      ec: { value: e, rating: ecRating, status: e < 1.0 ? 'good' : 'warning' },
      organicCarbon: { value: `${oc}%`, rating: ocRating, advice: ocAdvice },
      nitrogen: { value: `${n} kg/ha`, rating: nStatus },
      phosphorus: { value: `${phos} kg/ha`, rating: pStatus },
      potassium: { value: `${k} kg/ha`, rating: kStatus },
      zinc: { value: `${zn} ppm`, rating: znStatus },
      sulfur: { value: `${s} ppm`, rating: sStatus }
    },
    soilAmendment: amendment,
    fertilizerPrescription: {
      ureaBags50kg: adjustedUrea,
      dapBags50kg: adjustedDap,
      mopBags50kg: adjustedMop,
      zincSulphateKg: zn < 0.6 ? Math.round(15 * safeAcres) : Math.round(5 * safeAcres),
      sulfurKg: s < 10 ? Math.round(10 * safeAcres) : 0
    },
    icarGuidelines: [
      'Apply 1/3 Nitrogen + 100% Phosphorus & Potash as basal dose before sowing.',
      'Split remaining Nitrogen in 2 top-dressings at CRI stage (21 DAS) and flowering stage.',
      zn < 0.6 ? 'Zinc deficiency detected: Apply 15 kg Zinc Sulphate (21%) per acre at basal preparation. Never mix Zinc directly with DAP.' : 'Zinc level is sufficient for healthy tillering.',
      'Use Neem Coated Urea to reduce nitrogen leaching losses by 20-25%.'
    ]
  };
}

