import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import {
  apiClient,
  marketService,
  cropsService,
  weatherService,
  advisoryService,
  schemesService,
  rotationService,
  monitoringService
} from '@/services/api.js';

describe('Main API Service Calls Suite', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('marketService', () => {
    it('should request mandi prices with correct commodity and state params', async () => {
      const mockPrices = {
        commodity: 'wheat',
        prices: [{ market: 'Khanna', modalPrice: 2275, minPrice: 2150, maxPrice: 2350, arrivals: 140 }]
      };
      const getSpy = jest.spyOn(apiClient, 'get').mockResolvedValueOnce({ data: mockPrices });

      const data = await marketService.getMandiPrices('wheat', 'Punjab');
      expect(getSpy).toHaveBeenCalledWith('/market/mandi?commodity=wheat&state=Punjab');
      expect(data.prices[0].market).toBe('Khanna');
      expect(data.prices[0].modalPrice).toBe(2275);
    });

    it('should omit state parameter when state is "All States"', async () => {
      const getSpy = jest.spyOn(apiClient, 'get').mockResolvedValueOnce({ data: { prices: [] } });
      await marketService.getMandiPrices('rice', 'All States');
      expect(getSpy).toHaveBeenCalledWith('/market/mandi?commodity=rice');
    });
  });

  describe('cropsService', () => {
    it('should retrieve list of crops', async () => {
      const mockCrops = [
        { id: 'wheat', name: { en: 'Wheat', hi: 'गेहूं' } },
        { id: 'rice', name: { en: 'Rice', hi: 'धान' } }
      ];
      jest.spyOn(apiClient, 'get').mockResolvedValueOnce({ data: mockCrops });

      const crops = await cropsService.getCrops();
      expect(crops.length).toBe(2);
      expect(crops[0].id).toBe('wheat');
    });

    it('should retrieve specific crop details by id', async () => {
      const mockCrop = { id: 'cotton', durationDays: 160 };
      const getSpy = jest.spyOn(apiClient, 'get').mockResolvedValueOnce({ data: mockCrop });

      const crop = await cropsService.getCropById('cotton');
      expect(getSpy).toHaveBeenCalledWith('/crops/cotton');
      expect(crop.durationDays).toBe(160);
    });
  });

  describe('weatherService', () => {
    it('should fetch weather by lat and lon coordinates', async () => {
      const getSpy = jest.spyOn(apiClient, 'get').mockResolvedValueOnce({
        data: { current: { temp: 28 }, forecast: [] }
      });

      const weather = await weatherService.getWeather(30.9, 75.85);
      expect(getSpy).toHaveBeenCalledWith('/weather?lat=30.9&lon=75.85');
      expect(weather.current.temp).toBe(28);
    });

    it('should fetch weather by city name query if coords not provided', async () => {
      const getSpy = jest.spyOn(apiClient, 'get').mockResolvedValueOnce({ data: { location: 'Karnal' } });
      await weatherService.getWeather(undefined, undefined, 'Karnal');
      expect(getSpy).toHaveBeenCalledWith('/weather?q=Karnal');
    });

    it('should request reverse geocoding', async () => {
      const getSpy = jest.spyOn(apiClient, 'get').mockResolvedValueOnce({
        data: { village: 'Khanna', state: 'Punjab' }
      });
      const res = await weatherService.reverseGeocode(30.7, 76.2);
      expect(getSpy).toHaveBeenCalledWith('/location/reverse?lat=30.7&lon=76.2');
      expect(res.village).toBe('Khanna');
    });
  });

  describe('advisoryService', () => {
    it('should fetch farmer stage-wise advisory', async () => {
      const mockAdvisory = {
        crop: 'wheat',
        currentStage: { name: 'Crown Root Initiation' },
        directives: []
      };
      const getSpy = jest.spyOn(apiClient, 'get').mockResolvedValueOnce({ data: mockAdvisory });

      const res = await advisoryService.getFarmerAdvisory('demo-001');
      expect(getSpy).toHaveBeenCalledWith('/farmers/demo-001/advisory');
      expect(res.crop).toBe('wheat');
    });

    it('should fetch crop disease diagnosis', async () => {
      const mockDiagnosis = {
        primaryDiagnosis: { name: 'Yellow Rust', pathogen: 'Puccinia striiformis' }
      };
      const getSpy = jest.spyOn(apiClient, 'get').mockResolvedValueOnce({ data: mockDiagnosis });

      const res = await advisoryService.diagnoseSymptoms('wheat', 'yellow stripes on leaf');
      expect(getSpy).toHaveBeenCalledWith(expect.stringContaining('/disease/diagnose?crop=wheat'));
      expect(res.primaryDiagnosis.name).toBe('Yellow Rust');
    });

    it('should calculate fertilizer dose per acreage', async () => {
      const mockFertilizer = {
        fertilizerNeeds: { ureaKg: 130, dapKg: 55, mopKg: 33 }
      };
      const getSpy = jest.spyOn(apiClient, 'get').mockResolvedValueOnce({ data: mockFertilizer });

      const res = await advisoryService.calculateFertilizerDose('wheat', 2.5);
      expect(getSpy).toHaveBeenCalledWith('/fertilizer/dose?crop=wheat&acres=2.5');
      expect(res.fertilizerNeeds.ureaKg).toBe(130);
    });
  });

  describe('schemesService & rotationService', () => {
    it('should query government schemes with category and state filters', async () => {
      const mockSchemes = [{ id: 'pm-kisan', name: 'PM-KISAN' }];
      const getSpy = jest.spyOn(apiClient, 'get').mockResolvedValueOnce({ data: mockSchemes });

      const res = await schemesService.getSchemes('financial', 'Punjab');
      expect(getSpy).toHaveBeenCalledWith('/schemes?category=financial&state=Punjab');
      expect(res[0].id).toBe('pm-kisan');
    });

    it('should retrieve crop rotation sequence plan', async () => {
      const mockPlan = { crop: 'wheat', details: { recommendedRotations: [] } };
      const getSpy = jest.spyOn(apiClient, 'get').mockResolvedValueOnce({ data: mockPlan });

      const res = await rotationService.getRotationPlan('wheat');
      expect(getSpy).toHaveBeenCalledWith('/rotation/wheat');
      expect(res.crop).toBe('wheat');
    });
  });

  describe('monitoringService', () => {
    it('should fetch health metrics', async () => {
      const mockMetrics = { status: 'HEALTHY', uptimeSec: 3600 };
      jest.spyOn(apiClient, 'get').mockResolvedValueOnce({ data: mockMetrics });

      const metrics = await monitoringService.getHealthMetrics();
      expect(metrics.status).toBe('HEALTHY');
    });
  });
});
