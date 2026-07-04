from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

class AlertModel(BaseModel):
    id: str
    title: str
    severity: str  # Critical, Warning, Info
    zone_id: str
    description: str
    status: str  # Active, Resolved, Dispatched
    timestamp: datetime

class AlertCreate(BaseModel):
    title: str
    severity: str
    zone_id: str
    description: str
