# SensoryPath 🧭

> A personalised, sensory-aware itinerary app for neurodivergent commuters in Melbourne CBD.  
> FIT5120 TE08 — Monash University

---

## Tech Stack

| Layer        | Technology                          |
|-------------|-------------------------------------|
| Frontend    | Vue 3 + Vite                        |
| Routing     | Vue Router 4                        |
| State       | Pinia                               |
| Map         | Leaflet + @vue-leaflet/vue-leaflet  |
| HTTP Client | Axios                               |
| Deployment  | Cloudflare Pages (2 environments)   |
| CI/CD       | GitHub Actions                      |

---

## Project Structure

```
src/
├── api/             # API interface layer (pedestrian, landmarks, routes, user)
├── components/
│   ├── common/      # NavBar, Footer, CrowdBadge
│   ├── map/         # MapContainer, SensorMarker
│   ├── route/       # RouteCard, SensoryIndicator
│   └── refuge/      # RefugeCard
├── router/          # Vue Router config
├── stores/          # Pinia stores (pedestrian, route, landmark, user)
├── utils/           # Crowd calculator, sensory score helpers
└── views/           # HomeView, MapView, RouteView, RefugesView, ProfileView
```

---

## Pages & Features

| Page          | Route       | Feature                                           |
|--------------|-------------|---------------------------------------------------|
| Home         | `/`         | Destination search + live crowd overview          |
| Live Map     | `/map`      | Real-time crowd density on Leaflet map            |
| Plan Route   | `/route`    | Sensory-friendly route planner (US 1.1–1.3)       |
| Quiet Spaces | `/refuges`  | Nearby parks, libraries, calm refuges (US 2.1)    |
| My Profile   | `/profile`  | Sensory preference configuration                  |

---

## API Endpoints (backend contract)

### Pedestrian
| Method | Path                                | Description              |
|--------|-------------------------------------|--------------------------|
| GET    | `/pedestrian/sensors`               | All sensor locations     |
| GET    | `/pedestrian/counts/minute`         | Live per-minute counts   |
| GET    | `/pedestrian/counts/hour`           | Hourly counts            |
| GET    | `/pedestrian/sensors/:id/history`   | Historical data          |
| GET    | `/pedestrian/crowd-level`           | Area crowd score         |
| GET    | `/pedestrian/forecast`              | 1-hour crowd forecast    |

### Landmarks
| Method | Path                          | Description              |
|--------|-------------------------------|--------------------------|
| GET    | `/landmarks`                  | All landmarks            |
| GET    | `/landmarks/refuges/nearby`   | Nearby quiet spaces      |
| GET    | `/landmarks/:id`              | Landmark detail          |
| GET    | `/landmarks/types`            | Type filter list         |

### Routes
| Method | Path                    | Description              |
|--------|-------------------------|--------------------------|
| POST   | `/routes/pedestrian`    | Plan sensory route       |
| GET    | `/routes/:id/crowd`     | Route crowd overlay      |
| POST   | `/routes/alternative`   | Reroute on crowd spike   |
| GET    | `/routes/geocode`       | Address → coordinates    |

### Users
| Method | Path                        | Description          |
|--------|-----------------------------|----------------------|
| POST   | `/users/register`           | Register             |
| POST   | `/users/login`              | Login → JWT          |
| GET    | `/users/me`                 | Get profile          |
| PUT    | `/users/me/preferences`     | Update sensory prefs |
| GET    | `/users/me/history`         | Route history        |
| POST   | `/users/me/saved-refuges`   | Save a refuge        |

---

## Local Development

```bash
cp .env.example .env.local
# Edit .env.local with your API URL

npm install
npm run dev        # http://localhost:5173
```

---

## Cloudflare Pages Deployment

Two separate Cloudflare Pages projects are used:

| Environment | CF Project Name       | Branch    | Domain                          |
|-------------|----------------------|-----------|---------------------------------|
| Production  | `sensorypath`        | `main`    | `sensorypath.pages.dev`         |
| Staging     | `sensorypath-staging`| `staging` | `sensorypath-staging.pages.dev` |

### GitHub Secrets Required

| Secret                      | Description                      |
|-----------------------------|----------------------------------|
| `CLOUDFLARE_API_TOKEN`      | Cloudflare API token (Pages edit)|
| `CLOUDFLARE_ACCOUNT_ID`     | Your Cloudflare account ID       |
| `VITE_API_BASE_URL_PROD`    | Production backend API URL       |
| `VITE_API_BASE_URL_STAGING` | Staging backend API URL          |

### Setup Steps

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com) → **Pages** → **Create a project**
2. Connect your GitHub repository
3. Create **two projects**: `sensorypath` (main branch) and `sensorypath-staging` (staging branch)
4. Build settings: Command = `npm run build`, Output = `dist`
5. Add GitHub Secrets in your repo → Settings → Secrets → Actions
6. Push to `main` or `staging` to trigger automatic deploy

---

## Data Sources

- [Pedestrian Counting System – Sensor Locations](https://data.melbourne.vic.gov.au)
- [Pedestrian Counting System – Past Hour (per minute)](https://data.melbourne.vic.gov.au)
- [Pedestrian Counting System – Past Hour (per hour)](https://data.melbourne.vic.gov.au)
- [Landmarks and Places of Interest](https://data.melbourne.vic.gov.au)
