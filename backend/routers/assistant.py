import os
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import google.generativeai as genai
from database import get_db

router = APIRouter()

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    history: List[ChatMessage] = []
    persona: Optional[str] = "Public"

# Configure Gemini
from dotenv import load_dotenv
load_dotenv()

def get_api_key():
    return os.environ.get("GEMINI_API_KEY")

api_key_init = get_api_key()
if api_key_init:
    genai.configure(api_key=api_key_init)

SYSTEM_PROMPT = """You are POLARIS Field & Science Copilot for NCPOR / MoES.
Knowledge scope: Indian Antarctic Programme (Dakshin Gangotri, Maitri, Bharati), Arctic Programme (Himadri), Himalayan research (Himansh, Chandra Basin), oceanographic CTD protocols, and Antarctic Treaty environmental guidelines.
Grounding rules: Always cite official NCPOR stations, genuine vessel names (MV Vasiliy Golovnin), and never fabricate coordinates or weather records. Provide concise, accurate responses with markdown formatting.
If the user asks for summaries of the website, research, activities, or timelines, use the DATABASE CONTEXT below to provide accurate, specific, and grounded answers.
"""

def build_dynamic_context() -> str:
    context_parts = []
    
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            
            # 1. Activities / Events
            cursor.execute("SELECT type, title, summary, date FROM activities ORDER BY date DESC LIMIT 10")
            activities = cursor.fetchall()
            if activities:
                context_parts.append("Recent Activities & News:")
                for a in activities:
                    context_parts.append(f"- {a['date']} [{a['type']}]: {a['title']} - {a['summary']}")

            # 2. Expeditions
            cursor.execute("SELECT name, region, dates, vessel, objectives FROM expeditions LIMIT 10")
            expeditions = cursor.fetchall()
            if expeditions:
                context_parts.append("\nKey Expeditions:")
                for e in expeditions:
                    context_parts.append(f"- {e['name']} ({e['region']}) {e['dates']}. Vessel: {e['vessel']}. Objectives: {e['objectives']}")

            # 3. Stations
            cursor.execute("SELECT name, region, status, purpose FROM stations")
            stations = cursor.fetchall()
            if stations:
                context_parts.append("\nResearch Stations:")
                for s in stations:
                    context_parts.append(f"- {s['name']} ({s['region']}): Status: {s['status']}. Purpose: {s['purpose']}")
                    
            # 4. Publications
            cursor.execute("SELECT title, authors, journal, year FROM publications LIMIT 10")
            publications = cursor.fetchall()
            if publications:
                context_parts.append("\nNotable Publications:")
                for p in publications:
                    context_parts.append(f"- {p['title']} by {p['authors']} ({p['year']}, {p['journal']})")
    except Exception as e:
        print(f"Error building context: {e}")
        
    return "\n".join(context_parts)


def fallback_answer(message: str) -> str:
    message = message.lower()
    if "maitri" in message:
        return "Maitri is India's second permanent research station in Antarctica, located in the Schirmacher Oasis. Coordinates: -70.76°S, 11.73°E."
    if "netcdf" in message or "ctd" in message:
        return "To prepare NetCDF CTD data, ensure you have variables for temperature, salinity, and depth. Use Python libraries like `xarray` or `netCDF4` to process the profiles."
    if "madrid protocol" in message or "environmental rules" in message:
        return "The Madrid Protocol designates Antarctica as a 'natural reserve, devoted to peace and science'. It prohibits mining and sets strict rules on waste disposal and environmental protection."
    if "43rd isea" in message:
        return "The 43rd ISEA (Indian Scientific Expedition to Antarctica) objectives include sustaining Maitri and Bharati stations, conducting atmospheric and geological observations, and supporting global climate research."
    return "I am operating in offline/fallback mode without a live AI connection. Please ask about Maitri, NetCDF CTD data, Madrid Protocol, or 43rd ISEA for cached answers."

@router.post("/chat")
async def chat_assistant(req: ChatRequest):
    load_dotenv(override=True) # Reload in case file changed
    current_key = get_api_key()
    if not current_key:
        return {"response": fallback_answer(req.message)}
    
    genai.configure(api_key=current_key)
    
    try:
        dynamic_context = build_dynamic_context()
        full_system_prompt = SYSTEM_PROMPT + "\n\nDATABASE CONTEXT:\n" + dynamic_context
        
        model = genai.GenerativeModel(
            model_name="gemini-flash-latest",
            system_instruction=full_system_prompt
        )
        
        # Format history for Gemini API
        formatted_history = []
        for msg in req.history:
            role = "user" if msg.role == "user" else "model"
            formatted_history.append({"role": role, "parts": [msg.content]})
            
        chat = model.start_chat(history=formatted_history)
        response = chat.send_message(req.message)
        
        return {"response": response.text}
    except Exception as e:
        print(f"Gemini API Error: {e}")
        return {"response": fallback_answer(req.message)}
