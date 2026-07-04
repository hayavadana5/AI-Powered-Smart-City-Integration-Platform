from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1 import (
    air_quality,
    electricity,
    traffic,
    waste,
    water,
    alerts,
    chat,
    predictions
)

app = FastAPI(
    title="ASCIP API",
    description="AI-Powered Smart City Infrastructure Platform API Backend",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(air_quality.router, prefix="/api/v1/air-quality", tags=["Air Quality"])
app.include_router(electricity.router, prefix="/api/v1/electricity", tags=["Electricity"])
app.include_router(traffic.router, prefix="/api/v1/traffic", tags=["Traffic"])
app.include_router(waste.router, prefix="/api/v1/waste", tags=["Waste"])
app.include_router(water.router, prefix="/api/v1/water", tags=["Water"])
app.include_router(alerts.router, prefix="/api/v1/alerts", tags=["Alerts"])
app.include_router(chat.router, prefix="/api/v1/chat", tags=["Chat"])
app.include_router(predictions.router, prefix="/api/v1/predictions", tags=["Predictions"])

@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "ASCIP Backend API Gateway",
        "version": "1.0.0"
      }
