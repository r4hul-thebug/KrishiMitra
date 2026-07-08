# KrishiMitraaz — Scope, Roadmap & Strategy

**Problem (SIH25010):** Smart Crop Advisory System for small & marginal farmers.
**Target user:** ~1-acre farmer, cheap/feature phone, weak network, low literacy.

Every scope decision below serves *that* person: **reach + trust** over feature count.

---

## 1. Refined scope — one hero, the rest support it

| Feature | Verdict | Notes |
|---|---|---|
| Voice-first multilingual advisory | 🟢 **HERO** | Literacy is the real problem. Build on **Bhashini** (free, Govt of India, 22 languages). |
| Personalized advisory engine | 🟢 Core | Profile + crop KB + IMD weather. |
| LLM chatbot with RAG grounding | 🟢 Core | Ground on ICAR/KVK advisories. Connected to MongoDB. |
| Mandi prices + schemes | 🟢 Core | Real time market prices of crops (Agmarknet/eNAM APIs). |
| Disease detection (image→CNN) | 🟢 Core | Image-based fertilizer guidance and disease detection using CNN/ONNX. |
| NDVI / Bhuvan satellite | 🟢 Core | AI + Satellite powered crop advisory (ISRO BHUVAN API, NDVI). |
| Rotational Crop Timeline | 🟢 Core | Crop rotation calendar for soil health. |

### Two reframes that can win it
1. **Reach feature phones too** — add an **IVR / missed-call / WhatsApp** channel sharing one backend. Proves "inclusivity" concretely; most teams miss this.
2. **Honest "offline"** = cached last advisory + on-device light STT + SMS/IVR fallback. Defensible under questioning; "offline AI chatbot" is not.

---

## 2. Architecture

- **Frontend:** React Native app (Farmer-Centric Interface, simple voice-first design).
- **Backend:** Node.js API gateway.
- **Databases:** PostgreSQL + PostGIS (for geospatial), MongoDB (for chatbot and AI context).
- **AI & Analytics:** Cloud LLM (like GPT API), ONNX and CNN models (for disease/fertilizer).
- **Data Sources:** ICAR, IMD Weather APIs, Market price APIs, ISRO Bhuvan (NDVI).
- **Channels:** React Native app + IVR/WhatsApp fallback.

Phase 1 mirrors this: providers are swappable behind normalized shapes.

---

## 3. Roadmap (no hard deadline → depth-first, solo-friendly)

- **Phase 1 — Advisory spine ✅ (this repo)**
  Farmer profile, Multi-year Yield History API, Professional Government Dashboard UI, crop KB (wheat/rice/maize/cotton), weather fusion, AI + Satellite powered crop advisory (NDVI), Rotational crop timeline, ranked+explainable advice, `toSpeech()` seam, tests.
- **Phase 2 — Voice & AI**
  Bhashini STT/TTS; LLM chatbot grounded on engine output. MongoDB integration for chatbot persistence.
- **Phase 3 — Ecosystem Integration**
  Real-time Mandi prices UI, schemes, disease-detection CNN & Fertilizer guidance.
- **Phase 4 — Inclusivity & Pitch**
  Offline/cache behavior (weak networks), simple local languages interface, one flawless end-to-end demo script.

### Suggested next steps (immediate)
1. Run Phase 1, hit `/advisory`, feel the loop.
2. Expand the crop KB with **real ICAR Package-of-Practices values for your target district** (replace the placeholder numbers; add `sources`).
3. Add 3–5 **real farmer interviews** — huge in SIH Q&A; feeds the KB and the pitch.
4. Wire real weather (OpenWeather now → IMD adapter later).
5. Start Phase 2: send `toSpeech()` output through Bhashini TTS.

---

## 4. Strategy to win

- **One narrative:** *"Trusted, spoken agricultural advice that reaches a farmer with a cheap phone and a weak signal."*
- **Demo = one farmer, one full journey** (voice question in Hindi → grounded advice + fertilizer tip + today's mandi price), not a feature tour.
- **Pre-empt the feasibility attack:** grounded RAG (not raw LLM), IVR reach, realistic offline, NDVI-as-roadmap. Judges reward teams that found their own holes.
- **Sustainability:** KVK/NGO partnerships for last-mile trust + content; govt stack (Bhashini, eNAM) for zero-cost scale.

---

## 5. Risk register (be ready to say these out loud)

| Risk | Honest mitigation |
|---|---|
| LLM gives wrong agronomic advice | RAG-grounded on ICAR/KVK + rule engine for the critical path; cite sources. |
| Reaching low-literacy / feature-phone users | Voice-first + IVR/WhatsApp, not app-only. |
| "Offline AI" isn't realistic | Redefine: cache + on-device STT + SMS/IVR fallback. |
| NDVI resolution vs tiny farms | Positioned as Phase 2 vision, not a core claim. |
| Disease detection over-promising | Framed as triage; show accuracy honestly. |
| Data/API reliability in demo | Every provider has a mock fallback (already implemented). |
