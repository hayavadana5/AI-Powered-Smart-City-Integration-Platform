from fastapi import APIRouter
from datetime import datetime, timedelta
import random
from app.models.traffic import TrafficReading, TrafficSummary
from typing import List

router = APIRouter()

ZONES = ["Zone 1 (Downtown)", "Zone 2 (Industrial)", "Zone 3 (Residential)", "Zone 4 (Suburbs)", "Zone 5 (Commercial)"]

def generate_mock_reading(zone: str, dt: datetime) -> TrafficReading:
    if "Downtown" in zone:
        avg_speed = round(random.uniform(15, 28), 1)
        congestion = random.randint(65, 88)
        signals = 24
    elif "Industrial" in zone:
        avg_speed = round(random.uniform(35, 55), 1)
        congestion = random.randint(30, 50)
        signals = 12
    else:
        avg_speed = round(random.uniform(30, 48), 1)
        congestion = random.randint(20, 55)
        signals = 18

    return TrafficReading(
        zone_id=zone,
        avg_speed_kmh=avg_speed,
        congestion_index=congestion,
        active_signals=signals,
        smart_signals=int(signals * 0.8),
        timestamp=dt
    )

@router.get("/latest", response_model=List[TrafficReading])
def get_latest_traffic():
    now = datetime.now()
    return [generate_mock_reading(zone, now) for zone in ZONES]

@router.get("/summary", response_model=TrafficSummary)
def get_traffic_summary():
    readings = [generate_mock_reading(zone, datetime.now()) for zone in ZONES]
    avg_speed = sum(r.avg_speed_kmh for r in readings) / len(readings)
    max_congest = max(readings, key=lambda r: r.congestion_index)
    
    return TrafficSummary(
        citywide_avg_speed=round(avg_speed, 1),
        peak_congestion_zone=max_congest.zone_id,
        active_incidents=random.randint(0, 3),
        signal_optimization_rate=92.5
    )

@router.get("/historical", response_model=List[TrafficReading])
def get_historical_traffic():
    readings = []
    now = datetime.now()
    for i in range(12, 0, -1):
        dt = now - timedelta(hours=i)
        for zone in ZONES:
            readings.append(generate_mock_reading(zone, dt))
    return readings
