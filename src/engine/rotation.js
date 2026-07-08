// ROTATIONAL CROP ENGINE ── Crop rotation timeline and calendar
//
// Recommends crop rotations based on the current crop to maintain soil health.

export function getRotationAdvice(currentCropId) {
  const rotationMap = {
    wheat: ['Legumes (e.g., Mung bean)', 'Cotton', 'Maize'],
    rice: ['Wheat', 'Mustard', 'Chickpea'],
    maize: ['Wheat', 'Mustard', 'Potato'],
    cotton: ['Wheat', 'Sorghum', 'Groundnut'],
    sugarcane: ['Wheat', 'Legumes', 'Mustard'],
    mustard: ['Cotton', 'Maize', 'Pearl Millet'],
    soybean: ['Wheat', 'Gram', 'Mustard'],
    groundnut: ['Wheat', 'Mustard', 'Sorghum'],
    potato: ['Maize', 'Paddy', 'Groundnut'],
    chickpea: ['Rice', 'Maize', 'Sorghum'],
    bajra: ['Mustard', 'Chickpea', 'Wheat'],
    jowar: ['Chickpea', 'Mustard', 'Wheat'],
    tur: ['Wheat', 'Mustard', 'Sorghum'],
    moong: ['Wheat', 'Potato', 'Mustard'],
    urad: ['Wheat', 'Mustard', 'Maize'],
    tea: ['Cover Crops (e.g., Guatemala Grass)', 'Legumes'],
    coffee: ['Shade Trees (Mixed)', 'Spices (e.g., Pepper)']
  };

  const nextCrops = rotationMap[currentCropId] || [];
  if (nextCrops.length === 0) return null;

  return {
    title: 'Crop Rotation Strategy',
    message: `After harvesting ${currentCropId}, consider planting ${nextCrops.join(' or ')} to restore soil nutrients and break pest cycles.`,
    basis: 'rotation:soil_health'
  };
}
