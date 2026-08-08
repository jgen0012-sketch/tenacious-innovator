"""
SensoryPath Backend - FastAPI
Provides sensory-aware routing, pedestrian data, and refuge APIs.
"""
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
import httpx

app = FastAPI(
    title="SensoryPath API",
    description="Backend for sensory-aware navigation in Melbourne CBD",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # tighten to real domains before production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Melbourne CBD rough bounding box, used to keep results local
MELB_VIEWBOX = "144.94,-37.82,144.98,-37.80"


@app.get("/")
def health_check():
    """Health check so we can confirm the service is running."""
    return {"status": "ok", "service": "SensoryPath API", "version": "0.1.0"}


@app.get("/routes/geocode")
async def geocode(address: str = Query(..., min_length=1)):
    """
    Convert a text address into map coordinates.
    Uses OpenStreetMap Nominatim (free, no API key).
    Returns { lat, lng, formattedAddress }.
    """
    url = "https://nominatim.openstreetmap.org/search"
    params = {
        "q": address,
        "format": "json",
        "limit": 1,
        "viewbox": MELB_VIEWBOX,
        "bounded": 0,
    }
    headers = {"User-Agent": "SensoryPath/0.1 (Monash FIT5120 student project)"}

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
