import { describe, it, expect } from '@jest/globals';
import { buildAdvisory } from '@backend/engine/advisory.js';
import { getRotationAdvice } from '@backend/engine/rotation.js';
import { generateRealisticPrices, getMandiPrices } from '@backend/services/market.js';

describe('Regression Tests: Mandi Market Data Integrity', () => {
  it('should ensure every mandi rate entry has modalPrice, minPrice, maxPrice, and arrivals', async () => {
    const rates = await getMandiPrices('wheat', 'Punjab');
    expect(rates).toBeDefined();
    expect(rates.prices.length).toBeGreaterThan(0);

    rates.prices.forEach(priceItem => {
      expect(typeof priceItem.modalPrice).toBe('number');
      expect(typeof priceItem.minPrice).toBe('number');
      expect(typeof priceItem.maxPrice).toBe('number');
      expect(typeof priceItem.arrivals).toBe('number');

      // Price relationships must hold: min <= modal <= max
      expect(priceItem.minPrice).toBeLessThanOrEqual(priceItem.modalPrice);
      expect(priceItem.modalPrice).toBeLessThanOrEqual(priceItem.maxPrice);
      expect(priceItem.arrivals).toBeGreaterThanOrEqual(0);
    });
  });

  it('should provide valid MSP and market analytics', () => {
    const wheatRates = generateRealisticPrices('wheat', 'Haryana');
    expect(wheatRates.govtMsp).toBeGreaterThan(0);
    expect(wheatRates.commodity).toBe('wheat');
    expect(wheatRates.prices.length).toBeGreaterThan(0);
    expect(wheatRates.averagePrice).toBeGreaterThan(0);
  });
});

describe('Regression Tests: Crop Rotation Engine', () => {
  it('should generate verified rotation plans for newly added crops (soybean, chickpea, potato)', () => {
    const soybeanPlan = getRotationAdvice('soybean');
    expect(soybeanPlan).toBeDefined();
    expect(soybeanPlan.details.name).toContain('Soybean');
    expect(soybeanPlan.details.recommendedRotations.length).toBeGreaterThan(0);
    expect(soybeanPlan.details.recommendedRotations[0].nitrogenFixedKgPerHa).toBeGreaterThan(0);

    const chickpeaPlan = getRotationAdvice('chickpea');
    expect(chickpeaPlan).toBeDefined();
    expect(chickpeaPlan.details.name).toContain('Chickpea');
    expect(chickpeaPlan.details.rootDepth).toBeDefined();

    const potatoPlan = getRotationAdvice('potato');
    expect(potatoPlan).toBeDefined();
    expect(potatoPlan.details.nutrientDemand).toContain('Potassium');
  });
});

describe('Regression Tests: Stage-wise Advisory Engine', () => {
  it('should produce prioritized advisory directives with weather integration', async () => {
    const mockForecast = {
      source: 'test',
      location: { lat: 28, lon: 77 },
      daily: [
        { date: '2026-09-24', tMaxC: 32, tMinC: 20, rainMm: 45, rainChance: 85, humidityPct: 80 },
        { date: '2026-09-25', tMaxC: 31, tMinC: 19, rainMm: 20, rainChance: 70, humidityPct: 75 }
      ]
    };

    const mockFarmer = {
      id: 'test-farmer-01',
      name: 'Ramesh Patel',
      crop: 'wheat',
      sowingDate: '2026-08-15',
      landAcres: 3.5,
      location: { lat: 28, lon: 77 },
      soilType: 'alluvial'
    };

    const advisory = await buildAdvisory(mockFarmer, mockForecast);
    expect(advisory).toBeDefined();
    expect(advisory.crop).toBe('wheat');
    expect(advisory.items.length).toBeGreaterThan(0);

    // With heavy rain in forecast, urgent rain hold directive should be generated
    const rainItem = advisory.items.find(it => it.kind === 'irrigation' || it.message.toLowerCase().includes('irrigate') || it.message.toLowerCase().includes('rain'));
    expect(rainItem).toBeDefined();
  });
});
