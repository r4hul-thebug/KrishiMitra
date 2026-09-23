// Agricultural Calendar and Date Utility Functions

/**
 * Calculates calendar days between two dates
 */
export function daysBetween(startDate, endDate = new Date()) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw new Error('Invalid date provided');
  }

  const startUtc = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
  const endUtc = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());

  return Math.floor((endUtc - startUtc) / (1000 * 60 * 60 * 24));
}

/**
 * Returns Indian Agricultural Cropping Season (Kharif, Rabi, Zaid) for a given date
 * Kharif: June - October (Monsoon crops like Paddy, Maize, Cotton)
 * Rabi: October - March (Winter crops like Wheat, Mustard, Gram)
 * Zaid: March - June (Summer crops like Moong, Cucumber, Watermelon)
 */
export function getAgriculturalSeason(dateInput = new Date()) {
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) {
    throw new Error('Invalid date provided');
  }

  const month = d.getMonth() + 1; // 1 = Jan, 12 = Dec

  if (month >= 6 && month <= 10) {
    return {
      season: 'Kharif',
      hindiName: 'खरीफ',
      typicalCrops: ['Paddy', 'Maize', 'Cotton', 'Soybean', 'Groundnut'],
      description: 'Monsoon cropping season (June to October)'
    };
  } else if (month === 11 || month === 12 || month <= 3) {
    return {
      season: 'Rabi',
      hindiName: 'रबी',
      typicalCrops: ['Wheat', 'Mustard', 'Gram', 'Barley', 'Potato'],
      description: 'Winter cropping season (October/November to March/April)'
    };
  } else {
    return {
      season: 'Zaid',
      hindiName: 'जायद',
      typicalCrops: ['Moong', 'Watermelon', 'Cucumber', 'Fodder'],
      description: 'Summer short-duration cropping season (March to June)'
    };
  }
}

/**
 * Formats a date into Indian standard format (DD/MM/YYYY)
 */
export function formatDateIndian(dateInput) {
  if (!dateInput) return '';
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return '';

  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();

  return `${day}/${month}/${year}`;
}
