from pydantic import BaseModel
from datetime import datetime
from typing import List

class ElectricityReading(BaseModel):
    zone_id: str
    demand_gw: float
    capacity_gw: float
    renewable_percentage: float
    status: str
    timestamp: datetime

class ElectricitySummary(BaseModel):
    total_demand_gw: float
    avg_renewable_percentage: float
    active_outages: int
    grid_status: str
