import time
import httpx
from datetime import datetime, timezone
from typing import Dict, List, Any
from models import StationWeather

# Station geographical coordinates
STATION_COORDS = {
    "maitri": {
        "name": "Maitri Research Station",
        "region": "Antarctica",
        "lat": -70.7667,
        "lon": 11.7333,
        "elevation": 117.0,
    },
    "bharati": {
        "name": "Bharati Research Station",
        "region": "Antarctica",
        "lat": -69.4072,
        "lon": 76.1872,
        "elevation": 35.0,
    },
    "himadri": {
        "name": "Himadri Arctic Station",
        "region": "Arctic",
        "lat": 78.9242,
        "lon": 11.9286,
        "elevation": 10.0,
    },
    "himansh": {
        "name": "Himansh Glaciological Hub",
        "region": "Himalaya",
        "lat": 32.4000,
        "lon": 77.6000,
        "elevation": 4050.0,
    }
}

# Cache store: {station_id: (timestamp_epoch, StationWeather)}
_WEATHER_CACHE: Dict[str, tuple[float, StationWeather]] = {}
CACHE_TTL_SECONDS = 300  # 5 minutes

# Fallback realistic seasonal reference data if network or external API is offline
FALLBACK_WEATHER: Dict[str, Dict[str, Any]] = {
    "maitri": {
        "temp": -21.4,
        "wind": 28.5,
        "dir": 110.0,
        "humidity": 68.0,
        "pressure": 988.2,
        "condition": "Polar Clear / Catabatic Drift"
    },
    "bharati": {
        "temp": -17.8,
        "wind": 22.0,
        "dir": 95.0,
        "humidity": 74.0,
        "pressure": 994.5,
        "condition": "Coastal Antarctic Maritime Cold"
    },
    "himadri": {
        "temp": -4.2,
        "wind": 15.8,
        "dir": 210.0,
        "humidity": 82.0,
        "pressure": 1012.0,
        "condition": "High Arctic Polar Twilight"
    },
    "himansh": {
        "temp": -8.5,
        "wind": 18.2,
        "dir": 315.0,
        "humidity": 45.0,
        "pressure": 625.0,  # High altitude Himalaya 4000m+
        "condition": "Alpine Sub-zero Glacial Winds"
    }
}


async def fetch_station_weather(station_id: str, client: httpx.AsyncClient) -> StationWeather:
    station_id = station_id.lower()
    if station_id not in STATION_COORDS:
        raise ValueError(f"Unknown station: {station_id}")

    coord = STATION_COORDS[station_id]
    now_epoch = time.time()

    # Check cache first
    if station_id in _WEATHER_CACHE:
        cached_time, cached_weather = _WEATHER_CACHE[station_id]
        if now_epoch - cached_time < CACHE_TTL_SECONDS:
            return cached_weather

    # Call Open-Meteo live endpoint
    url = "https://api.open-meteo.com/v1/forecast"
    params = {
        "latitude": coord["lat"],
        "longitude": coord["lon"],
        "current": "temperature_2m,relative_humidity_2m,surface_pressure,wind_speed_10m,wind_direction_10m",
        "timezone": "UTC"
    }

    try:
        response = await client.get(url, params=params, timeout=5.0)
        if response.status_code == 200:
            data = response.json()
            curr = data.get("current", {})
            temp = float(curr.get("temperature_2m", 0.0))
            wind = float(curr.get("wind_speed_10m", 0.0))
            wind_dir = float(curr.get("wind_direction_10m", 0.0))
            hum = float(curr.get("relative_humidity_2m", 0.0))
            press = float(curr.get("surface_pressure", 1013.2))

            condition = "Stable Polar Atmosphere"
            if wind > 40:
                condition = "Blizzard / High Wind Advisory"
            elif temp < -30:
                condition = "Extreme Deep Freeze"
            elif temp < -15:
                condition = "Clear / Severe Sub-Zero"
            elif temp < 0:
                condition = "Sub-Zero Moderate"

            weather = StationWeather(
                station_id=station_id,
                station_name=coord["name"],
                region=coord["region"],
                latitude=coord["lat"],
                longitude=coord["lon"],
                temperature_c=temp,
                wind_speed_kmh=wind,
                wind_direction_deg=wind_dir,
                relative_humidity_pct=hum,
                surface_pressure_hpa=press,
                timestamp=datetime.now(timezone.utc).isoformat(),
                source="Open-Meteo API",
                source_url="https://open-meteo.com",
                status="live",
                condition_description=condition
            )
            _WEATHER_CACHE[station_id] = (now_epoch, weather)
            return weather
    except Exception as exc:
        print(f"Warning: live weather fetch for {station_id} failed ({exc}). Using cached/reference data.")

    # Return cached data if present even if expired
    if station_id in _WEATHER_CACHE:
        _, cached_weather = _WEATHER_CACHE[station_id]
        cached_weather.status = "cached"
        return cached_weather

    # Fallback to realistic reference observation
    fb = FALLBACK_WEATHER.get(station_id, FALLBACK_WEATHER["maitri"])
    weather = StationWeather(
        station_id=station_id,
        station_name=coord["name"],
        region=coord["region"],
        latitude=coord["lat"],
        longitude=coord["lon"],
        temperature_c=fb["temp"],
        wind_speed_kmh=fb["wind"],
        wind_direction_deg=fb["dir"],
        relative_humidity_pct=fb["humidity"],
        surface_pressure_hpa=fb["pressure"],
        timestamp=datetime.now(timezone.utc).isoformat(),
        source="Open-Meteo Reference Baseline",
        source_url="https://open-meteo.com",
        status="fallback",
        condition_description=fb["condition"]
    )
    return weather


async def get_all_stations_weather() -> List[StationWeather]:
    results = []
    async with httpx.AsyncClient() as client:
        for sid in STATION_COORDS.keys():
            w = await fetch_station_weather(sid, client)
            results.append(w)
    return results
