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
    name: { en: 'Wheat', hi: 'गेहूँ' },
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
    name: { en: 'Rice (Paddy)', hi: 'धान' },
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
    name: { en: 'Maize', hi: 'मक्का' },
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
    name: { en: 'Cotton', hi: 'कपास' },
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
    name: { en: 'Sugarcane', hi: 'गन्ना' },
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
    name: { en: 'Mustard', hi: 'सरसों' },
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
    name: { en: 'Soybean', hi: 'सोयाबीन' },
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
    name: { en: 'Groundnut', hi: 'मूंगफली' },
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
    name: { en: 'Potato', hi: 'आलू' },
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
    name: { en: 'Chickpea (Gram)', hi: 'चना' },
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
    name: { en: 'Pearl Millet (Bajra)', hi: 'बाजरा' },
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
    name: { en: 'Sorghum (Jowar)', hi: 'ज्वार' },
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
    name: { en: 'Pigeon Pea (Tur/Arhar)', hi: 'अरहर' },
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
    name: { en: 'Green Gram (Moong)', hi: 'मूंग' },
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
    name: { en: 'Black Gram (Urad)', hi: 'उड़द' },
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
    name: { en: 'Tea', hi: 'चाय' },
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
    name: { en: 'Coffee (Robusta/Arabica)', hi: 'कॉफ़ी' },
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
