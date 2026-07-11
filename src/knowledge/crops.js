// CROP KNOWLEDGE BASE  ── the grounded core of the advisory engine.
//
// This is deliberately DATA, not code. Every number here should ultimately
// trace to a citable source (ICAR Package of Practices, state agri-university
// / KVK advisories). Keeping advice grounded in a versioned KB — instead of
// free-form LLM output — is KrishiMitraaz's trust story. Cite sources per crop.
//
// Growth stages use "days after sowing" (DAS) windows. Fertilizer doses are
// per-acre and illustrative — replace with district-calibrated values before
// any real deployment. Each crop is intentionally shallow but complete so the
// engine has every field it needs; add crops by copying the shape.

export const CROPS = {
  wheat: {
    id: 'wheat',
    name: { en: 'Wheat', hi: 'गेहूँ', mr: 'Wheat', pa: 'Wheat', gu: 'Wheat', ta: 'Wheat', te: 'Wheat', bn: 'Wheat', kn: 'Wheat', ml: 'Wheat', or: 'Wheat', as: 'Wheat' },
    season: 'rabi', // sown ~Oct–Dec, harvested ~Mar–Apr
    durationDays: 140,
    yieldPerAcreQuintals: 15,
    mspPerQuintal: 2275,
    seedCostPerAcre: 1200,
    fertilizerCostPerAcre: 3000,
    // Total nutrient recommendation per acre (N-P-K in kg), split across stages.
    nutrientPlanPerAcre: { N: 48, P: 24, K: 16 },
    idealTempC: { min: 10, max: 25 },
    stages: [
      { key: 'sowing', name: 'Sowing & germination', from: 0, to: 20,
        irrigationDays: 21,
        actions: [
          'Ensure seed treatment before sowing to prevent seed-borne disease.',
          'Apply full P & K and 1/3 of N as basal dose at sowing.',
        ] },
      { key: 'tillering', name: 'Crown root & tillering', from: 21, to: 45,
        irrigationDays: 7,
        actions: [
          'First irrigation at crown-root stage (~21 DAS) is the most critical of the season.',
          'Top-dress 1/3 of N after the first irrigation.',
        ] },
      { key: 'jointing', name: 'Jointing & booting', from: 46, to: 80,
        irrigationDays: 12,
        actions: [
          'Top-dress the final 1/3 of N.',
          'Watch for yellow rust in cool, humid spells — scout leaves weekly.',
        ] },
      { key: 'flowering', name: 'Flowering & milking', from: 81, to: 110,
        irrigationDays: 12,
        actions: [
          'Do not let the crop face moisture stress at flowering — yield-defining stage.',
        ] },
      { key: 'maturity', name: 'Grain filling & maturity', from: 111, to: 140,
        irrigationDays: 15,
        actions: [
          'Stop irrigation ~10–15 days before harvest.',
          'Harvest when grains are hard and straw turns golden.',
        ] },
    ],
    sources: ['ICAR Package of Practices — Wheat (placeholder, verify locally)'],
  },

  rice: {
    id: 'rice',
    name: { en: 'Rice (Paddy)', hi: 'धान', mr: 'Rice (Paddy)', pa: 'Rice (Paddy)', gu: 'Rice (Paddy)', ta: 'Rice (Paddy)', te: 'Rice (Paddy)', bn: 'Rice (Paddy)', kn: 'Rice (Paddy)', ml: 'Rice (Paddy)', or: 'Rice (Paddy)', as: 'Rice (Paddy)' },
    season: 'kharif', // sown ~Jun–Jul with monsoon
    durationDays: 125,
    yieldPerAcreQuintals: 18,
    mspPerQuintal: 2183,
    seedCostPerAcre: 1000,
    fertilizerCostPerAcre: 3500,
    nutrientPlanPerAcre: { N: 40, P: 20, K: 20 },
    idealTempC: { min: 20, max: 35 },
    stages: [
      { key: 'nursery', name: 'Nursery / transplanting', from: 0, to: 25,
        irrigationDays: 3,
        actions: [
          'Maintain 2–5 cm standing water after transplanting.',
          'Apply full P & K and 1/2 of N as basal.',
        ] },
      { key: 'tillering', name: 'Tillering', from: 26, to: 55,
        irrigationDays: 4,
        actions: [
          'Top-dress 1/4 of N at active tillering.',
          'Keep a thin water layer; drain briefly to control excessive tillers.',
        ] },
      { key: 'panicle', name: 'Panicle initiation', from: 56, to: 85,
        irrigationDays: 4,
        actions: [
          'Top-dress the final 1/4 of N at panicle initiation.',
          'Scout for stem borer and leaf folder.',
        ] },
      { key: 'flowering', name: 'Flowering', from: 86, to: 105,
        irrigationDays: 3,
        actions: ['Never let the field dry at flowering — keep saturated.'] },
      { key: 'maturity', name: 'Grain filling & maturity', from: 106, to: 125,
        irrigationDays: 6,
        actions: [
          'Drain the field ~10 days before harvest.',
          'Harvest at 80–85% golden grains.',
        ] },
    ],
    sources: ['ICAR Package of Practices — Rice (placeholder, verify locally)'],
  },

  maize: {
    id: 'maize',
    name: { en: 'Maize', hi: 'मक्का', mr: 'Maize', pa: 'Maize', gu: 'Maize', ta: 'Maize', te: 'Maize', bn: 'Maize', kn: 'Maize', ml: 'Maize', or: 'Maize', as: 'Maize' },
    season: 'kharif',
    durationDays: 100,
    yieldPerAcreQuintals: 20,
    mspPerQuintal: 2090,
    seedCostPerAcre: 1500,
    fertilizerCostPerAcre: 3000,
    nutrientPlanPerAcre: { N: 48, P: 24, K: 16 },
    idealTempC: { min: 18, max: 32 },
    stages: [
      { key: 'sowing', name: 'Sowing & establishment', from: 0, to: 15,
        irrigationDays: 6,
        actions: ['Apply full P & K and 1/3 N as basal.', 'Ensure good drainage — maize hates waterlogging.'] },
      { key: 'knee_high', name: 'Knee-high / vegetative', from: 16, to: 40,
        irrigationDays: 6,
        actions: ['Top-dress 1/3 N.', 'Scout for fall armyworm in whorls — act early.'] },
      { key: 'tasseling', name: 'Tasseling & silking', from: 41, to: 70,
        irrigationDays: 5,
        actions: ['Top-dress final 1/3 N before tasseling.', 'Most water-sensitive stage — do not let it stress.'] },
      { key: 'maturity', name: 'Grain filling & maturity', from: 71, to: 100,
        irrigationDays: 10,
        actions: ['Reduce irrigation near maturity.', 'Harvest when husks dry and kernels dent.'] },
    ],
    sources: ['ICAR Package of Practices — Maize (placeholder, verify locally)'],
  },

  cotton: {
    id: 'cotton',
    name: { en: 'Cotton', hi: 'कपास', mr: 'Cotton', pa: 'Cotton', gu: 'Cotton', ta: 'Cotton', te: 'Cotton', bn: 'Cotton', kn: 'Cotton', ml: 'Cotton', or: 'Cotton', as: 'Cotton' },
    season: 'kharif',
    durationDays: 165,
    yieldPerAcreQuintals: 8,
    mspPerQuintal: 6620,
    seedCostPerAcre: 2000,
    fertilizerCostPerAcre: 4000,
    nutrientPlanPerAcre: { N: 40, P: 20, K: 20 },
    idealTempC: { min: 21, max: 35 },
    stages: [
      { key: 'sowing', name: 'Sowing & seedling', from: 0, to: 30,
        irrigationDays: 8,
        actions: ['Apply full P & K and 1/3 N as basal.', 'Maintain plant spacing to reduce pest pressure.'] },
      { key: 'squaring', name: 'Squaring', from: 31, to: 70,
        irrigationDays: 8,
        actions: ['Top-dress 1/3 N.', 'Begin scouting for bollworm; use pheromone traps.'] },
      { key: 'flowering', name: 'Flowering & boll development', from: 71, to: 120,
        irrigationDays: 7,
        actions: ['Top-dress final 1/3 N.', 'Critical water demand — avoid stress during boll formation.'] },
      { key: 'boll_opening', name: 'Boll opening & picking', from: 121, to: 165,
        irrigationDays: 12,
        actions: ['Reduce irrigation as bolls open.', 'Pick regularly to maintain fibre quality.'] },
    ],
    sources: ['ICAR Package of Practices — Cotton (placeholder, verify locally)'],
  },

  sugarcane: {
    id: 'sugarcane',
    name: { en: 'Sugarcane', hi: 'गन्ना', mr: 'Sugarcane', pa: 'Sugarcane', gu: 'Sugarcane', ta: 'Sugarcane', te: 'Sugarcane', bn: 'Sugarcane', kn: 'Sugarcane', ml: 'Sugarcane', or: 'Sugarcane', as: 'Sugarcane' },
    season: 'kharif', // Or annual
    durationDays: 365,
    yieldPerAcreQuintals: 300,
    mspPerQuintal: 315,
    seedCostPerAcre: 8000,
    fertilizerCostPerAcre: 6000,
    nutrientPlanPerAcre: { N: 100, P: 40, K: 40 },
    idealTempC: { min: 20, max: 35 },
    stages: [
      { key: 'germination', name: 'Germination', from: 0, to: 45, irrigationDays: 10, actions: ['Ensure adequate moisture for bud sprouting.'] },
      { key: 'tillering', name: 'Tillering', from: 46, to: 120, irrigationDays: 12, actions: ['Apply first top dressing of N.', 'Scout for early shoot borer.'] },
      { key: 'grand_growth', name: 'Grand Growth', from: 121, to: 250, irrigationDays: 15, actions: ['Maximum water and nutrient demand. Apply final N dose.'] },
      { key: 'maturity', name: 'Maturity & Ripening', from: 251, to: 365, irrigationDays: 20, actions: ['Withhold irrigation 15-20 days before harvest to improve sugar recovery.'] },
    ],
    sources: ['ICAR Package of Practices — Sugarcane'],
  },

  mustard: {
    id: 'mustard',
    name: { en: 'Mustard', hi: 'सरसों', mr: 'Mustard', pa: 'Mustard', gu: 'Mustard', ta: 'Mustard', te: 'Mustard', bn: 'Mustard', kn: 'Mustard', ml: 'Mustard', or: 'Mustard', as: 'Mustard' },
    season: 'rabi',
    durationDays: 120,
    yieldPerAcreQuintals: 6,
    mspPerQuintal: 5650,
    seedCostPerAcre: 500,
    fertilizerCostPerAcre: 2500,
    nutrientPlanPerAcre: { N: 25, P: 15, K: 15 },
    idealTempC: { min: 10, max: 25 },
    stages: [
      { key: 'sowing', name: 'Sowing & Germination', from: 0, to: 20, irrigationDays: 25, actions: ['Apply basal fertilizers with Sulphur for better oil content.'] },
      { key: 'vegetative', name: 'Vegetative growth', from: 21, to: 50, irrigationDays: 25, actions: ['First irrigation at 30-35 DAS. Thinning to maintain spacing.'] },
      { key: 'flowering', name: 'Flowering & Siliqua formation', from: 51, to: 90, irrigationDays: 25, actions: ['Critical stage for irrigation. Watch out for aphids.'] },
      { key: 'maturity', name: 'Maturity', from: 91, to: 120, irrigationDays: 0, actions: ['Harvest when pods turn yellow to avoid shattering.'] },
    ],
    sources: ['ICAR Package of Practices — Mustard'],
  },

  soybean: {
    id: 'soybean',
    name: { en: 'Soybean', hi: 'सोयाबीन', mr: 'Soybean', pa: 'Soybean', gu: 'Soybean', ta: 'Soybean', te: 'Soybean', bn: 'Soybean', kn: 'Soybean', ml: 'Soybean', or: 'Soybean', as: 'Soybean' },
    season: 'kharif',
    durationDays: 100,
    yieldPerAcreQuintals: 8,
    mspPerQuintal: 4600,
    seedCostPerAcre: 3000,
    fertilizerCostPerAcre: 2000,
    nutrientPlanPerAcre: { N: 10, P: 30, K: 15 },
    idealTempC: { min: 25, max: 32 },
    stages: [
      { key: 'sowing', name: 'Sowing & Germination', from: 0, to: 20, irrigationDays: 10, actions: ['Seed treatment with Rhizobium is essential.'] },
      { key: 'vegetative', name: 'Vegetative', from: 21, to: 45, irrigationDays: 15, actions: ['Keep field weed-free for first 30 days.'] },
      { key: 'flowering', name: 'Flowering & Pod formation', from: 46, to: 80, irrigationDays: 10, actions: ['Critical water requirement stage. Avoid moisture stress.'] },
      { key: 'maturity', name: 'Maturity', from: 81, to: 100, irrigationDays: 20, actions: ['Harvest when leaves drop and pods dry.'] },
    ],
    sources: ['ICAR Package of Practices — Soybean'],
  },
  
  groundnut: {
    id: 'groundnut',
    name: { en: 'Groundnut', hi: 'मूंगफली', mr: 'Groundnut', pa: 'Groundnut', gu: 'Groundnut', ta: 'Groundnut', te: 'Groundnut', bn: 'Groundnut', kn: 'Groundnut', ml: 'Groundnut', or: 'Groundnut', as: 'Groundnut' },
    season: 'kharif',
    durationDays: 110,
    yieldPerAcreQuintals: 8,
    mspPerQuintal: 6377,
    seedCostPerAcre: 4000,
    fertilizerCostPerAcre: 2500,
    nutrientPlanPerAcre: { N: 10, P: 20, K: 15 },
    idealTempC: { min: 25, max: 30 },
    stages: [
      { key: 'sowing', name: 'Sowing & Germination', from: 0, to: 20, irrigationDays: 10, actions: ['Treat seeds to prevent root rot.'] },
      { key: 'vegetative', name: 'Vegetative & Pegging', from: 21, to: 60, irrigationDays: 12, actions: ['Apply gypsum at pegging stage. Do not disturb soil after pegging.'] },
      { key: 'pod_development', name: 'Pod development', from: 61, to: 90, irrigationDays: 10, actions: ['Critical stage for moisture. Watch for leaf spot (Tikka disease).'] },
      { key: 'maturity', name: 'Maturity', from: 91, to: 110, irrigationDays: 20, actions: ['Harvest when inner shell turns dark.'] },
    ],
    sources: ['ICAR Package of Practices — Groundnut'],
  },

  potato: {
    id: 'potato',
    name: { en: 'Potato', hi: 'आलू', mr: 'Potato', pa: 'Potato', gu: 'Potato', ta: 'Potato', te: 'Potato', bn: 'Potato', kn: 'Potato', ml: 'Potato', or: 'Potato', as: 'Potato' },
    season: 'rabi',
    durationDays: 100,
    yieldPerAcreQuintals: 100,
    mspPerQuintal: 1500,
    seedCostPerAcre: 15000,
    fertilizerCostPerAcre: 8000,
    nutrientPlanPerAcre: { N: 60, P: 40, K: 40 },
    idealTempC: { min: 15, max: 20 },
    stages: [
      { key: 'sowing', name: 'Planting', from: 0, to: 20, irrigationDays: 7, actions: ['Use certified disease-free tubers.'] },
      { key: 'vegetative', name: 'Vegetative & Earthing up', from: 21, to: 45, irrigationDays: 10, actions: ['Earth up to prevent tubers from turning green. Top-dress remaining N.'] },
      { key: 'tuber_initiation', name: 'Tuber initiation & Bulking', from: 46, to: 80, irrigationDays: 10, actions: ['Most sensitive to water stress. Keep soil uniformly moist. Watch for late blight.'] },
      { key: 'maturity', name: 'Maturity', from: 81, to: 100, irrigationDays: 15, actions: ['Cut haulms 10-15 days before harvest to harden tuber skin.'] },
    ],
    sources: ['ICAR Package of Practices — Potato'],
  },

  chickpea: {
    id: 'chickpea',
    name: { en: 'Chickpea (Gram)', hi: 'चना', mr: 'Chickpea (Gram)', pa: 'Chickpea (Gram)', gu: 'Chickpea (Gram)', ta: 'Chickpea (Gram)', te: 'Chickpea (Gram)', bn: 'Chickpea (Gram)', kn: 'Chickpea (Gram)', ml: 'Chickpea (Gram)', or: 'Chickpea (Gram)', as: 'Chickpea (Gram)' },
    season: 'rabi',
    durationDays: 110,
    yieldPerAcreQuintals: 8,
    mspPerQuintal: 5440,
    seedCostPerAcre: 2500,
    fertilizerCostPerAcre: 1500,
    nutrientPlanPerAcre: { N: 8, P: 20, K: 8 },
    idealTempC: { min: 15, max: 25 },
    stages: [
      { key: 'sowing', name: 'Sowing', from: 0, to: 20, irrigationDays: 30, actions: ['Treat seeds with Rhizobium culture.'] },
      { key: 'vegetative', name: 'Vegetative & Branching', from: 21, to: 50, irrigationDays: 30, actions: ['Nipping at 30-35 DAS encourages branching.'] },
      { key: 'flowering', name: 'Flowering & Pod formation', from: 51, to: 90, irrigationDays: 20, actions: ['Critical stage for irrigation. Watch out for pod borer.'] },
      { key: 'maturity', name: 'Maturity', from: 91, to: 110, irrigationDays: 0, actions: ['Harvest when leaves turn yellow and pods are dry.'] },
    ],
    sources: ['ICAR Package of Practices — Chickpea'],
  },

  bajra: {
    id: 'bajra',
    name: { en: 'Pearl Millet (Bajra)', hi: 'बाजरा', mr: 'Pearl Millet (Bajra)', pa: 'Pearl Millet (Bajra)', gu: 'Pearl Millet (Bajra)', ta: 'Pearl Millet (Bajra)', te: 'Pearl Millet (Bajra)', bn: 'Pearl Millet (Bajra)', kn: 'Pearl Millet (Bajra)', ml: 'Pearl Millet (Bajra)', or: 'Pearl Millet (Bajra)', as: 'Pearl Millet (Bajra)' },
    season: 'kharif',
    durationDays: 85,
    yieldPerAcreQuintals: 10,
    mspPerQuintal: 2500,
    seedCostPerAcre: 300,
    fertilizerCostPerAcre: 1500,
    nutrientPlanPerAcre: { N: 24, P: 12, K: 12 },
    idealTempC: { min: 25, max: 35 },
    stages: [
      { key: 'sowing', name: 'Sowing', from: 0, to: 15, irrigationDays: 15, actions: ['Ensure proper spacing for drought resistance.'] },
      { key: 'vegetative', name: 'Tillering', from: 16, to: 40, irrigationDays: 15, actions: ['Top-dress N after first weeding.'] },
      { key: 'flowering', name: 'Booting to Flowering', from: 41, to: 65, irrigationDays: 12, actions: ['Needs moisture during grain formation.'] },
      { key: 'maturity', name: 'Maturity', from: 66, to: 85, irrigationDays: 0, actions: ['Harvest when grains are hard.'] },
    ],
    sources: ['ICAR Package of Practices — Bajra'],
  },

  jowar: {
    id: 'jowar',
    name: { en: 'Sorghum (Jowar)', hi: 'ज्वार', mr: 'Sorghum (Jowar)', pa: 'Sorghum (Jowar)', gu: 'Sorghum (Jowar)', ta: 'Sorghum (Jowar)', te: 'Sorghum (Jowar)', bn: 'Sorghum (Jowar)', kn: 'Sorghum (Jowar)', ml: 'Sorghum (Jowar)', or: 'Sorghum (Jowar)', as: 'Sorghum (Jowar)' },
    season: 'kharif',
    durationDays: 115,
    yieldPerAcreQuintals: 12,
    mspPerQuintal: 3180,
    seedCostPerAcre: 500,
    fertilizerCostPerAcre: 1500,
    nutrientPlanPerAcre: { N: 32, P: 16, K: 16 },
    idealTempC: { min: 26, max: 34 },
    stages: [
      { key: 'sowing', name: 'Sowing', from: 0, to: 15, irrigationDays: 15, actions: ['Avoid deep sowing.'] },
      { key: 'vegetative', name: 'Grand Growth', from: 16, to: 55, irrigationDays: 15, actions: ['Scout for shoot fly in early stages.'] },
      { key: 'flowering', name: 'Flowering & Grain Filling', from: 56, to: 90, irrigationDays: 12, actions: ['Critical stage for moisture.'] },
      { key: 'maturity', name: 'Maturity', from: 91, to: 115, irrigationDays: 0, actions: ['Harvest when moisture content drops.'] },
    ],
    sources: ['ICAR Package of Practices — Jowar'],
  },

  tur: {
    id: 'tur',
    name: { en: 'Pigeon Pea (Tur/Arhar)', hi: 'अरहर', mr: 'Pigeon Pea (Tur/Arhar)', pa: 'Pigeon Pea (Tur/Arhar)', gu: 'Pigeon Pea (Tur/Arhar)', ta: 'Pigeon Pea (Tur/Arhar)', te: 'Pigeon Pea (Tur/Arhar)', bn: 'Pigeon Pea (Tur/Arhar)', kn: 'Pigeon Pea (Tur/Arhar)', ml: 'Pigeon Pea (Tur/Arhar)', or: 'Pigeon Pea (Tur/Arhar)', as: 'Pigeon Pea (Tur/Arhar)' },
    season: 'kharif',
    durationDays: 180,
    yieldPerAcreQuintals: 7,
    mspPerQuintal: 7000,
    seedCostPerAcre: 1000,
    fertilizerCostPerAcre: 1500,
    nutrientPlanPerAcre: { N: 10, P: 20, K: 10 },
    idealTempC: { min: 25, max: 35 },
    stages: [
      { key: 'sowing', name: 'Sowing & Germination', from: 0, to: 20, irrigationDays: 20, actions: ['Treat seeds with Rhizobium. Avoid waterlogging.'] },
      { key: 'vegetative', name: 'Branching', from: 21, to: 70, irrigationDays: 20, actions: ['Weed control is critical up to 60 days.'] },
      { key: 'flowering', name: 'Flowering & Pod formation', from: 71, to: 130, irrigationDays: 15, actions: ['Monitor closely for pod borer (Helicoverpa). Spray if necessary.'] },
      { key: 'maturity', name: 'Maturity', from: 131, to: 180, irrigationDays: 0, actions: ['Harvest when leaves shed and pods turn brown.'] },
    ],
    sources: ['ICAR Package of Practices — Pigeon Pea'],
  },

  moong: {
    id: 'moong',
    name: { en: 'Green Gram (Moong)', hi: 'मूंग', mr: 'Green Gram (Moong)', pa: 'Green Gram (Moong)', gu: 'Green Gram (Moong)', ta: 'Green Gram (Moong)', te: 'Green Gram (Moong)', bn: 'Green Gram (Moong)', kn: 'Green Gram (Moong)', ml: 'Green Gram (Moong)', or: 'Green Gram (Moong)', as: 'Green Gram (Moong)' },
    season: 'zaid', // Can be kharif/zaid
    durationDays: 65,
    yieldPerAcreQuintals: 5,
    mspPerQuintal: 8558,
    seedCostPerAcre: 1200,
    fertilizerCostPerAcre: 1200,
    nutrientPlanPerAcre: { N: 8, P: 16, K: 8 },
    idealTempC: { min: 27, max: 35 },
    stages: [
      { key: 'sowing', name: 'Sowing', from: 0, to: 10, irrigationDays: 15, actions: ['Sow in lines for better aeration.'] },
      { key: 'vegetative', name: 'Vegetative', from: 11, to: 30, irrigationDays: 15, actions: ['Keep field weed-free. First irrigation if dry.'] },
      { key: 'flowering', name: 'Flowering', from: 31, to: 45, irrigationDays: 10, actions: ['Ensure soil moisture is maintained for pod setting.'] },
      { key: 'maturity', name: 'Maturity', from: 46, to: 65, irrigationDays: 0, actions: ['Harvest promptly to prevent shattering.'] },
    ],
    sources: ['ICAR Package of Practices — Moong'],
  },

  urad: {
    id: 'urad',
    name: { en: 'Black Gram (Urad)', hi: 'उड़द', mr: 'Black Gram (Urad)', pa: 'Black Gram (Urad)', gu: 'Black Gram (Urad)', ta: 'Black Gram (Urad)', te: 'Black Gram (Urad)', bn: 'Black Gram (Urad)', kn: 'Black Gram (Urad)', ml: 'Black Gram (Urad)', or: 'Black Gram (Urad)', as: 'Black Gram (Urad)' },
    season: 'kharif',
    durationDays: 75,
    yieldPerAcreQuintals: 4,
    mspPerQuintal: 6950,
    seedCostPerAcre: 1200,
    fertilizerCostPerAcre: 1200,
    nutrientPlanPerAcre: { N: 8, P: 16, K: 8 },
    idealTempC: { min: 25, max: 35 },
    stages: [
      { key: 'sowing', name: 'Sowing', from: 0, to: 15, irrigationDays: 15, actions: ['Ensure proper drainage, very sensitive to waterlogging.'] },
      { key: 'vegetative', name: 'Vegetative', from: 16, to: 40, irrigationDays: 15, actions: ['Scout for Yellow Mosaic Virus vectors (whitefly).'] },
      { key: 'flowering', name: 'Flowering & Podding', from: 41, to: 60, irrigationDays: 12, actions: ['Critical moisture requirement.'] },
      { key: 'maturity', name: 'Maturity', from: 61, to: 75, irrigationDays: 0, actions: ['Harvest when pods turn black.'] },
    ],
    sources: ['ICAR Package of Practices — Urad'],
  },

  tea: {
    id: 'tea',
    name: { en: 'Tea', hi: 'चाय', mr: 'Tea', pa: 'Tea', gu: 'Tea', ta: 'Tea', te: 'Tea', bn: 'Tea', kn: 'Tea', ml: 'Tea', or: 'Tea', as: 'Tea' },
    season: 'annual',
    durationDays: 365,
    yieldPerAcreQuintals: 10,
    mspPerQuintal: 20000,
    seedCostPerAcre: 5000,
    fertilizerCostPerAcre: 5000, // Made tea
    nutrientPlanPerAcre: { N: 60, P: 20, K: 40 },
    idealTempC: { min: 13, max: 30 },
    stages: [
      { key: 'pruning', name: 'Pruning / Skiffing', from: 0, to: 60, irrigationDays: 15, actions: ['Light skiffing to maintain plucking table. Apply basal NPK.'] },
      { key: 'flushing1', name: 'First Flush', from: 61, to: 120, irrigationDays: 7, actions: ['Critical period for high-quality shoots. Ensure overhead shade is optimal.'] },
      { key: 'monsoon', name: 'Monsoon Flush', from: 121, to: 240, irrigationDays: 0, actions: ['Ensure perfect drainage. Monitor for Blister Blight in high humidity.'] },
      { key: 'autumn', name: 'Autumn Flush', from: 241, to: 365, irrigationDays: 10, actions: ['Prepare bushes for winter dormancy. Pluck fine.'] },
    ],
    sources: ['Tea Board of India Guidelines'],
  },

  coffee: {
    id: 'coffee',
    name: { en: 'Coffee (Robusta/Arabica)', hi: 'कॉफ़ी', mr: 'Coffee (Robusta/Arabica)', pa: 'Coffee (Robusta/Arabica)', gu: 'Coffee (Robusta/Arabica)', ta: 'Coffee (Robusta/Arabica)', te: 'Coffee (Robusta/Arabica)', bn: 'Coffee (Robusta/Arabica)', kn: 'Coffee (Robusta/Arabica)', ml: 'Coffee (Robusta/Arabica)', or: 'Coffee (Robusta/Arabica)', as: 'Coffee (Robusta/Arabica)' },
    season: 'annual',
    durationDays: 365,
    yieldPerAcreQuintals: 12,
    mspPerQuintal: 15000,
    seedCostPerAcre: 6000,
    fertilizerCostPerAcre: 6000, // Clean coffee
    nutrientPlanPerAcre: { N: 60, P: 30, K: 60 },
    idealTempC: { min: 15, max: 28 },
    stages: [
      { key: 'blossom', name: 'Blossom Showers', from: 0, to: 30, irrigationDays: 5, actions: ['Crucial time for blossom showers (irrigation if rain fails) to induce uniform flowering.'] },
      { key: 'berry_set', name: 'Berry Setting', from: 31, to: 90, irrigationDays: 10, actions: ['Provide backing showers 20 days after blossom. Apply first split of fertilizers.'] },
      { key: 'development', name: 'Berry Development', from: 91, to: 270, irrigationDays: 15, actions: ['Maintain shade canopy. Watch out for Coffee Berry Borer and White Stem Borer.'] },
      { key: 'harvest', name: 'Ripening & Harvest', from: 271, to: 365, irrigationDays: 0, actions: ['Harvest only fully ripe red cherries for best cup quality.'] },
    ],
    sources: ['Coffee Board of India Guidelines'],
  },

  mango: {
    id: 'mango', name: { en: 'Mango', hi: 'आम', mr: 'Mango', pa: 'Mango', gu: 'Mango', ta: 'Mango', te: 'Mango', bn: 'Mango', kn: 'Mango', ml: 'Mango', or: 'Mango', as: 'Mango' }, season: 'annual', durationDays: 365, yieldPerAcreQuintals: 40, mspPerQuintal: 4000, seedCostPerAcre: 5000, fertilizerCostPerAcre: 3000, nutrientPlanPerAcre: { N: 100, P: 50, K: 100 }, idealTempC: { min: 24, max: 30 },
    stages: [{ key: 'vegetative', name: 'Vegetative', from: 0, to: 180, irrigationDays: 15, actions: ['Prune after harvest.', 'Apply fertilizers.'] }, { key: 'flowering', name: 'Flowering & Fruit Set', from: 181, to: 240, irrigationDays: 10, actions: ['Protect from powdery mildew and hoppers.'] }, { key: 'development', name: 'Fruit Development', from: 241, to: 320, irrigationDays: 10, actions: ['Irrigate regularly to prevent fruit drop.'] }, { key: 'harvest', name: 'Harvest', from: 321, to: 365, irrigationDays: 0, actions: ['Stop irrigation 2 weeks prior to harvest.'] }],
    sources: ['ICAR']
  },
  banana: {
    id: 'banana', name: { en: 'Banana', hi: 'केला', mr: 'Banana', pa: 'Banana', gu: 'Banana', ta: 'Banana', te: 'Banana', bn: 'Banana', kn: 'Banana', ml: 'Banana', or: 'Banana', as: 'Banana' }, season: 'annual', durationDays: 365, yieldPerAcreQuintals: 150, mspPerQuintal: 1500, seedCostPerAcre: 10000, fertilizerCostPerAcre: 15000, nutrientPlanPerAcre: { N: 200, P: 50, K: 300 }, idealTempC: { min: 20, max: 30 },
    stages: [{ key: 'vegetative', name: 'Vegetative', from: 0, to: 150, irrigationDays: 5, actions: ['Heavy water requirement.', 'Desuckering.'] }, { key: 'shooting', name: 'Shooting', from: 151, to: 240, irrigationDays: 5, actions: ['Provide propping support.'] }, { key: 'development', name: 'Bunch Development', from: 241, to: 330, irrigationDays: 7, actions: ['Cover bunches.', 'Apply K for fruit size.'] }, { key: 'harvest', name: 'Harvest', from: 331, to: 365, irrigationDays: 10, actions: ['Harvest when ridges change from angular to round.'] }],
    sources: ['ICAR']
  },
  tomato: {
    id: 'tomato', name: { en: 'Tomato', hi: 'टमाटर', mr: 'Tomato', pa: 'Tomato', gu: 'Tomato', ta: 'Tomato', te: 'Tomato', bn: 'Tomato', kn: 'Tomato', ml: 'Tomato', or: 'Tomato', as: 'Tomato' }, season: 'rabi', durationDays: 150, yieldPerAcreQuintals: 120, mspPerQuintal: 1000, seedCostPerAcre: 3000, fertilizerCostPerAcre: 8000, nutrientPlanPerAcre: { N: 60, P: 40, K: 40 }, idealTempC: { min: 18, max: 27 },
    stages: [{ key: 'nursery', name: 'Nursery', from: 0, to: 25, irrigationDays: 3, actions: ['Protect seedlings from damping off.'] }, { key: 'vegetative', name: 'Vegetative', from: 26, to: 60, irrigationDays: 5, actions: ['Staking and earthing up.'] }, { key: 'flowering', name: 'Flowering & Fruiting', from: 61, to: 110, irrigationDays: 5, actions: ['Critical water requirement.', 'Watch for fruit borer.'] }, { key: 'harvest', name: 'Harvesting', from: 111, to: 150, irrigationDays: 7, actions: ['Harvest at breaker stage for transport.'] }],
    sources: ['ICAR']
  },
  onion: {
    id: 'onion', name: { en: 'Onion', hi: 'प्याज', mr: 'Onion', pa: 'Onion', gu: 'Onion', ta: 'Onion', te: 'Onion', bn: 'Onion', kn: 'Onion', ml: 'Onion', or: 'Onion', as: 'Onion' }, season: 'rabi', durationDays: 140, yieldPerAcreQuintals: 100, mspPerQuintal: 1500, seedCostPerAcre: 4000, fertilizerCostPerAcre: 6000, nutrientPlanPerAcre: { N: 40, P: 20, K: 40 }, idealTempC: { min: 13, max: 24 },
    stages: [{ key: 'nursery', name: 'Nursery', from: 0, to: 45, irrigationDays: 4, actions: ['Sow seeds on raised beds.'] }, { key: 'vegetative', name: 'Vegetative', from: 46, to: 80, irrigationDays: 7, actions: ['Keep weed free.', 'Watch for thrips.'] }, { key: 'bulbing', name: 'Bulb Development', from: 81, to: 120, irrigationDays: 7, actions: ['Critical stage for moisture.'] }, { key: 'harvest', name: 'Maturity & Harvest', from: 121, to: 140, irrigationDays: 0, actions: ['Stop irrigation 15 days before harvest.', 'Curing required.'] }],
    sources: ['ICAR']
  },
  apple: {
    id: 'apple', name: { en: 'Apple', hi: 'सेब', mr: 'Apple', pa: 'Apple', gu: 'Apple', ta: 'Apple', te: 'Apple', bn: 'Apple', kn: 'Apple', ml: 'Apple', or: 'Apple', as: 'Apple' }, season: 'annual', durationDays: 365, yieldPerAcreQuintals: 60, mspPerQuintal: 5000, seedCostPerAcre: 15000, fertilizerCostPerAcre: 10000, nutrientPlanPerAcre: { N: 70, P: 35, K: 70 }, idealTempC: { min: 4, max: 21 },
    stages: [{ key: 'dormancy', name: 'Dormancy & Pruning', from: 0, to: 90, irrigationDays: 0, actions: ['Winter pruning.', 'Apply dormant sprays.'] }, { key: 'flowering', name: 'Flowering', from: 91, to: 150, irrigationDays: 10, actions: ['Ensure cross-pollination.', 'Watch for scab.'] }, { key: 'development', name: 'Fruit Development', from: 151, to: 270, irrigationDays: 10, actions: ['Thinning of fruits.', 'Irrigate if dry.'] }, { key: 'harvest', name: 'Harvest', from: 271, to: 365, irrigationDays: 0, actions: ['Harvest at proper color and firmness.'] }],
    sources: ['ICAR']
  },
  grapes: {
    id: 'grapes', name: { en: 'Grapes', hi: 'अंगूर', mr: 'Grapes', pa: 'Grapes', gu: 'Grapes', ta: 'Grapes', te: 'Grapes', bn: 'Grapes', kn: 'Grapes', ml: 'Grapes', or: 'Grapes', as: 'Grapes' }, season: 'annual', durationDays: 365, yieldPerAcreQuintals: 80, mspPerQuintal: 4000, seedCostPerAcre: 20000, fertilizerCostPerAcre: 15000, nutrientPlanPerAcre: { N: 80, P: 40, K: 80 }, idealTempC: { min: 15, max: 35 },
    stages: [{ key: 'pruning', name: 'Foundation Pruning', from: 0, to: 120, irrigationDays: 15, actions: ['April pruning for vegetative growth.'] }, { key: 'fruit_pruning', name: 'Forward Pruning', from: 121, to: 180, irrigationDays: 10, actions: ['October pruning for fruiting.'] }, { key: 'development', name: 'Berry Development', from: 181, to: 300, irrigationDays: 7, actions: ['Apply GA3.', 'Control downy mildew.'] }, { key: 'harvest', name: 'Harvest', from: 301, to: 365, irrigationDays: 15, actions: ['Harvest when TSS is optimal.'] }],
    sources: ['ICAR']
  },
  cabbage: {
    id: 'cabbage', name: { en: 'Cabbage', hi: 'पत्ता गोभी', mr: 'Cabbage', pa: 'Cabbage', gu: 'Cabbage', ta: 'Cabbage', te: 'Cabbage', bn: 'Cabbage', kn: 'Cabbage', ml: 'Cabbage', or: 'Cabbage', as: 'Cabbage' }, season: 'rabi', durationDays: 100, yieldPerAcreQuintals: 150, mspPerQuintal: 800, seedCostPerAcre: 2000, fertilizerCostPerAcre: 5000, nutrientPlanPerAcre: { N: 60, P: 30, K: 30 }, idealTempC: { min: 15, max: 20 },
    stages: [{ key: 'nursery', name: 'Nursery', from: 0, to: 25, irrigationDays: 4, actions: ['Protect from damping off.'] }, { key: 'vegetative', name: 'Vegetative', from: 26, to: 60, irrigationDays: 7, actions: ['Earthing up.', 'Watch for Diamondback moth.'] }, { key: 'head', name: 'Head Formation', from: 61, to: 85, irrigationDays: 5, actions: ['Critical water requirement.'] }, { key: 'harvest', name: 'Harvest', from: 86, to: 100, irrigationDays: 10, actions: ['Harvest when heads are firm.'] }],
    sources: ['ICAR']
  },
  brinjal: {
    id: 'brinjal', name: { en: 'Brinjal (Eggplant)', hi: 'बैंगन', mr: 'Brinjal (Eggplant)', pa: 'Brinjal (Eggplant)', gu: 'Brinjal (Eggplant)', ta: 'Brinjal (Eggplant)', te: 'Brinjal (Eggplant)', bn: 'Brinjal (Eggplant)', kn: 'Brinjal (Eggplant)', ml: 'Brinjal (Eggplant)', or: 'Brinjal (Eggplant)', as: 'Brinjal (Eggplant)' }, season: 'kharif', durationDays: 150, yieldPerAcreQuintals: 100, mspPerQuintal: 1200, seedCostPerAcre: 1500, fertilizerCostPerAcre: 4000, nutrientPlanPerAcre: { N: 40, P: 20, K: 20 }, idealTempC: { min: 21, max: 27 },
    stages: [{ key: 'nursery', name: 'Nursery', from: 0, to: 30, irrigationDays: 4, actions: ['Sow in raised beds.'] }, { key: 'vegetative', name: 'Vegetative', from: 31, to: 70, irrigationDays: 7, actions: ['Top-dress N.', 'Watch for shoot borer.'] }, { key: 'flowering', name: 'Flowering & Fruiting', from: 71, to: 120, irrigationDays: 6, actions: ['Critical stage for fruit borer control.'] }, { key: 'harvest', name: 'Harvest', from: 121, to: 150, irrigationDays: 7, actions: ['Harvest tender glossy fruits.'] }],
    sources: ['ICAR']
  },
  chilli: {
    id: 'chilli', name: { en: 'Chilli', hi: 'मिर्च', mr: 'Chilli', pa: 'Chilli', gu: 'Chilli', ta: 'Chilli', te: 'Chilli', bn: 'Chilli', kn: 'Chilli', ml: 'Chilli', or: 'Chilli', as: 'Chilli' }, season: 'kharif', durationDays: 150, yieldPerAcreQuintals: 40, mspPerQuintal: 6000, seedCostPerAcre: 3000, fertilizerCostPerAcre: 5000, nutrientPlanPerAcre: { N: 60, P: 30, K: 30 }, idealTempC: { min: 20, max: 30 },
    stages: [{ key: 'nursery', name: 'Nursery', from: 0, to: 35, irrigationDays: 4, actions: ['Prevent damping off.'] }, { key: 'vegetative', name: 'Vegetative', from: 36, to: 70, irrigationDays: 8, actions: ['Monitor for thrips and mites (leaf curl).'] }, { key: 'flowering', name: 'Flowering & Fruiting', from: 71, to: 110, irrigationDays: 6, actions: ['Avoid water stress.', 'Apply K for fruit quality.'] }, { key: 'harvest', name: 'Harvest', from: 111, to: 150, irrigationDays: 10, actions: ['Harvest green or red depending on market.'] }],
    sources: ['ICAR']
  },
  turmeric: {
    id: 'turmeric', name: { en: 'Turmeric', hi: 'हल्दी', mr: 'Turmeric', pa: 'Turmeric', gu: 'Turmeric', ta: 'Turmeric', te: 'Turmeric', bn: 'Turmeric', kn: 'Turmeric', ml: 'Turmeric', or: 'Turmeric', as: 'Turmeric' }, season: 'kharif', durationDays: 240, yieldPerAcreQuintals: 100, mspPerQuintal: 7000, seedCostPerAcre: 15000, fertilizerCostPerAcre: 8000, nutrientPlanPerAcre: { N: 60, P: 30, K: 60 }, idealTempC: { min: 20, max: 30 },
    stages: [{ key: 'planting', name: 'Planting & Sprouting', from: 0, to: 45, irrigationDays: 7, actions: ['Plant healthy rhizomes.', 'Mulch immediately.'] }, { key: 'vegetative', name: 'Vegetative', from: 46, to: 120, irrigationDays: 10, actions: ['Earthing up is essential.', 'Weed control.'] }, { key: 'rhizome', name: 'Rhizome Development', from: 121, to: 200, irrigationDays: 10, actions: ['Critical water requirement.', 'Watch for rhizome rot.'] }, { key: 'harvest', name: 'Maturity & Harvest', from: 201, to: 240, irrigationDays: 0, actions: ['Harvest when leaves turn yellow and dry.'] }],
    sources: ['ICAR']
  },
  black_pepper: {
    id: 'black_pepper', name: { en: 'Black Pepper', hi: 'काली मिर्च', mr: 'Black Pepper', pa: 'Black Pepper', gu: 'Black Pepper', ta: 'Black Pepper', te: 'Black Pepper', bn: 'Black Pepper', kn: 'Black Pepper', ml: 'Black Pepper', or: 'Black Pepper', as: 'Black Pepper' }, season: 'annual', durationDays: 365, yieldPerAcreQuintals: 8, mspPerQuintal: 40000, seedCostPerAcre: 8000, fertilizerCostPerAcre: 5000, nutrientPlanPerAcre: { N: 40, P: 20, K: 50 }, idealTempC: { min: 20, max: 30 },
    stages: [{ key: 'vegetative', name: 'Vegetative', from: 0, to: 150, irrigationDays: 10, actions: ['Train vines on standards.', 'Apply organics.'] }, { key: 'flowering', name: 'Flowering (Monsoon)', from: 151, to: 210, irrigationDays: 0, actions: ['Watch for quick wilt disease (Phytophthora).'] }, { key: 'berry', name: 'Berry Development', from: 211, to: 300, irrigationDays: 15, actions: ['Ensure adequate moisture post monsoon.'] }, { key: 'harvest', name: 'Harvest', from: 301, to: 365, irrigationDays: 0, actions: ['Harvest when 1-2 berries turn red.'] }],
    sources: ['ICAR']
  },
  cardamom: {
    id: 'cardamom', name: { en: 'Cardamom', hi: 'इलायची', mr: 'Cardamom', pa: 'Cardamom', gu: 'Cardamom', ta: 'Cardamom', te: 'Cardamom', bn: 'Cardamom', kn: 'Cardamom', ml: 'Cardamom', or: 'Cardamom', as: 'Cardamom' }, season: 'annual', durationDays: 365, yieldPerAcreQuintals: 1, mspPerQuintal: 150000, seedCostPerAcre: 20000, fertilizerCostPerAcre: 10000, nutrientPlanPerAcre: { N: 30, P: 30, K: 60 }, idealTempC: { min: 10, max: 35 },
    stages: [{ key: 'vegetative', name: 'Vegetative', from: 0, to: 120, irrigationDays: 5, actions: ['Maintain shade.', 'Ensure high humidity.'] }, { key: 'flowering', name: 'Flowering & Panicle', from: 121, to: 200, irrigationDays: 7, actions: ['Provide summer irrigation.'] }, { key: 'capsule', name: 'Capsule Development', from: 201, to: 300, irrigationDays: 7, actions: ['Watch for thrips.'] }, { key: 'harvest', name: 'Harvest', from: 301, to: 365, irrigationDays: 10, actions: ['Harvest ripe capsules every 3-4 weeks.'] }],
    sources: ['ICAR']
  },
  coriander: {
    id: 'coriander', name: { en: 'Coriander', hi: 'धनिया', mr: 'Coriander', pa: 'Coriander', gu: 'Coriander', ta: 'Coriander', te: 'Coriander', bn: 'Coriander', kn: 'Coriander', ml: 'Coriander', or: 'Coriander', as: 'Coriander' }, season: 'rabi', durationDays: 120, yieldPerAcreQuintals: 6, mspPerQuintal: 8000, seedCostPerAcre: 1000, fertilizerCostPerAcre: 2500, nutrientPlanPerAcre: { N: 25, P: 15, K: 15 }, idealTempC: { min: 15, max: 25 },
    stages: [{ key: 'sowing', name: 'Sowing', from: 0, to: 20, irrigationDays: 7, actions: ['Split seeds before sowing.'] }, { key: 'vegetative', name: 'Vegetative', from: 21, to: 60, irrigationDays: 10, actions: ['Weed control.', 'Watch for aphids.'] }, { key: 'flowering', name: 'Flowering & Seed Setting', from: 61, to: 95, irrigationDays: 10, actions: ['Avoid stress.', 'Watch for powdery mildew.'] }, { key: 'harvest', name: 'Harvest', from: 96, to: 120, irrigationDays: 0, actions: ['Harvest when grains turn yellowish brown.'] }],
    sources: ['ICAR']
  },
  jute: {
    id: 'jute', name: { en: 'Jute', hi: 'जूट', mr: 'Jute', pa: 'Jute', gu: 'Jute', ta: 'Jute', te: 'Jute', bn: 'Jute', kn: 'Jute', ml: 'Jute', or: 'Jute', as: 'Jute' }, season: 'kharif', durationDays: 120, yieldPerAcreQuintals: 12, mspPerQuintal: 5050, seedCostPerAcre: 500, fertilizerCostPerAcre: 2000, nutrientPlanPerAcre: { N: 30, P: 15, K: 15 }, idealTempC: { min: 24, max: 37 },
    stages: [{ key: 'sowing', name: 'Sowing', from: 0, to: 25, irrigationDays: 15, actions: ['Requires fine seedbed.', 'High humidity needed.'] }, { key: 'vegetative', name: 'Vegetative Growth', from: 26, to: 90, irrigationDays: 15, actions: ['Thinning is critical.', 'Watch for stem weevil.'] }, { key: 'flowering', name: 'Early Flowering', from: 91, to: 105, irrigationDays: 20, actions: ['Harvest at early flowering for best fibre.'] }, { key: 'retting', name: 'Harvest & Retting', from: 106, to: 120, irrigationDays: 0, actions: ['Retting in clean slow moving water for 15-20 days.'] }],
    sources: ['ICAR']
  },
  rubber: {
    id: 'rubber', name: { en: 'Rubber', hi: 'रबड़', mr: 'Rubber', pa: 'Rubber', gu: 'Rubber', ta: 'Rubber', te: 'Rubber', bn: 'Rubber', kn: 'Rubber', ml: 'Rubber', or: 'Rubber', as: 'Rubber' }, season: 'annual', durationDays: 365, yieldPerAcreQuintals: 6, mspPerQuintal: 16000, seedCostPerAcre: 15000, fertilizerCostPerAcre: 6000, nutrientPlanPerAcre: { N: 40, P: 20, K: 20 }, idealTempC: { min: 20, max: 34 },
    stages: [{ key: 'vegetative', name: 'Growth', from: 0, to: 180, irrigationDays: 0, actions: ['Mainly rainfed.', 'Control weeds.'] }, { key: 'disease', name: 'Monsoon Disease Mgmt', from: 181, to: 270, irrigationDays: 0, actions: ['Prophylactic spray for abnormal leaf fall.'] }, { key: 'tapping', name: 'Tapping', from: 271, to: 330, irrigationDays: 0, actions: ['Tap on 1/2 spiral every alternate day.'] }, { key: 'wintering', name: 'Wintering (Rest)', from: 331, to: 365, irrigationDays: 0, actions: ['Stop tapping when leaves fall.'] }],
    sources: ['Rubber Board']
  },
  tobacco: {
    id: 'tobacco', name: { en: 'Tobacco', hi: 'तंबाकू', mr: 'Tobacco', pa: 'Tobacco', gu: 'Tobacco', ta: 'Tobacco', te: 'Tobacco', bn: 'Tobacco', kn: 'Tobacco', ml: 'Tobacco', or: 'Tobacco', as: 'Tobacco' }, season: 'rabi', durationDays: 150, yieldPerAcreQuintals: 8, mspPerQuintal: 10000, seedCostPerAcre: 1500, fertilizerCostPerAcre: 4000, nutrientPlanPerAcre: { N: 45, P: 30, K: 45 }, idealTempC: { min: 20, max: 30 },
    stages: [{ key: 'nursery', name: 'Nursery', from: 0, to: 45, irrigationDays: 3, actions: ['Protect from damping off.'] }, { key: 'vegetative', name: 'Vegetative', from: 46, to: 100, irrigationDays: 10, actions: ['Topping (removal of flower buds) is essential.'] }, { key: 'desuckering', name: 'Desuckering', from: 101, to: 130, irrigationDays: 12, actions: ['Remove side shoots (suckers).'] }, { key: 'harvest', name: 'Harvest (Priming)', from: 131, to: 150, irrigationDays: 0, actions: ['Harvest mature leaves systematically.'] }],
    sources: ['Tobacco Board']
  },
  coconut: {
    id: 'coconut', name: { en: 'Coconut', hi: 'नारियल', mr: 'Coconut', pa: 'Coconut', gu: 'Coconut', ta: 'Coconut', te: 'Coconut', bn: 'Coconut', kn: 'Coconut', ml: 'Coconut', or: 'Coconut', as: 'Coconut' }, season: 'annual', durationDays: 365, yieldPerAcreQuintals: 40, mspPerQuintal: 3000, seedCostPerAcre: 10000, fertilizerCostPerAcre: 5000, nutrientPlanPerAcre: { N: 20, P: 15, K: 40 }, idealTempC: { min: 27, max: 32 },
    stages: [{ key: 'growth', name: 'Vegetative', from: 0, to: 150, irrigationDays: 7, actions: ['Summer irrigation prevents button shedding.'] }, { key: 'flowering', name: 'Inflorescence', from: 151, to: 240, irrigationDays: 7, actions: ['Apply organics.', 'Watch for Rhinoceros beetle.'] }, { key: 'nut', name: 'Nut Development', from: 241, to: 330, irrigationDays: 10, actions: ['Watch for Red palm weevil.'] }, { key: 'harvest', name: 'Harvest', from: 331, to: 365, irrigationDays: 0, actions: ['Harvest mature nuts (11-12 months old).'] }],
    sources: ['Coconut Development Board']
  },
  ragi: {
    id: 'ragi', name: { en: 'Finger Millet (Ragi)', hi: 'रागी', mr: 'Finger Millet (Ragi)', pa: 'Finger Millet (Ragi)', gu: 'Finger Millet (Ragi)', ta: 'Finger Millet (Ragi)', te: 'Finger Millet (Ragi)', bn: 'Finger Millet (Ragi)', kn: 'Finger Millet (Ragi)', ml: 'Finger Millet (Ragi)', or: 'Finger Millet (Ragi)', as: 'Finger Millet (Ragi)' }, season: 'kharif', durationDays: 120, yieldPerAcreQuintals: 10, mspPerQuintal: 3846, seedCostPerAcre: 400, fertilizerCostPerAcre: 2000, nutrientPlanPerAcre: { N: 25, P: 15, K: 15 }, idealTempC: { min: 20, max: 30 },
    stages: [{ key: 'sowing', name: 'Sowing/Transplanting', from: 0, to: 25, irrigationDays: 10, actions: ['Transplanting gives better yield than broadcasting.'] }, { key: 'vegetative', name: 'Tillering', from: 26, to: 60, irrigationDays: 15, actions: ['Top dress N.', 'Weed control.'] }, { key: 'flowering', name: 'Flowering', from: 61, to: 95, irrigationDays: 15, actions: ['Critical moisture requirement.'] }, { key: 'harvest', name: 'Maturity & Harvest', from: 96, to: 120, irrigationDays: 0, actions: ['Harvest earheads when brown.'] }],
    sources: ['ICAR']
  },
  barley: {
    id: 'barley', name: { en: 'Barley', hi: 'जौ', mr: 'Barley', pa: 'Barley', gu: 'Barley', ta: 'Barley', te: 'Barley', bn: 'Barley', kn: 'Barley', ml: 'Barley', or: 'Barley', as: 'Barley' }, season: 'rabi', durationDays: 130, yieldPerAcreQuintals: 14, mspPerQuintal: 1850, seedCostPerAcre: 1000, fertilizerCostPerAcre: 2000, nutrientPlanPerAcre: { N: 30, P: 15, K: 15 }, idealTempC: { min: 12, max: 25 },
    stages: [{ key: 'sowing', name: 'Sowing', from: 0, to: 25, irrigationDays: 20, actions: ['Treat seeds for loose smut.'] }, { key: 'tillering', name: 'Tillering', from: 26, to: 60, irrigationDays: 25, actions: ['First irrigation at active tillering.'] }, { key: 'booting', name: 'Booting to Flowering', from: 61, to: 100, irrigationDays: 20, actions: ['Irrigate if soil is dry.'] }, { key: 'harvest', name: 'Harvest', from: 101, to: 130, irrigationDays: 0, actions: ['Harvest when grain is hard and straw is dry.'] }],
    sources: ['ICAR']
  },
  lentil: {
    id: 'lentil', name: { en: 'Lentil (Masoor)', hi: 'मसूर', mr: 'Lentil (Masoor)', pa: 'Lentil (Masoor)', gu: 'Lentil (Masoor)', ta: 'Lentil (Masoor)', te: 'Lentil (Masoor)', bn: 'Lentil (Masoor)', kn: 'Lentil (Masoor)', ml: 'Lentil (Masoor)', or: 'Lentil (Masoor)', as: 'Lentil (Masoor)' }, season: 'rabi', durationDays: 110, yieldPerAcreQuintals: 6, mspPerQuintal: 6425, seedCostPerAcre: 1500, fertilizerCostPerAcre: 1500, nutrientPlanPerAcre: { N: 8, P: 20, K: 10 }, idealTempC: { min: 15, max: 25 },
    stages: [{ key: 'sowing', name: 'Sowing', from: 0, to: 20, irrigationDays: 30, actions: ['Treat with Rhizobium.'] }, { key: 'vegetative', name: 'Vegetative', from: 21, to: 55, irrigationDays: 30, actions: ['Avoid excessive irrigation.'] }, { key: 'flowering', name: 'Flowering & Podding', from: 56, to: 90, irrigationDays: 20, actions: ['Watch for aphids and wilt.'] }, { key: 'harvest', name: 'Harvest', from: 91, to: 110, irrigationDays: 0, actions: ['Harvest when pods turn brown.'] }],
    sources: ['ICAR']
  },
  peas: {
    id: 'peas', name: { en: 'Field Peas', hi: 'मटर', mr: 'Field Peas', pa: 'Field Peas', gu: 'Field Peas', ta: 'Field Peas', te: 'Field Peas', bn: 'Field Peas', kn: 'Field Peas', ml: 'Field Peas', or: 'Field Peas', as: 'Field Peas' }, season: 'rabi', durationDays: 120, yieldPerAcreQuintals: 8, mspPerQuintal: 5500, seedCostPerAcre: 3000, fertilizerCostPerAcre: 2000, nutrientPlanPerAcre: { N: 10, P: 25, K: 10 }, idealTempC: { min: 10, max: 20 },
    stages: [{ key: 'sowing', name: 'Sowing', from: 0, to: 20, irrigationDays: 20, actions: ['Seed treatment with Rhizobium.'] }, { key: 'vegetative', name: 'Vegetative', from: 21, to: 60, irrigationDays: 20, actions: ['Watch for powdery mildew.'] }, { key: 'flowering', name: 'Flowering & Podding', from: 61, to: 95, irrigationDays: 15, actions: ['Critical stage for moisture.'] }, { key: 'harvest', name: 'Harvest', from: 96, to: 120, irrigationDays: 0, actions: ['Harvest when pods are fully developed.'] }],
    sources: ['ICAR']
  },
  sunflower: {
    id: 'sunflower', name: { en: 'Sunflower', hi: 'सूरजमुखी', mr: 'Sunflower', pa: 'Sunflower', gu: 'Sunflower', ta: 'Sunflower', te: 'Sunflower', bn: 'Sunflower', kn: 'Sunflower', ml: 'Sunflower', or: 'Sunflower', as: 'Sunflower' }, season: 'rabi', durationDays: 100, yieldPerAcreQuintals: 6, mspPerQuintal: 6760, seedCostPerAcre: 1500, fertilizerCostPerAcre: 3000, nutrientPlanPerAcre: { N: 30, P: 20, K: 15 }, idealTempC: { min: 20, max: 25 },
    stages: [{ key: 'sowing', name: 'Sowing', from: 0, to: 20, irrigationDays: 15, actions: ['Ensure proper spacing.'] }, { key: 'vegetative', name: 'Vegetative', from: 21, to: 45, irrigationDays: 15, actions: ['Earthing up prevents lodging.'] }, { key: 'flowering', name: 'Flowering & Capitulum', from: 46, to: 75, irrigationDays: 10, actions: ['Provide irrigation. Do not spray insecticides during bloom (protects bees).'] }, { key: 'harvest', name: 'Maturity', from: 76, to: 100, irrigationDays: 0, actions: ['Harvest when back of head turns lemon yellow.'] }],
    sources: ['ICAR']
  },
  sesame: {
    id: 'sesame', name: { en: 'Sesame (Til)', hi: 'तिल', mr: 'Sesame (Til)', pa: 'Sesame (Til)', gu: 'Sesame (Til)', ta: 'Sesame (Til)', te: 'Sesame (Til)', bn: 'Sesame (Til)', kn: 'Sesame (Til)', ml: 'Sesame (Til)', or: 'Sesame (Til)', as: 'Sesame (Til)' }, season: 'kharif', durationDays: 85, yieldPerAcreQuintals: 3, mspPerQuintal: 8635, seedCostPerAcre: 500, fertilizerCostPerAcre: 1500, nutrientPlanPerAcre: { N: 15, P: 10, K: 10 }, idealTempC: { min: 25, max: 35 },
    stages: [{ key: 'sowing', name: 'Sowing', from: 0, to: 15, irrigationDays: 15, actions: ['Mix seed with sand for uniform broadcasting.'] }, { key: 'vegetative', name: 'Vegetative', from: 16, to: 40, irrigationDays: 15, actions: ['Thinning is critical. Highly sensitive to waterlogging.'] }, { key: 'flowering', name: 'Flowering', from: 41, to: 65, irrigationDays: 10, actions: ['Watch for leaf webber.'] }, { key: 'harvest', name: 'Harvest', from: 66, to: 85, irrigationDays: 0, actions: ['Harvest when bottom leaves shed and capsules turn yellow.'] }],
    sources: ['ICAR']
  },
  castor: {
    id: 'castor', name: { en: 'Castor', hi: 'अरंडी', mr: 'Castor', pa: 'Castor', gu: 'Castor', ta: 'Castor', te: 'Castor', bn: 'Castor', kn: 'Castor', ml: 'Castor', or: 'Castor', as: 'Castor' }, season: 'kharif', durationDays: 150, yieldPerAcreQuintals: 8, mspPerQuintal: 5000, seedCostPerAcre: 1000, fertilizerCostPerAcre: 2000, nutrientPlanPerAcre: { N: 30, P: 15, K: 10 }, idealTempC: { min: 20, max: 30 },
    stages: [{ key: 'sowing', name: 'Sowing', from: 0, to: 25, irrigationDays: 15, actions: ['Deep tap root, tolerates drought.'] }, { key: 'vegetative', name: 'Vegetative', from: 26, to: 75, irrigationDays: 20, actions: ['Top-dress N.', 'Watch for castor semilooper.'] }, { key: 'flowering', name: 'Spike Formation', from: 76, to: 120, irrigationDays: 15, actions: ['Irrigate if prolonged dry spell.'] }, { key: 'harvest', name: 'Harvest', from: 121, to: 150, irrigationDays: 0, actions: ['Harvest spikes when capsules turn brown.'] }],
    sources: ['ICAR']
  },
  linseed: {
    id: 'linseed', name: { en: 'Linseed (Alsi)', hi: 'अलसी', mr: 'Linseed (Alsi)', pa: 'Linseed (Alsi)', gu: 'Linseed (Alsi)', ta: 'Linseed (Alsi)', te: 'Linseed (Alsi)', bn: 'Linseed (Alsi)', kn: 'Linseed (Alsi)', ml: 'Linseed (Alsi)', or: 'Linseed (Alsi)', as: 'Linseed (Alsi)' }, season: 'rabi', durationDays: 120, yieldPerAcreQuintals: 4, mspPerQuintal: 5800, seedCostPerAcre: 800, fertilizerCostPerAcre: 1500, nutrientPlanPerAcre: { N: 15, P: 15, K: 10 }, idealTempC: { min: 10, max: 25 },
    stages: [{ key: 'sowing', name: 'Sowing', from: 0, to: 25, irrigationDays: 25, actions: ['Sow with residual moisture (Utera system common).'] }, { key: 'vegetative', name: 'Vegetative', from: 26, to: 60, irrigationDays: 30, actions: ['Weed control is essential.'] }, { key: 'flowering', name: 'Flowering & Capsule', from: 61, to: 90, irrigationDays: 20, actions: ['Watch for rust and bud fly.'] }, { key: 'harvest', name: 'Harvest', from: 91, to: 120, irrigationDays: 0, actions: ['Harvest when capsules turn brown and crack.'] }],
    sources: ['ICAR']
  }
};

export function getCrop(cropId) {
  return CROPS[cropId] || null;
}

export function listCrops() {
  return Object.values(CROPS).map((c) => ({
    id: c.id,
    name: c.name,
    season: c.season,
    durationDays: c.durationDays,
  }));
}

// Returns the stage object matching a given day-after-sowing, or null.
export function stageForDay(crop, das) {
  if (!crop) return null;
  return crop.stages.find((s) => das >= s.from && das <= s.to) || null;
}
