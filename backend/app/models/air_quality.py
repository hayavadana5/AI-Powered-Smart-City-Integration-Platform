from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

class AQIReading(BaseModel):
    zone_id: str
    aqi: int
    pm25: float
    pm10: float
    no2: float
    co2: float
    o3: float
    timestamp: datetime

class AQIHistoricalResponse(BaseModel):
    zone_id: str
    readings: List[AQIReading]

class AQISummary(BaseModel):
    average_aqi: float
    max_aqi: int
    min_aqi: int
    status: str
    zones_monitored: int
