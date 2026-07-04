from pydantic import BaseModel
from datetime import datetime
from typing import List

class WasteReading(BaseModel):
    zone_id: str
    fill_level_percent: float
    bin_count: int
    overfilled_bins: int
    timestamp: datetime

class WasteSummary(BaseModel):
    avg_fill_level: float
    collection_efficiency: float
    total_bins_monitored: int
    pending_pickups: int
