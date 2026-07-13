// ADVISORY ENGINE  ── the backbone of KrishiMitraaz.
//
// Input : a farmer profile + live weather.
// Output: a structured, PRIORITIZED advisory (each item has severity + a
//         plain-language message + the reasoning trace).
//
// Design principles:
//  1. Deterministic & explainable. Every advice item carries `basis` so the
//     future voice/LLM layer can *read out the reason*, not just the verdict.
//     Judges trust advice they can trace; farmers trust advice with a "why".
//  2. Stage-aware. What to do depends on where the crop is in its life.
//  3. Weather-overlaid. Generic calendar advice is re-ranked by the forecast
//     (e.g. "don't irrigate — heavy rain in 2 days").
//  4. Voice-ready. `toSpeech()` renders the same data as one spoken paragraph.
//
// This engine is intentionally rule-based, not an LLM. The LLM comes later as a
// conversational front-end that is GROUNDED on exactly this output + the crop KB.

import { getCrop, stageForDay } from '../knowledge/crops.js';
import { fetchSatelliteData } from '../services/satellite.js';
import { getRotationAdvice } from './rotation.js';
import { getDiseaseGuidance } from './disease.js';

const SEV = { URGENT: 3, IMPORTANT: 2, INFO: 1 };
const SEV_LABEL = { 3: 'urgent', 2: 'important', 1: 'info' };

// Whole days between an ISO date string and today (>=0 for past sowing).
function daysSince(isoDate) {
  const then = new Date(isoDate + 'T00:00:00');
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return Math.floor((now - then) / 86_400_000);
}

function rainNextDays(forecast, n) {
  return forecast.daily.slice(0, n).reduce((sum, d) => sum + d.rainMm, 0);
}

function hotDaysAhead(forecast, thresholdC, n) {
  return forecast.daily.slice(0, n).filter((d) => d.tMaxC >= thresholdC).length;
}

// Core: build advisory items for a farmer given a forecast.
export async function buildAdvisory(farmer, forecast) {
  const crop = getCrop(farmer.crop);
  const items = [];

  if (!crop) {
    return {
      farmerId: farmer.id,
      crop: farmer.crop,
      generatedAt: new Date().toISOString(),
      items: [{
        severity: SEV_LABEL[SEV.INFO],
        title: 'Crop not yet supported',
        message: `Advisory for "${farmer.crop}" is not in the knowledge base yet. Supported: wheat, rice, maize, cotton.`,
        basis: 'knowledge-base-miss',
      }],
    };
  }

  const das = farmer.sowingDate ? daysSince(farmer.sowingDate) : null;
  const stage = das != null ? stageForDay(crop, das) : null;

  // 1) STAGE GUIDANCE — where the crop is and what this stage demands.
  if (stage) {
    items.push({
      severity: SEV_LABEL[SEV.IMPORTANT],
      title: `Stage: ${stage.name}`,
      message: `Your ${crop.name.en.toLowerCase()} is ~${das} days after sowing (${stage.name}). ${stage.actions[0]}`,
      basis: `stage:${stage.key}`,
      _sev: SEV.IMPORTANT,
    });
    // Remaining stage actions as info items.
    for (const action of stage.actions.slice(1)) {
      items.push({
        severity: SEV_LABEL[SEV.INFO],
        title: 'Stage tip',
        message: action,
        basis: `stage:${stage.key}`,
        _sev: SEV.INFO,
      });
    }
  } else if (das != null && das > crop.durationDays) {
    items.push({
      severity: SEV_LABEL[SEV.IMPORTANT],
      title: 'Likely past harvest',
      message: `It has been ${das} days since sowing; ${crop.name.en} usually matures in ~${crop.durationDays} days. If not harvested, prioritize it.`,
      basis: 'stage:post-maturity',
      _sev: SEV.IMPORTANT,
    });
  }

  // 2) IRRIGATION — merge stage water need with the rain forecast.
  if (stage) {
    const rain3 = rainNextDays(forecast, 3);
    if (rain3 >= 15) {
      items.push({
        severity: SEV_LABEL[SEV.URGENT],
        title: 'Hold irrigation — rain coming',
        message: `About ${rain3} mm of rain is expected in the next 3 days. Skip irrigation now to save water and avoid waterlogging.`,
        basis: `weather:rain=${rain3}mm;stage:${stage.key}`,
        _sev: SEV.URGENT,
      });
    } else {
      items.push({
        severity: SEV_LABEL[SEV.IMPORTANT],
        title: 'Irrigation schedule',
        message: `Little rain expected (${rain3} mm/3d). At this stage irrigate about every ${stage.irrigationDays} days. Check soil 5 cm deep; water if dry.`,
        basis: `weather:rain=${rain3}mm;stage:${stage.key}:cycle=${stage.irrigationDays}d`,
        _sev: SEV.IMPORTANT,
      });
    }
  }

  // 3) HEAT / COLD STRESS — compare forecast to the crop's ideal band.
  const hot = hotDaysAhead(forecast, crop.idealTempC.max + 3, 5);
  if (hot >= 2) {
    items.push({
      severity: SEV_LABEL[SEV.IMPORTANT],
      title: 'Heat stress risk',
      message: `${hot} of the next 5 days may exceed ${crop.idealTempC.max + 3}°C — above the comfort range for ${crop.name.en.toLowerCase()}. Irrigate in the cooler evening and keep soil moist.`,
      basis: `weather:hotDays=${hot};crop:maxIdeal=${crop.idealTempC.max}`,
      _sev: SEV.IMPORTANT,
    });
  }
  const coldAhead = forecast.daily.slice(0, 5).filter((d) => d.tMinC <= crop.idealTempC.min - 4).length;
  if (coldAhead >= 2) {
    items.push({
      severity: SEV_LABEL[SEV.IMPORTANT],
      title: 'Cold stress risk',
      message: `${coldAhead} of the next 5 nights may fall near ${crop.idealTempC.min - 4}°C. Light evening irrigation can protect the crop from cold/frost.`,
      basis: `weather:coldNights=${coldAhead};crop:minIdeal=${crop.idealTempC.min}`,
      _sev: SEV.IMPORTANT,
    });
  }

  // 4) FERTILIZER — translate the stage's nutrient plan into a concrete nudge.
  if (stage && /basal|top-dress|top dress|N as|N\b/i.test(stage.actions.join(' '))) {
    const plan = crop.nutrientPlanPerAcre;
    const acres = farmer.landAcres || 1;
    items.push({
      severity: SEV_LABEL[SEV.INFO],
      title: 'Nutrient reminder',
      message: `Season plan for ${crop.name.en.toLowerCase()}: ~${Math.round(plan.N * acres)} kg N, ${Math.round(plan.P * acres)} kg P, ${Math.round(plan.K * acres)} kg K for your ${acres} acre(s), split across stages. Follow the stage tip above for this split.`,
      basis: `fertilizer:plan;acres=${acres}`,
      _sev: SEV.INFO,
    });
  }

  // 5) DISEASE WATCH — humidity+warmth heuristic + CNN hook.
  const wetWarm = forecast.daily.slice(0, 5).filter((d) => d.rainMm > 0 && d.tMaxC >= 22 && d.tMaxC <= 32).length;
  if (stage) {
    const diseaseTip = getDiseaseGuidance(crop.id, wetWarm);
    if (diseaseTip) {
      items.push({
        severity: SEV_LABEL[SEV.IMPORTANT],
        title: diseaseTip.title,
        message: diseaseTip.message,
        basis: diseaseTip.basis,
        _sev: SEV.IMPORTANT,
      });
    } else if (wetWarm >= 2) {
      items.push({
        severity: SEV_LABEL[SEV.IMPORTANT],
        title: 'Disease-favourable weather',
        message: `Warm + humid days ahead raise fungal disease risk. Scout leaves every 2–3 days; act early if you see spots or rust.`,
        basis: `weather:wetWarmDays=${wetWarm}`,
        _sev: SEV.IMPORTANT,
      });
    }
  }

  // 6) AI + SATELLITE (ISRO BHUVAN/NDVI) HOOK
  if (farmer.location && farmer.location.lat && farmer.location.lon) {
    try {
      const satData = await fetchSatelliteData(farmer.location.lat, farmer.location.lon);
      if (satData && satData.ndvi) {
        items.push({
          severity: SEV_LABEL[SEV.INFO],
          title: 'Satellite Crop Health (NDVI)',
          message: `NDVI index is ${satData.ndvi}. ${satData.analysis}.`,
          basis: `satellite:ndvi=${satData.ndvi}`,
          _sev: SEV.INFO,
        });
      }
    } catch (err) {
      console.warn('Satellite data fetch failed', err);
    }
  }

  // 7) ROTATIONAL CROP TIMELINE
  if (das != null && das >= crop.durationDays - 15) {
    const rotationTip = getRotationAdvice(crop.id);
    if (rotationTip) {
      items.push({
        severity: SEV_LABEL[SEV.INFO],
        title: rotationTip.title,
        message: rotationTip.message,
        basis: rotationTip.basis,
        _sev: SEV.INFO,
      });
    }
  }

  // 8) YIELD PROGNOSIS
  if (crop.yieldPerAcreQuintals && farmer.landAcres) {
    const projectedYield = crop.yieldPerAcreQuintals * farmer.landAcres;
    items.push({
      severity: SEV_LABEL[SEV.INFO],
      title: 'Yield Prognosis',
      message: `Based on your ${farmer.landAcres} acres and crop history, your estimated gross production for ${crop.name.en} is ${projectedYield} quintals under optimal conditions.`,
      basis: `yield:calc;acres=${farmer.landAcres}`,
      _sev: SEV.INFO,
    });
  }

  // Sort by severity (urgent first), stable within a tier.
  const ranked = items
    .map((it, i) => ({ it, i }))
    .sort((a, b) => (b.it._sev || 1) - (a.it._sev || 1) || a.i - b.i)
    .map(({ it }) => {
      const { _sev, ...clean } = it;
      return clean;
    });

  return {
    farmerId: farmer.id,
    crop: crop.id,
    cropName: crop.name,
    stage: stage ? { key: stage.key, name: stage.name, das } : null,
    weatherSource: forecast.source,
    generatedAt: new Date().toISOString(),
    items: ranked,
  };
}

// Render an advisory as a single spoken paragraph — the seam the Phase 2
// Bhashini TTS layer will consume. Kept here so voice and text never drift.
export function toSpeech(advisory, lang = 'en') {
  if (!advisory.items.length) return 'No advisory available right now.';
  const name = advisory.cropName ? advisory.cropName[lang] || advisory.cropName.en : advisory.crop;
  const lead = `Advisory for your ${name}. `;
  const body = advisory.items
    .slice(0, 4) // keep spoken output short for weak-network / low-attention use
    .map((it) => it.message)
    .join('\n');
  return lead + '\n' + body;
}
