import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import axios from 'axios';
import { detectFarmerLocation, geocodePlace } from '@/utils/locationHelper.js';

describe('Utility: locationHelper', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('detectFarmerLocation', () => {
    it('should use HTML5 GPS when available and reverse-geocode the coordinates', async () => {
      const mockGeolocation = {
        getCurrentPosition: jest.fn((success) => {
          success({
            coords: {
              latitude: 30.9010,
              longitude: 75.8573
            }
          });
        })
      };
      globalThis.navigator = { geolocation: mockGeolocation };

      jest.spyOn(axios, 'get').mockResolvedValueOnce({
        data: {
          village: 'Ludhiana',
          state: 'Punjab',
          locationStr: 'Ludhiana, Punjab'
        }
      });

      const result = await detectFarmerLocation();

      expect(result.source).toBe('gps');
      expect(result.lat).toBe(30.901);
      expect(result.lon).toBe(75.8573);
      expect(result.village).toBe('Ludhiana');
      expect(result.state).toBe('Punjab');
    });

    it('should fallback to server IP/network geolocation when GPS is denied or unavailable', async () => {
      const mockGeolocation = {
        getCurrentPosition: jest.fn((_success, reject) => {
          reject(new Error('User denied Geolocation'));
        })
      };
      globalThis.navigator = { geolocation: mockGeolocation };

      jest.spyOn(axios, 'get').mockResolvedValueOnce({
        data: {
          lat: 23.2599,
          lon: 77.4126,
          village: 'Bhopal',
          state: 'Madhya Pradesh',
          locationStr: 'Bhopal, Madhya Pradesh'
        }
      });

      const result = await detectFarmerLocation();

      expect(result.source).toBe('network');
      expect(result.lat).toBe(23.2599);
      expect(result.lon).toBe(77.4126);
      expect(result.state).toBe('Madhya Pradesh');
    });

    it('should fallback to default agricultural hub (Barabanki) when all methods fail', async () => {
      const mockGeolocation = {
        getCurrentPosition: jest.fn((_success, reject) => {
          reject(new Error('Timeout'));
        })
      };
      globalThis.navigator = { geolocation: mockGeolocation };

      jest.spyOn(axios, 'get').mockRejectedValueOnce(new Error('Network error'));

      const result = await detectFarmerLocation();

      expect(result.source).toBe('default');
      expect(result.lat).toBe(26.85);
      expect(result.lon).toBe(80.95);
      expect(result.village).toBe('Barabanki');
      expect(result.state).toBe('Uttar Pradesh');
    });
  });

  describe('geocodePlace', () => {
    it('should return null for empty or whitespace query', async () => {
      expect(await geocodePlace('')).toBeNull();
      expect(await geocodePlace('   ')).toBeNull();
      expect(await geocodePlace(null)).toBeNull();
    });

    it('should query /geocode API and return result', async () => {
      jest.spyOn(axios, 'get').mockResolvedValueOnce({
        data: {
          lat: 28.6139,
          lon: 77.2090,
          name: 'New Delhi'
        }
      });

      const res = await geocodePlace('New Delhi');
      expect(res).toBeDefined();
      expect(res.lat).toBe(28.6139);
      expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('New%20Delhi'), expect.any(Object));
    });

    it('should return null if geocode request fails', async () => {
      jest.spyOn(axios, 'get').mockRejectedValueOnce(new Error('404 Not Found'));
      const res = await geocodePlace('UnknownPlaceXYZ');
      expect(res).toBeNull();
    });
  });
});
