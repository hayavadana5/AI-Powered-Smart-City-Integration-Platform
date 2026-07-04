from pydantic import BaseModel
from datetime import datetime
from typing import List

class TrafficReading(BaseModel):
    zone_id: str
    avg_speed_kmh: float
    congestion_index: int  # 0 to 100
    active_signals: int
    smart_signals: int
    timestamp: datetime

class TrafficSummary(BaseModel):
    citywide_avg_speed: float
    peak_congestion_zone: str
    active_incidents: int
    signal_optimization_rate: float
