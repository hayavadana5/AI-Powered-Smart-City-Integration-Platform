from fastapi import APIRouter
from datetime import datetime, timedelta
import random
from app.models.water import WaterReading, WaterSummary
from typing import List

router = APIRouter()

ZONES = ["Zone 1 (Downtown)", "Zone 2 (Industrial)", "Zone 3 (Residential)", "Zone 4 (Suburbs)", "Zone 5 (Commercial)"]

def generate_mock_reading(zone: str, dt: datetime) -> WaterReading:
    if "Industrial" in zone:
        flow = round(random.uniform(4.5, 6.2), 2)
        pressure = round(random.uniform(55, 65), 1)
        ph = round(random.uniform(6.5, 7.8), 2)
    elif "Suburbs" in zone:
        flow = round(random.uniform(1.5, 2.8), 2)
        pressure = round(random.uniform(45, 52), 1)
        ph = round(random.uniform(7.1, 7.5), 2)
    else:
        flow = round(random.uniform(2.5, 3.8), 2)
        pressure = round(random.uniform(48, 56), 1)
        ph = round(random.uniform(7.0, 7.4), 2)

    return WaterReading(
        zone_id=zone,
        flow_rate_mld=flow,
        pressure_psi=pressure,
        ph_level=ph,
        turbidity_ntu=round(random.uniform(0.1, 0.45), 2),
        timestamp=dt
    )

@router.get("/latest", response_model=List[WaterReading])
def get_latest_water():
    now = datetime.now()
    return [generate_mock_reading(zone, now) for zone in ZONES]

@router.get("/summary", response_model=WaterSummary)
def get_water_summary():
    readings = [generate_mock_reading(zone, datetime.now()) for zone in ZONES]
    total_flow = sum(r.flow_rate_mld for r in readings)
    avg_press = sum(r.pressure_psi for r in readings) / len(readings)
    
    return WaterSummary(
        total_flow_rate_mld=round(total_flow, 2),
        avg_pressure_psi=round(avg_press, 1),
        leakages_detected=0,
        quality_compliance=99.8
    )

@router.get("/historical", response_model=List[WaterReading])
def get_historical_water():
    readings = []
    now = datetime.now()
    for i in range(12, 0, -1):
        dt = now - timedelta(hours=i)
        for zone in ZONES:
            readings.append(generate_mock_reading(zone, dt))
    return readings
