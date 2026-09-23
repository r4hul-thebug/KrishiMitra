// Market price service (mandi prices)
// Integrates live Agmarknet / eNAM data when DATAGOV_API_KEY is provided,
// with a comprehensive, realistic multi-state APMC dataset covering all major Indian agricultural commodities.
import { config } from '../config.js';

export const COMMODITY_MSP = {
  wheat: 2275,
  rice: 2183,
  paddy: 2183,
  maize: 2090,
  cotton: 7020,
  mustard: 5650,
  soybean: 4600,
  groundnut: 6377,
  chickpea: 5440,
  gram: 5440,
  tur: 7000,
  arhar: 7000,
  moong: 8558,
  urad: 6950,
  bajra: 2500,
  jowar: 3180,
  potato: 1350,
  onion: 1850,
  tomato: 1600,
  sugarcane: 315, // per quintal FRP
};

export const MANDI_DIRECTORY = [
  // Punjab & Haryana
  { market: 'Khanna', district: 'Ludhiana', state: 'Punjab', commodities: ['wheat', 'rice', 'paddy', 'maize'] },
  { market: 'Karnal', district: 'Karnal', state: 'Haryana', commodities: ['wheat', 'rice', 'paddy', 'mustard'] },
  { market: 'Sirsa', district: 'Sirsa', state: 'Haryana', commodities: ['cotton', 'wheat', 'mustard'] },
  { market: 'Bathinda', district: 'Bathinda', state: 'Punjab', commodities: ['cotton', 'wheat', 'mustard'] },

  // Uttar Pradesh
  { market: 'Barabanki', district: 'Barabanki', state: 'Uttar Pradesh', commodities: ['wheat', 'rice', 'potato', 'mentha'] },
  { market: 'Hapur', district: 'Hapur', state: 'Uttar Pradesh', commodities: ['wheat', 'maize', 'mustard'] },
  { market: 'Agra', district: 'Agra', state: 'Uttar Pradesh', commodities: ['potato', 'mustard', 'wheat'] },
  { market: 'Azamgarh', district: 'Azamgarh', state: 'Uttar Pradesh', commodities: ['rice', 'paddy', 'wheat'] },

  // Madhya Pradesh
  { market: 'Indore', district: 'Indore', state: 'Madhya Pradesh', commodities: ['soybean', 'wheat', 'chickpea', 'gram'] },
  { market: 'Ujjain', district: 'Ujjain', state: 'Madhya Pradesh', commodities: ['soybean', 'wheat', 'chickpea'] },
  { market: 'Neemuch', district: 'Neemuch', state: 'Madhya Pradesh', commodities: ['soybean', 'mustard', 'groundnut', 'wheat'] },

  // Rajasthan
  { market: 'Kota', district: 'Kota', state: 'Rajasthan', commodities: ['soybean', 'mustard', 'wheat', 'chickpea'] },
  { market: 'Sri Ganganagar', district: 'Sri Ganganagar', state: 'Rajasthan', commodities: ['mustard', 'cotton', 'wheat', 'gram'] },
  { market: 'Alwar', district: 'Alwar', state: 'Rajasthan', commodities: ['mustard', 'bajra', 'wheat'] },

  // Maharashtra
  { market: 'Lasalgaon', district: 'Nashik', state: 'Maharashtra', commodities: ['onion', 'tomato', 'soybean'] },
  { market: 'Nagpur', district: 'Nagpur', state: 'Maharashtra', commodities: ['cotton', 'soybean', 'orange', 'tur'] },
  { market: 'Latur', district: 'Latur', state: 'Maharashtra', commodities: ['soybean', 'tur', 'arhar', 'chickpea'] },
  { market: 'Akola', district: 'Akola', state: 'Maharashtra', commodities: ['cotton', 'soybean', 'tur'] },

  // Gujarat
  { market: 'Rajkot', district: 'Rajkot', state: 'Gujarat', commodities: ['groundnut', 'cotton', 'chickpea'] },
  { market: 'Gondal', district: 'Rajkot', state: 'Gujarat', commodities: ['groundnut', 'cotton', 'onion', 'chilli'] },
  { market: 'Unjha', district: 'Mehsana', state: 'Gujarat', commodities: ['mustard', 'cumin', 'cotton'] },

  // Karnataka & South
  { market: 'Hubli', district: 'Dharwad', state: 'Karnataka', commodities: ['cotton', 'maize', 'chilli', 'groundnut'] },
  { market: 'Gulbarga', district: 'Kalaburagi', state: 'Karnataka', commodities: ['tur', 'arhar', 'chickpea', 'moong'] },
  { market: 'Kurnool', district: 'Kurnool', state: 'Andhra Pradesh', commodities: ['cotton', 'groundnut', 'paddy', 'maize'] },
  { market: 'Warangal', district: 'Warangal', state: 'Telangana', commodities: ['cotton', 'paddy', 'chilli', 'maize'] },

  // Delhi Central Mandi
  { market: 'Azadpur', district: 'North Delhi', state: 'Delhi', commodities: ['wheat', 'rice', 'potato', 'onion', 'tomato'] }
];

export function generateRealisticPrices(commodity = 'wheat', stateFilter = null) {
  const normComm = commodity.toLowerCase().trim();
  const msp = COMMODITY_MSP[normComm] || 2200;
  const today = new Date().toISOString().slice(0, 10);

  // Find relevant mandis that trade this commodity or state
  let relevantMandis = MANDI_DIRECTORY.filter(m => 
    m.commodities.includes(normComm) || 
    (stateFilter && m.state.toLowerCase().includes(stateFilter.toLowerCase()))
  );

  if (relevantMandis.length === 0) {
    relevantMandis = MANDI_DIRECTORY.slice(0, 8);
  }

  const prices = relevantMandis.map((m, idx) => {
    // Generate deterministic yet lively price based on market name and commodity
    const charSum = m.market.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const offsetFactor = ((charSum % 21) - 10) / 100; // -10% to +10%
    const modal = Math.round(msp * (1 + offsetFactor + 0.04));
    const minPrice = Math.round(modal * 0.93);
    const maxPrice = Math.round(modal * 1.07);
    const arrivals = Math.round(180 + (charSum % 450));
    
    // Trend calculation
    let trend = 'steady';
    if (offsetFactor > 0.02) trend = 'rising';
    else if (offsetFactor < -0.02) trend = 'falling';

    return {
      market: m.market,
      district: m.district,
      state: m.state,
      commodity: normComm,
      modalPrice: modal,
      minPrice: minPrice,
      maxPrice: maxPrice,
      arrivals: arrivals,
      modalPricePerQuintal: modal,
      minPricePerQuintal: minPrice,
      maxPricePerQuintal: maxPrice,
      mspPerQuintal: msp,
      diffFromMsp: modal - msp,
      arrivalsQuintals: arrivals,
      trend, // 'rising' | 'falling' | 'steady'
      date: today,
    };
  });

  // Calculate market analytics
  const avgModal = Math.round(prices.reduce((s, p) => s + p.modalPricePerQuintal, 0) / prices.length);
  const minMandi = Math.min(...prices.map(p => p.minPricePerQuintal));
  const maxMandi = Math.max(...prices.map(p => p.maxPricePerQuintal));

  // Determine market advisory
  let advisory = '';
  if (avgModal > msp * 1.05) {
    advisory = `Market prices for ${normComm} are currently buoyant and trading +${avgModal - msp} ₹/Qtl above Govt MSP. Ideal window to harvest and bring marketable surplus to APMC mandis.`;
  } else if (avgModal < msp) {
    advisory = `Open market prices are tracking below MSP. Consider enrolling in Govt Procurement (e-NAM / FCI procurement centers) to secure guaranteed minimum support price.`;
  } else {
    advisory = `Prices are stable near MSP levels. Moderate arrivals reported across state mandis.`;
  }

  return {
    source: 'agmarknet_simulated',
    commodity: normComm,
    date: today,
    govtMsp: msp,
    averagePrice: avgModal,
    highestPrice: maxMandi,
    lowestPrice: minMandi,
    bestTimeToSell: advisory,
    prices,
  };
}

export async function getPrices(commodity = 'wheat', state = null) {
  const normComm = (commodity || 'wheat').toLowerCase().trim();

  // If real API key is configured for Data.gov.in
  if (config.market.provider === 'agmarknet' && config.market.dataGovKey) {
    try {
      const key = config.market.dataGovKey;
      const url = `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=${key}&format=json&limit=25&filters%5Bcommodity%5D=${encodeURIComponent(normComm)}`;
      const res = await fetch(url, { signal: AbortSignal.timeout(4000) });
      if (res.ok) {
        const json = await res.json();
        if (json.records && json.records.length > 0) {
          const records = json.records.map(r => {
            const modal = Number(r.modal_price) || COMMODITY_MSP[normComm] || 2200;
            const minPrice = Number(r.min_price) || Math.round(modal * 0.95);
            const maxPrice = Number(r.max_price) || Math.round(modal * 1.05);
            const arrivals = Number(r.arrival_quantity) || 200;
            return {
              market: r.market || 'Regional Mandi',
              district: r.district || '',
              state: r.state || '',
              commodity: normComm,
              modalPrice: modal,
              minPrice: minPrice,
              maxPrice: maxPrice,
              arrivals: arrivals,
              modalPricePerQuintal: modal,
              minPricePerQuintal: minPrice,
              maxPricePerQuintal: maxPrice,
              mspPerQuintal: COMMODITY_MSP[normComm] || 2200,
              diffFromMsp: modal - (COMMODITY_MSP[normComm] || 2200),
              arrivalsQuintals: arrivals,
              trend: 'steady',
              date: r.arrival_date || new Date().toISOString().slice(0, 10),
            };
          });
          return {
            source: 'agmarknet_live',
            commodity: normComm,
            govtMsp: COMMODITY_MSP[normComm] || 2200,
            averagePrice: Math.round(records.reduce((a, b) => a + b.modalPricePerQuintal, 0) / records.length),
            highestPrice: Math.max(...records.map(r => r.maxPricePerQuintal)),
            lowestPrice: Math.min(...records.map(r => r.minPricePerQuintal)),
            bestTimeToSell: `Live AGMARKNET arrivals verified across ${records.length} mandis.`,
            prices: records
          };
        }
      }
    } catch (e) {
      console.warn('[market] Live agmarknet fetch error, using multi-mandi simulated fallback:', e.message);
    }
  }

  return generateRealisticPrices(normComm, state);
}

export const getMandiPrices = getPrices;
