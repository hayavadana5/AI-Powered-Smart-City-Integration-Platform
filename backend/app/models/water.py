from pydantic import BaseModel
from datetime import datetime
from typing import List

class WaterReading(BaseModel):
    zone_id: str
    flow_rate_mld: float
    pressure_psi: float
    ph_level: float
    turbidity_ntu: float
    timestamp: datetime

class WaterSummary(BaseModel):
    total_flow_rate_mld: float
    avg_pressure_psi: float
    leakages_detected: int
    quality_compliance: float
