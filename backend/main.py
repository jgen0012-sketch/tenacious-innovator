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
    version="0.3.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MELB_VIEWBOX = "144.94,-37.82,144.98,-37.80"

# City of Melbourne open data - per-minute pedestrian counts (past hour)
COM_MINUTE_URL = (
    "https://data.melbourne.vic.gov.au/api/explore/v2.1/catalog/datasets/"
    "pedestrian-counting-system-past-hour-counts-per-minute/records"
)

# Fallback data used if the open data API is unavailable
FALLBACK_COUNTS = [
    {"locationId": 39, "count": 5},
    {"locationId": 40, "count": 8},
    {"locationId": 1, "count": 20},
    {"locationId": 2, "count": 45},
]


def count_to_level(count: int) -> str:
    """Map a pedestrian count into a sensory/crowd level."""
    if count < 30:
        return "low"
    if count <= 70:
        return "moderate"
    return "high"


async def fetch_live_counts():
    """
    Fetch the latest per-minute pedestrian count for each sensor from the
    City of Melbourne open data API. Returns a list of
    { locationId, count, level, timestamp }.
    Falls back to sample data if the API is unavailable.
    """
    params = {"limit": 100, "order_by": "sensing_datetime DESC"}
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.get(COM_MINUTE_URL, params=params)
        resp.raise_for_status()
        records = resp.json().get("results", [])
    except Exception:
        # API failed - degrade gracefully with fallback data
        now = datetime.now(timezone.utc).isoformat()
        return {
            "source": "fallback",
            "data": [
                {
                    "locationId": r["locationId"],
                    "count": r["count"],
                    "level": count_to_level(r["count"]),
                    "timestamp": now,
                }
                for r in FALLBACK_COUNTS
            ],
        }

    # Keep only the most recent record per location_id
    latest = {}
    for rec in records:
        loc = rec.get("location_id")
        if loc is None:
            continue
        if loc not in latest:  # records are DESC, so first seen = newest
            latest[loc] = rec

    data = [
        {
            "locationId": loc,
            "count": rec.get("total_of_directions", 0),
            "level": count_to_level(rec.get("total_of_directions", 0)),
            "timestamp": rec.get("sensing_datetime"),
        }
        for loc, rec in latest.items()
    ]
    return {"source": "live", "data": data}


@app.get("/")
def health_check():
    """Health check so we can confirm the service is running."""
    return {"status": "ok", "service": "SensoryPath API", "version": "0.3.0"}


@app.get("/routes/geocode")
async def geocode(address: str = Query(..., min_length=1)):
    """Convert a text address into map coordinates (OpenStreetMap Nominatim)."""
    url = "https://nominatim.openstreetmap.org/search"
    params = {"q": address, "format": "json", "limit": 1, "viewbox": MELB_VIEWBOX, "bounded": 0}
    headers = {"User-Agent": "SensoryPath/0.3 (Monash FIT5120 student project)"}
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


@app.get("/pedestrian/counts/minute")
async def get_minute_counts():
    """
    Return the latest per-minute pedestrian count for each sensor,
    from City of Melbourne live open data, with a derived crowd level.
    """
    result = await fetch_live_counts()
    return result
