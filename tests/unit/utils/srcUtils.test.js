import {
  calculateGDD,
  calculateNPKRequirement,
  calculateMSPSpread,
  convertLandUnits,
  formatIndianCurrency,
  daysBetween,
  getAgriculturalSeason,
  formatDateIndian,
  CROP_BASE_TEMP
} from '../../../src/utils/index.js';

describe('src/utils: Agricultural & Domain Calculators', () => {
  describe('calculateGDD (Growing Degree Days)', () => {
    it('should correctly compute GDD when mean temperature exceeds base temp', () => {
      // Mean temp = (32 + 18) / 2 = 25. Base temp = 10. GDD = 15
      const gdd = calculateGDD(32, 18, 10);
      expect(gdd).toBe(15);
    });

    it('should return 0 when mean temperature is below or equal to base temp', () => {
      const gdd = calculateGDD(8, 2, 10);
      expect(gdd).toBe(0);
    });

    it('should use crop-specific base temperature when passed from CROP_BASE_TEMP', () => {
      // Wheat base temp is 4.5
      const gddWheat = calculateGDD(20, 10, CROP_BASE_TEMP.wheat);
      expect(gddWheat).toBe(10.5);
    });

    it('should throw TypeError when invalid inputs are provided', () => {
      expect(() => calculateGDD('25', 10)).toThrow(TypeError);
      expect(() => calculateGDD(25, null)).toThrow(TypeError);
    });
  });

  describe('calculateNPKRequirement', () => {
    it('should calculate fertilizer requirements in kg and 45kg/50kg bags for 2.5 acres of wheat', () => {
      const result = calculateNPKRequirement('wheat', 2.5, 'alluvial');
      expect(result.crop).toBe('wheat');
      expect(result.acres).toBe(2.5);
      expect(result.commercialFertilizersKg.urea).toBeGreaterThan(0);
      expect(result.commercialFertilizersKg.dap).toBeGreaterThan(0);
      expect(result.commercialFertilizersKg.mop).toBeGreaterThan(0);
      expect(result.bagsEstimated.ureaBags45Kg).toBeGreaterThan(0);
    });

    it('should adjust nutrient dosing for sandy and clay soils', () => {
      const alluvial = calculateNPKRequirement('maize', 1, 'alluvial');
      const sandy = calculateNPKRequirement('maize', 1, 'sandy');
      // Sandy soil has leaching factor 1.15
      expect(sandy.pureNutrientsKg.n).toBeGreaterThan(alluvial.pureNutrientsKg.n);
    });

    it('should handle legume crops with minimal nitrogen demand', () => {
      const soybean = calculateNPKRequirement('soybean', 1);
      const wheat = calculateNPKRequirement('wheat', 1);
      expect(soybean.pureNutrientsKg.n).toBeLessThan(wheat.pureNutrientsKg.n);
    });

    it('should reject invalid or negative acreage', () => {
      expect(() => calculateNPKRequirement('wheat', -2)).toThrow();
      expect(() => calculateNPKRequirement('wheat', 0)).toThrow();
      expect(() => calculateNPKRequirement('', 2)).toThrow();
    });
  });

  describe('calculateMSPSpread', () => {
    it('should identify ABOVE_MSP market status with sell recommendation', () => {
      const spread = calculateMSPSpread(2500, 2275);
      expect(spread.status).toBe('ABOVE_MSP');
      expect(spread.diff).toBe(225);
      expect(spread.percentDiff).toBeGreaterThan(0);
      expect(spread.recommendation).toContain('Sell in APMC Mandi');
    });

    it('should identify BELOW_MSP market status with procurement recommendation', () => {
      const spread = calculateMSPSpread(2000, 2275);
      expect(spread.status).toBe('BELOW_MSP');
      expect(spread.diff).toBe(-275);
      expect(spread.recommendation).toContain('Govt MSP procurement');
    });

    it('should identify AT_MSP when price is within baseline tolerance', () => {
      const spread = calculateMSPSpread(2280, 2275);
      expect(spread.status).toBe('AT_MSP');
    });

    it('should validate inputs', () => {
      expect(() => calculateMSPSpread('2000', 2275)).toThrow();
      expect(() => calculateMSPSpread(2000, -100)).toThrow();
    });
  });

  describe('convertLandUnits', () => {
    it('should convert hectares to acres accurately', () => {
      // 1 hectare = 2.471 acres
      const acres = convertLandUnits(2, 'hectares', 'acres');
      expect(acres).toBeCloseTo(4.942, 2);
    });

    it('should convert bigha and guntha to acres', () => {
      const fromBigha = convertLandUnits(10, 'bigha', 'acres');
      expect(fromBigha).toBe(6.2);

      const fromGuntha = convertLandUnits(40, 'guntha', 'acres');
      expect(fromGuntha).toBe(1.0);
    });

    it('should throw on unsupported units', () => {
      expect(() => convertLandUnits(5, 'acres', 'yards')).toThrow();
    });
  });

  describe('formatIndianCurrency', () => {
    it('should format positive amounts with Indian number system separators', () => {
      expect(formatIndianCurrency(125000)).toBe('₹1,25,000');
      expect(formatIndianCurrency(500)).toBe('₹500');
      expect(formatIndianCurrency(10000000)).toBe('₹1,00,00,000');
    });

    it('should handle zero and negative amounts', () => {
      expect(formatIndianCurrency(0)).toBe('₹0');
      expect(formatIndianCurrency(-4500)).toBe('-₹4,500');
    });
  });
});

describe('src/utils: Agricultural Calendar & Date Helpers', () => {
  describe('daysBetween', () => {
    it('should return exact number of calendar days between two dates', () => {
      const days = daysBetween('2026-09-01', '2026-09-21');
      expect(days).toBe(20);
    });

    it('should throw when invalid date strings are provided', () => {
      expect(() => daysBetween('invalid-date', '2026-09-21')).toThrow();
    });
  });

  describe('getAgriculturalSeason', () => {
    it('should detect Kharif season for monsoon months (June - October)', () => {
      const july = getAgriculturalSeason('2026-07-15');
      expect(july.season).toBe('Kharif');
      expect(july.hindiName).toBe('खरीफ');
      expect(july.typicalCrops).toContain('Paddy');
    });

    it('should detect Rabi season for winter months (November - March)', () => {
      const dec = getAgriculturalSeason('2026-12-10');
      expect(dec.season).toBe('Rabi');
      expect(dec.hindiName).toBe('रबी');
      expect(dec.typicalCrops).toContain('Wheat');
    });

    it('should detect Zaid season for summer months (April - May)', () => {
      const april = getAgriculturalSeason('2026-04-20');
      expect(april.season).toBe('Zaid');
      expect(april.hindiName).toBe('जायद');
      expect(april.typicalCrops).toContain('Moong');
    });
  });

  describe('formatDateIndian', () => {
    it('should format valid date string to DD/MM/YYYY', () => {
      const formatted = formatDateIndian('2026-09-23T00:00:00.000Z');
      expect(formatted).toBe('23/09/2026');
    });

    it('should return empty string for null or invalid date', () => {
      expect(formatDateIndian(null)).toBe('');
      expect(formatDateIndian('not-a-date')).toBe('');
    });
  });
});
