from fastapi import APIRouter, HTTPException
from datetime import datetime
import uuid
from app.models.alert import AlertModel, AlertCreate
from typing import List

router = APIRouter()

# Global list of in-memory active alerts
ACTIVE_ALERTS = [
    AlertModel(
        id="alert-1",
        title="Industrial Over-emission Detected",
        severity="Warning",
        zone_id="Zone 2 (Industrial)",
        description="Air quality sensor A4 registered PM2.5 levels exceeding safety limits.",
        status="Active",
        timestamp=datetime.now()
    )
]

@router.get("/active", response_model=List[AlertModel])
def get_active_alerts():
    return ACTIVE_ALERTS

@router.post("/dispatch", response_model=AlertModel)
def dispatch_alert(alert: AlertCreate):
    if alert.severity not in ["Critical", "Warning", "Info"]:
        raise HTTPException(status_code=400, detail="Invalid severity level")
        
    new_alert = AlertModel(
        id=f"alert-{uuid.uuid4().hex[:6]}",
        title=alert.title,
        severity=alert.severity,
        zone_id=alert.zone_id,
        description=alert.description,
        status="Active",
        timestamp=datetime.now()
    )
    ACTIVE_ALERTS.insert(0, new_alert)
    return new_alert

@router.post("/resolve/{alert_id}", response_model=AlertModel)
def resolve_alert(alert_id: str):
    for a in ACTIVE_ALERTS:
        if a.id == alert_id:
            a.status = "Resolved"
            return a
    raise HTTPException(status_code=404, detail="Alert not found")
