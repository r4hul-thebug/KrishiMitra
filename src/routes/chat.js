import { Router } from 'express';
import * as store from '../db/store.js';
import { getForecast } from '../services/weather.js';
import { fetchSatelliteData } from '../services/satellite.js';
import { getCrop } from '../knowledge/crops.js';
import { cropDetails } from '../knowledge/crop_details.js';

export const chat = Router();

// Simulated AI Chatbot Endpoint
chat.post('/', async (req, res) => {
  const { farmerId, message, mediaAttached } = req.body;
  
  if (!farmerId) return res.status(400).json({ error: 'farmerId is required' });
  
  const farmer = await store.getFarmer(farmerId);
  if (!farmer) return res.status(404).json({ error: 'Farmer not found' });

  const crop = getCrop(farmer.crop) || { name: { en: farmer.crop } };
  
  // 1. Gather live context for the AI
  let weatherSummary = '';
  let satelliteSummary = '';
  
  if (farmer.location) {
    try {
      const forecast = await getForecast(farmer.location.lat, farmer.location.lon);
      const today = forecast.daily[0];
      weatherSummary = `Temp: ${today.tMinC}°C to ${today.tMaxC}°C. Rain: ${today.rainMm}mm.`;
      
      const sat = await fetchSatelliteData(farmer.location.lat, farmer.location.lon);
      if (sat) satelliteSummary = `NDVI: ${sat.ndvi}. ${sat.analysis}`;
    } catch (e) {
      console.warn("Context gathering failed", e);
    }
  }

  // 2. Simulated LLM Processing
  let responseText = '';
  let responseType = 'text'; // 'text' or 'diagnosis'

  const msgLower = message.toLowerCase();

  // If a media file is attached, run "Image Analysis"
  if (mediaAttached) {
    responseType = 'diagnosis';
    // Fake CNN response based on the crop type
    if (crop.id === 'wheat' || crop.id === 'maize') {
      responseText = `I have analyzed the image of your ${crop.name.en}. I detect early signs of Rust / Leaf Blight. \n\n**Diagnosis:** Fungal Infection.\n**Prescription:** Spray Mancozeb 75% WP at 2g/liter of water immediately. The current weather (${weatherSummary}) is highly conducive to fungal spread, so act within 24 hours.`;
    } else if (crop.id === 'cotton' || crop.id === 'sugarcane') {
      responseText = `I have analyzed the image of your ${crop.name.en}. I detect pest damage consistent with early borer / bollworm attacks. \n\n**Diagnosis:** Pest Infestation.\n**Prescription:** Setup 5 pheromone traps per acre today. If damage exceeds 5%, consider spraying Emamectin Benzoate 5% SG at 0.5g/liter.`;
    } else {
      responseText = `I have analyzed the image of your ${crop.name.en}. I see some nitrogen deficiency and minor spots, but no severe disease. \n\n**Diagnosis:** Nutrient Deficiency.\n**Prescription:** Apply a foliar spray of 2% Urea. Your satellite data shows ${satelliteSummary} which aligns with a slight biomass drop.`;
    }
  } 
  // Else, normal chat routing based on keywords
  else if (msgLower.match(/(rain|weather|water|irrigation|moisture|dry|wet)/)) {
    const detail = cropDetails[crop.id]?.irrigation || '';
    responseText = `According to live satellite and meteorological data for your location, the forecast is: ${weatherSummary}. \n\n**ICAR Guidelines for ${crop.name.en} Water Management:**\n${detail}`;
  } 
  else if (msgLower.match(/(fertilizer|urea|nutrient|npk|potash|zinc|sulphur|gypsum|compost|manure)/)) {
    const detail = cropDetails[crop.id]?.fertilizer || '';
    responseText = `**ICAR Nutrient Plan for ${crop.name.en}:**\n${detail}\n\n*Note: Adjust based on your local soil testing.*`;
  }
  else if (msgLower.match(/(disease|fungus|blight|rust|rot|smut|mildew|virus)/)) {
    const detail = cropDetails[crop.id]?.diseases || '';
    responseText = `**Common Diseases in ${crop.name.en}:**\n${detail}\n\n*Tip: You can click the paperclip icon to upload an image of your sick crop, and I'll analyze it visually!*`;
  }
  else if (msgLower.match(/(pest|insect|worm|bug|borer|aphid|termite|hopper|whitefly|thrip|mite)/)) {
    const detail = cropDetails[crop.id]?.pests || '';
    responseText = `**Major Pests of ${crop.name.en}:**\n${detail}\n\n*If you suspect an infestation, attach a photo so I can confirm.*`;
  }
  else if (msgLower.match(/(soil|field|ph|salinity|drainage|loam|clay|sand)/)) {
    const detail = cropDetails[crop.id]?.soil || '';
    responseText = `**Soil Requirements for ${crop.name.en}:**\n${detail}`;
  }
  else if (msgLower.match(/(sow|plant|seed|spacing|distance|depth|rate|nursery|transplant)/)) {
    const detail = cropDetails[crop.id]?.sowing || '';
    responseText = `**Sowing & Planting Guide for ${crop.name.en}:**\n${detail}`;
  }
  else if (msgLower.match(/(harvest|cut|yield|pick|picking|maturity|dry)/)) {
    const detail = cropDetails[crop.id]?.harvest || '';
    responseText = `**Harvesting ${crop.name.en}:**\n${detail}`;
  }
  else if (msgLower.match(/(profit|margin|msp|cost|revenue|price|economics|finance|money)/)) {
    const msp = crop.mspPerQuintal || 0;
    const seed = crop.seedCostPerAcre || 0;
    const fert = crop.fertilizerCostPerAcre || 0;
    const ypa = crop.yieldPerAcreQuintals || 0;
    const rev = msp * ypa;
    const cost = seed + fert;
    const profit = rev - cost;
    responseText = `**Financial Projection for ${crop.name.en} (per Acre):**\n\n- **Govt MSP:** ₹${msp} / quintal\n- **Average Yield:** ${ypa} quintals\n- **Expected Revenue:** ₹${rev.toLocaleString()}\n- **Estimated Input Costs (Seed + Fertilizer):** ₹${cost.toLocaleString()}\n\n**Projected Profit Margin:** ₹${profit.toLocaleString()} per acre.`;
  }
  else if (msgLower.match(/(everything|all about|tell me about|info|details)/)) {
    const details = cropDetails[crop.id];
    if (details) {
      responseText = `Here is the comprehensive ICAR profile for ${crop.name.en}:\n\n**Soil:** ${details.soil}\n**Sowing:** ${details.sowing}\n**Fertilizer:** ${details.fertilizer}\n**Irrigation:** ${details.irrigation}\n**Diseases:** ${details.diseases}\n**Pests:** ${details.pests}\n**Harvest:** ${details.harvest}`;
    } else {
      responseText = `I'm sorry, I don't have the full detailed profile for ${crop.name.en} yet.`;
    }
  }
  else if (msgLower.match(/(satellite|health|ndvi|isro|bhuvan|space)/)) {
    responseText = `I am pulling your latest ISRO Bhuvan satellite imagery... ${satelliteSummary || 'Currently, I cannot reach the satellite for your coordinates.'}. I recommend physically scouting the field tomorrow morning.`;
  }
  else if (msgLower.match(/(hello|hi|namaste|hey|morning|evening)/)) {
    responseText = `Namaste! I am KrishiMitra, your AI agricultural assistant. I have loaded your profile for ${crop.name.en}. I can see your local weather is ${weatherSummary}. How can I help you manage your crop today? You can ask me about **diseases**, **pests**, **fertilizers**, **sowing**, or attach images for diagnosis!`;
  }
  else {
    // Advanced Fallback: Search the entire crop profile for the user's keywords
    const details = cropDetails[crop.id];
    if (details) {
      const fullText = Object.values(details).join(' ').toLowerCase();
      // Simple heuristic: if any word > 4 chars from the message is found in the text, return the section that contains it
      const words = msgLower.split(' ').filter(w => w.length > 4);
      let foundSection = null;
      let foundSectionName = '';
      
      for (const w of words) {
        for (const [key, text] of Object.entries(details)) {
          if (text.toLowerCase().includes(w)) {
            foundSection = text;
            foundSectionName = key;
            break;
          }
        }
        if (foundSection) break;
      }

      if (foundSection) {
        responseText = `Regarding your query about "${message}", here is the most relevant ICAR guideline for ${crop.name.en} (${foundSectionName.toUpperCase()}): \n\n${foundSection}`;
      } else {
        responseText = `I understand you are asking about "${message}". As an AI, I am still learning about some specific topics. Feel free to ask me about **weather, irrigation, fertilizers, pests, diseases**, or say "tell me everything about my crop". You can also attach an image for a diagnosis!`;
      }
    } else {
      responseText = `I understand you are asking about "${message}". As an AI, I am still learning about some specific topics. Feel free to ask me about **weather, irrigation, fertilizers, pests, diseases**, or say "tell me everything about my crop". You can also attach an image for a diagnosis!`;
    }
  }

  // Return the AI response
  res.json({
    role: 'ai',
    message: responseText,
    type: responseType,
    contextUsed: {
      weather: weatherSummary !== '',
      satellite: satelliteSummary !== ''
    }
  });
});
