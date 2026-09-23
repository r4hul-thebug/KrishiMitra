// ROTATIONAL CROP ENGINE ── Rotational crop timeline and calendar
// Designs seasonal crop rotation sequences (Kharif -> Rabi -> Zaid) to preserve
// soil micro-nutrients, naturally fix atmospheric nitrogen, and interrupt pest life cycles.

export const ROTATION_KNOWLEDGE = {
  wheat: {
    name: 'Wheat (गेहूं)',
    family: 'Poaceae (Gramineae)',
    season: 'Rabi (Nov - Apr)',
    rootDepth: 'Deep (90-120 cm)',
    nutrientDemand: 'High Nitrogen & Phosphorus',
    recommendedRotations: [
      {
        planName: 'Cereal-Legume Sustainability Plan',
        cycle: ['Paddy / Maize (Kharif)', 'Wheat (Rabi)', 'Moong Bean / Green Gram (Zaid)'],
        nitrogenFixedKgPerHa: 38,
        organicCarbonImpact: '+18% soil microbial mass',
        pestReductionRating: 'High (Disrupts Karnal bunt & phalaris weed)',
        incomeBoostPct: '+22%',
        description: 'Planting short-duration Green Gram (Moong) right after harvesting Wheat fixes atmospheric nitrogen, cutting next season urea expenditure by 20-25%.'
      },
      {
        planName: 'Cash Crop Diversification Plan',
        cycle: ['Cotton / Soybean (Kharif)', 'Wheat (Rabi)', 'Sesame / Fodder (Zaid)'],
        nitrogenFixedKgPerHa: 20,
        organicCarbonImpact: '+12% organic humus',
        pestReductionRating: 'Moderate (Breaks cereal root rot)',
        incomeBoostPct: '+28%',
        description: 'Alternating with Soybean or Cotton balances deep vs shallow root extraction, preserving subsoil moisture.'
      }
    ],
    timeline: [
      { month: 'Oct-Nov', task: 'Land preparation & Sowing of Wheat with Basal DAP', season: 'Rabi' },
      { month: 'Dec-Jan', task: 'First Crown Root Irrigation (CRI) + First Urea Top Dressing', season: 'Rabi' },
      { month: 'Feb-Mar', task: 'Booting & Flowering monitoring, weather protection', season: 'Rabi' },
      { month: 'April', task: 'Harvesting Wheat & immediate stubble mulching', season: 'Rabi' },
      { month: 'May-June', task: 'Sow short-duration Moong (Legume) for soil rejuvenation', season: 'Zaid' },
      { month: 'July-Oct', task: 'Sow Kharif Paddy or Maize', season: 'Kharif' }
    ]
  },
  rice: {
    name: 'Rice / Paddy (धान)',
    family: 'Poaceae',
    season: 'Kharif (Jun - Nov)',
    rootDepth: 'Shallow fibrous (30-60 cm)',
    nutrientDemand: 'High Nitrogen & Potassium, heavy water',
    recommendedRotations: [
      {
        planName: 'Paddy-Wheat-Legume System (Indo-Gangetic Standard)',
        cycle: ['Paddy (Kharif)', 'Wheat (Rabi)', 'Moong Bean (Zaid)'],
        nitrogenFixedKgPerHa: 42,
        organicCarbonImpact: '+20% biological carbon',
        pestReductionRating: 'Very High (Breaks stem borer & blast fungus)',
        incomeBoostPct: '+24%',
        description: 'Breaks waterlogged anaerobic soil condition with an aerated winter wheat cycle, followed by pulse green manuring.'
      },
      {
        planName: 'Paddy-Mustard-Vegetable Cycle',
        cycle: ['Paddy (Kharif)', 'Yellow Mustard (Rabi)', 'Bittergourd / Okra (Zaid)'],
        nitrogenFixedKgPerHa: 15,
        organicCarbonImpact: '+14% soil tilth',
        pestReductionRating: 'High',
        incomeBoostPct: '+35%',
        description: 'Replaces water-thirsty winter crops with drought-tolerant mustard, conserving groundwater levels.'
      }
    ],
    timeline: [
      { month: 'June-July', task: 'Transplanting Paddy seedlings & water puddle management', season: 'Kharif' },
      { month: 'Aug-Sept', task: 'Tillering stage, Nitrogen split application & weed control', season: 'Kharif' },
      { month: 'Oct-Nov', task: 'Drain water 10 days before harvest, then harvest Paddy', season: 'Kharif' },
      { month: 'Nov-Dec', task: 'Zero-tillage sowing of Wheat or Mustard into standing stubble', season: 'Rabi' },
      { month: 'Jan-Mar', task: 'Rabi crop flowering & pod/grain development', season: 'Rabi' },
      { month: 'Apr-May', task: 'Summer pulse / Fodder crop for soil fertility restoration', season: 'Zaid' }
    ]
  },
  maize: {
    name: 'Maize (मक्का)',
    family: 'Poaceae',
    season: 'Kharif / Rabi',
    rootDepth: 'Medium (60-90 cm)',
    nutrientDemand: 'Heavy Feeder of N-P-K',
    recommendedRotations: [
      {
        planName: 'Maize-Chickpea-Green Gram Rotation',
        cycle: ['Maize (Kharif)', 'Chickpea / Gram (Rabi)', 'Green Gram / Cowpea (Zaid)'],
        nitrogenFixedKgPerHa: 45,
        organicCarbonImpact: '+22% soil regeneration',
        pestReductionRating: 'High (Disrupts Fall Armyworm cycle)',
        incomeBoostPct: '+30%',
        description: 'Two successive legume crops completely rebuild soil nitrogen depleted by heavy-feeding maize.'
      },
      {
        planName: 'Maize-Potato-Onion Intensive Rotation',
        cycle: ['Maize (Kharif)', 'Early Potato (Rabi)', 'Summer Onion / Cucumber (Zaid)'],
        nitrogenFixedKgPerHa: 10,
        organicCarbonImpact: '+16% organic matter',
        pestReductionRating: 'Moderate',
        incomeBoostPct: '+45%',
        description: 'High-income vegetable sequence with excellent cash flow for farmers near peri-urban mandis.'
      }
    ],
    timeline: [
      { month: 'June-July', task: 'Ridge and furrow sowing of hybrid Maize', season: 'Kharif' },
      { month: 'Aug-Sept', task: 'Knee-high & Tasseling stage top dressing', season: 'Kharif' },
      { month: 'October', task: 'Cob harvesting & stalk chopping', season: 'Kharif' },
      { month: 'Nov-Mar', task: 'Sow Chickpea or Mustard for low-water winter crop', season: 'Rabi' },
      { month: 'Apr-May', task: 'Zaid vegetable or summer green manuring', season: 'Zaid' }
    ]
  },
  cotton: {
    name: 'Cotton (कपास)',
    family: 'Malvaceae',
    season: 'Kharif (May - Dec)',
    rootDepth: 'Deep taproot (120-180 cm)',
    nutrientDemand: 'High Potash and Nitrogen',
    recommendedRotations: [
      {
        planName: 'Cotton-Groundnut-Gram Cycle',
        cycle: ['Bt Cotton (Kharif)', 'Gram / Chickpea (Rabi)', 'Fallow / Cowpea (Zaid)'],
        nitrogenFixedKgPerHa: 36,
        organicCarbonImpact: '+19% root depth aeration',
        pestReductionRating: 'Very High (Breaks Pink Bollworm dormancy)',
        incomeBoostPct: '+26%',
        description: 'Deep taproot breaks hard subsoil pans; following with a shallow legume restores topsoil biology.'
      }
    ],
    timeline: [
      { month: 'May-June', task: 'Sow Cotton with basal fertilizer & pheromone traps', season: 'Kharif' },
      { month: 'July-Aug', task: 'Square formation & sucking pest scouting', season: 'Kharif' },
      { month: 'Sept-Nov', task: 'Boll bursting & multiple picking rounds', season: 'Kharif' },
      { month: 'Dec-Jan', task: 'Stubble shredding to eliminate overwintering pink bollworm', season: 'Rabi' },
      { month: 'Feb-May', task: 'Sow short-duration pulse or summer groundnut', season: 'Zaid' }
    ]
  },
  mustard: {
    name: 'Mustard / Rapeseed (सरसों)',
    family: 'Brassicaceae',
    season: 'Rabi (Oct - Mar)',
    rootDepth: 'Medium taproot (70-100 cm)',
    nutrientDemand: 'High Sulphur and Nitrogen',
    recommendedRotations: [
      {
        planName: 'Mustard-Pearl Millet Bio-fumigation System',
        cycle: ['Bajra / Pearl Millet (Kharif)', 'Mustard (Rabi)', 'Moong (Zaid)'],
        nitrogenFixedKgPerHa: 32,
        organicCarbonImpact: '+17% soil tilth',
        pestReductionRating: 'Extremely High (Mustard root exudates suppress nematodes)',
        incomeBoostPct: '+22%',
        description: 'Mustard glucosinolates act as natural bio-fumigants, suppressing harmful soil fungi.'
      }
    ],
    timeline: [
      { month: 'Oct-Nov', task: 'Sow Mustard with Single Super Phosphate (Sulphur)', season: 'Rabi' },
      { month: 'Dec-Jan', task: 'Thinning, aphid monitoring & light irrigation', season: 'Rabi' },
      { month: 'Feb-Mar', task: 'Siliqua pod maturity and early morning harvest', season: 'Rabi' },
      { month: 'Apr-May', task: 'Summer Moong sowing', season: 'Zaid' },
      { month: 'July-Sept', task: 'Kharif Bajra or Soybean', season: 'Kharif' }
    ]
  },
  soybean: {
    name: 'Soybean (सोयाबीन)',
    family: 'Fabaceae (Leguminosae)',
    season: 'Kharif (Jun - Oct)',
    rootDepth: 'Medium taproot (60-90 cm)',
    nutrientDemand: 'High Phosphorus & Rhizobium inoculation',
    recommendedRotations: [
      {
        planName: 'Soybean-Wheat Legume Enrichment Cycle',
        cycle: ['Soybean (Kharif)', 'Wheat (Rabi)', 'Summer Moong / Sesame (Zaid)'],
        nitrogenFixedKgPerHa: 45,
        organicCarbonImpact: '+25% soil nitrogen pool',
        pestReductionRating: 'High (Interrupts cereal root rot & rusts)',
        incomeBoostPct: '+26%',
        description: 'Soybean naturally enriches soil with nodule bacteria, providing residual nitrogen for succeeding wheat crops.'
      }
    ],
    timeline: [
      { month: 'Jun-Jul', task: 'Sow Soybean with Bradyrhizobium seed inoculation', season: 'Kharif' },
      { month: 'Aug-Sep', task: 'Intercultural weeding and pod borer monitoring', season: 'Kharif' },
      { month: 'Oct', task: 'Harvest at 14% seed moisture, shred crop residues into soil', season: 'Kharif' },
      { month: 'Nov-Apr', task: 'Zero-tillage sowing of Wheat', season: 'Rabi' }
    ]
  },
  chickpea: {
    name: 'Chickpea / Gram (चना)',
    family: 'Fabaceae',
    season: 'Rabi (Oct - Mar)',
    rootDepth: 'Deep taproot (90-120 cm)',
    nutrientDemand: 'Phosphorus and moisture-sensitive',
    recommendedRotations: [
      {
        planName: 'Rainfed Cereal-Pulse Rotation',
        cycle: ['Pearl Millet / Sorghum (Kharif)', 'Chickpea (Rabi)', 'Green Fodder (Zaid)'],
        nitrogenFixedKgPerHa: 40,
        organicCarbonImpact: '+20% microbial biomass',
        pestReductionRating: 'Very High (Breaks monocot rust and smut cycles)',
        incomeBoostPct: '+21%',
        description: 'Deep taproot mines subsoil moisture efficiently, rejuvenating drought-prone soils.'
      }
    ],
    timeline: [
      { month: 'Oct-Nov', task: 'Deep ploughing & Sowing of Chickpea with Trichoderma treatment', season: 'Rabi' },
      { month: 'Dec-Jan', task: 'Nipping of apical shoots to encourage branching, pod borer traps', season: 'Rabi' },
      { month: 'Feb-Mar', task: 'Harvesting when plants turn yellowish-brown', season: 'Rabi' }
    ]
  },
  potato: {
    name: 'Potato (आलू)',
    family: 'Solanaceae',
    season: 'Rabi (Oct - Feb)',
    rootDepth: 'Shallow root system (30-50 cm)',
    nutrientDemand: 'Heavy Potassium, Phosphorus & Nitrogen feeder',
    recommendedRotations: [
      {
        planName: 'Potato-Maize-Sesbania Green Manuring',
        cycle: ['Dhaincha / Sesbania Green Manure (Summer)', 'Potato (Rabi)', 'Spring Maize / Sunflower (Zaid)'],
        nitrogenFixedKgPerHa: 30,
        organicCarbonImpact: '+30% soil organic matter',
        pestReductionRating: 'High (Breaks bacterial wilt and tuber moth)',
        incomeBoostPct: '+35%',
        description: 'Green manuring with Sesbania prior to potato planting restores massive organic matter required for tuber expansion.'
      }
    ],
    timeline: [
      { month: 'Oct-Nov', task: 'Tubers treated with Mancozeb, ridging and planting', season: 'Rabi' },
      { month: 'Dec-Jan', task: 'Earthing up and late blight preventive spraying', season: 'Rabi' },
      { month: 'Feb', task: 'Dehaulming (cutting foliage) 10 days before harvesting', season: 'Rabi' }
    ]
  }
};

export function getRotationAdvice(cropId = 'wheat') {
  const norm = cropId.toLowerCase().trim();
  const data = ROTATION_KNOWLEDGE[norm] || ROTATION_KNOWLEDGE['wheat'];

  return {
    crop: norm,
    details: data,
    scientificPrinciple: 'Alternating fibrous-root monocots (cereals) with taproot dicots (pulses/oilseeds) maximizes root zone aeration, recycles residual phosphorus, and prevents the buildup of host-specific pests.',
    soilNutrientBenefit: `${data.recommendedRotations[0]?.nitrogenFixedKgPerHa || 35} kg atmospheric Nitrogen fixed per hectare annually.`
  };
}
