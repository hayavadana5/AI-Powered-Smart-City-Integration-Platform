from pydantic import BaseModel
from datetime import datetime
from typing import List

class ForecastPoint(BaseModel):
    timestamp: datetime
    predicted_value: float
    lower_bound: float
    upper_bound: float

class DomainPrediction(BaseModel):
    domain: str  # Air Quality, Electricity, Traffic, Water
    forecasts: List[ForecastPoint]
    model_name: str
    accuracy_metric: str
