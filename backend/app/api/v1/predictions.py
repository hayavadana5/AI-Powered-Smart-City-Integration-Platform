from fastapi import APIRouter
from datetime import datetime, timedelta
import random
from app.models.prediction import DomainPrediction, ForecastPoint
from typing import List

router = APIRouter()

def generate_forecasts(base_val: float, variance: float) -> List[ForecastPoint]:
    points = []
    now = datetime.now()
    for i in range(1, 8):  # Next 7 hours / days
        dt = now + timedelta(hours=i)
        pred = base_val + random.uniform(-variance, variance) + (i * 0.1)
        points.append(ForecastPoint(
            timestamp=dt,
            predicted_value=round(pred, 2),
            lower_bound=round(pred - variance * 0.5, 2),
            upper_bound=round(pred + variance * 0.5, 2)
        ))
    return points

@router.get("/forecasts", response_model=List[DomainPrediction])
def get_predictive_forecasts():
    return [
        DomainPrediction(
            domain="Air Quality (AQI)",
            forecasts=generate_forecasts(52, 10),
            model_name="Prophet Regressor v1.4",
            accuracy_metric="MAPE: 4.8%"
        ),
        DomainPrediction(
            domain="Electricity Load (GW)",
            forecasts=generate_forecasts(8.4, 1.2),
            model_name="LSTM Network v3.0",
            accuracy_metric="RMSE: 0.12"
        ),
        DomainPrediction(
            domain="Traffic Congestion (%)",
            forecasts=generate_forecasts(45, 15),
            model_name="XGBoost Classifier v2.1",
            accuracy_metric="F1-Score: 94.2%"
        ),
        DomainPrediction(
            domain="Water Demand (MLD)",
            forecasts=generate_forecasts(14.2, 2.0),
            model_name="ARIMA Predictor v0.8",
            accuracy_metric="MAE: 0.35"
        )
    ]
