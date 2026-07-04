from fastapi import APIRouter
from datetime import datetime, timedelta
import random
from app.models.electricity import ElectricityReading, ElectricitySummary
from typing import List

router = APIRouter()

ZONES = ["Zone 1 (Downtown)", "Zone 2 (Industrial)", "Zone 3 (Residential)", "Zone 4 (Suburbs)", "Zone 5 (Commercial)"]

def generate_mock_reading(zone: str, dt: datetime) -> ElectricityReading:
    if "Industrial" in zone:
        demand = round(random.uniform(2.5, 3.8), 2)
        capacity = 4.0
        renewable = round(random.uniform(15, 25), 1)
    elif "Suburbs" in zone:
        demand = round(random.uniform(0.8, 1.4), 2)
        capacity = 2.0
        renewable = round(random.uniform(40, 60), 1)
    else:
        demand = round(random.uniform(1.2, 2.2), 2)
        capacity = 2.5
        renewable = round(random.uniform(25, 45), 1)

    status = "Normal"
    if demand / capacity > 0.9:
        status = "High Load"

    return ElectricityReading(
        zone_id=zone,
        demand_gw=demand,
        capacity_gw=capacity,
        renewable_percentage=renewable,
        status=status,
        timestamp=dt
    )

@router.get("/latest", response_model=List[ElectricityReading])
def get_latest_electricity():
    now = datetime.now()
    return [generate_mock_reading(zone, now) for zone in ZONES]

@router.get("/summary", response_model=ElectricitySummary)
def get_electricity_summary():
    readings = [generate_mock_reading(zone, datetime.now()) for zone in ZONES]
    total_demand = sum(r.demand_gw for r in readings)
    avg_renew = sum(r.renewable_percentage for r in readings) / len(readings)
    high_load_zones = sum(1 for r in readings if r.status == "High Load")
    
    grid_status = "Nominal"
    if high_load_zones >= 2:
        grid_status = "Stressed"

    return ElectricitySummary(
        total_demand_gw=round(total_demand, 2),
        avg_renewable_percentage=round(avg_renew, 1),
        active_outages=0,
        grid_status=grid_status
    )

@router.get("/historical", response_model=List[ElectricityReading])
def get_historical_electricity():
    readings = []
    now = datetime.now()
    for i in range(12, 0, -1):
        dt = now - timedelta(hours=i)
        for zone in ZONES:
            readings.append(generate_mock_reading(zone, dt))
    return readings
