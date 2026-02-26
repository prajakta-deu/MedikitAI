from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx


app = FastAPI(title="Emergency Health Assistant API")

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For demo - restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request/Response models
class HealthQuery(BaseModel):
    message: str

class HealthResponse(BaseModel):
    user_input: str
    ai_response: str

# Ollama configuration
OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL_NAME = "tinyllama"

async def call_tinyllama(prompt: str) -> str:
    """Calls TinyLlama via Ollama API"""
    
    # Create health-focused prompt
    full_prompt = f"You are an emergency health assistant. Provide clear first aid advice.\n\nUser: {prompt}\n\nAssistant:"
    
    payload = {
        "model": MODEL_NAME,
        "prompt": full_prompt,
        "stream": False
    }
    
    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(OLLAMA_URL, json=payload)
            response.raise_for_status()
            result = response.json()
            return result.get("response", "").strip()
    except httpx.HTTPError as e:
        raise HTTPException(status_code=500, detail=f"Ollama API error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

@app.get("/")
async def root():
    """Health check endpoint"""
    return {"status": "running", "message": "Emergency Health Assistant API"}

@app.post("/analyze", response_model=HealthResponse)
async def analyze_health_query(query: HealthQuery):
    """
    Main endpoint: receives user message and returns AI response
    """
    if not query.message or not query.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")
    
    # Get AI response from TinyLlama
    ai_response = await call_tinyllama(query.message)
    
    return HealthResponse(
        user_input=query.message,
        ai_response=ai_response
    )

# Run with: uvicorn main:app --reload --port 8000