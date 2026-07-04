from fastapi import APIRouter
from app.models.chat import ChatRequest, ChatResponse
import random

router = APIRouter()

SMART_CITY_KNOWLEDGE = {
    "traffic": [
        "Current avg city speed is 42.5 km/h. Zone 1 (Downtown) is experiencing normal peak congestion.",
        "Traffic light adjustments have been executed automatically in Zone 5 to relieve load."
    ],
    "air quality": [
        "AQI averages at 48. Local industrial zones (Zone 2) are slightly elevated but within safety limits.",
        "Industrial emission thresholds are being monitored continuously via AI Prophet forecasts."
    ],
    "electricity": [
        "Power grid consumption is at 8.4 GW. Zone 4 (Suburbs) is leading in renewable source energy uptake.",
        "Grid loading is nominal. Smart balancing has distributed peak loads from Zone 3."
    ],
    "water": [
        "Daily flow rate is 14.2 MLD. Water pH is safe (avg 7.2) and no pipe leakages are reported."
    ]
}

@router.post("/query", response_model=ChatResponse)
def query_assistant(req: ChatRequest):
    msg = req.message.lower()
    reply = "I am the ASCIP Smart City AI Assistant. I can assist you with monitoring traffic congestion, air quality levels, power load balancing, and water flow systems. What sector would you like to query?"

    for key, responses in SMART_CITY_KNOWLEDGE.items():
        if key in msg:
            reply = random.choice(responses)
            break
            
    if "help" in msg or "capabilities" in msg:
        reply = "I monitor city metrics and can trigger simulations. Try asking: 'Is the water supply clean?', 'What is the traffic speed downtown?', or 'Check current electricity renewable load'."

    return ChatResponse(reply=reply)
