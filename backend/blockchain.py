# backend/blockchain.py
from fastapi import FastAPI
from pydantic import BaseModel
from transformers import pipeline  # Using Hugging Face's transformers as an example

app = FastAPI()

class ItineraryRequest(BaseModel):
    destination: str
    duration: int
    interests: str = ""

@app.post("/generate-itinerary")
async def generate_itinerary(request: ItineraryRequest):
    prompt = f"""
    Create a detailed {request.duration}-day travel itinerary for {request.destination}.
    {f"Focus on activities related to: {request.interests}" if request.interests else ""}
    Include daily schedules, recommended attractions, and dining suggestions.
    """
    
    # Using Hugging Face's text generation pipeline as an example
    generator = pipeline("text-generation", model="gpt2")  # Replace "gpt2" with your desired model
    response = generator(prompt, max_length=1500, temperature=0.7)[0]["generated_text"]
    
    return {"itinerary": response}