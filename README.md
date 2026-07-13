# 🌱 KrishiMitraaz — Smart Crop Advisory System

> **An AI-powered, full-stack web platform providing real-time, weather-aware crop advisory and financial projections for small & marginal farmers.** Features a professional government-style dashboard, NDVI satellite analysis, multi-year yield tracking, and voice-ready summary generation.

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 🏛️ **Government Dashboard** | Professional NIC-style enterprise UI — solid theme, high contrast, accessible |
| 🌾 **AI Advisory Engine** | Weather-aware, stage-specific crop advice for **39 major Indian crops** |
| 📡 **Satellite Integration** | NDVI crop health analysis via ISRO Bhuvan API |
| 🎤 **Voice-Ready Summaries** | Structured output designed for Bhashini TTS (22 Indian languages) with smart auto-language detection |
| 💰 **Yield Calculator** | Real-time financial projections — cost, revenue, MSP profit per acre |
| 🗺️ **Precision Geolocation** | Auto-detects village/state via GPS + Nominatim reverse geocoding |
| 📱 **Mobile Responsive** | Fully fluid UI that transforms into an app-like bottom navigation on phones |
| 📊 **Multi-Year Yield History** | Track and compare harvest data across multiple seasons |
| 🤖 **Advanced AI Chatbot** | Powered by **Google Gemini**, providing highly-contextual conversational agronomy advice and multi-modal image disease diagnosis (supporting up to 50MB image payloads) |
| 🔐 **Secure Authentication** | JWT-based login with PM Kisan / Aadhaar Official ID (with auto-logout on stale session/404 handling) |
| 🌍 **Comprehensive i18n** | Full regional language support for 10 Indian languages (Hindi, Marathi, Punjabi, Gujarati, Tamil, Telugu, Bengali, Kannada, Malayalam, Odia, Assamese, English) with location-based language auto-detection and on-the-fly LLM translation. |

---

## 🚀 Quick Start

**Zero external database setup required for local demo testing.** The backend uses a PostgreSQL database natively (via `pg`), and the frontend is a blazing-fast React Vite app.

### 1. Backend API

```bash
cd krishimitraaz
npm install
npm run seed        # Seed demo farmers
npm start           # http://localhost:10000
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
│       ├── store.js           # PostgreSQL persistence layer
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
# Backend engine tests (16/16 passing - rigorously tested!)
node --test test/engine.test.js

# Frontend lint (0 errors, 0 warnings)
cd frontend && npm run lint
```

---

## 🛠️ Environment Configuration

### Frontend (`.env` in `frontend/`)
```env
VITE_API_URL=http://localhost:10000/api
```

### Backend (`.env` in root)
```env
PORT=10000
DATABASE_URL=postgresql://neondb_owner:... # Your Neon Postgres connection string
GEMINI_API_KEY=your_gemini_api_key         # Google Gemini API key for image analysis
WEATHER_PROVIDER=mock                      # or "openweather"
OPENWEATHER_API_KEY=your_key
MARKET_PROVIDER=mock                       # or "agmarknet"
DATAGOV_API_KEY=your_key
```

All providers have mock fallbacks (except Gemini which requires an API key for image features).

---

## 🌍 Deployment

KrishiMitraaz is optimized for seamless deployment across modern cloud platforms.

### Backend (Render / Heroku)
1. Push your code to GitHub.
2. Create a new Web Service on Render and link your repository.
3. In Render, create a free **PostgreSQL Database** and copy the internal or external Connection String.
3. Set the Root Directory to the base folder (or leave blank).
4. Build Command: `npm install`
5. Start Command: `node --env-file=.env src/server.js` (or add `DATABASE_URL` in Render Environment variables and run `node src/server.js`)
6. Add your environment variables (`DATABASE_URL`, `WEATHER_PROVIDER`, etc.).
7. Once deployed, copy the backend URL (e.g., `https://krishimitra-backend.onrender.com`).

### Frontend (Vercel / Netlify)
1. Go to Vercel and import your GitHub repository.
2. Set the **Framework Preset** to `Vite`.
3. Set the **Root Directory** to `frontend`.
4. In Environment Variables, add `VITE_API_URL` and set it to your Render backend URL (e.g., `https://krishimitra-backend.onrender.com/api`).
5. Click **Deploy**. 

*Note: If you update `VITE_API_URL` after deployment, you must manually trigger a Redeploy in the Vercel dashboard for the changes to take effect.*

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite 8, React Router 7 |
| Backend | Node.js, Express 4 (`express-async-errors`), PostgreSQL (pg) |
| Auth | JWT (jsonwebtoken + bcryptjs) |
| Icons | Lucide React |
| Linting | Oxlint |
| Testing | Node.js built-in test runner |

---

## 🗺️ Roadmap

| Phase | Status | Scope |
|---|---|---|
| **Phase 1** | ✅ Complete | Full-stack dashboard, JWT auth, advisory engine, yield calculator, crop suitability, voice summaries |
| **Phase 2** | ✅ Complete | LLM chatbot fully integrated with Gemini 1.5 Flash for text, multi-modal disease detection, and dynamic backend advisory translation |
| **Phase 3** | ✅ Complete | Dynamic layout adaptability and robust UI multi-lingual localization across 10+ regional Indian languages (i18n context layer) |
| **Phase 4** | 🔜 Next | Bhashini STT/TTS integration, real-time Mandi prices, scheme recommendations |
| **Phase 5** | 📋 Planned | Offline-first caching, IVR/WhatsApp channels, feature phone support |

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.
