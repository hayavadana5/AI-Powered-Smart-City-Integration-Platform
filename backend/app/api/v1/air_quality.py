from fastapi import APIRouter, HTTPException
from datetime import datetime, timedelta
import random
from app.models.air_quality import AQIReading, AQISummary, AQIHistoricalResponse
from typing import List

router = APIRouter()

# In-memory mock zones
ZONES = ["Zone 1 (Downtown)", "Zone 2 (Industrial)", "Zone 3 (Residential)", "Zone 4 (Suburbs)", "Zone 5 (Commercial)"]

def generate_mock_reading(zone: str, dt: datetime) -> AQIReading:
    # Set seed or range based on zone characteristics
    if "Industrial" in zone:
        aqi = random.randint(80, 160)
        pm25 = round(aqi * 0.25 + random.uniform(5, 15), 1)
        pm10 = round(aqi * 0.5 + random.uniform(10, 30), 1)
        co2 = random.randint(480, 650)
    elif "Suburbs" in zone:
        aqi = random.randint(20, 50)
        pm25 = round(aqi * 0.2 + random.uniform(1, 5), 1)
        pm10 = round(aqi * 0.4 + random.uniform(2, 8), 1)
        co2 = random.randint(390, 420)
    else:
        aqi = random.randint(40, 95)
        pm25 = round(aqi * 0.22 + random.uniform(3, 10), 1)
        pm10 = round(aqi * 0.45 + random.uniform(5, 15), 1)
        co2 = random.randint(410, 480)
        
    return AQIReading(
        zone_id=zone,
        aqi=aqi,
        pm25=pm25,
        pm10=pm10,
        no2=round(random.uniform(10, 45), 1),
        co2=co2,
        o3=round(random.uniform(5, 30), 1),
        timestamp=dt
    )

@router.get("/latest", response_model=List[AQIReading])
def get_latest_aqi():
    now = datetime.now()
    return [generate_mock_reading(zone, now) for zone in ZONES]

@router.get("/historical/{zone_id}", response_model=AQIHistoricalResponse)
def get_historical_aqi(zone_id: str):
    if zone_id not in ZONES:
        raise HTTPException(status_code=404, detail="Zone not found")
        
    readings = []
    now = datetime.now()
    # Generate hourly readings for last 12 hours
    for i in range(12, 0, -1):
        dt = now - timedelta(hours=i)
        readings.append(generate_mock_reading(zone_id, dt))
        
    return AQIHistoricalResponse(zone_id=zone_id, readings=readings)

@router.get("/summary", response_model=AQISummary)
def get_aqi_summary():
    latest_readings = [generate_mock_reading(zone, datetime.now()) for zone in ZONES]
    aqis = [r.aqi for r in latest_readings]
    avg_aqi = sum(aqis) / len(aqis)
    
    if avg_aqi <= 50:
        status = "Good"
    elif avg_aqi <= 100:
        status = "Moderate"
    else:
        status = "Unhealthy for Sensitive Groups"
        
    return AQISummary(
        average_aqi=round(avg_aqi, 1),
        max_aqi=max(aqis),
        min_aqi=min(aqis),
        status=status,
        zones_monitored=len(ZONES)
    )
