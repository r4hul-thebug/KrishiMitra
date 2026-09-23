# 🌱 KrishiMitraaz — Smart Crop Advisory & National Farmer Portal

> **An enterprise-grade, full-stack AI agronomy platform providing real-time, weather-aware crop advisories, satellite NDVI vegetation analysis, e-NAM market price intelligence, disease diagnostics, and financial projections for Indian farmers.** Designed according to Government of India (NIC/ICAR) digital design standards with high-contrast accessibility, regional language support (Hindi, English & 10+ languages), and voice-ready summary generation.

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Tests: 22 Passing](https://img.shields.io/badge/Tests-22%2F22%20Passing-brightgreen.svg)](#-testing)
[![Code Quality: Oxlint](https://img.shields.io/badge/Linter-Clean-blue.svg)](#-testing)
[![Runtime: Node.js 20+](https://img.shields.io/badge/Runtime-Node.js%2020%2B-forestgreen.svg)](#-quick-start)

---

## ✨ Integrated Portal Modules

| Module | Route | Description |
|---|---|---|
| 🏛️ **National Farmer Dashboard** | `/dashboard` | Directives tab, stage-wise agronomy alerts, active hazard warnings, and quick services |
| 🌾 **Real-Time Advisory Engine** | `/dashboard` | Weather-aware, GDD-calibrated crop advice across **39 major Indian crops** |
| 🏬 **e-NAM Live Mandi Prices** | `/mandi` | APMC market prices, minimum/maximum/modal modal prices, and MSP support benchmark |
| 🛰️ **ISRO Bhuvan Satellite NDVI** | `/satellite` | Sentinel-2 & Bhuvan NDVI canopy vigor, vegetation health & moisture index |
| 🔄 **Crop Rotation & Soil Rejuvenation** | `/rotation` | Kharif → Rabi → Zaid seasonal sequencing to biologically fix nitrogen & disrupt pest cycles |
| 🩺 **Crop Doctor Diagnostics Clinic** | `/disease` | Pathogen triage, CPCB-approved bio-controls, and acreage NPK split dosage calculator |
| 💰 **Yield & Profitability Calculator** | `/calculator` | Acreage input cost breakdown, market revenue projections & net profit estimator |
| 📜 **Govt DBT Schemes Directory** | `/schemes` | Central & State agricultural schemes (PM-KISAN, PMFBY, PM-KUSUM, KCC, AIF) |
| 🌍 **Agro-Climatic Suitability** | `/suggestions` | Climate-driven crop matching based on soil type, precipitation, and thermal range |
| 🧪 **Digital Soil Health Card** | `/soil` | 12-parameter soil chemical analysis, deficiency alerts & organic carbon advisories |
| 📞 **Kisan Emergency Toll-Free Desk** | `/helpline` | 24x7 Kisan Call Centre (1800-180-1551), PMFBY 72-hour crop loss hotline & NDMA SOPs |
| 🤖 **Gemini AI Agronomy Chatbot** | Overlay | Conversational advisory assistant with multi-modal leaf photo diagnosis (up to 50MB) |

---

## ⚡ Performance & Production Architecture

- **Route-Level Code Splitting**: All sub-pages and modal tools are loaded on-demand via `React.lazy()` and `Suspense`, isolating heavy dependencies to minimize First Contentful Paint (FCP).
- **Zero CLS Skeletons**: Dynamic `PageSkeleton` and `DashboardTabSkeleton` placeholders prevent Cumulative Layout Shift during data fetching and route transitions.
- **HTTP Response Compression**: Integrated `compression` middleware with automatic Brotli/Gzip encoding for static assets and API payloads above 1KB.
- **Optimized Cache Control**: Production static assets are served with 1-year immutable caching (`max-age=31536000`), while HTML shells enforce `no-cache` to ensure instantaneous rollouts.
- **Infinite Loop-Proof Routing**: Hardened route guard middleware intercepts 404s and unhandled 500 exceptions, redirecting browser navigation gracefully to `/login` without infinite recursion.

---

## 🚀 Quick Start

### Prerequisites
- **Node.js**: v20 or higher
- **npm**: v10 or higher (or **bun**)

### 1. Install & Seed
```bash
git clone https://github.com/your-username/krishimitraaz.git
cd krishimitraaz

# Install all dependencies (workspaces automatically handled)
npm install

# Seed demo farmers & agronomy knowledge base
npm run seed
```

### 2. Run Full-Stack Development Server
```bash
# Starts the unified full-stack server on port 3000
npm run dev
```
Open **http://localhost:3000** in your browser.

Or run frontend and backend independently:
```bash
# Terminal 1: Backend API
node src/server.js

# Terminal 2: Frontend Vite
cd frontend && npm run dev
```

---

## 📁 Project Structure

```
krishimitraaz/
├── frontend/                     # React 19 + Vite Frontend SPA
│   ├── src/
│   │   ├── components/           # GovtHeader, GovtFooter, Sidebar, Skeletons, Chat
│   │   ├── contexts/             # LanguageContext (bilingual i18n layer)
│   │   ├── pages/                # 11 Portal modules (Dashboard, Mandi, Doctor, etc.)
│   │   ├── App.jsx               # Route definitions & Suspense boundaries
│   │   └── main.jsx              # React DOM entry point
│   ├── index.html                # High-contrast accessible HTML shell with SEO meta
│   ├── package.json              # Frontend dependencies (React 19, Lucide, Axios)
│   └── vite.config.js            # Rollup chunking & build optimization
├── src/                          # Express Backend & Agronomy Engine
│   ├── db/
│   │   ├── store.js              # Persistence store (PostgreSQL + in-memory fallback)
│   │   └── seed.js               # Demo farmers, mandi benchmarks & soil records
│   ├── engine/
│   │   ├── advisory.js           # Core weather-aware advisory algorithm & toSpeech()
│   │   ├── disease.js            # Pathogen & bio-control rules
│   │   ├── rotation.js           # Multi-season crop diversification planner
│   │   └── suitability.js        # Agro-climatic matching engine
│   ├── knowledge/
│   │   ├── crops.js              # 39 Indian crops knowledge base
│   │   └── crop_details.js       # Agronomy parameters, MSP values, water demand
│   ├── middleware/
│   │   └── unifiedRouteHandler.js# 404 & 500 guard with recursion prevention
│   ├── routes/
│   │   ├── auth.js               # JWT login & registration
│   │   ├── chat.js               # Google Gemini generative advisory endpoint
│   │   ├── farmers.js            # Farmer CRUD, advisory generation & threats
│   │   └── reference.js          # Mandi, soil, disease & schemes reference APIs
│   ├── services/
│   │   ├── market.js             # e-NAM / Agmarknet APMC market rates
│   │   ├── satellite.js          # ISRO Bhuvan & Sentinel NDVI simulation
│   │   └── weather.js            # 5-day agro-meteorological forecasting
│   ├── config.js                 # Environment variables loader
│   └── server.js                 # Express server configuration & compression
├── test/
│   ├── engine.test.js            # Agronomy engine unit tests (16 tests)
│   └── route-middleware.test.js  # Redirect & error fallback tests (6 tests)
├── server.ts                     # Cloud Run / container runner entrypoint
├── metadata.json                 # AI Studio deployment metadata
├── package.json                  # Root orchestration & scripts
├── README.md                     # Documentation
└── .env.example                  # Environment configuration template
```

---

## 🧪 Testing & Verification

The test suite includes 22 automated unit and integration tests verifying agronomic calculation accuracy, stage classification, weather stress detection, and unified routing fallback behavior:

```bash
# Run all automated tests
npm test

# Build production bundles
npm run build

# Run Oxlint validation
npm run lint
```

---

## 🛠️ Environment Variables

Copy `.env.example` to `.env` in the root folder:

```env
PORT=3000
DATABASE_URL=postgresql://user:password@host:5432/dbname   # Optional: defaults to in-memory fallback
GEMINI_API_KEY=your_gemini_api_key                         # Required for multimodal leaf photo chat
WEATHER_PROVIDER=mock                                      # or "openweather"
OPENWEATHER_API_KEY=your_key
MARKET_PROVIDER=mock                                       # or "agmarknet"
DATAGOV_API_KEY=your_key
```

---

## 🌐 Production Deployment

### Option 1: Docker / Cloud Run / Single Container (Recommended)
KrishiMitraaz is structured to build and serve the client and API from a single container:

```bash
# Build production frontend
npm run build

# Start production server
npm start
```
The server automatically detects `./frontend/dist`, serves static hashed assets with optimal caching, and routes API endpoints seamlessly under `/api`.

### Option 2: Split Deployment (Vercel Frontend + Render/Railway API)
1. **Frontend**: Deploy `./frontend` to Vercel. Set `VITE_API_URL` to `https://your-api.onrender.com/api`.
2. **Backend**: Deploy root repository to Render or Railway. Set Start Command to `npm start`. Set `PORT` and `DATABASE_URL`.

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

