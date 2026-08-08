# SensoryPath 🧭

> A personalised, sensory-aware itinerary app for neurodivergent commuters in Melbourne CBD.  
> FIT5120 TE08 — Monash University

---

## Getting Started (Local Development)

### Prerequisites

Make sure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) **v18 or above** (v20 recommended)
- npm (comes with Node.js)
- Git

Run the following commands to check your versions:

```bash
node -v       # should show v18.x.x or above
npm -v        # should show 9.x.x or above
git --version
```

---

### Step 1: Clone the Repository

```bash
git clone -b Geng https://github.com/jgen0012-sketch/tenacious-innovator.git
cd tenacious-innovator
```

---

### Step 2: Install Dependencies

```bash
npm install
```

> This will generate the `node_modules` folder automatically. It takes about 15–30 seconds.

---

### Step 3: Set Up Environment Variables (Required)

The project uses mock data so it works without a backend. You need to create a `.env.local` file in the **project root** (same level as `package.json`).

**Option A — Create the file manually**

Create a new file called `.env.local` and paste the following:

```
VITE_USE_MOCK=true
VITE_API_BASE_URL=http://localhost:8080
```

**Option B — Create via terminal (Mac/Linux)**

```bash
echo "VITE_USE_MOCK=true" > .env.local
echo "VITE_API_BASE_URL=http://localhost:8080" >> .env.local
```

**Option B — Create via terminal (Windows PowerShell)**

```powershell
"VITE_USE_MOCK=true`nVITE_API_BASE_URL=http://localhost:8080" | Out-File -FilePath .env.local -Encoding utf8
```

> ⚠️ Note: `.env.local` is listed in `.gitignore` and will never be committed to Git. Every team member needs to create this file locally after cloning.

---

### Step 4: Start the Development Server

```bash
npm run dev
```

Once started, you should see:

```
VITE v8.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
```

Open your browser and go to **http://localhost:5173**.

---

### Troubleshooting

**Map not showing / blank page?**  
Check that `.env.local` exists in the project root and contains `VITE_USE_MOCK=true`.

**`npm install` fails?**  
Delete the `node_modules` folder and `package-lock.json`, then run `npm install` again.

**Port 5173 already in use?**  
Vite automatically switches to 5174, 5175, etc. Check the terminal output for the actual URL.

---

## Pages & Features

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Google Maps-style full-screen map with 8 live crowd sensors (🟢🟡🔴) |
| Live Map | `/map` | Full-screen Leaflet map with sensor status sidebar |
| Plan Route | `/route` | Enter origin and destination, get 3 routes ranked by sensory intensity |
| Quiet Spaces | `/refuges` | Nearby parks, libraries, cafes and other low-sensory refuges |
| My Profile | `/profile` | Configure personal sensory thresholds, walking distance and alerts |

---

## Project Structure

```
src/
├── api/                  # API interface layer
│   ├── client.js         # Axios instance (with JWT interceptor)
│   ├── pedestrian.js     # Pedestrian counting system API
│   ├── landmarks.js      # Landmarks and places of interest API
│   ├── routes.js         # Route planning API
│   ├── user.js           # User account API
│   └── mockData.js       # Local mock data (for development)
├── components/
│   ├── common/           # NavBar, Footer, CrowdBadge
│   ├── map/              # LeafletMap reusable map component
│   ├── route/            # RouteCard, SensoryIndicator
│   └── refuge/           # RefugeCard
├── stores/               # Pinia state management
│   ├── usePedestrianStore.js
│   ├── useRouteStore.js
│   ├── useLandmarkStore.js
│   └── useUserStore.js
├── router/               # Vue Router config
├── views/                # 5 page views
│   ├── HomeView.vue
│   ├── MapView.vue
│   ├── RouteView.vue
│   ├── RefugesView.vue
│   └── ProfileView.vue
├── App.vue
└── main.js
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend Framework | Vue 3 + Vite |
| Routing | Vue Router 4 |
| State Management | Pinia |
| Map | Leaflet (CartoDB Voyager tiles — free, no API key required) |
| HTTP Client | Axios |
| Deployment | Cloudflare Pages |
| CI/CD | GitHub Actions |

---

## Backend API Reference

> When `VITE_USE_MOCK=false`, the frontend will call the real backend. Below are the endpoints the backend needs to implement.

### Pedestrian

| Method | Path | Description |
|--------|------|-------------|
| GET | `/pedestrian/sensors` | Get all sensor locations |
| GET | `/pedestrian/counts/minute` | Get live per-minute pedestrian counts (refreshed every 15 min) |
| GET | `/pedestrian/counts/hour` | Get hourly pedestrian counts |
| GET | `/pedestrian/sensors/:id/history` | Get historical data for a sensor |
| GET | `/pedestrian/crowd-level` | Get crowd score for a given area |
| GET | `/pedestrian/forecast` | Get 1-hour ahead crowd forecast |

### Landmarks

| Method | Path | Description |
|--------|------|-------------|
| GET | `/landmarks` | Get all landmarks |
| GET | `/landmarks/refuges/nearby` | Get nearby quiet spaces |
| GET | `/landmarks/:id` | Get landmark detail |
| GET | `/landmarks/types` | Get list of landmark types |

### Routes

| Method | Path | Description |
|--------|------|-------------|
| POST | `/routes/pedestrian` | Plan a sensory-friendly route |
| GET | `/routes/:id/crowd` | Get crowd data along a route |
| POST | `/routes/alternative` | Get alternative route when crowd threshold exceeded |
| GET | `/routes/geocode` | Convert address to coordinates |

### Users

| Method | Path | Description |
|--------|------|-------------|
| POST | `/users/register` | Register a new account |
| POST | `/users/login` | Login and receive JWT token |
| GET | `/users/me` | Get current user profile |
| PUT | `/users/me/preferences` | Update sensory preferences |
| GET | `/users/me/history` | Get route history |
| POST | `/users/me/saved-refuges` | Save a refuge to favourites |

---

## Cloudflare Pages Deployment

The project is deployed using two separate Cloudflare Pages environments:

| Environment | CF Project Name | GitHub Branch | URL |
|-------------|----------------|---------------|-----|
| Production | `sensorypath` | `Geng` | `sensorypath-eoc.pages.dev` |
| Staging | `sensorypath-staging` | `staging` | `sensorypath-staging.pages.dev` |

### Deployment Steps

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Go to **Workers & Pages** → **Create application** → **Pages**
3. Click **Connect to Git** → select `jgen0012-sketch/tenacious-innovator`
4. Set the branch to `Geng`
5. Fill in build settings:
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
6. Add environment variable:
   - `VITE_USE_MOCK` = `true`
7. Click **Save and Deploy**

Every push to the `Geng` branch will trigger an automatic redeploy.

---

## Data Sources

- [Pedestrian Counting System – Sensor Locations](https://data.melbourne.vic.gov.au)
- [Pedestrian Counting System – Past Hour (counts per minute)](https://data.melbourne.vic.gov.au)
- [Pedestrian Counting System – Past Hour (counts per hour)](https://data.melbourne.vic.gov.au)
- [Landmarks and Places of Interest](https://data.melbourne.vic.gov.au)
