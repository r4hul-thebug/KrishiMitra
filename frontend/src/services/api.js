// Centralized API Client with Integrated Telemetry & Error Logging
import axios from 'axios';
import { API_URL } from '../config';
import { logger } from './logger';

export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor: Attach Auth & Correlation IDs
apiClient.interceptors.request.use(
  (config) => {
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('krishimitraaz_token') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers['X-Request-ID'] = Math.random().toString(36).substring(2, 9);
    config.metadata = { startTime: Date.now() };
    return config;
  },
  (error) => {
    logger.error('API Request Configuration Error', { error: error.message });
    return Promise.reject(error);
  }
);

// Response Interceptor: Real-time Telemetry & Error Capture
apiClient.interceptors.response.use(
  (response) => {
    const duration = Date.now() - (response.config.metadata?.startTime || Date.now());
    if (duration > 3000) {
      logger.warn(`Slow API Response: ${response.config.method?.toUpperCase()} ${response.config.url} (${duration}ms)`);
    }
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url;
    const method = error.config?.method?.toUpperCase();
    const message = error.response?.data?.error || error.message;

    logger.error(`API Error: ${method} ${url} [Status ${status || 'NETWORK_ERROR'}]`, {
      status,
      url,
      method,
      errorMessage: message,
      responseData: error.response?.data
    });

    return Promise.reject(error);
  }
);

// Modular API Services
export const marketService = {
  async getMandiPrices(commodity = 'wheat', state = null) {
    const stateQuery = state && state !== 'All States' ? `&state=${encodeURIComponent(state)}` : '';
    const res = await apiClient.get(`/market/mandi?commodity=${encodeURIComponent(commodity)}${stateQuery}`);
    return res.data;
  }
};

export const cropsService = {
  async getCrops() {
    const res = await apiClient.get('/crops');
    return res.data;
  },
  async getCropById(cropId) {
    const res = await apiClient.get(`/crops/${encodeURIComponent(cropId)}`);
    return res.data;
  }
};

export const weatherService = {
  async getWeather(lat, lon, query = null) {
    let url = '/weather';
    if (lat !== undefined && lon !== undefined) {
      url += `?lat=${lat}&lon=${lon}`;
    } else if (query) {
      url += `?q=${encodeURIComponent(query)}`;
    }
    const res = await apiClient.get(url);
    return res.data;
  },
  async reverseGeocode(lat, lon) {
    const res = await apiClient.get(`/location/reverse?lat=${lat}&lon=${lon}`);
    return res.data;
  },
  async getAutoLocation() {
    const res = await apiClient.get('/location/auto');
    return res.data;
  },
  async searchLocation(query) {
    const res = await apiClient.get(`/location/search?q=${encodeURIComponent(query)}`);
    return res.data;
  }
};

export const advisoryService = {
  async getFarmerAdvisory(farmerId) {
    const res = await apiClient.get(`/farmers/${farmerId}/advisory`);
    return res.data;
  },
  async getThreats(farmerId) {
    const res = await apiClient.get(`/farmers/${farmerId}/threats`);
    return res.data;
  },
  async diagnoseSymptoms(crop, symptoms) {
    const res = await apiClient.get(`/disease/diagnose?crop=${encodeURIComponent(crop)}&symptoms=${encodeURIComponent(symptoms || '')}`);
    return res.data;
  },
  async calculateFertilizerDose(crop, acres) {
    const res = await apiClient.get(`/fertilizer/dose?crop=${encodeURIComponent(crop)}&acres=${acres}`);
    return res.data;
  }
};

export const schemesService = {
  async getSchemes(category = 'all', state = 'all') {
    const res = await apiClient.get(`/schemes?category=${encodeURIComponent(category)}&state=${encodeURIComponent(state)}`);
    return res.data;
  },
  async getSchemeById(id) {
    const res = await apiClient.get(`/schemes/${encodeURIComponent(id)}`);
    return res.data;
  }
};

export const rotationService = {
  async getRotationPlan(crop = 'wheat') {
    const res = await apiClient.get(`/rotation/${encodeURIComponent(crop)}`);
    return res.data;
  }
};

export const monitoringService = {
  async getHealthMetrics() {
    const res = await apiClient.get('/monitoring/health');
    return res.data;
  },
  async getRecentLogs(filter = {}) {
    const params = new URLSearchParams(filter).toString();
    const res = await apiClient.get(`/monitoring/logs?${params}`);
    return res.data;
  }
};
