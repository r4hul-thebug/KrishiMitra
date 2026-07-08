import { listCrops, getCrop } from '../knowledge/crops.js';

/**
 * Crop Suitability Engine
 * Evaluates the live weather forecast against the ideal temperature ranges of all crops
 * to suggest the most suitable crops for a farmer's specific microclimate.
 */
export function getSuitability(forecast) {
  if (!forecast || !forecast.daily || forecast.daily.length === 0) return [];

  // Calculate average temperature from the 5-day forecast
  const avgTMin = forecast.daily.reduce((sum, d) => sum + d.tMinC, 0) / forecast.daily.length;
  const avgTMax = forecast.daily.reduce((sum, d) => sum + d.tMaxC, 0) / forecast.daily.length;
  const avgTemp = (avgTMin + avgTMax) / 2;

  const allCrops = listCrops().map(c => getCrop(c.id));
  
  // Score each crop based on how close the avg forecast temp is to its ideal range
  const scoredCrops = allCrops.map(crop => {
    let score = 100;
    const midIdeal = (crop.idealTempC.min + crop.idealTempC.max) / 2;
    
    // Deduct points based on variance from ideal temp
    const variance = Math.abs(avgTemp - midIdeal);
    score -= (variance * 5); // 5 points off per degree of variance

    // Check if it's completely out of bounds (severe penalty)
    if (avgTMax > crop.idealTempC.max + 5 || avgTMin < crop.idealTempC.min - 5) {
      score -= 40;
    }

    return {
      id: crop.id,
      name: crop.name,
      season: crop.season,
      durationDays: crop.durationDays,
      yieldPerAcreQuintals: crop.yieldPerAcreQuintals,
      mspPerQuintal: crop.mspPerQuintal || 0,
      seedCostPerAcre: crop.seedCostPerAcre || 0,
      fertilizerCostPerAcre: crop.fertilizerCostPerAcre || 0,
      score: Math.max(0, Math.round(score)),
      reasoning: `Matches your local microclimate average of ${Math.round(avgTemp)}°C (Ideal for this crop is ${crop.idealTempC.min}-${crop.idealTempC.max}°C).`
    };
  });

  // Return the top 3 most suitable crops
  return scoredCrops
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}
