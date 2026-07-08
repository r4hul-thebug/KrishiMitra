# KrishiMitraaz — Frontend Dashboard

The KrishiMitraaz frontend is a **React + Vite** single-page application providing a professional, government-style (NIC-like) dashboard for farmers.

## Pages

| Route | Component | Description |
|---|---|---|
| `/` | `Auth.jsx` | Secure login/registration with PM Kisan / Aadhaar Official ID |
| `/dashboard` | `Dashboard.jsx` | AI Advisory overview, weather threats, voice summary |
| `/suggestions` | `Suggestions.jsx` | Location-based crop suitability recommendations |
| `/yield` | `YieldCalculator.jsx` | Financial projections (cost, revenue, MSP profit) |

## Components

| Component | Description |
|---|---|
| `Sidebar.jsx` | Collapsible navigation with farmer profile, geolocation, and logout |
| `ProfileModal.jsx` | Editable farmer profile with multi-year yield history management |
| `FloatingChat.jsx` | AI chatbot overlay for farming questions |

## Scripts

```bash
npm install          # Install dependencies
npm run dev          # Start dev server (http://localhost:5173)
npm run build        # Production build to dist/
npm run lint         # Run Oxlint (0 errors, 0 warnings)
```

## Environment Variables

Create a `.env` file (copy from `.env.example`):

```env
VITE_API_URL=http://localhost:3000/api
```

For production deployment (e.g. Vercel), set `VITE_API_URL` to your live backend URL + `/api`.

## Tech Stack

- **React 19** — UI framework
- **Vite 8** — Build tool
- **React Router 7** — Client-side routing
- **Axios** — HTTP client
- **Lucide React** — Icon library
- **Oxlint** — Linter
