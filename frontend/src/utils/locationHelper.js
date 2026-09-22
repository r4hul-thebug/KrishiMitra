import axios from 'axios';
import { API_URL } from '../config';

/**
 * Robust, zero-error location detection.
 * Tier 1: HTML5 GPS (short timeout, low accuracy for instant responsiveness)
 * Tier 2: Server IP/Network geolocation fallback (works in iframe, when GPS is denied, or without hardware)
 * Tier 3: Default major agricultural hub (Barabanki, Uttar Pradesh)
 */
export async function detectFarmerLocation(onStatus) {
  if (onStatus) onStatus('Detecting location...');

  let coordinates = null;
  let source = 'fallback';

  // 1. Try browser Geolocation if supported
  if (typeof navigator !== 'undefined' && navigator.geolocation) {
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          { timeout: 3500, enableHighAccuracy: false, maximumAge: 300000 }
        );
      });

      if (position?.coords) {
        coordinates = {
          lat: Number(position.coords.latitude.toFixed(4)),
          lon: Number(position.coords.longitude.toFixed(4))
        };
        source = 'gps';
      }
    } catch {
      // Browser GPS denied, timed out, or blocked by iframe permissions policy.
      // Continue silently to Tier 2 network fallback.
    }
  }

  // 2. If browser GPS did not succeed, use Server Auto/IP Geolocation
  if (!coordinates) {
    try {
      const autoRes = await axios.get(`${API_URL}/location/auto`, { timeout: 4000 });
      if (autoRes.data && autoRes.data.lat && autoRes.data.lon) {
        return {
          lat: autoRes.data.lat,
          lon: autoRes.data.lon,
          village: autoRes.data.village || '',
          state: autoRes.data.state || 'Uttar Pradesh',
          locationStr: autoRes.data.locationStr || `${autoRes.data.lat}° N, ${autoRes.data.lon}° E`,
          source: 'network'
        };
      }
    } catch {
      // Continue to default
    }
  }

  // If GPS coordinates were obtained, reverse-geocode via backend
  if (coordinates) {
    try {
      const revRes = await axios.get(
        `${API_URL}/location/reverse?lat=${coordinates.lat}&lon=${coordinates.lon}`,
        { timeout: 4000 }
      );
      return {
        lat: coordinates.lat,
        lon: coordinates.lon,
        village: revRes.data.village || '',
        state: revRes.data.state || '',
        locationStr: revRes.data.locationStr || `${coordinates.lat}° N, ${coordinates.lon}° E`,
        source: 'gps'
      };
    } catch {
      return {
        lat: coordinates.lat,
        lon: coordinates.lon,
        village: '',
        state: '',
        locationStr: `${coordinates.lat}° N, ${coordinates.lon}° E`,
        source: 'gps'
      };
    }
  }

  // 3. Fallback: Barabanki, Uttar Pradesh agricultural hub
  return {
    lat: 26.85,
    lon: 80.95,
    village: 'Barabanki',
    state: 'Uttar Pradesh',
    locationStr: 'Barabanki, Uttar Pradesh',
    source: 'default'
  };
}

/**
 * Geocode user-typed village/district/state
 */
export async function geocodePlace(query) {
  if (!query || !query.trim()) return null;
  try {
    const res = await axios.get(`${API_URL}/geocode?q=${encodeURIComponent(query.trim())}`, { timeout: 4000 });
    return res.data;
  } catch {
    return null;
  }
}
