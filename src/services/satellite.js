// SATELLITE SERVICE ── AI + Satellite powered crop advisory (ISRO BHUVAN API, NDVI)
//
// This is a stub for the Phase 1 demo. In Phase 2, this will interact with ISRO Bhuvan
// or other satellite data providers to get real NDVI values for a farmer's coordinates.

export async function fetchSatelliteData(lat, lon) {
  // Mock response for NDVI (Normalized Difference Vegetation Index)
  // Values range from -1.0 to 1.0. Healthy vegetation is typically > 0.4.
  const mockNDVI = 0.65;
  
  return {
    source: 'isro_bhuvan_mock',
    ndvi: mockNDVI,
    analysis: 'Healthy crop cover detected',
    timestamp: new Date().toISOString()
  };
}
