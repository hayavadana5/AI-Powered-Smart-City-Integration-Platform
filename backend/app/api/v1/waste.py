from fastapi import APIRouter
from datetime import datetime, timedelta
import random
from app.models.waste import WasteReading, WasteSummary
from typing import List

router = APIRouter()

ZONES = ["Zone 1 (Downtown)", "Zone 2 (Industrial)", "Zone 3 (Residential)", "Zone 4 (Suburbs)", "Zone 5 (Commercial)"]

def generate_mock_reading(zone: str, dt: datetime) -> WasteReading:
    if "Commercial" in zone or "Downtown" in zone:
        fill = round(random.uniform(55, 82), 1)
        bins = 80
    else:
        fill = round(random.uniform(35, 60), 1)
        bins = 45
        
    overfilled = int(bins * (fill / 100) * random.uniform(0.05, 0.15))

    return WasteReading(
        zone_id=zone,
        fill_level_percent=fill,
        bin_count=bins,
        overfilled_bins=overfilled,
        timestamp=dt
    )

@router.get("/latest", response_model=List[WasteReading])
def get_latest_waste():
    now = datetime.now()
    return [generate_mock_reading(zone, now) for zone in ZONES]

@router.get("/summary", response_model=WasteSummary)
def get_waste_summary():
    readings = [generate_mock_reading(zone, datetime.now()) for zone in ZONES]
    avg_fill = sum(r.fill_level_percent for r in readings) / len(readings)
    total_bins = sum(r.bin_count for r in readings)
    pending_pickups = sum(r.overfilled_bins for r in readings)

    return WasteSummary(
        avg_fill_level=round(avg_fill, 1),
        collection_efficiency=96.4,
        total_bins_monitored=total_bins,
        pending_pickups=pending_pickups
    )
