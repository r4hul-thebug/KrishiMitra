// Market price service (mandi prices). Normalized shape:
// { source, commodity, prices:[{market, state, modalPricePerQuintal, date}] }
//
// Real source: Agmarknet / eNAM daily mandi prices, published on data.gov.in
// (resource 9ef84268-d588-465a-a308-a864a43d0070). Needs a free DATAGOV_API_KEY.
import { config } from '../config.js';

const MOCK_BASE = {
  wheat: 2275,   // roughly tracks MSP-era ranges (₹/quintal); illustrative only
  rice: 2300,
  maize: 2090,
  cotton: 7120,
};

function mockPrices(commodity) {
  const base = MOCK_BASE[commodity] || 2000;
  const markets = [
    { market: 'Azadpur', state: 'Delhi' },
    { market: 'Indore', state: 'Madhya Pradesh' },
    { market: 'Ludhiana', state: 'Punjab' },
  ];
  const today = new Date().toISOString().slice(0, 10);
  return {
    source: 'mock',
    commodity,
    prices: markets.map((m, i) => ({
      ...m,
      modalPricePerQuintal: base + (i - 1) * 60,
      date: today,
    })),
  };
}

async function agmarknetPrices(commodity) {
  const key = config.market.dataGovKey;
  const url =
    `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070` +
    `?api-key=${key}&format=json&limit=10&filters%5Bcommodity%5D=${encodeURIComponent(commodity)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`data.gov.in ${res.status}`);
  const json = await res.json();
  const prices = (json.records || []).map((r) => ({
    market: r.market,
    state: r.state,
    modalPricePerQuintal: Number(r.modal_price),
    date: r.arrival_date,
  }));
  return { source: 'agmarknet', commodity, prices };
}

export async function getPrices(commodity) {
  const key = (MOCK_BASE[commodity] ? commodity : 'wheat');
  if (config.market.provider === 'agmarknet' && config.market.dataGovKey) {
    try {
      return await agmarknetPrices(commodity);
    } catch (err) {
      console.warn('[market] real provider failed, using mock:', err.message);
      return mockPrices(key);
    }
  }
  return mockPrices(key);
}
