// Maps Indian states (from reverse geocoding) to our supported regional languages
export const getStateLanguage = (stateName) => {
  if (!stateName) return null;
  
  const state = stateName.toLowerCase();
  
  // Mapping logic for all 28 states & 8 UTs (grouped by primary regional language)
  if (state.includes('maharashtra') || state.includes('goa')) return 'mr'; // Marathi (Goa has Konkani, but Marathi is widely understood)
  if (state.includes('punjab') || state.includes('chandigarh')) return 'pa'; // Punjabi
  if (state.includes('gujarat') || state.includes('dadra') || state.includes('daman') || state.includes('diu')) return 'gu'; // Gujarati
  if (state.includes('tamil nadu') || state.includes('puducherry')) return 'ta'; // Tamil
  if (state.includes('telangana') || state.includes('andhra pradesh')) return 'te'; // Telugu
  if (state.includes('west bengal') || state.includes('tripura')) return 'bn'; // Bengali
  if (state.includes('karnataka')) return 'kn'; // Kannada
  if (state.includes('kerala') || state.includes('lakshadweep')) return 'ml'; // Malayalam
  if (state.includes('odisha')) return 'or'; // Odia
  if (state.includes('assam')) return 'as'; // Assamese
  
  // Hindi is dominant in many northern & central states
  if (state.includes('uttar pradesh') || state.includes('madhya pradesh') || 
      state.includes('bihar') || state.includes('rajasthan') || 
      state.includes('haryana') || state.includes('jharkhand') || 
      state.includes('chhattisgarh') || state.includes('uttarakhand') || 
      state.includes('himachal pradesh') || state.includes('delhi') ||
      state.includes('andaman')) {
    return 'hi';
  }
  
  // Other NE states (Nagaland, Manipur, Mizoram, Meghalaya, Sikkim, Arunachal) 
  // generally default to English/Hindi depending on exact region, so we'll fallback to null
  // which means it won't add a 3rd option, leaving English and Hindi.

  return null;
};
