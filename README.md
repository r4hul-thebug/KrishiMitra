# 🌱 KrishiMitraaz — Smart Crop Advisory System (SIH25010)

> **An AI-powered, voice-first Smart Crop Advisory System built for small and marginal farmers.** Features a real-time weather-aware advisory engine, NDVI satellite analysis, multi-year yield tracking, and a professional government-style dashboard.

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 🏛️ **Government Dashboard** | Professional NIC-style enterprise UI — solid theme, high contrast, accessible |
| 🌾 **AI Advisory Engine** | Weather-aware, stage-specific crop advice with explainable reasoning (`basis` field) |
| 📡 **Satellite Integration** | NDVI crop health analysis via ISRO Bhuvan API |
| 🎤 **Voice-Ready Summaries** | Structured output designed for Bhashini TTS (22 Indian languages) |
| 💰 **Yield Calculator** | Real-time financial projections — cost, revenue, MSP profit per acre |
| 🗺️ **Precision Geolocation** | Auto-detects village/state via GPS + Nominatim reverse geocoding |
| 📊 **Multi-Year Yield History** | Track and compare harvest data across multiple seasons |
| 🤖 **AI Chatbot** | Grounded agricultural assistant for farming questions |
| 🔐 **Secure Authentication** | JWT-based login with PM Kisan / Aadhaar Official ID |

---

## 🚀 Quick Start

**Zero external database setup required.** The backend uses a lightweight JSON store, and the frontend is a blazing-fast React Vite app.

### 1. Backend API

```bash
cd krishimitraaz
npm install
npm run seed        # Seed demo farmers
npm start           # http://localhost:3000
```

### 2. Frontend Dashboard

```bash
cd krishimitraaz/frontend
npm install
npm run dev         # http://localhost:5173
```

Log in with any seeded Official ID, or register a new farmer account.

---

## 📁 Project Structure

```
krishimitraaz/
├── src/
│   ├── server.js              # Express API entry point
│   ├── config.js              # Environment configuration
│   ├── routes/
│   │   ├── auth.js            # JWT registration & login
│   │   ├── farmers.js         # Farmer CRUD, advisory, threats
│   │   ├── chat.js            # AI chatbot endpoint
│   │   └── reference.js       # Crop data reference API
│   ├── engine/
│   │   ├── advisory.js        # Core advisory engine + toSpeech()
│   │   ├── suitability.js     # Climate-based crop recommendations
│   │   ├── disease.js         # Disease detection logic
│   │   └── rotation.js        # Crop rotation calendar
│   ├── knowledge/
│   │   ├── crops.js           # Crop knowledge base
│   │   └── crop_details.js    # Detailed crop economics (MSP, costs)
│   ├── services/
│   │   ├── weather.js         # Weather provider (mock / OpenWeather)
│   │   ├── satellite.js       # NDVI satellite data (mock / Bhuvan)
│   │   └── market.js          # Market price provider (mock / Agmarknet)
│   └── db/
│       ├── store.js           # JSON file-based data store
│       └── seed.js            # Demo data seeder
├── frontend/
│   ├── src/
│   │   ├── App.jsx            # Router & layout
│   │   ├── pages/             # Auth, Dashboard, Suggestions, YieldCalculator
│   │   ├── components/        # Sidebar, ProfileModal, FloatingChat
│   │   ├── config.js          # API URL configuration
│   │   └── index.css          # Design system (CSS variables, theme)
│   └── ...
├── test/
│   └── engine.test.js         # 6 unit tests for advisory engine
├── README.md
├── ROADMAP.md
└── .env.example
```

---

## 🧪 Testing

```bash
# Backend engine tests (6/6 passing)
node --test test/engine.test.js

# Frontend lint (0 errors, 0 warnings)
cd frontend && npm run lint
```

---

## 🛠️ Environment Configuration

### Frontend (`.env` in `frontend/`)
```env
VITE_API_URL=http://localhost:3000/api
```

### Backend (`.env` in root)
```env
PORT=3000
WEATHER_PROVIDER=mock          # or "openweather"
OPENWEATHER_API_KEY=your_key
MARKET_PROVIDER=mock           # or "agmarknet"
DATAGOV_API_KEY=your_key
```

All providers have mock fallbacks — **no API keys needed to run locally**.

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite 8, React Router 7 |
| Backend | Node.js, Express 4 |
| Auth | JWT (jsonwebtoken + bcryptjs) |
| Icons | Lucide React |
| Linting | Oxlint |
| Testing | Node.js built-in test runner |

---

## 🗺️ Roadmap

| Phase | Status | Scope |
|---|---|---|
| **Phase 1** | ✅ Complete | Full-stack dashboard, JWT auth, advisory engine, yield calculator, crop suitability, voice summaries |
| **Phase 2** | 🔜 Next | Bhashini STT/TTS integration, LLM chatbot grounded on engine output |
| **Phase 3** | 📋 Planned | Disease detection CNN, real-time Mandi prices, scheme recommendations |
| **Phase 4** | 📋 Planned | Offline-first caching, IVR/WhatsApp channels, feature phone support |

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.
