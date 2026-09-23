# KrishiMitraaz — Frontend Dashboard

The KrishiMitraaz frontend is a **React 19 + Vite** high-performance single-page application providing a professional, national digital portal (NIC-style enterprise UI) designed for Indian small and marginal farmers.

## 🧭 Pages & Routes

| Route | Component | Description |
|---|---|---|
| `/login` | `Auth.jsx` | Secure login/registration with PM Kisan / Aadhaar Official ID & credentials |
| `/dashboard` | `Dashboard.jsx` | AI Advisory overview, weather threats, voice TTS summary, and interactive tabs |
| `/mandi` | `MandiPrices.jsx` | Real-time APMC auction rates, MSP benchmark comparisons & mandi trends |
| `/satellite` | `SatelliteView.jsx` | Sentinel-2 & ISRO Bhuvan NDVI canopy health, moisture & biomass indices |
| `/rotation` | `CropRotation.jsx` | Scientific 3-season crop sequencing (Kharif → Rabi → Zaid) for nitrogen fixing |
| `/disease` | `CropDoctor.jsx` | Leaf pathogen diagnostics, CPCB-approved bio-controls & NPK dose calculator |
| `/calculator` | `YieldCalculator.jsx` | Farm profitability, input costs, MSP revenue projections & net profit estimator |
| `/schemes` | `GovtSchemes.jsx` | Central & state DBT welfare schemes (PM-KISAN, PMFBY, PM-KUSUM, KCC) |
| `/suggestions` | `Suggestions.jsx` | Agro-climatic crop suitability recommendations based on local coordinates |
| `/soil` | `SoilHealthCard.jsx` | Digital Soil Health Card analyzer with 12 parameter tests & organic recommendations |
| `/helpline` | `KisanHelpline.jsx` | 24x7 Kisan Call Centre (1551), PMFBY 72-hour crop loss hotline & disaster relief SOPs |

## 🧩 Key Components

| Component | Description |
|---|---|
| `Sidebar.jsx` | Collapsible national portal navigation with farmer profile, GPS coordinates, and quick links |
| `GovtHeader.jsx` | Official Government of India bilingual portal header with emergency ticker and language selector |
| `GovtFooter.jsx` | National portal footer with helpline numbers, ICAR/NDMA disclaimers, and accessibility links |
| `RouteController.jsx` | Unified route guard preventing unauthorized access and recursive redirect loops |
| `PageSkeleton.jsx` | Zero Cumulative Layout Shift (CLS) suspense skeleton for instant page transitions |
| `FloatingChat.jsx` | Google Gemini AI conversational agronomy assistant with multi-modal leaf image diagnosis |

## 🛠️ Scripts

```bash
npm install          # Install dependencies
npm run dev          # Start development server (http://localhost:5173)
npm run build        # Production build to dist/
npm run lint         # Run Oxlint validation
```

## ⚙️ Environment Variables

Create a `.env` file (refer to `.env.example` in project root):

```env
VITE_API_URL=/api
```

For split deployment (e.g. Vercel frontend + Render/Cloud Run backend), set `VITE_API_URL` to your live API base URL (e.g. `https://your-api-domain.com/api`).

## 🏗️ Tech Stack

- **React 19** — Component architecture & Concurrent Mode
- **Vite 8** — Next-generation build tool with Rollup code-splitting
- **React Router 7** — Client-side SPA routing with lazy dynamic chunking
- **Axios** — Robust API communication
- **Lucide React** — Standardized iconography
- **Oxlint** — High-speed code quality linter

