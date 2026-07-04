from pydantic import BaseModel
from typing import List

class ChatMessage(BaseModel):
    sender: str  # user or ai
    message: str

class ChatRequest(BaseModel):
    message: str
    history: List[ChatMessage]

class ChatResponse(BaseModel):
    reply: str
