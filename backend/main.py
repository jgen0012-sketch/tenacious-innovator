"""
SensoryPath Backend - FastAPI
Provides sensory-aware routing, pedestrian data, and refuge APIs.
"""
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timezone
import httpx

app = FastAPI(
    title="SensoryPath API",
    description="Backend for sensory-aware navigation in Melbourne CBD",
    version="0.2.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # tighten to real domains before production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MELB_VIEWBOX = "144.94,-37.82,144.98,-37.80"

# --- Melbourne CBD sensor locations (matches frontend mockData) ---
# TODO: replace with live data from the team database once available.
SENSORS = [
    {"sensorId": 1, "name": "Bourke St Mall (North)",      "lat": -37.8132, "lng": 144.9653, "status": "active"},
    {"sensorId": 2, "name": "Flinders St Station",         "lat": -37.8183, "lng": 144.9671, "status": "active"},
    {"sensorId": 3, "name": "Swanston St / Collins St",    "lat": -37.8143, "lng": 144.9669, "status": "active"},
    {"sensorId": 4, "name": "Melbourne Central",           "lat": -37.8101, "lng": 144.9631, "status": "active"},
    {"sensorId": 5, "name": "Federation Square",           "lat": -37.8179, "lng": 144.9691, "status": "active"},
    {"sensorId": 6, "name": "Queen Victoria Market",       "lat": -37.8072, "lng": 144.9568, "status": "active"},
    {"sensorId": 7, "name": "Lygon St / Carlton",          "lat": -37.7990, "lng": 144.9667, "status": "active"},
    {"sensorId": 8, "name": "Docklands / Waterfront City", "lat": -37.8145, "lng": 144.9481, "status": "active"},
]

# Sample live-ish minute counts per sensor (placeholder until DB is connected)
SAMPLE_COUNTS = {1: 72, 2: 95, 3: 18, 4: 41, 5: 63, 6: 12, 7: 8, 8: 29}


def count_to_level(count: int) -> str:
    """Map a pedestrian count into a sensory/crowd level."""
    if count < 30:
        return "low"
    if count <= 70:
        return "moderate"
    return "high"


@app.get("/")
def health_check():
    """Health check so we can confirm the service is running."""
    return {"status": "ok", "service": "SensoryPath API", "version": "0.2.0"}


@app.get("/routes/geocode")
async def geocode(address: str = Query(..., min_length=1)):
    """Convert a text address into map coordinates (OpenStreetMap Nominatim)."""
    url = "https://nominatim.openstreetmap.org/search"
    params = {"q": address, "format": "json", "limit": 1, "viewbox": MELB_VIEWBOX, "bounded": 0}
    headers = {"User-Agent": "SensoryPath/0.2 (Monash FIT5120 student project)"}

    async with httpx.AsyncClient(timeout=10) as client:
        resp = await client.get(url, params=params, headers=headers)

    if resp.status_code != 200:
        raise HTTPException(status_code=502, detail="Geocoding service error")
    results = resp.json()
    if not results:
        raise HTTPException(status_code=404, detail="Address not found")

    top = results[0]
    return {
        "lat": float(top["lat"]),
        "lng": float(top["lon"]),
        "formattedAddress": top.get("display_name", address),
    }


@app.get("/pedestrian/sensors")
def get_sensors():
    """Return all pedestrian sensor locations in the Melbourne CBD."""
    return SENSORS


@app.get("/pedestrian/counts/minute")
def get_minute_counts():
    """
    Return the latest per-minute pedestrian count for each sensor,
    with a derived crowd level (low / moderate / high).
    """
    now = datetime.now(timezone.utc).isoformat()
    return [
        {
            "sensorId": s["sensorId"],
            "name": s["name"],
            "timestamp": now,
            "count": SAMPLE_COUNTS.get(s["sensorId"], 0),
            "level": count_to_level(SAMPLE_COUNTS.get(s["sensorId"], 0)),
        }
        for s in SENSORS
    ]
