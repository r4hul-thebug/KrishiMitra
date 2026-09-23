// Agricultural Domain Utility Calculators

/**
 * Standard base temperatures for Growing Degree Days (GDD) calculation (°C)
 */
export const CROP_BASE_TEMP = {
  wheat: 4.5,
  rice: 10.0,
  maize: 10.0,
  cotton: 12.0,
  mustard: 5.0,
  soybean: 10.0,
  chickpea: 5.0,
  potato: 7.0
};

/**
 * Calculates Growing Degree Days (GDD)
 * Formula: ((Tmax + Tmin) / 2) - Tbase
 * Values below base temperature return 0.
 */
export function calculateGDD(tMax, tMin, baseTemp = 10.0) {
  if (typeof tMax !== 'number' || typeof tMin !== 'number') {
    throw new TypeError('tMax and tMin must be numbers');
  }
  const meanTemp = (tMax + tMin) / 2;
  const gdd = meanTemp - baseTemp;
  return gdd > 0 ? Number(gdd.toFixed(2)) : 0;
}

/**
 * Calculates NPK and Commercial Fertilizer Requirements (Urea, DAP, MOP) in kg
 * based on crop type, land size (acres), and soil type adjustment.
 */
export function calculateNPKRequirement(cropId, acres = 1, soilType = 'alluvial') {
  if (!cropId || typeof cropId !== 'string') {
    throw new Error('Valid cropId is required');
  }
  const numericAcres = Number(acres);
  if (isNaN(numericAcres) || numericAcres <= 0) {
    throw new Error('Acres must be a positive number');
  }

  // Recommended baseline N-P-K (kg/acre)
  const baseline = {
    wheat: { n: 48, p: 24, k: 16 },
    rice: { n: 40, p: 20, k: 20 },
    maize: { n: 48, p: 24, k: 20 },
    cotton: { n: 40, p: 20, k: 20 },
    mustard: { n: 32, p: 16, k: 12 },
    soybean: { n: 12, p: 24, k: 16 }, // legume fixes own N
    chickpea: { n: 8, p: 20, k: 12 },  // legume
    potato: { n: 60, p: 32, k: 40 }
  };

  const norm = cropId.toLowerCase().trim();
  const rec = baseline[norm] || baseline['wheat'];

  // Soil modifier factors
  const soilFactors = {
    alluvial: 1.0,
    black: 0.95, // naturally high in clay & potassium
    red: 1.05,   // often low in phosphorus
    sandy: 1.15, // prone to leaching, needs split dosing
    clay: 0.98
  };
  const factor = soilFactors[soilType?.toLowerCase()] || 1.0;

  const totalN = Math.round(rec.n * numericAcres * factor);
  const totalP = Math.round(rec.p * numericAcres * factor);
  const totalK = Math.round(rec.k * numericAcres * factor);

  // Conversion to commercial bags/fertilizers:
  // DAP is 18% N and 46% P2O5
  // MOP is 60% K2O
  // Urea is 46% N
  const dapKg = Math.round(totalP / 0.46);
  const nFromDap = dapKg * 0.18;
  const remainingN = Math.max(0, totalN - nFromDap);
  const ureaKg = Math.round(remainingN / 0.46);
  const mopKg = Math.round(totalK / 0.60);

  return {
    crop: norm,
    acres: numericAcres,
    soilType: soilType || 'alluvial',
    pureNutrientsKg: { n: totalN, p: totalP, k: totalK },
    commercialFertilizersKg: {
      urea: ureaKg,
      dap: dapKg,
      mop: mopKg
    },
    bagsEstimated: {
      ureaBags45Kg: Math.ceil(ureaKg / 45),
      dapBags50Kg: Math.ceil(dapKg / 50),
      mopBags50Kg: Math.ceil(mopKg / 50)
    }
  };
}

/**
 * Calculates Market Price Spread against Government Minimum Support Price (MSP)
 */
export function calculateMSPSpread(modalPrice, msp) {
  if (typeof modalPrice !== 'number' || typeof msp !== 'number' || msp <= 0) {
    throw new Error('Valid numeric modalPrice and positive msp are required');
  }

  const diff = modalPrice - msp;
  const percentDiff = Number(((diff / msp) * 100).toFixed(2));

  let status = 'AT_MSP';
  if (percentDiff > 1.5) {
    status = 'ABOVE_MSP';
  } else if (percentDiff < -1.5) {
    status = 'BELOW_MSP';
  }

  return {
    modalPrice,
    msp,
    diff,
    percentDiff,
    status,
    recommendation: status === 'ABOVE_MSP' 
      ? 'Sell in APMC Mandi for premium' 
      : status === 'BELOW_MSP' 
        ? 'Enroll in Govt MSP procurement center' 
        : 'Market tracking close to MSP baseline'
  };
}

/**
 * Converts Indian Agricultural Land Units
 * Supported: acres, hectares, bigha (standard UP/MP 1 acre = 1.61 bigha), guntha (1 acre = 40 guntha)
 */
export function convertLandUnits(value, fromUnit, toUnit) {
  const num = Number(value);
  if (isNaN(num) || num < 0) {
    throw new Error('Value must be a non-negative number');
  }

  // Conversion factors to standard Acre
  const toAcre = {
    acre: 1.0,
    acres: 1.0,
    hectare: 2.47105,
    hectares: 2.47105,
    bigha: 0.62, // 1 bigha = 0.62 acre
    guntha: 0.025 // 1 guntha = 1/40 acre
  };

  const from = fromUnit.toLowerCase().trim();
  const to = toUnit.toLowerCase().trim();

  if (!toAcre[from] || !toAcre[to]) {
    throw new Error(`Unsupported land unit: ${fromUnit} or ${toUnit}`);
  }

  const valueInAcres = num * toAcre[from];
  const converted = valueInAcres / toAcre[to];
  return Number(converted.toFixed(3));
}

/**
 * Formats numbers into Indian Currency format (₹ with Lakhs/Crores grouping)
 */
export function formatIndianCurrency(amount) {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return '₹0';
  }
  const isNegative = amount < 0;
  const absVal = Math.round(Math.abs(amount)).toString();
  
  let lastThree = absVal.substring(absVal.length - 3);
  const otherNumbers = absVal.substring(0, absVal.length - 3);
  if (otherNumbers !== '') {
    lastThree = ',' + lastThree;
  }
  const formatted = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
  return `${isNegative ? '-' : ''}₹${formatted}`;
}
