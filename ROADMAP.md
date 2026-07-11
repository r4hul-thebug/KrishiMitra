# KrishiMitraaz — Scope, Roadmap & Strategy

**Goal:** Smart Crop Advisory System for small & marginal farmers.  
**Target user:** ~1-acre farmer, cheap/feature phone, weak network, low literacy.

Every scope decision below serves *that* person: **reach + trust** over feature count.

---

## 1. Feature Scope

| Feature | Status | Notes |
|---|---|---|
| Professional Government Dashboard | ✅ Done | NIC-style solid theme, high-contrast, accessible |
| Secure JWT Authentication | ✅ Done | PM Kisan / Aadhaar Official ID based login |
| AI Advisory Engine | ✅ Done | Weather-aware, stage-specific, explainable |
| Voice-ready Summaries | ✅ Done | `toSpeech()` seam for Bhashini TTS |
| Multi-Year Yield History | ✅ Done | Track harvests across seasons |
| Financial Yield Calculator | ✅ Done | MSP, cost, revenue, profit per acre |
| Crop Suitability Engine | ✅ Done | Location-based weather-matched recommendations |
| AI Chatbot | ✅ Done | Grounded agricultural assistant |
| Precision Geolocation | ✅ Done | GPS + Nominatim reverse geocoding |
| NDVI Satellite Integration | ✅ Done | Mock-ready for ISRO Bhuvan API |
| Bhashini STT/TTS | 🔜 Phase 2 | Voice I/O for 22 Indian languages |
| LLM RAG Chatbot | 🔜 Phase 2 | Grounded on engine output, not raw LLM |
| Disease Detection CNN | 📋 Phase 3 | Image-based crop disease triage |
| Mandi Prices UI | 📋 Phase 3 | Real-time market prices (Agmarknet/eNAM) |
| IVR / WhatsApp Channel | 📋 Phase 4 | Feature phone accessibility |
| Offline-first Caching | 📋 Phase 4 | Cached advisory + SMS fallback |

### Two reframes that can win it
1. **Reach feature phones too** — add an **IVR / missed-call / WhatsApp** channel sharing one backend. Proves "inclusivity" concretely; most teams miss this.
2. **Honest "offline"** = cached last advisory + on-device light STT + SMS/IVR fallback. Defensible under questioning; "offline AI chatbot" is not.

---

## 2. Architecture

- **Frontend:** React + Vite (Professional Government Dashboard UI)
- **Backend:** Node.js + Express API gateway
- **Database:** JSON file store (Phase 1) → PostgreSQL + PostGIS (Phase 2+)
- **AI & Analytics:** Rule engine + LLM grounding (Phase 2), CNN models (Phase 3)
- **Data Sources:** IMD Weather, ISRO Bhuvan (NDVI), Agmarknet (Mandi prices)
- **Channels:** Web dashboard (Phase 1) → IVR/WhatsApp (Phase 4)

All providers are swappable behind normalized data shapes with mock fallbacks.

---

## 3. Roadmap

- **Phase 1 — Advisory Spine ✅ (this repo)**
  Farmer profile, multi-year yield history, professional dashboard, crop KB (wheat/rice/maize/cotton/sugarcane/mustard/soybean/groundnut), weather fusion, NDVI satellite, ranked+explainable advice, `toSpeech()` seam, yield calculator, crop suitability, AI chatbot, full test suite.

- **Phase 2 — Voice & AI**
  Bhashini STT/TTS integration; LLM chatbot grounded on engine JSON output; MongoDB for chat persistence.

- **Phase 3 — Ecosystem & Localization**
  Real-time Mandi prices UI, government scheme recommendations, disease-detection CNN & fertilizer guidance. Dynamic layout adaptability and localization to regional languages (Completed).

- **Phase 4 — Inclusivity & Scale**
  Offline/cache behavior, IVR/WhatsApp channels, simple local language interfaces, one flawless end-to-end demo script.

### Immediate Next Steps
1. Expand crop KB with **real ICAR Package-of-Practices values** for target districts
2. Wire real weather provider (OpenWeather → IMD adapter)
3. Send `toSpeech()` output through Bhashini TTS
4. Add 3–5 **real farmer interviews** for Q&A readiness

---

## 4. Strategy

- **One narrative:** *"Trusted, spoken agricultural advice that reaches a farmer with a cheap phone and a weak signal."*
- **Demo = one farmer, one full journey** (voice question in Hindi → grounded advice + fertilizer tip + today's mandi price), not a feature tour.
- **Pre-empt feasibility attacks:** grounded RAG (not raw LLM), IVR reach, realistic offline, NDVI satellite integration.
- **Sustainability:** KVK/NGO partnerships for last-mile trust + content; govt stack (Bhashini, eNAM) for zero-cost scale.

---

## 5. Risk Register

| Risk | Mitigation |
|---|---|
| LLM gives wrong agronomic advice | RAG-grounded on ICAR/KVK + rule engine for critical path; cite sources |
| Reaching low-literacy / feature-phone users | Voice-first + IVR/WhatsApp, not app-only |
| "Offline AI" isn't realistic | Redefine: cache + on-device STT + SMS/IVR fallback |
| NDVI resolution vs tiny farms | Positioned as enhancement, not core claim |
| Disease detection over-promising | Framed as triage; show accuracy honestly |
| Data/API reliability in demo | Every provider has a mock fallback (already implemented) |
